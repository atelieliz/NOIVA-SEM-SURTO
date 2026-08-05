import { LockKeyhole } from "lucide-react";

export function Guarantee() {
  return (
    <section className="px-5 py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-[1.75rem] border-2 border-ink bg-lime p-7 text-center shadow-[6px_6px_0_var(--color-ink)] sm:flex-row sm:text-left">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-ink text-cream">
          <LockKeyhole className="h-8 w-8" />
        </span>
        <div>
          <h3 className="font-display text-3xl font-black">Condições reais, sem promessa inventada.</h3>
          <p className="mt-2 text-ink/75">
            A garantia válida é exatamente a informada no checkout da Kiwify no momento da compra.
          </p>
        </div>
      </div>
    </section>
  );
}
