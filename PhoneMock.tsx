import { Compass, Sparkles } from "lucide-react";

export function PhoneMock() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-label="Demonstração da Bússola Sem Surto">
      <div className="absolute -left-3 -top-5 z-10 rotate-[-5deg] tag-chip bg-lime sm:-left-6">
        <Compass className="h-3 w-3" /> Bússola Sem Surto
      </div>
      <div className="absolute -bottom-3 -right-2 z-10 rotate-[4deg] tag-chip bg-coral text-cream sm:-right-5">
        Uma decisão por vez
      </div>

      <div className="brutal-card rotate-[1deg] bg-cream p-4">
        <div className="flex items-center justify-between rounded-2xl border-2 border-ink bg-white px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-hot text-lg text-white">💍</div>
            <div className="leading-tight">
              <div className="text-[9px] uppercase tracking-widest text-ink/60">Sua rota de hoje</div>
              <div className="text-xs font-black">Noiva Sem Surto</div>
            </div>
          </div>
          <Sparkles className="h-5 w-5 text-hot" />
        </div>

        <div className="mt-3 rounded-2xl border-2 border-ink bg-ink p-4 text-white">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] font-black">
            SUA PRIORIDADE AGORA
          </span>
          <div className="mt-3 font-display text-xl font-black leading-tight">
            Definir a lista-base de convidados
          </div>
          <div className="mt-2 text-[12px] text-white/75">
            Essa decisão orienta espaço, buffet e orçamento.
          </div>
        </div>

        <div className="mt-3 rounded-2xl border-2 border-ink bg-white p-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-ink/55">Por onde começar</div>
          {[
            "Criar a primeira lista sem cortes",
            "Separar essenciais e desejados",
            "Cruzar quantidade com orçamento",
          ].map((text, index) => (
            <div key={text} className="mt-2 flex items-start gap-2 rounded-xl bg-cream p-2.5">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-hot text-[10px] font-black text-white">
                {index + 1}
              </span>
              <span className="text-[12px] font-semibold leading-tight">{text}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1 rounded-2xl bg-ink p-1.5 text-center text-[8px] font-bold text-cream/65">
          <div className="rounded-xl bg-hot px-1 py-2 text-white">Bússola</div>
          <div className="px-1 py-2">Orçamento</div>
          <div className="px-1 py-2">Lista</div>
          <div className="px-1 py-2">SOS</div>
        </div>
      </div>
    </div>
  );
}
