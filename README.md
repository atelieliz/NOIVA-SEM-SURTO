# Noiva Sem Surto — Landing de Diagnóstico

Landing page construída em **Next.js 15 + React 19 + TypeScript + Tailwind CSS v4**, sem qualquer dependência da Lovable.

A estrutura visual original foi preservada: Fraunces, tons creme/roxo/coral/amarelo, cards arredondados, bordas marcantes e experiência mobile. O fluxo foi refinado para:

```text
Anúncio → Landing → Diagnóstico → Resultado personalizado → Aplicativo → Oferta → Kiwify
```

## O que foi implementado

- Primeira dobra sem preço e focada no diagnóstico.
- Seção curta de identificação da dor.
- Vídeo complementar, sem autoplay com som e carregado sob demanda.
- Questionário interativo com 8 perguntas, uma por tela.
- Barra de progresso, voltar, continuar e respostas persistidas no navegador.
- Resultado personalizado com 5 perfis, risco, 3 decisões, itens que podem esperar e mensagem de segurança.
- Aplicativo e oferta liberados somente após o diagnóstico.
- Bússola Sem Surto, Lista dos Sonhos, recursos, transparência e FAQ.
- Remoção do fluxo de depoimentos fictícios, contadores e escassez falsa.
- Checkout da Kiwify: `https://pay.kiwify.com.br/AUehsBX`.
- Meta Pixel padrão: `3331832193668276`.

## Vídeo

O ZIP não continha o arquivo de vídeo. Para ativá-lo sem mudar código:

1. Renomeie o vídeo para `video-noiva-sem-surto.mp4`.
2. Coloque-o dentro da pasta `public/`.

Ou informe uma URL pública em `.env.local`:

```env
NEXT_PUBLIC_VIDEO_URL=https://seusite.com/video.mp4
```

Enquanto o arquivo não for adicionado, a seção mantém o poster e mostra uma orientação discreta ao tentar reproduzir.

## Rodar localmente

Requisitos: Node.js 20+ recomendado.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Acesse `http://localhost:3000`.

## Build de produção

```bash
npm run build
npm start
```

## Eventos configurados

### Meta Pixel

- `PageView`: carregamento da página.
- `ViewContent`: oferta visualizada.
- `StartDiagnostic`: início do questionário.
- `CompleteDiagnostic`: conclusão do questionário.
- `InitiateCheckout`: clique para a Kiwify.

A landing **não dispara Purchase**.

### Eventos adicionais

- `DiagnosticQuestionView`
- `DiagnosticAnswer`
- `DiagnosticAbandon`
- `DiagnosticResultView`
- `VideoClick`
- `RestartDiagnostic`

UTMs, `fbclid`, referência e caminho inicial são anexados aos eventos quando disponíveis.

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_CHECKOUT_URL` | Link da Kiwify |
| `NEXT_PUBLIC_SITE_URL` | URL pública para SEO |
| `NEXT_PUBLIC_VIDEO_URL` | Arquivo ou URL do vídeo |
| `NEXT_PUBLIC_META_PIXEL_ID` | Pixel da Meta |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 opcional |
| `NEXT_PUBLIC_GTM_ID` | GTM opcional |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity opcional |

## Observação sobre dados

O progresso do diagnóstico fica no `localStorage` do navegador. Limpar dados, usar modo privado ou trocar de aparelho pode remover o progresso. Nenhum banco de dados é necessário para esta landing.
