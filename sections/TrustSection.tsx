import { Eye, HeartHandshake, LockKeyhole, Smartphone } from "lucide-react";
import { SectionHead } from "@/components/SectionHead";

const trustItems = [
  [Eye, "Demonstração real", "A página mostra como a lógica e as telas do produto funcionam."],
  [HeartHandshake, "Dúvidas reais", "A estrutura nasceu de perguntas recorrentes sobre orçamento, lista, fornecedores e cronograma."],
  [Smartphone, "Acesso imediato", "Após a confirmação do pagamento, o acesso segue o fluxo informado pela Kiwify."],
  [LockKeyhole, "Condições transparentes", "Garantia, pagamento e dados são apresentados sem contadores ou promessas inventadas."],
];

export function TrustSection() {
  return (
    <section className="border-y border-ink/10 bg-sun px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="Prova e confiança" title={<>Criado a partir das dúvidas reais de <span className="italic">noivas</span>.</>} />
        <p className="mt-5 max-w-3xl text-lg text-ink/70">
          O Noiva Sem Surto nasceu de perguntas recorrentes sobre orçamento, lista, fornecedores, cronograma e medo de esquecer etapas importantes.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(([Icon, title, description]) => {
            const TrustIcon = Icon as typeof Eye;
            return (
              <article key={title as string} className="soft-card bg-cream p-5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime"><TrustIcon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-display text-xl font-black">{title as string}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{description as string}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-ink/15 bg-cream/80 px-5 py-4 text-sm text-ink/70">
          <b>Depoimentos:</b> o espaço poderá ser adicionado quando existirem avaliações reais e autorizadas. Nenhum relato fictício foi incluído nesta versão.
        </div>
      </div>
    </section>
  );
}
