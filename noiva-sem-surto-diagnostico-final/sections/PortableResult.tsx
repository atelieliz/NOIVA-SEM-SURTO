import { ClipboardList, Download, MessageCircleHeart, ScanLine, Zap } from "lucide-react";
import { SectionHead } from "@/components/SectionHead";

export function PortableResult() {
  const ways = [
    { icon: ClipboardList, t: "Copiar o plano", d: "Texto pronto para colar onde você quiser." },
    { icon: Download, t: "Baixar ou imprimir", d: "Resumo visual para guardar na pasta do casamento." },
    { icon: MessageCircleHeart, t: "Enviar pelo WhatsApp", d: "Compartilhe com o parceiro, mãe ou assessora." },
    { icon: ScanLine, t: "Salvar como imagem", d: "Um cartão simples que não depende do navegador." },
    { icon: Zap, t: "Refazer sempre", d: "Quando a situação mudar, o diagnóstico muda junto." },
  ];
  return (
    <section className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          eyebrow="Progresso portátil"
          title={<>O valor não fica preso ao <span className="italic">navegador</span>.</>}
        />
        <p className="mt-4 text-ink/75 max-w-2xl">
          O produto não promete acompanhamento permanente. Cada sessão termina com um resultado portátil.
          A noiva pode sair com o plano e continuar usando fora do app.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ways.map((w, i) => (
            <div key={w.t} className="brutal-card p-6">
              <div
                className="h-11 w-11 grid place-items-center rounded-xl border-2 border-ink mb-4"
                style={{ background: ["var(--color-sun)", "var(--color-lime)", "var(--color-coral)", "var(--color-hot)", "var(--color-sun)"][i] }}
              >
                <w.icon className="h-5 w-5" style={{ color: i === 0 || i === 1 ? "var(--color-ink)" : "var(--color-cream)" }} />
              </div>
              <h3 className="font-display text-xl font-black">{w.t}</h3>
              <p className="mt-2 text-ink/70">{w.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
