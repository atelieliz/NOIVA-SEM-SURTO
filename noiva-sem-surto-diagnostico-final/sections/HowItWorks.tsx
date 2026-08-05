import { SectionHead } from "@/components/SectionHead";

export function HowItWorks() {
  return (
    <section className="px-5 py-20 sm:py-28 bg-ink text-cream border-y-2 border-ink">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          eyebrow="Como o app funciona"
          title={<>Três etapas para sair da confusão e <span className="italic">saber o que fazer</span>.</>}
        />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          <div className="brutal-card p-6" style={{ background: "var(--color-cream)", color: "var(--color-ink)" }}>
            <div className="font-display text-6xl font-black text-hot leading-none">1</div>
            <h3 className="mt-4 font-display text-xl font-black">Tela de identificação</h3>
            <p className="mt-2 text-ink/70">
              A noiva escolhe a frase que mais representa seu momento: "não sei por onde começar",
              "tenho medo de esquecer algo", "meu orçamento está saindo do controle" e outras.
              O app começa pela <b>dor</b>, não por um menu cheio de ferramentas.
            </p>
          </div>
          <div className="brutal-card p-6" style={{ background: "var(--color-sun)", color: "var(--color-ink)" }}>
            <div className="font-display text-6xl font-black text-hot leading-none">2</div>
            <h3 className="mt-4 font-display text-xl font-black">Quiz interativo</h3>
            <p className="mt-2 text-ink/70">
              Uma pergunta por vez. O app coleta apenas o necessário: data, convidados, orçamento,
              estilo, prioridades, decisões já tomadas e maior preocupação. Parece uma{" "}
              <b>conversa curta</b>, não um formulário burocrático.
            </p>
          </div>
          <div className="brutal-card p-6" style={{ background: "var(--color-lime)", color: "var(--color-ink)" }}>
            <div className="font-display text-6xl font-black text-hot leading-none">3</div>
            <h3 className="mt-4 font-display text-xl font-black">Diagnóstico final</h3>
            <p className="mt-2 text-ink/70">
              A noiva recebe uma prioridade objetiva, o porquê aquilo vem primeiro, três ações para
              as próximas 72 horas e o que pode esperar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
