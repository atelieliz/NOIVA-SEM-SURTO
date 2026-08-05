

export function Promise() {
  return (
    <section className="px-5 py-20 sm:py-28 bg-sun border-y-2 border-ink">
      <div className="mx-auto max-w-4xl text-center">
        <span className="tag-chip" style={{ background: "var(--color-ink)", color: "var(--color-cream)", borderColor: "var(--color-ink)" }}>
          A promessa
        </span>
        <h2 className="mt-5 font-display text-4xl sm:text-6xl font-black leading-[1.05]">
          Descubra em até <span className="italic">10 minutos</span> o que fazer primeiro no seu casamento.
        </h2>
        <p className="mt-6 text-lg text-ink/80 max-w-2xl mx-auto">
          O app organiza as respostas da noiva e transforma confusão em uma orientação prática.
          Ela entra <b>perdida</b>. Sai com uma <b>decisão</b>.
        </p>
      </div>
    </section>
  );
}
