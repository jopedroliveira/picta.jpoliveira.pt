# Picta

Comunicar em cartões. Pega numa lista de palavras e devolve uma folha A4 pronta a imprimir, com pictogramas do ARASAAC.

Pensado para famílias e técnicos que trabalham com crianças que usam CAA (Comunicação Aumentativa e Alternativa).

## Como funciona

1. **Lista**: uma palavra por linha.
2. **Revisão**: confirma cada cartão, troca o pictograma ou anexa uma foto sua. Podes também associar a ilustração e o vídeo do gesto a usar no verso.
3. **Imprimir**: ajusta tamanho e contraste, e gera a folha A4 (ou PDF).

Os cartões agrupam-se automaticamente por função comunicativa (pedir, recusar, escolher, comentar).

## Correr localmente

```bash
npm install
npm run dev
```

Por defeito abre em `http://localhost:5180/`. A landing fica em `/`, a app em `/app`.

## Stack

- React 19 + TypeScript
- Vite 8
- Sem dependências de UI, tudo estilizado inline com os tokens da Picta
- ARASAAC público via `api.arasaac.org`
- Coleções guardadas no `localStorage` do dispositivo

## Estrutura

```
src/
  App.tsx           # router landing ↔ app
  router.ts         # navegação por path (sem react-router)
  state.ts          # hook usePicta com estado e ações
  theme.ts          # cores, funções, contextos, tamanhos
  arasaac.ts        # cliente da API ARASAAC com cache em memória
  icons.tsx         # ícones e placeholders SVG
  components/       # Header, CardEditor
  screens/          # Landing, Entrada, Revisao, Impressao, Auth, Colecoes, Comunidade
```

## Créditos e licenças

Pictogramas de Sergio Palao para o ARASAAC, propriedade do Governo de Aragão, licença Creative Commons BY-NC-SA. A atribuição consta na app e no rodapé da folha impressa.

Projeto pessoal de [Pedro Oliveira](https://jpoliveira.pt). Para sugestões ou bugs, [pedro@jpoliveira.pt](mailto:pedro@jpoliveira.pt).
