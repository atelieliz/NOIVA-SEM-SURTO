import { ArrowRight, Check, CreditCard, LockKeyhole, Mail, Smartphone } from "lucide-react";
import { OfferObserver } from "@/components/OfferObserver";

export function OfferSection() {
  return (
    <section id="oferta" className="scroll-mt-5 px-5 py-20 sm:py-28">
      <OfferObserver />
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="tag-chip bg-sun">Continue sua Rota Sem Surto</span>
          <h2 className="mt-5 text-4xl font-black sm:text-6xl">Desbloqueie seu planejamento completo.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/70">
            Seu diagnóstico mostrou o que vem primeiro. Agora use o Noiva Sem Surto para transformar essa prioridade em uma jornada organizada até a celebração.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-[9px_9px_0_var(--color-ink)] lg:grid-cols-[1.05fr_.95fr]">
          <div className="p-6 sm:p-9">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-hot">Noiva Sem Surto</p>
            <h3 className="mt-2 text-3xl font-black">Clareza para decidir. Estrutura para continuar.</h3>
            <p className="mt-4 text-ink/65">
              Acesso à Bússola Sem Surto, jornada por fase, orçamento, listas, fornecedores, cerimônia, recepção e modo últimos 30 dias.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Diagnóstico transformado em uma rota prática",
                "Uma prioridade importante por vez",
                "Planejamento reunido em um só lugar",
                "Uso pelo navegador do celular",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-ink/75">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ink p-6 text-cream sm:p-9">
            <p className="text-sm font-semibold text-cream/50">
              De <span className="line-through">R$ 67,00</span>
            </p>
            <p className="mt-1 text-sm font-black uppercase tracking-[0.15em] text-sun">Acesso completo</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-display text-6xl font-black leading-none">R$ 29,90</span>
            </div>
            <p className="mt-3 text-sm text-cream/65">Pagamento único. Sem mensalidade.</p>
            <form
  action="https://pay.kiwify.com.br/AUehsBX"
  method="get"
  className="mt-7"
>
  <button
    type="submit"
    className="nss-primary-btn w-full"
  >
    Desbloquear meu planejamento
    <ArrowRight className="h-4 w-4" />
  </button>
</form>
            <p className="mt-3 text-center text-xs text-cream/50">
              Continue exatamente de onde seu diagnóstico terminou.
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
