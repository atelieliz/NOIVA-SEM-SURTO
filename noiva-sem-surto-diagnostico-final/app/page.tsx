import { AfterDiagnostic } from "@/components/AfterDiagnostic";
import { CompassSection } from "@/sections/CompassSection";
import { DiagnosticFAQ } from "@/sections/DiagnosticFAQ";
import { DiagnosticFinalCTA } from "@/sections/DiagnosticFinalCTA";
import { DiagnosticHero } from "@/sections/DiagnosticHero";
import { DiagnosticSection } from "@/sections/DiagnosticSection";
import { DiagnosticStickyCTA } from "@/sections/DiagnosticStickyCTA";
import { DiagnosticTopBar } from "@/sections/DiagnosticTopBar";
import { DreamListSection } from "@/sections/DreamListSection";
import { Footer } from "@/sections/Footer";
import { OfferSection } from "@/sections/OfferSection";
import { PainSection } from "@/sections/PainSection";
import { ProductBridge } from "@/sections/ProductBridge";
import { TrustSection } from "@/sections/TrustSection";
import { UnlocksSection } from "@/sections/UnlocksSection";
import { VideoSection } from "@/sections/VideoSection";

export default function Page() {
  return (
    <main id="inicio" className="min-h-screen overflow-x-hidden bg-cream text-ink">
      <DiagnosticTopBar />
      <DiagnosticHero />
      <PainSection />
      <VideoSection />
      <DiagnosticSection />

      <AfterDiagnostic>
        <ProductBridge />
        <CompassSection />
        <UnlocksSection />
        <DreamListSection />
        <OfferSection />
        <TrustSection />
        <DiagnosticFAQ />
        <DiagnosticFinalCTA />
      </AfterDiagnostic>

      <Footer />
      <DiagnosticStickyCTA />
    </main>
  );
}
