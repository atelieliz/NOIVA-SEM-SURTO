import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-5 py-10 pb-24 sm:pb-10 bg-ink text-cream/70 text-sm border-t-2 border-ink">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-hot" fill="currentColor" />
          <span className="font-display font-black text-cream">Noiva Sem Surto</span>
        </div>
        <div>© {new Date().getFullYear()} · Todos os direitos reservados</div>
      </div>
    </footer>
  );
}
