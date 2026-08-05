"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

export function OfferObserver() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trackEvent("ViewContent", {
          content_name: "Oferta Noiva Sem Surto",
          content_type: "product",
          value: 29.9,
          currency: "BRL",
        });
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} aria-hidden="true" />;
}
