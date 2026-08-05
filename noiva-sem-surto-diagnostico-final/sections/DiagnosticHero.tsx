import { ArrowDown, Check, Heart } from "lucide-react";

export function DiagnosticHero() {
  return (
    <header className="relative overflow-hidden px-5 pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="hero-blob hero-blob-one" aria-hidden="true" />
      <div className="hero-blob hero-blob-two" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <nav className="mb-10 flex items-center justify-between sm:mb-16" aria-label="Principal">
          <a href="#inicio" className="flex items-center gap-2" aria-label="Noiva Sem Surto">
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-hot text-cream shadow-[3px_3px_0_var(--color-ink)]">
              <Heart className="h-4 w-4" fill="currentColor" />
            </span>
            <span className="font-display text-xl font-black">Noiva Sem Surto</span>
          </a>
          <span className="tag-chip hidden bg-white/70 sm:inline-flex">Avaliação inicial</span>
        </nav>

        <div className="mx-auto max-w-4xl text-center">
          <span className="tag-chip bg-sun">Comece pela decisão certa</span>
          <h1 className="mt-6 text-[2.65rem] font-black leading-[1.02] sm:text-6xl lg:text-7xl">
            Descubra o que você realmente precisa resolver primeiro no seu casamento.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/70 sm:text-xl">
            Responda algumas perguntas rápidas e receba um diagnóstico do seu planejamento, com prioridades, riscos e próximos passos.
          </p>

          <div className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-2.5">
            {["Sem planilha gigante", "Sem tentar fazer tudo ao mesmo tempo", "Sem começar pela decisão errada"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-3.5 py-2 text-sm font-semibold shadow-sm">
                <Check className="h-4 w-4 text-hot" /> {item}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col items-center">
            <a href="#diagnostico" className="nss-primary-btn w-full sm:w-auto">
              Fazer meu diagnóstico <ArrowDown className="h-4 w-4" />
            </a>
            <p className="mt-3 text-sm text-ink/50">Leva cerca de 2 minutos.</p>
          </div>
        </div>
      </div>
    </header>
  );
}
