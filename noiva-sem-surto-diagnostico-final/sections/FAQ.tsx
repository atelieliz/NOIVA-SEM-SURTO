import { SectionHead } from "@/components/SectionHead";
import { FAQItem } from "@/components/FAQItem";

export function FAQ() {
  const items = [
    ["Preciso me cadastrar?", "Não. O app funciona sem cadastro. Você responde, recebe o resultado e pode salvá-lo fora do navegador."],
    ["É um curso em vídeo?", "Não. É um mini-app interativo que organiza suas respostas e gera uma prioridade com ações."],
    ["Quanto tempo leva para ver resultado?", "Em até 10 minutos você descobre o que fazer primeiro no seu casamento."],
    ["Preciso de experiência?", "Não. O quiz conduz cada etapa com perguntas simples, como uma conversa."],
    ["Funciona no celular?", "Sim. A experiência foi pensada para uso direto pelo celular, pelo navegador."],
    ["E se eu ainda não tiver data ou orçamento?", "Você pode começar mesmo assim. O diagnóstico indica quais definições precisam vir primeiro."],
    ["E se eu já tiver contratado alguns fornecedores?", "Você informa o que já resolveu e o sistema reorganiza apenas o que continua pendente."],
    ["Serve para qualquer tipo de casamento?", "Sim. As tarefas mudam conforme tamanho, formato, local e momento do planejamento."],
  ];
  return (
    <section className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHead eyebrow="Perguntas frequentes" title={<>Ainda com <span className="italic">dúvida</span>?</>} />
        <div className="mt-10 space-y-3">
          {items.map(([q, a]) => (
            <FAQItem key={q} q={q} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
