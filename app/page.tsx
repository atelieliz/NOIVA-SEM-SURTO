import { AfterDiagnostic } from "@/components/AfterDiagnostic";
import { DiagnosticFAQ } from "@/sections/DiagnosticFAQ";
import { DiagnosticHero } from "@/sections/DiagnosticHero";
import { DiagnosticSection } from "@/sections/DiagnosticSection";
import { Footer } from "@/sections/Footer";
import { OfferSection } from "@/sections/OfferSection";
import { ProductBridge } from "@/sections/ProductBridge";

export default function Page() {
  return (
    <main id="inicio" className="min-h-screen overflow-x-hidden bg-cream text-ink">
      <DiagnosticHero />
      <DiagnosticSection />

      <AfterDiagnostic>
        <ProductBridge />
        <OfferSection />
        <DiagnosticFAQ />
      </AfterDiagnostic>

      <Footer />
    </main>
  );
}
