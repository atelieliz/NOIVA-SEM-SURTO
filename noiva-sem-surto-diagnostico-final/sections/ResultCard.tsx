

export function ResultCard() {
  return (
    <section className="px-5 py-20 sm:py-28 bg-hot text-cream border-y-2 border-ink">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <span className="tag-chip" style={{ background: "var(--color-ink)", color: "var(--color-cream)", borderColor: "var(--color-cream)" }}>
            Resultado final da experiência
          </span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl font-black leading-tight">
            Ao concluir o quiz, a noiva recebe um cartão como este:
          </h2>
        </div>
        <div className="brutal-card p-6 sm:p-10" style={{ background: "var(--color-cream)", color: "var(--color-ink)" }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-xl grid place-items-center text-white text-lg" style={{ background: "linear-gradient(145deg,#4b276d,#7543a4)" }}>💍</div>
            <h3 className="font-display text-2xl sm:text-3xl font-black">Meu Plano Sem Surto</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border-2 border-ink" style={{ background: "#faf6fb" }}>
              <span className="text-xs font-bold uppercase tracking-widest text-ink/60">Minha prioridade</span>
              <p className="font-display text-xl font-black mt-1">Definir a lista-base.</p>
            </div>
            <div className="p-4 rounded-xl border-2 border-ink" style={{ background: "#faf6fb" }}>
              <span className="text-xs font-bold uppercase tracking-widest text-ink/60">Meu maior risco</span>
              <p className="font-medium mt-1">Escolher espaço antes de saber quantas pessoas serão convidadas.</p>
            </div>
            <div className="p-4 rounded-xl border-2 border-ink" style={{ background: "#faf6fb" }}>
              <span className="text-xs font-bold uppercase tracking-widest text-ink/60">Minhas três ações</span>
              <ol className="mt-2 space-y-2">
                {["Criar a lista inicial", "Definir convidados essenciais", "Estabelecer o limite máximo"].map((a, i) => (
                  <li key={a} className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-md bg-hot text-cream grid place-items-center font-black text-xs">{i + 1}</span>
                    {a}
                  </li>
                ))}
              </ol>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border-2 border-ink" style={{ background: "#faf6fb" }}>
                <span className="text-xs font-bold uppercase tracking-widest text-ink/60">Pode esperar</span>
                <p className="font-medium mt-1">Decoração e lembrancinhas.</p>
              </div>
              <div className="p-4 rounded-xl border-2 border-ink" style={{ background: "#faf6fb" }}>
                <span className="text-xs font-bold uppercase tracking-widest text-ink/60">Prazo sugerido</span>
                <p className="font-medium mt-1">Concluir em até 72 horas.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border-2 border-ink" style={{ background: "linear-gradient(135deg,#3d195a,#6b389a)", color: "white" }}>
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Próxima decisão depois disso</span>
              <p className="font-medium mt-1">Selecionar espaços compatíveis com a lista e o orçamento.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
