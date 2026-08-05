import { Check } from "lucide-react";

export function Differential() {
  return (
    <section className="px-5 py-20 sm:py-28 bg-sun border-y-2 border-ink">
      <div className="mx-auto max-w-4xl text-center">
        <span className="tag-chip" style={{ background: "var(--color-ink)", color: "var(--color-cream)", borderColor: "var(--color-ink)" }}>
          Diferencial da oferta
        </span>
        <h2 className="mt-5 font-display text-4xl sm:text-6xl font-black leading-[1.05]">
          Outros apps tentam controlar <span className="italic">todo o casamento</span>.
        </h2>
        <p className="mt-6 text-lg text-ink/80 max-w-2xl mx-auto">
          O Noiva Sem Surto faz algo mais simples e mais útil: <b>ele ajuda a noiva a decidir o que fazer agora</b>.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Não depende de cadastro", "Não exige uso diário", "Não cria outra obrigação"].map((t) => (
            <span key={t} className="tag-chip" style={{ background: "var(--color-cream)" }}>
              <Check className="h-3 w-3" /> {t}
            </span>
          ))}
        </div>
        <p className="mt-8 text-ink/70">
          A noiva entra quando estiver perdida, responde ao quiz e sai com direção.
        </p>
      </div>
    </section>
  );
}
