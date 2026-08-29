import { ArrowRight, BadgeCheck, CircleHelp, LockKeyhole, Smartphone } from "lucide-react";

const CHECKOUT_URL = "https://pay.kiwify.com.br/AUehsBX";

const reassurance = [
  {
    icon: BadgeCheck,
    title: "Pagamento único",
    text: "Você paga R$ 14,99 uma vez. Não existe mensalidade.",
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
            <CircleHelp className="h-3.5 w-3.5" /> Sua próxima decisão pode ser simples
          </span>
          <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-[1.04] sm:text-6xl">
            Você não precisa saber tudo agora. Só precisa parar de voltar para o zero toda vez que surgir uma nova dúvida.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-cream/80">
            O Noiva Sem Surto foi criado para ser esse ponto de retorno: abrir, entender o que faz sentido agora e continuar uma decisão de cada vez.
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
          <p className="text-sm font-black uppercase tracking-[0.16em] text-sun">Noiva Sem Surto completo</p>
          <p className="mt-2 font-display text-5xl font-black">R$ 14,99</p>
          <p className="mt-2 text-sm text-cream/65">Pagamento único · sem mensalidade</p>

          <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-cream/10 bg-white/5 p-4">
            <p className="font-semibold text-cream/85">
              Se esse planejamento já ocupou espaço demais na sua cabeça, talvez o próximo passo seja justamente ter um lugar que organize a ordem por você.
            </p>
          </div>

          <a
            href={CHECKOUT_URL}
            data-checkout-link="true"
            data-placement="final_cta"
            className="nss-primary-btn relative z-10 mt-7 w-full cursor-pointer bg-sun text-ink sm:w-auto"
            aria-label="Continuar para o checkout seguro da Kiwify"
          >
            Quero minha Rota Sem Surto <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-4 text-xs text-cream/55">
            Ao tocar no botão, você será direcionada diretamente para o checkout da Kiwify.
          </p>
        </div>
      </div>
    </section>
  );
}
