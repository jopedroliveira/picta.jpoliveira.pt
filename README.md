# Picta

Comunicar em cartões. Pega numa lista de palavras e devolve uma folha A4 pronta a imprimir, com pictogramas do ARASAAC.

Pensado para famílias e técnicos que trabalham com crianças que usam CAA (Comunicação Aumentativa e Alternativa).

## Porquê

A Picta nasceu de uma experiência próxima de acompanhar uma criança em início de comunicação e de reabilitação auditiva, e da constatação de que as ferramentas livres para criar cartões eram quase todas genéricas ou datadas, e nenhuma estava pensada de raiz para dois pontos que fazem toda a diferença:

- **Baixa visão.** O cartão tem de ser o mais legível possível: contraste máximo, um símbolo por cartão, sem ruído visual.
- **Comunicação multimodal.** A aprendizagem apoia-se em vários canais ao mesmo tempo, a palavra dita, o símbolo e o gesto. A Picta deixa associar ao verso do cartão a ilustração e o vídeo do gesto correspondente.

O objetivo é simples: tirar atrito ao trabalho de quem precisa de produzir muitos cartões, de forma rápida, bonita e acessível, e de graça.

## O que faz

1. **Lista**: uma palavra por linha.
2. **Revisão**: confirma cada cartão, troca o pictograma ou anexa uma foto sua. Podes também associar a ilustração e o vídeo do gesto a usar no verso.
3. **Imprimir**: ajusta tamanho e contraste, e gera a folha A4 (ou PDF).

Os cartões agrupam-se automaticamente por função comunicativa (pedir, recusar, escolher, comentar), sinalizada por uma faixa numa aresta do cartão, sem nunca invadir a área do símbolo.

## Acessibilidade

A acessibilidade é o ponto de partida, não o acabamento. Vale para o cartão impresso (contraste, tamanho, simplicidade) e para a própria interface de quem opera a app, já que pais e técnicos podem também ter baixa visão.

## Privacidade

A Picta é local-first e não tem contas. As coleções e, sobretudo, as fotografias que carregas ficam guardadas apenas no teu dispositivo (`localStorage`) e nunca são enviadas para lado nenhum. As fotos de crianças são dados sensíveis e a app foi desenhada para que nunca saiam de casa.

## Coleções

Além das coleções que crias, a Picta traz **coleções globais** já feitas, curadas no próprio repositório (vocabulário nuclear por função, rotinas de casa, creche, emoções). São um ponto de partida: abres uma, copias para as tuas e personalizas à vontade. As coleções globais guardam só palavra, função e o id do pictograma no ARASAAC, nunca imagens nem fotos.

## Correr localmente

```
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
- App estática, sem backend, pronta para Cloudflare Pages

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
  screens/          # Landing, Entrada, Revisao, Impressao, Colecoes
```

## Créditos e licenças

Pictogramas de Sergio Palao para o ARASAAC, propriedade do Governo de Aragão, licença Creative Commons BY-NC-SA. A atribuição consta na app e no rodapé da folha impressa. As coleções globais referenciam os pictogramas por id e não redistribuem as imagens.

Projeto pessoal de [Pedro Oliveira](https://jpoliveira.pt). Para sugestões, bugs ou para propor uma coleção, <pedro@jpoliveira.pt>.
