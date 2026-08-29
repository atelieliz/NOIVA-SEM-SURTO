import { ArrowRight, Check, Heart } from "lucide-react";

export function DiagnosticHero() {
  return (
    <header className="relative overflow-hidden px-5 pb-12 pt-7 sm:pb-20 sm:pt-10">
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
          <span className="tag-chip hidden bg-white/75 sm:inline-flex">Rota personalizada</span>
        </nav>

        <div className="mx-auto max-w-4xl text-center">
          <span className="tag-chip bg-sun">Descubra sua próxima decisão</span>
          <h1 className="mt-6 text-[2.65rem] font-black leading-[1.02] sm:text-6xl lg:text-7xl">
            Você não precisa organizar tudo agora.
            <span className="mt-2 block text-hot">Precisa descobrir o que vem primeiro.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-ink/70 sm:text-xl">
            Responda três perguntas rápidas e receba uma Rota Sem Surto personalizada para organizar seu casamento, bodas ou celebração sem se perder entre orçamento, convidados, fornecedores e detalhes.
          </p>

          <a href="#diagnostico" className="nss-primary-btn mt-8 w-full sm:w-auto">
            Descobrir meu próximo passo <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-3 text-sm font-semibold text-ink/55">Leva menos de 3 minutos.</p>

          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2 text-sm font-semibold text-ink/70">
            {["Diagnóstico gratuito", "3 perguntas", "Resultado na hora"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-3 py-2">
                <Check className="h-4 w-4 text-hot" /> {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
