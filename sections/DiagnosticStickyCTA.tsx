"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { CheckoutLink } from "@/components/CheckoutLink";
import { DiagnosticStartButton } from "@/components/DiagnosticStartButton";
import { DIAGNOSTIC_STORAGE_KEY } from "@/lib/diagnostic";

function readCompleted() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(DIAGNOSTIC_STORAGE_KEY) || "null") as
      | { completed?: boolean }
      | null;
    return Boolean(saved?.completed);
  } catch {
    return false;
  }
}

export function DiagnosticStickyCTA() {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const read = () => setCompleted(readCompleted());
    read();
    window.addEventListener("nss:diagnostic-complete", read);
    window.addEventListener("nss:diagnostic-reset", read);
    return () => {
      window.removeEventListener("nss:diagnostic-complete", read);
      window.removeEventListener("nss:diagnostic-reset", read);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-cream/10 bg-ink/95 p-3 backdrop-blur-md sm:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div className="text-xs text-cream">
          <div className="font-black text-sun">{completed ? "R$ 29,90" : "Rota gratuita"}</div>
          <div className="text-cream/60">{completed ? "Pagamento único" : "3 perguntas rápidas"}</div>
        </div>
        {completed ? (
          <CheckoutLink placement="mobile_sticky" className="nss-primary-btn px-4 py-2.5 text-xs">
            Desbloquear acesso <ArrowRight className="h-3.5 w-3.5" />
          </CheckoutLink>
        ) : (
          <DiagnosticStartButton
            placement="mobile_sticky"
            className="nss-primary-btn px-4 py-2.5 text-xs"
          >
            Descobrir meu passo <ArrowRight className="h-3.5 w-3.5" />
          </DiagnosticStartButton>
        )}
      </div>
    </div>
  );
}
