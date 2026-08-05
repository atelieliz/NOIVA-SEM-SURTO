"use client";

import { Play, Video } from "lucide-react";
import { useRef, useState } from "react";
import { VIDEO_URL } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  async function playVideo() {
    trackEvent("VideoClick", { placement: "identificacao_da_dor" });
    setStarted(true);
    try {
      await videoRef.current?.play();
    } catch {
      // Os controles nativos continuam disponíveis.
    }
  }

  return (
    <section className="px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <span className="tag-chip bg-lime"><Video className="h-3.5 w-3.5" /> Explicação rápida</span>
        <h2 className="mt-5 text-4xl font-black sm:text-5xl">Antes de continuar, assista a esta explicação rápida.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/70">
          Em poucos segundos você vai entender por que tantas noivas se sentem perdidas mesmo pesquisando todos os dias.
        </p>

        <div className="mx-auto mt-9 max-w-3xl overflow-hidden rounded-[1.75rem] border-2 border-ink bg-ink shadow-[7px_7px_0_var(--color-ink)]">
          <div className="relative aspect-video bg-[linear-gradient(135deg,#3d195a,#7543a4_55%,#ff6b5e)]">
            {!failed && (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                controls={started}
                playsInline
                preload="none"
                poster="/video-poster.svg"
                onPlay={() => setStarted(true)}
                onError={() => setFailed(true)}
              >
                {VIDEO_URL && <source src={VIDEO_URL} type="video/mp4" />}
              </video>
            )}

            {!started && (
              <button
                type="button"
                onClick={playVideo}
                className="absolute inset-0 grid place-items-center bg-ink/5 transition hover:bg-ink/10"
                aria-label="Reproduzir vídeo"
              >
                <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-cream bg-cream text-hot shadow-lg sm:h-20 sm:w-20">
                  <Play className="ml-1 h-7 w-7 fill-current sm:h-9 sm:w-9" />
                </span>
              </button>
            )}

            {failed && (
              <div className="absolute inset-0 grid place-items-center px-6 text-center text-cream">
                <div>
                  <Video className="mx-auto h-10 w-10" />
                  <p className="mt-3 font-display text-2xl font-black">Seu vídeo entra aqui.</p>
                  <p className="mt-2 text-sm text-cream/75">Adicione o arquivo indicado no README para ativar a reprodução.</p>
                </div>
              </div>
            )}
          </div>
          <p className="bg-cream px-5 py-4 text-sm font-semibold text-ink/70">
            O vídeo explica o problema. O diagnóstico mostra o que fazer no seu caso.
          </p>
        </div>

        <a href="#diagnostico" className="nss-secondary-btn mt-8 w-full sm:w-auto">
          Começar meu diagnóstico
        </a>
      </div>
    </section>
  );
}
