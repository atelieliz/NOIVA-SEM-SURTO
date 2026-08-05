export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "https://pay.kiwify.com.br/AUehsBX";

// Mantido por compatibilidade com a estrutura que já foi publicada.
// A página final não renderiza o vídeo.
export const VIDEO_URL = process.env.NEXT_PUBLIC_VIDEO_URL ?? "/video-noiva-sem-surto.mp4";

export const SITE = {
  name: "Noiva Sem Surto",
  title: "Noiva Sem Surto — Descubra o que vem primeiro",
  description:
    "Responda três perguntas e receba uma Rota Sem Surto personalizada para organizar seu casamento, bodas ou celebração com mais clareza.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://noivasemsurto.com.br",
};
