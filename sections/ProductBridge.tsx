import { ArrowRight, Check, Compass, Heart, Sparkles } from "lucide-react";

const changes = [
  "Você para de tentar resolver tudo ao mesmo tempo.",
  "Você entende o que vem agora e o que pode esperar.",
  "Você organiza convidados, orçamento e decisões em um só lugar.",
  "Você volta a sentir que o casamento cabe na sua cabeça.",
];

export function ProductBridge() {
  return (
    <section className="border-y-2 border-ink bg-white px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <span className="tag-chip bg-lime">
            <Compass className="h-3.5 w-3.5" /> Sua assessora digital
          </span>
          <h2 className="mt-5 text-4xl font-black leading-[1.04] sm:text-6xl">
            Agora você sabe o que vem primeiro. Mas o casamento não trava em uma decisão só.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-ink/70 sm:text-xl">
            Depois aparecem convidados, orçamento, fornecedores, cerimônia, pagamentos e dezenas de pequenas escolhas. O Noiva Sem Surto existe para colocar essas decisões em ordem e te mostrar o próximo passo sem te afogar em informação.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
          <article className="rounded-[2rem] border-2 border-ink bg-cream p-5 shadow-[7px_7px_0_var(--color-sun)] sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-hot text-white">
                <Heart className="h-5 w-5" fill="currentColor" />
              </span>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-hot">Clareza desde o começo</p>
                <h3 className="font-display text-2xl font-black">Você entra e já sabe por onde seguir.</h3>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nss-app-welcome.webp"
              alt="Tela real do Noiva Sem Surto iniciando a rota de planejamento"
              className="mx-auto w-full max-w-sm rounded-[1.6rem] border border-ink/15"
              loading="lazy"
            />
          </article>

          <article className="rounded-[2rem] border-2 border-ink bg-white p-5 shadow-[7px_7px_0_var(--color-hot)] sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-lime text-ink">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-hot">Planejamento prático</p>
                <h3 className="font-display text-2xl font-black">A ideia vira ação dentro do app.</h3>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nss-app-guests.webp"
              alt="Tela real do Noiva Sem Surto organizando a lista de convidados por grupos"
              className="mx-auto w-full max-w-sm rounded-[1.6rem] border border-ink/15"
              loading="lazy"
            />
          </article>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {changes.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-cream p-4 sm:p-5">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="font-semibold text-ink/75">{item}</span>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-[2rem] border-2 border-ink bg-sun p-6 text-center shadow-[6px_6px_0_var(--color-ink)] sm:p-8">
          <p className="font-display text-2xl font-black sm:text-3xl">
            Não é mais uma lista mostrando tudo o que falta. É um lugar para voltar quando você não souber o que fazer depois.
          </p>
          <a href="#oferta" className="nss-primary-btn mt-7 w-full sm:w-auto">
            Ver o que eu desbloqueio <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
