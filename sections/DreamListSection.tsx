import { Download, Heart, ListFilter, Users } from "lucide-react";

const categories = [
  ["Essencial", "Pessoas que fazem parte da história e não podem faltar.", "bg-hot text-cream"],
  ["Gostaria muito", "Convidados importantes que vocês desejam incluir.", "bg-sun"],
  ["Talvez", "Nomes que dependem de espaço, orçamento ou contexto.", "bg-lime"],
  ["Opcional", "Convites que só entram se a realidade permitir.", "bg-white"],
];

export function DreamListSection() {
  return (
    <section className="border-y border-ink/10 bg-coral px-5 py-20 text-cream sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="tag-chip border-cream bg-ink text-cream"><Heart className="h-3.5 w-3.5" fill="currentColor" /> Lista dos Sonhos</span>
          <h2 className="mt-5 text-4xl font-black sm:text-6xl">A primeira lista não é para cortar.</h2>
          <div className="mt-6 space-y-3 text-lg text-cream/80">
            <p>Você e seu noivo ou noiva colocam todos os nomes que imaginam vivendo esse momento com vocês.</p>
            <p><b>Sem discussão. Sem conta. Sem pressão.</b></p>
            <p>Depois, o aplicativo organiza essa primeira versão, exporta em PDF e conduz a Lista de Cortes com critérios claros.</p>
          </div>
          <p className="mt-7 rounded-2xl border border-cream/25 bg-ink/25 px-5 py-4 font-semibold">
            Primeiro vocês colocam o sonho no papel. Depois ajustam à realidade.
          </p>
        </div>

        <div className="rounded-[2rem] border-2 border-ink bg-cream p-5 text-ink shadow-[8px_8px_0_var(--color-ink)] sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.17em] text-hot">Lista dos Sonhos</p>
              <h3 className="mt-1 text-2xl font-black">Quem vocês imaginam nesse dia?</h3>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sun"><Users className="h-5 w-5" /></span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {categories.map(([title, description, className]) => (
              <article key={title} className={`rounded-2xl border border-ink/15 p-4 ${className}`}>
                <p className="font-display text-lg font-black">{title}</p>
                <p className="mt-1 text-xs leading-relaxed opacity-75">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-semibold shadow-sm">
              <Download className="h-5 w-5 text-hot" /> Exportar primeira lista em PDF
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-semibold shadow-sm">
              <ListFilter className="h-5 w-5 text-hot" /> Conduzir cortes por prioridade
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
