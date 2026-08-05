import { ArrowRight, Compass, Heart, Sparkles } from "lucide-react";
import { PhoneMock } from "@/components/PhoneMock";

export function ProductBridge() {
  return (
    <section className="px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="tag-chip bg-sun"><Sparkles className="h-3.5 w-3.5" /> Continuação natural</span>
          <h2 className="mt-5 text-4xl font-black sm:text-6xl">Agora você sabe o que precisa fazer.</h2>
          <p className="mt-5 max-w-2xl text-xl font-semibold text-ink/80">
            O Noiva Sem Surto transforma esse diagnóstico em uma jornada completa até o casamento.
          </p>
          <p className="mt-4 max-w-2xl text-lg text-ink/70">
            Dentro do aplicativo, sua <b>Bússola Sem Surto</b> mostra apenas a próxima decisão importante, explica por que ela vem agora e organiza cada etapa na ordem certa.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Bússola Sem Surto", "Jornada cronológica", "Orçamento", "Lista dos Sonhos", "Comparador de fornecedores", "Checklist por fase", "SOS Noiva"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/75 px-4 py-3 font-semibold shadow-sm">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-lime"><Heart className="h-3.5 w-3.5" fill="currentColor" /></span>
                {item}
              </div>
            ))}
          </div>

          <a href="#bussola" className="nss-secondary-btn mt-8">
            Conhecer minha Bússola <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="lg:col-span-5">
          <div className="relative">
            <span className="absolute -right-2 top-4 z-10 hidden rotate-3 rounded-full border-2 border-ink bg-lime px-4 py-2 text-sm font-black shadow-[3px_3px_0_var(--color-ink)] sm:inline-flex">
              <Compass className="mr-2 h-4 w-4" /> Próximo passo claro
            </span>
            <PhoneMock />
          </div>
        </div>
      </div>
    </section>
  );
}
