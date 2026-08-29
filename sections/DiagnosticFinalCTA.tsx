import { ArrowRight, BadgeCheck, CircleHelp, LockKeyhole, Smartphone } from "lucide-react";

const CHECKOUT_URL = "https://pay.kiwify.com.br/AUehsBX";

const reassurance = [
  {
    icon: BadgeCheck,
    title: "Pagamento único",
    text: "Você paga R$ 29,90 uma vez. Não existe mensalidade.",
  },
  {
    icon: Smartphone,
    title: "Acesso simples",
    text: "Use pelo navegador do celular ou computador, sem precisar instalar nada.",
  },
  {
    icon: LockKeyhole,
    title: "Checkout seguro",
    text: "O pagamento e as condições finais são apresentados pela Kiwify.",
  },
];

export function DiagnosticFinalCTA() {
  return (
    <section className="border-t-2 border-ink bg-hot px-5 py-20 text-cream sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="tag-chip border-cream bg-ink text-cream">
            <CircleHelp className="h-3.5 w-3.5" /> Ainda ficou alguma dúvida?
          </span>
          <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-[1.04] sm:text-6xl">
            Você não precisa voltar a organizar tudo sozinha.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/80">
            O diagnóstico mostrou o que vem primeiro. O Noiva Sem Surto transforma essa clareza em uma rota prática para você continuar sem se perder entre decisões, orçamento e fornecedores.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-3 md:grid-cols-3">
          {reassurance.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl border border-cream/20 bg-ink/25 p-5 text-left">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-sun text-ink">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">{text}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] border-2 border-cream bg-ink p-6 text-center shadow-[7px_7px_0_var(--color-sun)] sm:p-9">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-sun">Sua jornada completa</p>
          <p className="mt-2 font-display text-4xl font-black">R$ 29,90</p>
          <p className="mt-2 text-sm text-cream/65">Pagamento único · acesso imediato após a confirmação</p>
          <a
            href={CHECKOUT_URL}
            data-checkout-link="true"
            data-placement="final_cta"
            className="nss-primary-btn relative z-10 mt-7 w-full cursor-pointer bg-sun text-ink sm:w-auto"
            aria-label="Continuar para o checkout seguro da Kiwify"
          >
            Quero continuar minha Rota Sem Surto <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-4 text-xs text-cream/55">
            Ao tocar no botão, você será direcionada diretamente para o checkout da Kiwify.
          </p>
          <a
            href={CHECKOUT_URL}
            data-checkout-link="true"
            data-placement="final_text_link"
            className="mt-4 inline-block text-sm font-bold text-sun underline decoration-2 underline-offset-4"
          >
            Prefiro abrir o checkout por este link
          </a>
        </div>
      </div>
    </section>
  );
}
