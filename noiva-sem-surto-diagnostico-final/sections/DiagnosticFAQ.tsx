import { FAQItem } from "@/components/FAQItem";
import { SectionHead } from "@/components/SectionHead";

const items = [
  ["O diagnóstico é gratuito?", "Sim. As 8 perguntas e o resultado inicial desta página são gratuitos."],
  ["O que acontece depois do resultado?", "Você recebe uma leitura do seu momento, do maior risco, das próximas decisões e do que pode esperar. Depois, conhece o Noiva Sem Surto como continuação opcional."],
  ["Preciso instalar algum aplicativo?", "Não nesta versão web. O acesso acontece pelo navegador. Caso a forma de acesso do produto mude, essa informação deve ser atualizada aqui e no checkout."],
  ["Funciona no celular?", "Sim. A landing, o questionário e os botões foram priorizados para telas de celular."],
  ["O aplicativo substitui uma assessoria presencial?", "Não. Ele organiza decisões, prioridades e informações. Uma assessoria presencial pode ser necessária para execução, negociação e acompanhamento do evento."],
  ["Consigo atualizar minhas respostas?", "Sim. Você pode voltar durante o preenchimento ou usar o botão para refazer o diagnóstico depois do resultado."],
  ["Como funciona a Lista dos Sonhos?", "O casal começa incluindo todos os nomes desejados. Depois, organiza as pessoas por prioridade e ajusta a lista à realidade do orçamento e do espaço."],
  ["Os dados ficam salvos?", "O progresso deste diagnóstico é salvo no navegador utilizado. Limpar os dados do navegador ou trocar de aparelho pode remover esse progresso."],
  ["Recebo acesso imediatamente?", "O acesso segue o processo exibido pela Kiwify após a confirmação do pagamento."],
  ["Existe garantia?", "Valem as condições reais apresentadas no checkout da Kiwify no momento da compra. Esta página não cria prazo ou regra diferente do checkout."],
];

export function DiagnosticFAQ() {
  return (
    <section className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHead eyebrow="Perguntas frequentes" title={<>Tudo explicado com <span className="italic text-hot">transparência</span>.</>} />
        <div className="mt-10 space-y-3">
          {items.map(([question, answer]) => (
            <FAQItem key={question} q={question} a={answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
