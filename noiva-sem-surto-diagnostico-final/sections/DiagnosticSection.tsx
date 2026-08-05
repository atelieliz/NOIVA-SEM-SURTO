import { DiagnosticExperience } from "@/components/DiagnosticExperience";

export function DiagnosticSection() {
  return (
    <section id="diagnostico" className="scroll-mt-6 border-y border-ink/10 bg-[linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,247,236,.95))] px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <DiagnosticExperience />
      </div>
    </section>
  );
}
