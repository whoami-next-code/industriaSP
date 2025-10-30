export function isValidPrice(value: any): boolean {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0.01;
}

