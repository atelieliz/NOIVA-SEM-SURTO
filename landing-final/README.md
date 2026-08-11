# Noiva Sem Surto — landing

Landing em Next.js 15 conectada ao checkout do Noiva Sem Surto na Kiwify.

## Jornada

1. Apresentação curta, sem preço ou detalhes do produto.
2. Diagnóstico com três perguntas.
3. Resultado personalizado com momento, risco, prioridade e o que pode esperar.
4. Custo do problema e ponte para o produto.
5. Demonstração da Bússola e das telas reais do mini app.
6. Ferramentas, diferencial Lista dos Sonhos e confiança.
7. Oferta de R$ 29,90 e acesso ao checkout.

## Rastreamento

- Meta Pixel: `3331832193668276`.
- A landing registra `PageView`, `StartDiagnostic`, `CompleteDiagnostic`, `ResultView` e o evento personalizado `CheckoutClick`.
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` e `fbclid` são preservados até a Kiwify.
- O primeiro clique bloqueia os demais até o redirecionamento, evitando duplicação por toque duplo.
- Os eventos comerciais do checkout e da compra ficam sob responsabilidade da Kiwify.

## Produto

A copy apresenta apenas recursos comprovados no mini app. Bússola Sem Surto e Lista dos Sonhos são demonstradas com telas reais. Visita técnica e Modo Últimos 30 Dias permanecem no código como módulos futuros desativados e não entram na oferta.

## Validação

```bash
npm ci
npm test
npm run build
```

Na Vercel, mantenha o framework Next.js e o diretório raiz como `./`.
