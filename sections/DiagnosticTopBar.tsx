import { Clock3, Heart, Sparkles } from "lucide-react";

export function DiagnosticTopBar() {
  return (
    <div className="w-full border-b border-ink/10 bg-ink px-4 py-2.5 text-center text-xs font-semibold text-cream sm:text-sm">
      <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-sun" /> Diagnóstico gratuito</span>
        <span className="hidden h-1 w-1 rounded-full bg-cream/30 sm:block" />
        <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-sun" /> Cerca de 2 minutos</span>
        <span className="hidden h-1 w-1 rounded-full bg-cream/30 sm:block" />
        <span className="inline-flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-sun" /> Sem pressão</span>
      </span>
    </div>
  );
}
