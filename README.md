# Noiva Sem Surto — Landing Rota Sem Surto

Landing page em Next.js com jornada enxuta de conversão:

1. Headline e CTA para o diagnóstico.
2. Três perguntas interativas.
3. Resultado personalizado com risco, prioridade e próximos passos.
4. Apresentação curta da Bússola Sem Surto.
5. Oferta e checkout da Kiwify.
6. FAQ transparente.

## Links e integrações

- Checkout padrão: `https://pay.kiwify.com.br/AUehsBX`
- Meta Pixel padrão: `3331832193668276`

Ambos podem ser alterados por variáveis de ambiente:

```env
NEXT_PUBLIC_CHECKOUT_URL=https://pay.kiwify.com.br/AUehsBX
NEXT_PUBLIC_META_PIXEL_ID=3331832193668276
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
```

## Eventos

- PageView
- StartDiagnostic
- DiagnosticQuestionView
- DiagnosticAnswer
- DiagnosticAbandon
- CompleteDiagnostic
- DiagnosticResultView
- OfferIntent
- ViewContent
- InitiateCheckout

A landing não dispara `Purchase`.

## Publicação na Vercel

- Framework: Next.js
- Root Directory: pasta em que está o `package.json`
- Build Command: `npm run build`
- Output Directory: vazio
- Install Command: `npm install`
