// Weibull PDF: f(t) = (k/λ)(t/λ)^(k−1) · exp(−(t/λ)^k)
// Weibull CDF: F(t) = 1 − exp(−(t/λ)^k)
// k = shape, λ = scale

export function weibullPDF(t: number, k: number, lambda: number): number {
  if (t < 0 || k <= 0 || lambda <= 0) return 0;
  if (t === 0) return k === 1 ? k / lambda : 0;
  const ratio = t / lambda;
  return (k / lambda) * Math.pow(ratio, k - 1) * Math.exp(-Math.pow(ratio, k));
}

export function weibullCDF(t: number, k: number, lambda: number): number {
  if (t < 0 || k <= 0 || lambda <= 0) return 0;
  return 1 - Math.exp(-Math.pow(t / lambda, k));
}
