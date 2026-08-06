export const TRACKING_KEYS = Object.freeze([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
]);

export function mergeTrackingParams(currentSearch = "", savedSearch = "") {
  const current = new URLSearchParams(currentSearch);
  const saved = new URLSearchParams(savedSearch);

  TRACKING_KEYS.forEach((key) => {
    const value = current.get(key);
    if (value) saved.set(key, value);
  });

  return saved.toString();
}

export function appendTrackingParams(baseUrl, trackingSearch = "") {
  const url = new URL(baseUrl);
  const tracking = new URLSearchParams(trackingSearch);

  TRACKING_KEYS.forEach((key) => {
    const value = tracking.get(key);
    if (value) url.searchParams.set(key, value);
  });

  return url.toString();
}
