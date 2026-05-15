// I(t) = c · t^(k−1), Armitage & Doll 1954
export function incidence(t: number, k: number, c: number = 1): number {
  if (t < 0) return 0;
  if (k < 1) return 0;
  return c * Math.pow(t, k - 1);
}

export function logLogSlope(k: number): number {
  return k - 1;
}

export function logLogIntercept(c: number): number {
  return Math.log(c);
}
