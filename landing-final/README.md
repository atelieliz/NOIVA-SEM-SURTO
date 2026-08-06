# Noiva Sem Surto — landing

Landing em Next.js 15 conectada ao checkout do Noiva Sem Surto na Kiwify.

## Jornada

1. Apresentação curta, sem preço ou detalhes do produto.
2. Diagnóstico com três perguntas.
3. Resultado personalizado com prioridade, risco e três primeiros passos.
4. Apresentação das funções reais do mini app.
5. Oferta de R$ 29,90, FAQ e acesso ao checkout.

## Rastreamento

- Meta Pixel: `3331832193668276`.
- A landing registra `PageView` e o evento personalizado `CheckoutClick`.
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` e `fbclid` são preservados até a Kiwify.
- O primeiro clique bloqueia os demais até o redirecionamento, evitando duplicação por toque duplo.

## Produto

A copy apresenta apenas recursos disponíveis no mini app. Bússola Sem Surto e Lista dos Sonhos permanecem como módulos futuros desativados no código e não são exibidas.

## Validação

```bash
npm ci
npm test
npm run build
```

Na Vercel, mantenha o framework Next.js e o diretório raiz como `./`.
