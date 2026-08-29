import { ArrowRight, Check, CreditCard, LockKeyhole, Mail, Smartphone } from "lucide-react";
import { OfferObserver } from "@/components/OfferObserver";

const CHECKOUT_URL = "https://pay.kiwify.com.br/AUehsBX";

const included = [
  "Bússola Sem Surto para mostrar sua próxima prioridade",
  "Jornada por fase para organizar o que vem depois",
  "Orçamento e decisões financeiras reunidos",
  "Lista de convidados estruturada por pessoas e grupos",
  "Organização de fornecedores, cerimônia e recepção",
  "Modo últimos 30 dias e SOS Noiva para momentos urgentes",
];

export function OfferSection() {
  return (
    <section id="oferta" className="scroll-mt-5 px-5 py-20 sm:py-28">
      <OfferObserver />
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="tag-chip bg-sun">Continue sua Rota Sem Surto</span>
          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-[1.04] sm:text-6xl">
            Tenha um lugar para voltar sempre que bater a dúvida: “e agora, o que eu faço?”
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-ink/70">
            O diagnóstico te mostra a primeira prioridade. O Noiva Sem Surto transforma essa clareza em uma rota completa para você continuar sem se perder nas próximas decisões.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-[9px_9px_0_var(--color-ink)] lg:grid-cols-[1.08fr_.92fr]">
          <div className="p-6 sm:p-9">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-hot">Você desbloqueia</p>
            <h3 className="mt-2 text-3xl font-black">Clareza para decidir. Estrutura para continuar.</h3>
            <p className="mt-4 text-ink/65">
              Tudo pensado para reduzir a sensação de “tem coisa demais” e devolver uma ordem prática ao planejamento.
            </p>

            <div className="mt-7 space-y-3">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-3 text-ink/75">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border-2 border-ink bg-sun p-5 shadow-[4px_4px_0_var(--color-ink)]">
              <p className="font-display text-xl font-black sm:text-2xl">
                Por R$ 14,99 você não está comprando outra lista de casamento. Está comprando clareza para continuar quando o planejamento travar.
              </p>
            </div>
          </div>

          <div className="bg-ink p-6 text-cream sm:p-9">
            <p className="text-sm font-black uppercase tracking-[0.15em] text-sun">Acesso completo</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-display text-6xl font-black leading-none">R$ 14,99</span>
            </div>
            <p className="mt-3 text-sm text-cream/65">Pagamento único. Sem mensalidade.</p>

            <div className="mt-7 rounded-3xl border border-cream/15 bg-white/5 p-5">
              <p className="text-sm font-black uppercase tracking-[0.13em] text-sun">Se hoje parece tudo misturado...</p>
              <p className="mt-2 text-lg font-semibold leading-relaxed text-cream/85">
                você não precisa dar conta de tudo hoje. Precisa de direção suficiente para resolver uma decisão de cada vez.
              </p>
            </div>

            <a
              id="checkout-principal"
              href={CHECKOUT_URL}
              data-checkout-link="true"
              data-placement="offer_main"
              className="nss-primary-btn relative z-10 mt-7 w-full cursor-pointer"
              aria-label="Ir para o checkout seguro da Kiwify"
            >
              Quero meu planejamento sem surto <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-3 text-center text-xs text-cream/55">
              Você será direcionada para o checkout seguro da Kiwify.
            </p>

            <div className="mt-6 grid gap-3 border-t border-cream/10 pt-6 text-sm text-cream/70">
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-sun" /> Pagamento processado pela Kiwify
              </span>
              <span className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-sun" /> Condições e garantia exibidas no checkout
              </span>
              <span className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-sun" /> Acesso pelo celular ou computador
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sun" /> Orientações de acesso enviadas após a compra
              </span>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-ink/50">
          O progresso do diagnóstico fica salvo neste navegador. A forma de acesso, a garantia e as condições finais são as apresentadas no checkout da Kiwify.
        </p>
      </div>
    </section>
  );
}
