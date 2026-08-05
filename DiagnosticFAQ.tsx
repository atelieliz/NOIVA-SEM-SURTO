import { FAQItem } from "@/components/FAQItem";

const items = [
  [
    "O diagnóstico é gratuito?",
    "Sim. As três perguntas e a Rota Sem Surto inicial são gratuitas. A compra é opcional e libera a jornada completa dentro do Noiva Sem Surto.",
  ],
  [
    "Preciso instalar algum aplicativo?",
    "Não. O acesso é feito pelo navegador do celular ou do computador, conforme as orientações enviadas após a compra.",
  ],
  [
    "O Noiva Sem Surto substitui uma assessoria presencial?",
    "Não. Ele funciona como uma assessora digital para organizar prioridades, decisões e informações. A execução presencial do evento continua dependendo dos profissionais contratados.",
  ],
  [
    "Os meus dados ficam salvos?",
    "O progresso desta landing fica salvo no navegador utilizado. Limpar os dados do navegador ou trocar de aparelho pode remover esse progresso.",
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
          <span className="tag-chip bg-lime">Antes de continuar</span>
          <h2 className="mt-5 text-4xl font-black sm:text-5xl">Tudo explicado com transparência.</h2>
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
