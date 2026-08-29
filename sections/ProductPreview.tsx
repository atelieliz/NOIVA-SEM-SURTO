import { Check, Compass, Sparkles } from "lucide-react";

const previewPoints = [
  "O que faz sentido resolver agora",
  "Por que essa decisão vem antes das outras",
  "O que pode esperar sem virar culpa ou atraso",
];

export function ProductPreview() {
  return (
    <section className="border-y-2 border-ink bg-white px-5 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <span className="tag-chip bg-lime">
            <Sparkles className="h-3.5 w-3.5" /> Depois do diagnóstico existe uma rota
          </span>
          <h2 className="mt-5 text-4xl font-black leading-[1.04] sm:text-5xl">
            O diagnóstico mostra o começo. O Noiva Sem Surto te conduz no restante.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-ink/70">
            Você não recebe uma lista genérica para dar conta. Recebe uma assessora digital que organiza a ordem das decisões e te ajuda a voltar para o próximo passo sempre que o planejamento embolar.
          </p>

          <div className="mt-7 space-y-3">
            {previewPoints.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-cream p-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold text-ink/75">{item}</span>
              </div>
            ))}
          </div>

          <a href="#diagnostico" className="nss-primary-btn mt-8 w-full sm:w-auto">
            <Compass className="h-4 w-4" /> Descobrir minha próxima decisão
          </a>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="rounded-[2.2rem] border-2 border-ink bg-cream p-3 shadow-[8px_8px_0_var(--color-sun)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nss-app-welcome.webp"
              alt="Tela real do Noiva Sem Surto dando boas-vindas e iniciando a rota da noiva"
              className="w-full rounded-[1.65rem] border border-ink/15"
              loading="lazy"
            />
          </div>
          <p className="mt-4 text-center text-sm font-semibold text-ink/55">Tela real do Noiva Sem Surto</p>
        </div>
      </div>
    </section>
  );
}
