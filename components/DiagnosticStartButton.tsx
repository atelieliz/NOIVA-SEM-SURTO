"use client";

import type { ReactNode, MouseEvent } from "react";
import { trackEvent } from "@/lib/analytics";

function scrollToDiagnostic() {
  const scroll = () => {
    document.getElementById("diagnostico")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  window.requestAnimationFrame(() => {
    scroll();
    window.setTimeout(scroll, 120);
  });
}

export function DiagnosticStartButton({
  children,
  className = "",
  placement,
}: {
  children: ReactNode;
  className?: string;
  placement: string;
}) {
  function handleClick(_event: MouseEvent<HTMLAnchorElement>) {
    trackEvent("StartDiagnosticIntent", { placement });
    window.dispatchEvent(new CustomEvent("nss:start-diagnostic", { detail: { placement } }));
    scrollToDiagnostic();
  }

  return (
    <a href="#diagnostico" className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
