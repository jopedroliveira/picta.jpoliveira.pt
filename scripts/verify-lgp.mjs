import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

mkdirSync('screenshots/lgp-verify', { recursive: true })

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({
  viewport: { width: 1200, height: 1100 },
  deviceScaleFactor: 1.5,
})
const page = await ctx.newPage()

const errors = []
page.on('pageerror', (e) => errors.push(`PAGEERR ${e.message}`))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`CONSOLE ${msg.text()}`)
})

await page.goto('http://localhost:5180/app', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)

await page.locator('textarea').first().fill('casa\nmaee\nabacaxi\nfoobarbaz')
await page.screenshot({ path: 'screenshots/lgp-verify/01-entrada.png' })

await page.locator('button', { hasText: /procurar pictogramas/i }).first().click()
await page.waitForTimeout(1500)
await page.screenshot({ path: 'screenshots/lgp-verify/02-revisao.png' })

// Each card is a top-level <button> with the word visible. Pick by position.
// We assume order matches the textarea.
const cardButtons = page.locator('button').filter({
  has: page.locator('[style*="Atkinson"], [style*="atkinson"]')
})
// Fallback: just pick by the visible word text
async function openCardWithWord(word) {
  // Many spans render the word — we want the one inside a card button.
  const candidate = page
    .locator('button:has-text("' + word + '")')
    .filter({ hasNot: page.locator('text=Concluído') })
    .first()
  await candidate.click()
  await page.waitForTimeout(1500)
}

async function closeEditor() {
  const btn = page.locator('button', { hasText: /concluído/i }).first()
  if (await btn.isVisible().catch(() => false)) {
    await btn.click()
    await page.waitForTimeout(400)
  }
}

await openCardWithWord('casa')
await page.screenshot({ path: 'screenshots/lgp-verify/03-editor-casa.png' })
const lgpInputValue = await page.locator('input[type="text"]').inputValue()
console.log('Editor casa: LGP input =', JSON.stringify(lgpInputValue))
await closeEditor()

await openCardWithWord('maee')
await page.screenshot({ path: 'screenshots/lgp-verify/04-editor-maee.png' })
await closeEditor()

await openCardWithWord('foobarbaz')
await page.screenshot({ path: 'screenshots/lgp-verify/05-editor-foobarbaz.png' })
await closeEditor()

// Open casa again and paste a custom video URL — should override LGP for QR
// but keep the LGP indicator visible.
await openCardWithWord('casa')
const urlInput = page.locator('input[type="url"]').first()
await urlInput.fill('https://youtu.be/dQw4w9WgXcQ')
await page.waitForTimeout(500)
await page.screenshot({ path: 'screenshots/lgp-verify/05b-editor-casa-video.png' })
await closeEditor()
await page.screenshot({ path: 'screenshots/lgp-verify/05c-revisao-with-video.png' })

// Go to print
await page.locator('button', { hasText: /imprimir/i }).first().click()
await page.waitForTimeout(800)
await page.screenshot({ path: 'screenshots/lgp-verify/06-impressao-frente.png', fullPage: true })

// Toggle "Verso com gesto" — find the toggle whose containing Panel reads "Verso com gesto"
const versoPanel = page.locator('div').filter({ hasText: /^Verso com gesto/ }).first()
const versoToggle = versoPanel.locator('button', { hasText: /desativado|ativado/i }).first()
if (await versoToggle.isVisible().catch(() => false)) {
  await versoToggle.click()
  await page.waitForTimeout(400)
}

// Switch face tab to verso
const versoTab = page.locator('button', { hasText: /^Verso$/ }).first()
if (await versoTab.isVisible().catch(() => false)) {
  await versoTab.click()
  await page.waitForTimeout(800)
}
await page.screenshot({ path: 'screenshots/lgp-verify/07-impressao-verso.png', fullPage: true })

// Zoomed-in shot of the casa card so we can eyeball the stylized QR.
const casaCard = page.locator('.print-sheet >> text=casa').first()
const casaParent = casaCard.locator('xpath=ancestor::div[2]')
await casaParent.scrollIntoViewIfNeeded()
await casaParent.screenshot({ path: 'screenshots/lgp-verify/08-qr-zoom.png' })

if (errors.length) {
  console.log('--- ERRORS ---')
  for (const e of errors) console.log(e)
} else {
  console.log('No console/page errors.')
}

await browser.close()
