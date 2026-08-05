"use client";

import type { ReactNode } from "react";
import { CHECKOUT_URL } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export function CheckoutLink({
  children,
  className = "",
  placement,
}: {
  children: ReactNode;
  className?: string;
  placement: string;
}) {
  return (
    <a
      href={CHECKOUT_URL}
      className={className}
      onClick={() =>
        trackEvent("InitiateCheckout", {
          placement,
          value: 29.9,
          currency: "BRL",
          content_name: "Noiva Sem Surto",
        })
      }
    >
      {children}
    </a>
  );
}
