# Noiva Sem Surto — Landing final enxuta

Esta versão usa exatamente a mesma base técnica da primeira implantação que funcionou:

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- mesma estrutura de pastas e configurações de build

## Jornada final

```text
Headline → 3 perguntas → resultado personalizado → Noiva Sem Surto → oferta → Kiwify
```

## O que aparece na página

- headline direta, sem preço no início;
- diagnóstico com apenas 3 perguntas;
- resultado com momento atual, risco, prioridade, 3 passos e o que pode esperar;
- apresentação curta da Bússola Sem Surto;
- oferta de R$ 29,90;
- FAQ enxuto e transparente;
- CTA fixo no celular;
- nenhum vídeo na página;
- nenhum botão decorativo.

## Links configurados

- Checkout: `https://pay.kiwify.com.br/AUehsBX`
- Meta Pixel: `3331832193668276`

## Eventos

- `PageView`
- `StartDiagnostic`
- `DiagnosticQuestionView`
- `DiagnosticAnswer`
- `DiagnosticAbandon`
- `CompleteDiagnostic`
- `DiagnosticResultView`
- `OfferIntent`
- `ViewContent`
- `InitiateCheckout`

A landing não dispara `Purchase`.

## Publicação na Vercel

Mantenha as mesmas configurações da implantação que já funcionou:

```text
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: vazio
Install Command: npm install
```

Os arquivos `package.json`, `app`, `components`, `lib`, `sections` e `styles` precisam aparecer diretamente na raiz do repositório.
