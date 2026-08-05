import { Check } from "lucide-react";
import { SectionHead } from "@/components/SectionHead";

const unlocks = [
  ["Diagnóstico transformado em plano", "Continua exatamente do ponto identificado nas suas respostas."],
  ["Bússola Sem Surto personalizada", "Mostra uma decisão importante por vez."],
  ["Jornada cronológica", "Organiza do pedido ao grande dia por fase e prazo."],
  ["Planejamento de orçamento", "Ajuda a enxergar limite, categorias e impactos."],
  ["Lista dos Sonhos", "Cria a primeira lista com o casal sem começar pelos cortes."],
  ["Exportação da primeira lista em PDF", "Gera uma versão organizada para revisar e compartilhar."],
  ["Lista de cortes por prioridade", "Conduz ajustes com critérios mais claros."],
  ["Estilo, cores e conceito", "Centraliza referências antes de comprar detalhes."],
  ["Comparador de fornecedores", "Compara preço, contrato, segurança e logística."],
  ["Checklist de visita técnica", "Leva perguntas essenciais para cada visita."],
  ["Cronograma por prazo", "Mostra o que pertence a cada fase do planejamento."],
  ["Planejamento da cerimônia", "Organiza decisões que afetam o momento principal."],
  ["Planejamento da recepção", "Conecta convidados, espaço, alimentação e experiência."],
  ["Modo últimos 30 dias", "Prioriza confirmações, pagamentos e operação final."],
  ["SOS Noiva", "Oferece direção rápida para imprevistos comuns."],
];

export function UnlocksSection() {
  return (
    <section className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="Sua jornada completa" title={<>O que você desbloqueia no <span className="italic text-hot">Noiva Sem Surto</span></>} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {unlocks.map(([title, description], index) => (
            <article key={title} className={`soft-card p-5 ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
              <span className={`grid h-9 w-9 place-items-center rounded-full border border-ink/15 ${index % 3 === 0 ? "bg-hot text-cream" : index % 3 === 1 ? "bg-sun" : "bg-lime"}`}>
                <Check className="h-4 w-4" />
              </span>
              <h3 className="mt-4 font-display text-xl font-black">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
