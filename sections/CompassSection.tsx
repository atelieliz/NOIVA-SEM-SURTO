import { ArrowRight, Clock3, Compass, RefreshCcw } from "lucide-react";

export function CompassSection() {
  return (
    <section id="bussola" className="scroll-mt-8 border-y-2 border-ink bg-ink px-5 py-20 text-cream sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="tag-chip border-cream bg-hot text-cream"><Compass className="h-3.5 w-3.5" /> Bússola Sem Surto</span>
          <h2 className="mt-5 text-4xl font-black sm:text-6xl">Sua assessora não entrega uma lista gigante.</h2>
          <p className="mt-5 text-2xl font-semibold text-sun">Ela mostra o próximo passo.</p>
          <p className="mt-5 max-w-xl text-lg text-cream/70">
            Cada etapa concluída atualiza sua jornada e prepara a próxima decisão, sem fazer você carregar o casamento inteiro de uma vez.
          </p>
        </div>

        <article className="rounded-[2rem] border-2 border-cream/25 bg-cream p-5 text-ink shadow-[8px_8px_0_rgba(255,255,255,.16)] sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-hot">Bússola Sem Surto</p>
              <p className="mt-1 font-display text-2xl font-black">Faltam 284 dias.</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sun"><Compass className="h-6 w-6" /></span>
          </div>

          <div className="mt-6 rounded-3xl bg-[linear-gradient(135deg,#3d195a,#7543a4_58%,#ff6b5e)] p-6 text-cream">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-cream/70">Sua prioridade agora</p>
            <h3 className="mt-2 text-3xl font-black">Definir o orçamento.</h3>
            <div className="mt-5 rounded-2xl bg-white/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-cream/60">Por que isso vem agora</p>
              <p className="mt-2 font-semibold">Essa decisão orienta lista, local e fornecedores.</p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-cream/80">
              <Clock3 className="h-4 w-4" /> Tempo estimado: 15 minutos.
            </div>
          </div>

          <button type="button" className="nss-primary-btn mt-5 w-full" aria-label="Botão demonstrativo resolver agora">
            Resolver agora <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs font-semibold text-ink/50">
            <RefreshCcw className="h-3.5 w-3.5" /> A próxima prioridade aparece quando esta etapa é concluída.
          </p>
        </article>
      </div>
    </section>
  );
}
