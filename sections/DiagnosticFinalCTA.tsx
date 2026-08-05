import { ArrowRight, Compass } from "lucide-react";
import { CheckoutLink } from "@/components/CheckoutLink";

export function DiagnosticFinalCTA() {
  return (
    <section className="border-t-2 border-ink bg-hot px-5 py-20 text-cream sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <span className="tag-chip border-cream bg-ink text-cream"><Compass className="h-3.5 w-3.5" /> Continue sua jornada</span>
        <h2 className="mt-6 text-5xl font-black leading-[1.02] sm:text-7xl">Você não precisa organizar tudo hoje.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/80">
          Precisa apenas saber qual decisão vem agora — e ter uma rota clara para a próxima.
        </p>
        <CheckoutLink placement="final_cta" className="nss-primary-btn mt-9 w-full bg-sun text-ink sm:w-auto">
          Acessar minha Bússola Sem Surto <ArrowRight className="h-4 w-4" />
        </CheckoutLink>
        <p className="mt-4 text-sm text-cream/60">Pagamento único de R$ 29,90 · checkout seguro pela Kiwify</p>
      </div>
    </section>
  );
}
