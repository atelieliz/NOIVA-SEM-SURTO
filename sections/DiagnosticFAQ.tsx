import { FAQItem } from "@/components/FAQItem";

const items = [
  [
    "O diagnóstico é gratuito?",
    "Sim. As três perguntas e a Rota Sem Surto inicial são gratuitas. A compra é opcional e libera a jornada completa dentro do Noiva Sem Surto.",
  ],
  [
    "Por que comprar se o diagnóstico já mostrou meu próximo passo?",
    "Porque o diagnóstico mostra a primeira prioridade. Depois dela surgem novas decisões. O Noiva Sem Surto organiza a sequência, reúne informações e te ajuda a continuar sem voltar para a sensação de não saber por onde começar.",
  ],
  [
    "Mas eu já tenho planilhas e listas. Isso não é a mesma coisa?",
    "Não. Listas mostram tudo o que existe para fazer. A proposta do Noiva Sem Surto é ajudar você a entender a ordem: o que faz sentido resolver agora, o que vem depois e o que pode esperar.",
  ],
  [
    "E se eu já tiver começado a organizar o casamento?",
    "Você não precisa começar do zero. A ferramenta foi pensada para ajudar a reunir o que já foi decidido e retomar a organização a partir da fase em que você está.",
  ],
  [
    "É fácil de usar pelo celular?",
    "Sim. O acesso é feito pelo navegador do celular ou computador. As telas foram pensadas para uso simples e direto, sem exigir instalação.",
  ],
  [
    "O Noiva Sem Surto substitui uma assessoria presencial?",
    "Não. Ele funciona como uma assessora digital para organizar prioridades, decisões e informações. A execução presencial do evento continua dependendo dos profissionais contratados.",
  ],
  [
    "Como funciona o acesso e a garantia?",
    "O acesso é liberado conforme o processamento da Kiwify. O prazo e as condições de garantia válidos são os exibidos no checkout no momento da compra.",
  ],
];

export function DiagnosticFAQ() {
  return (
    <section className="border-t border-ink/10 bg-white px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="tag-chip bg-lime">Antes de decidir</span>
          <h2 className="mt-5 text-4xl font-black sm:text-5xl">As dúvidas que podem estar passando pela sua cabeça agora.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink/65">
            Sem promessa milagrosa: o Noiva Sem Surto organiza a parte do planejamento que costuma ficar mais confusa — a ordem das decisões.
          </p>
        </div>
        <div className="mt-10 space-y-3">
          {items.map(([question, answer]) => (
            <FAQItem key={question} q={question} a={answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
