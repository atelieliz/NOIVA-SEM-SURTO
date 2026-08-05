import { ArrowRight, Check, CreditCard, LockKeyhole, Smartphone } from "lucide-react";
import { CheckoutLink } from "@/components/CheckoutLink";
import { OfferObserver } from "@/components/OfferObserver";

export function OfferSection() {
  return (
    <section id="oferta" className="scroll-mt-8 px-5 py-20 sm:py-28">
      <OfferObserver />
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="tag-chip bg-sun">Oferta de lançamento</span>
          <h2 className="mt-5 text-4xl font-black sm:text-6xl">Desbloqueie sua jornada completa.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/70">
            Continue exatamente de onde seu diagnóstico terminou, com uma próxima decisão clara e uma rota organizada até o casamento.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-[9px_9px_0_var(--color-ink)] lg:grid-cols-[1fr_.85fr]">
          <div className="p-6 sm:p-9">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-hot">Noiva Sem Surto</p>
            <h3 className="mt-2 font-display text-3xl font-black">Uma assessora digital para organizar a próxima decisão.</h3>
            <div className="mt-6 space-y-3">
              {["Diagnóstico transformado em plano", "Bússola Sem Surto personalizada", "Jornada, orçamento, listas e fornecedores", "Modo últimos 30 dias e SOS Noiva"].map((item) => (
                <div key={item} className="flex items-start gap-3 text-ink/75">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime"><Check className="h-3.5 w-3.5" /></span>
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ink p-6 text-cream sm:p-9">
            <p className="text-sm font-semibold text-cream/50">De <span className="line-through">R$ 67,00</span></p>
            <p className="mt-1 text-sm font-black uppercase tracking-[0.15em] text-sun">Preço de lançamento</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-display text-6xl font-black leading-none">R$ 29,90</span>
            </div>
            <p className="mt-3 text-sm text-cream/60">Pagamento único. Sem mensalidade.</p>

            <CheckoutLink placement="offer_main" className="nss-primary-btn mt-7 w-full bg-hot text-cream">
              Desbloquear meu planejamento <ArrowRight className="h-4 w-4" />
            </CheckoutLink>

            <div className="mt-6 grid gap-3 text-sm text-cream/70">
              <span className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-sun" /> Pagamento processado pela Kiwify</span>
              <span className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-sun" /> Uso pelo celular, sem mensalidade</span>
              <span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-sun" /> Garantia conforme as condições exibidas no checkout</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink/50">
          O progresso deste diagnóstico fica salvo neste navegador. Os recursos e condições finais são os exibidos no produto e no checkout.
        </p>
      </div>
    </section>
  );
}
