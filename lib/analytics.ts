"use client";

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const TRAFFIC_KEY = "nss_traffic_source";

function getTrafficSource(): AnalyticsParams {
  if (typeof window === "undefined") return {};

  try {
    const saved = window.sessionStorage.getItem(TRAFFIC_KEY);
    if (saved) return JSON.parse(saved) as AnalyticsParams;

    const params = new URLSearchParams(window.location.search);
    const traffic: AnalyticsParams = {
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
      utm_content: params.get("utm_content") || undefined,
      utm_term: params.get("utm_term") || undefined,
      fbclid: params.get("fbclid") || undefined,
      referrer: document.referrer || "direct",
      landing_path: window.location.pathname,
    };

    window.sessionStorage.setItem(TRAFFIC_KEY, JSON.stringify(traffic));
    return traffic;
  } catch {
    return {};
  }
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    ...getTrafficSource(),
    ...params,
  };

  const standardMetaEvents = new Set(["ViewContent", "InitiateCheckout"]);

  if (window.fbq) {
    if (standardMetaEvents.has(name)) {
      window.fbq("track", name, payload);
    } else {
      window.fbq("trackCustom", name, payload);
    }
  }

  if (window.gtag) {
    window.gtag("event", name, payload);
  }

  window.dataLayer?.push({ event: name, ...payload });
}
