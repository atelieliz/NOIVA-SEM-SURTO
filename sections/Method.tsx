import { SectionHead } from "@/components/SectionHead";

export function Method() {
  const steps = [
    { letter: "C", title: "Clareza", desc: "Identificar a principal dor da noiva naquele momento." },
    { letter: "A", title: "Análise", desc: "Entender data, convidados, orçamento, prioridades e decisões já tomadas." },
    { letter: "S", title: "Simplificação", desc: "Eliminar tarefas desnecessárias e mostrar apenas o que importa agora." },
    { letter: "A", title: "Ação", desc: "Entregar três próximos passos possíveis." },
    { letter: "R", title: "Rota", desc: "Gerar um resumo final que a noiva pode copiar, imprimir ou compartilhar." },
  ];
  return (
    <section className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          eyebrow="O método"
          title={<>Método <span className="text-hot">C.A.S.A.R.</span></>}
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div key={s.letter} className="brutal-card p-6 hover:-translate-y-1 transition-transform">
              <div
                className="h-14 w-14 grid place-items-center rounded-xl border-2 border-ink mb-4"
                style={{ background: ["var(--color-hot)", "var(--color-sun)", "var(--color-lime)", "var(--color-coral)", "var(--color-sun)"][i] }}
              >
                <span className="font-display text-2xl font-black" style={{ color: i === 0 || i === 3 ? "var(--color-cream)" : "var(--color-ink)" }}>
                  {s.letter}
                </span>
              </div>
              <h3 className="font-display text-2xl font-black">{s.letter} — {s.title}</h3>
              <p className="mt-2 text-ink/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
