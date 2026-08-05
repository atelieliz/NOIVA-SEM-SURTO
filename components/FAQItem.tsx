"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="brutal-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-display font-black text-lg">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 -mt-1 text-ink/75 border-t-2 border-ink pt-4">{a}</div>
      )}
    </div>
  );
}
