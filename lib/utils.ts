export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

function normalizeClassValue(value: ClassValue): string[] {
  if (!value) return [];

  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap(normalizeClassValue);
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([className]) => className);
  }

  return [];
}

export function cn(...inputs: ClassValue[]): string {
  return inputs.flatMap(normalizeClassValue).join(" ");
}
