import { ArrowRight, Check, Compass, Heart } from "lucide-react";
import { PhoneMock } from "@/components/PhoneMock";

const benefits = [
  "Uma prioridade por vez, sem lista gigante.",
  "Jornada cronológica adaptada à sua fase.",
  "Orçamento e Lista dos Sonhos organizados.",
  "Comparação de fornecedores com mais segurança.",
  "Planejamento da cerimônia, recepção e últimos 30 dias.",
  "SOS Noiva para decisões urgentes.",
];

export function ProductBridge() {
  return (
    <section className="border-y-2 border-ink bg-white px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="tag-chip bg-lime">
            <Compass className="h-3.5 w-3.5" /> Sua assessora digital
          </span>
          <h2 className="mt-5 text-4xl font-black sm:text-6xl">Agora você sabe o que precisa resolver.</h2>
          <p className="mt-4 max-w-2xl text-xl font-bold text-hot">
            O Noiva Sem Surto mostra como executar cada etapa.
          </p>
          <p className="mt-4 max-w-2xl text-lg text-ink/70">
            A sua Bússola Sem Surto mostra a próxima decisão importante, explica por que ela vem agora e atualiza sua jornada conforme você avança.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-cream p-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold text-ink/75">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border-2 border-ink bg-sun p-5 shadow-[4px_4px_0_var(--color-ink)]">
            <div className="flex items-start gap-3">
              <Heart className="mt-1 h-5 w-5 shrink-0 text-hot" fill="currentColor" />
              <p className="font-display text-xl font-black sm:text-2xl">
                Não é mais uma lista mostrando tudo o que falta. É alguém mostrando o que faz sentido resolver agora.
              </p>
            </div>
          </div>

          <a href="#oferta" className="nss-primary-btn mt-8 w-full sm:w-auto">
            Ver minha jornada completa <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="lg:col-span-5">
          <PhoneMock />
        </div>
      </div>
    </section>
  );
}
