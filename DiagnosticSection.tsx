import { DiagnosticExperience } from "@/components/DiagnosticExperience";

export function DiagnosticSection() {
  return (
    <section id="diagnostico" className="scroll-mt-4 px-5 pb-20 pt-5 sm:pb-28 sm:pt-8">
      <div className="mx-auto max-w-5xl">
        <DiagnosticExperience />
      </div>
    </section>
  );
}
