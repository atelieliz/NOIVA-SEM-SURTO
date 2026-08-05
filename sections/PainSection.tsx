import { CircleHelp, Coins, ListChecks, MapPinned } from "lucide-react";
import { SectionHead } from "@/components/SectionHead";

const pains = [
  { icon: MapPinned, text: "Não sei por onde começar." },
  { icon: ListChecks, text: "Tenho medo de esquecer alguma coisa." },
  { icon: Coins, text: "Não sei se o orçamento vai dar." },
  { icon: CircleHelp, text: "Parece que todo mundo sabe o que fazer, menos eu." },
];

export function PainSection() {
  return (
    <section className="border-y border-ink/10 bg-white/50 px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="O que está acontecendo" title={<>Seu problema não é falta de <span className="italic text-hot">organização</span>.</>} />
        <p className="mt-5 max-w-3xl text-lg text-ink/70">
          Você está tentando lidar com orçamento, convidados, fornecedores, decoração, família, prazos e decisões ao mesmo tempo. Quando tudo parece urgente, nenhuma escolha parece segura.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pains.map(({ icon: Icon, text }, index) => (
            <article key={text} className="soft-card p-5">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl border border-ink/15 ${index % 2 === 0 ? "bg-sun" : "bg-lime"}`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-5 font-display text-xl font-black leading-tight">{text}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 rounded-2xl bg-ink px-5 py-4 text-center font-semibold text-cream">
          O diagnóstico existe para colocar essas decisões na ordem certa.
        </p>
      </div>
    </section>
  );
}
