import { Heart } from "lucide-react";

export function Marquee() {
  const items = [
    "SEM CADASTRO",
    "SEM SURTO",
    "SEM PLANILHA GIGANTE",
    "SEM APP PESADO",
    "SEM DECISÃO PERDIDA",
  ];
  return (
    <div className="border-y-2 border-ink bg-hot text-cream py-4 overflow-hidden">
      <div className="marquee-track">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="font-display text-2xl sm:text-3xl font-black whitespace-nowrap flex items-center gap-12">
            {t} <Heart className="h-5 w-5 shrink-0" fill="currentColor" />
          </span>
        ))}
      </div>
    </div>
  );
}
