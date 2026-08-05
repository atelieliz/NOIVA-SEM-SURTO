import { Sparkles } from "lucide-react";

export function PhoneMock() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -top-6 -left-6 rotate-[-8deg] tag-chip z-10" style={{ background: "var(--color-lime)" }}>
        <Sparkles className="h-3 w-3" /> Método C.A.S.A.R.
      </div>
      <div className="absolute -bottom-4 -right-4 rotate-[6deg] tag-chip z-10" style={{ background: "var(--color-coral)", color: "var(--color-cream)", borderColor: "var(--color-ink)" }}>
        Plano em 72h
      </div>

      <div className="brutal-card p-4 rotate-[2deg] bg-cream">
        <div className="flex items-center justify-between rounded-2xl border-2 border-ink bg-white px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl grid place-items-center text-white text-lg" style={{ background: "linear-gradient(145deg,#4b276d,#7543a4)" }}>💍</div>
            <div className="leading-tight">
              <div className="text-[9px] text-ink/60 uppercase tracking-widest">Organize sua cabeça</div>
              <div className="text-xs font-black">Noiva Sem Surto</div>
            </div>
          </div>
          <div className="h-9 w-9 rounded-full border-2 border-ink grid place-items-center text-[10px] font-black" style={{ background: "conic-gradient(#ff6b5e 68%, #ede4ee 0)" }}>
            <span className="bg-white rounded-full h-6 w-6 grid place-items-center">68%</span>
          </div>
        </div>

        <div className="mt-3 rounded-2xl p-4 text-white border-2 border-ink" style={{ background: "linear-gradient(135deg,#3d195a,#6b389a 60%,#98579e)" }}>
          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-white/15 border border-white/20">✨ R · Sua rota está pronta</span>
          <div className="mt-2 font-display text-lg font-black leading-tight">
            Definir a lista-base de convidados
          </div>
          <div className="mt-1 text-[11px] text-white/80">
            Essa decisão influencia espaço, buffet e orçamento.
          </div>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1">
          {[
            ["C", "Clareza", "done"],
            ["A", "Análise", "done"],
            ["S", "Simplif.", "done"],
            ["A", "Ação", "done"],
            ["R", "Rota", "active"],
          ].map(([l, n, s], i) => (
            <div key={i} className="text-center rounded-xl py-1.5 border border-ink/10" style={{
              background: s === "active" ? "linear-gradient(135deg,#7543a4,#ff6b5e)" : "var(--color-sun)",
              color: s === "active" ? "white" : "var(--color-ink)",
            }}>
              <div className="font-display font-black text-sm leading-none">{l}</div>
              <div className="text-[8px] font-bold mt-0.5">{n}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border-2 border-ink bg-white p-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-ink/60">Próximas 72 horas</div>
          {[
            "Criar uma lista inicial sem cortes",
            "Separar convidados essenciais e desejados",
            "Definir um limite compatível com o orçamento",
          ].map((t, i) => (
            <div key={t} className="mt-2 flex items-start gap-2 rounded-lg p-2" style={{ background: "#faf6fb" }}>
              <span className="h-5 w-5 shrink-0 rounded-md grid place-items-center text-white font-black text-[10px]" style={{ background: "#7543a4" }}>{i + 1}</span>
              <span className="text-[12px] font-medium leading-tight">{t}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1 rounded-2xl p-1.5" style={{ background: "#281f30" }}>
          {[
            ["✨", "Plano", true],
            ["✓", "Checklist", false],
            ["🧮", "Lista", false],
            ["⚖️", "Fornec.", false],
            ["🆘", "SOS", false],
          ].map(([ic, lb, active], i) => (
            <div key={i} className="text-center rounded-xl py-1.5" style={{
              background: active ? "linear-gradient(135deg,#7543a4,#ff6b5e)" : "transparent",
              color: active ? "white" : "#d4c7db",
            }}>
              <div className="text-sm leading-none">{ic as string}</div>
              <div className="text-[8px] font-bold mt-0.5">{lb as string}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
