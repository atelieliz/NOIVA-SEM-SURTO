import { SectionHead } from "@/components/SectionHead";

export function Checklist() {
  const phases = [
    "Primeiros passos",
    "Orçamento e convidados",
    "Espaço e fornecedores",
    "Cerimônia e recepção",
    "Últimos 30 dias",
    "Última semana",
  ];
  return (
    <section className="px-5 py-20 sm:py-28 bg-coral text-cream border-y-2 border-ink">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          eyebrow="Checklist útil"
          title={<>Uma ferramenta de consulta, não mais uma <span className="italic">obrigação</span>.</>}
        />
        <p className="mt-4 text-cream/85 max-w-2xl">
          O checklist não tenta acompanhar o casamento inteiro. Ele mostra, para cada fase, as tarefas essenciais com:
          o que fazer, por que importa e o que essa decisão destrava.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((p, i) => (
            <div key={p} className="brutal-card p-5" style={{ background: "var(--color-cream)", color: "var(--color-ink)" }}>
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-full bg-hot text-cream grid place-items-center font-black text-sm">{i + 1}</span>
                <span className="font-display font-black text-lg">{p}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          <div className="brutal-card p-6" style={{ background: "var(--color-sun)", color: "var(--color-ink)" }}>
            <h4 className="font-display text-lg font-black">O que fazer</h4>
            <p className="mt-2 text-ink/80">Definir o orçamento máximo.</p>
          </div>
          <div className="brutal-card p-6" style={{ background: "var(--color-lime)", color: "var(--color-ink)" }}>
            <h4 className="font-display text-lg font-black">Por que importa</h4>
            <p className="mt-2 text-ink/80">Evita contratar fornecedores antes de saber quanto pode gastar.</p>
          </div>
          <div className="brutal-card p-6" style={{ background: "var(--color-cream)", color: "var(--color-ink)" }}>
            <h4 className="font-display text-lg font-black">O que destrava</h4>
            <p className="mt-2 text-ink/80">Lista, espaço e prioridades.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
