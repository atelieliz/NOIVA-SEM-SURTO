# Noiva Sem Surto — Landing final

Landing em Next.js 15 baseada na mesma estrutura técnica que já publicou com sucesso na Vercel.

## Fluxo

Anúncio → 3 perguntas → Rota Sem Surto → apresentação do produto → oferta → FAQ → CTA final → Kiwify

## Checkout

Todos os CTAs de compra usam link HTML direto, na mesma aba, sem depender de variável de ambiente ou JavaScript:

`https://pay.kiwify.com.br/AUehsBX`

Pontos de acesso:

- botão principal da oferta;
- botão fixo mobile depois do diagnóstico;
- CTA final após o FAQ.

O JavaScript é usado apenas para registrar `InitiateCheckout`; a navegação funciona mesmo se o rastreamento falhar.

## Meta Pixel

ID padrão: `3331832193668276`

Eventos principais:

- PageView
- StartDiagnostic
- CompleteDiagnostic
- ViewContent
- InitiateCheckout

A landing não dispara Purchase.

## Publicação

Envie o conteúdo desta pasta para a raiz do repositório, mantendo:

- Framework: Next.js
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: vazio
- Install Command: `npm install`
