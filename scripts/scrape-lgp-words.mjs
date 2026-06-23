// Scrapes the Infopédia LGP dictionary to produce public/lgp-words.json.
// Strategy: BFS through "vizinhas" pages starting from every letter, using
// a small pool of headless chromium workers. The Infopédia rate-limits
// anonymous sessions to ~5 requests before redirecting to /acesso-restrito,
// so each worker recycles its browser context every few requests.
//
// Run manually:
//   node scripts/scrape-lgp-words.mjs
//
// Resumable: writes progress to scripts/.lgp-progress.json every batch.

import { chromium } from 'playwright'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname } from 'node:path'

const PROGRESS_PATH = 'scripts/.lgp-progress.json'
const OUTPUT_PATH = 'public/lgp-words.json'
const CONCURRENCY = 4
const REQS_PER_SESSION = 4
const NAV_TIMEOUT = 25000
const POST_LOAD_WAIT = 700
const LOG_EVERY = 25

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const SEEDS = 'abcdefghijklmnopqrstuvwxyz'.split('')

function loadProgress() {
  if (!existsSync(PROGRESS_PATH)) return { visited: [], queue: SEEDS, found: [] }
  return JSON.parse(readFileSync(PROGRESS_PATH, 'utf8'))
}

function saveProgress(state) {
  writeFileSync(
    PROGRESS_PATH,
    JSON.stringify(
      { visited: [...state.visited], queue: [...state.queue], found: [...state.found] },
      null,
      0,
    ),
  )
}

async function newSession(browser) {
  const ctx = await browser.newContext({ locale: 'pt-PT', userAgent: UA })
  await ctx.route('**/*', (route) => {
    const t = route.request().resourceType()
    if (t === 'image' || t === 'media' || t === 'font' || t === 'stylesheet') return route.abort()
    return route.continue()
  })
  const page = await ctx.newPage()
  return { ctx, page, count: 0 }
}

async function extractNeighbors(page, word) {
  const url = `https://www.infopedia.pt/dicionarios/lingua-gestual/vizinhas/${encodeURIComponent(word)}`
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT })
  if (!resp || resp.status() >= 400) return { ok: false, slugs: [], restricted: false }
  await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {})
  await page.waitForTimeout(POST_LOAD_WAIT)
  if (page.url().includes('/acesso-restrito')) {
    return { ok: false, slugs: [], restricted: true }
  }
  const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.href))
  const slugs = new Set()
  for (const h of hrefs) {
    if (!/\/dicionarios\/lingua-gestual\//.test(h)) continue
    const m = h.match(/lingua-gestual\/([^/?#]+)(?:[?#]|$)/i)
    if (!m) continue
    if (/^(vizinhas|parecidas|traducoes|pesquisa|proverbios)$/i.test(m[1])) continue
    let s
    try {
      s = decodeURIComponent(m[1]).trim().toLowerCase()
    } catch {
      continue
    }
    if (!s || s.length > 60) continue
    if (!/^[a-zà-ÿ0-9\-' ]+$/iu.test(s)) continue
    slugs.add(s)
  }
  return { ok: true, slugs: [...slugs], restricted: false }
}

async function main() {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
  const state = loadProgress()
  state.visited = new Set(state.visited)
  state.queue = state.queue.length ? state.queue : SEEDS.slice()
  state.found = new Set(state.found)
  for (const v of state.visited) state.found.add(v)

  console.log(
    `Start. queue=${state.queue.length} visited=${state.visited.size} found=${state.found.size}`,
  )

  const browser = await chromium.launch({ headless: true })

  let processed = 0
  let saveCounter = 0
  let inFlight = 0
  let stop = false
  process.on('SIGINT', () => {
    console.log('\nGot SIGINT, saving progress…')
    stop = true
  })

  async function takeWork() {
    while (!stop) {
      while (state.queue.length) {
        const w = state.queue.shift()
        if (state.visited.has(w)) continue
        state.visited.add(w)
        return w
      }
      if (inFlight === 0) return null
      await new Promise((r) => setTimeout(r, 80))
    }
    return null
  }

  async function runWorker(id) {
    let session = await newSession(browser)
    while (true) {
      const w = await takeWork()
      if (!w) break
      inFlight++
      try {
        if (session.count >= REQS_PER_SESSION) {
          await session.ctx.close().catch(() => {})
          session = await newSession(browser)
        }
        const { ok, slugs, restricted } = await extractNeighbors(session.page, w)
        session.count++
        if (restricted) {
          // Quota hit unexpectedly early — recycle and requeue this word.
          await session.ctx.close().catch(() => {})
          session = await newSession(browser)
          state.queue.unshift(w)
          state.visited.delete(w)
        } else if (ok) {
          for (const s of slugs) {
            if (!state.found.has(s)) {
              state.found.add(s)
              if (!state.visited.has(s)) state.queue.push(s)
            }
          }
        }
        processed++
        saveCounter++
        if (processed % LOG_EVERY === 0) {
          console.log(
            `[w${id}] processed=${processed} queue=${state.queue.length} found=${state.found.size}`,
          )
        }
        if (saveCounter >= 50) {
          saveCounter = 0
          saveProgress(state)
        }
      } catch (e) {
        console.warn(`[w${id}] error on "${w}": ${e.message}`)
        await session.ctx.close().catch(() => {})
        session = await newSession(browser)
      } finally {
        inFlight--
      }
    }
    await session.ctx.close().catch(() => {})
  }

  const workers = []
  for (let i = 0; i < CONCURRENCY; i++) workers.push(runWorker(i + 1))
  await Promise.all(workers)

  saveProgress(state)

  const final = [...state.found].sort((a, b) => a.localeCompare(b, 'pt'))
  writeFileSync(OUTPUT_PATH, JSON.stringify(final))
  console.log(
    `Done. words=${final.length} written to ${OUTPUT_PATH} (${(JSON.stringify(final).length / 1024).toFixed(1)} KB)`,
  )

  await browser.close()
}

await main()
