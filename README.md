# Picta

Comunicar em cartões. Uma lista de palavras vira uma folha A4 pronta a imprimir, com pictogramas do ARASAAC.

## Porquê

Muitas crianças que ainda não falam, ou que comunicam de outras formas, usam pictogramas para se exprimir. Para quem trabalha com elas (pais, terapeutas, educadores), produzir bons cartões implica passar horas em ferramentas de propósito geral ou pagar por software pesado e caro.

A Picta faz uma coisa só, mas faz bem: pega numa lista de palavras e devolve uma folha pronta a imprimir, recortar e plastificar. Sem conta. Sem instalação. Sem ruído.

## Princípios

A app tem duas camadas com necessidades opostas, e nenhuma pode invadir o espaço da outra.

**Quem opera** (adultos) precisa de calma e simplicidade. Muitas vezes está cansado e a meio de outras coisas. A interface não pode ser clínica, nem infantilizada, nem demasiado entusiasmada. Só clara.

**Quem usa** (crianças) precisa de contraste alto, símbolo grande, palavra legível, zero ruído visual. O cartão impresso é o produto verdadeiro; tudo o resto na app é meio para lá chegar.

Daí saem quatro princípios que guiam cada decisão:

- **O cartão primeiro.** Se algo não ajuda a criança a comunicar, não entra no cartão. A cor da função vive numa faixa, nunca por cima do símbolo.
- **Acessibilidade como ponto de partida.** Não como acabamento. Vale para a interface (legibilidade, alvos de toque grandes, contraste) e, de forma extrema, para o cartão (modo de alto contraste, foto real, pista redundante na cor da função).
- **Calmo e humano.** As famílias que chegam aqui vivem muitas vezes situações difíceis. Confiança e cuidado, sem hospital nem brinquedo.
- **Pronto para imprimir.** O resultado tem de ficar impecável em papel, não só no ecrã. Português primeiro, pronto para mais línguas.

## Privacidade

As fotografias reais que uma família escolhe juntar a um cartão são dados sensíveis. Ficam no `localStorage` do dispositivo e nunca saem dele. Privacidade por desenho, não por opção.

## Como funciona

1. **Lista**: uma palavra por linha.
2. **Revisão**: confirma cada cartão, troca o pictograma ou usa uma foto sua. Podes associar uma ilustração ou um vídeo do gesto a usar no verso.
3. **Imprimir**: ajusta tamanho e contraste, e gera a folha A4 (ou PDF).

Os cartões agrupam-se automaticamente por função comunicativa (pedir, recusar, escolher, comentar).

## Correr localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5180/`. Landing em `/`, app em `/app`.

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

Mantido por [Pedro Oliveira](https://jpoliveira.pt). Para sugestões ou bugs, [pedro@jpoliveira.pt](mailto:pedro@jpoliveira.pt).
