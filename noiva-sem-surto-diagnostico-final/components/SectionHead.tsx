import type { ReactNode } from "react";
import { Check } from "lucide-react";

export function SectionHead({
  eyebrow,
  title,
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <span className="tag-chip" style={dark ? { background: "var(--color-ink)", color: "var(--color-cream)", borderColor: "var(--color-ink)" } : undefined}>
        <Check className="h-3 w-3" /> {eyebrow}
      </span>
      <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05]">
        {title}
      </h2>
    </div>
  );
}
