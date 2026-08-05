import { AlarmClock, ClipboardList, Compass, ScanLine, Target, TrendingDown, Zap } from "lucide-react";
import { SectionHead } from "@/components/SectionHead";

export function Features() {
  const items = [
    { icon: Target, t: "🧭 Quiz do Casamento", d: "Identifica a situação atual e organiza a próxima decisão." },
    { icon: ScanLine, t: "🔎 Raio-X da Noiva", d: "Mostra a principal trava, os riscos e o que já está bem encaminhado." },
    { icon: ClipboardList, t: "✅ Checklist por Fase", d: "Apresenta apenas as tarefas relevantes para cada momento do planejamento." },
    { icon: TrendingDown, t: "🧮 Simulador de Lista", d: "Mostra como a quantidade de convidados interfere no orçamento." },
    { icon: Compass, t: "⚖️ Comparador de Fornecedores", d: "Ajuda a observar contrato, segurança, avaliações, plano B e preço." },
    { icon: AlarmClock, t: "🆘 SOS Noiva", d: "Entrega protocolos rápidos para problemas comuns." },
    { icon: Zap, t: "⏱️ Plano de 72 Horas", d: "Transforma o diagnóstico em três ações simples." },
  ];
  return (
    <section className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          eyebrow="Recursos principais"
          title={<>Tudo que a noiva precisa para <span className="italic">decidir agora</span>.</>}
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((b, i) => (
            <div key={b.t} className="brutal-card p-6 hover:-translate-y-1 transition-transform">
              <div
                className="h-11 w-11 grid place-items-center rounded-xl border-2 border-ink mb-4"
                style={{ background: ["var(--color-hot)", "var(--color-sun)", "var(--color-lime)", "var(--color-coral)", "var(--color-sun)", "var(--color-hot)", "var(--color-lime)"][i] }}
              >
                <b.icon className="h-5 w-5" style={{ color: i === 0 || i === 3 || i === 5 ? "var(--color-cream)" : "var(--color-ink)" }} />
              </div>
              <h3 className="font-display text-xl font-black">{b.t}</h3>
              <p className="mt-2 text-ink/70">{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
