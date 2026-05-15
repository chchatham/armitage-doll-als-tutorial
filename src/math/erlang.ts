// Erlang PDF: f(t) = μ^k · t^(k−1) · exp(−μt) / (k−1)!
// Erlang CDF: F(t) = 1 − Σ_{n=0}^{k−1} (μt)^n · exp(−μt) / n!
// k = shape (positive integer), μ = rate

function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export function erlangPDF(t: number, k: number, mu: number): number {
  if (t < 0 || k < 1 || mu <= 0) return 0;
  k = Math.round(k);
  if (t === 0) return k === 1 ? mu : 0;
  return (Math.pow(mu, k) * Math.pow(t, k - 1) * Math.exp(-mu * t)) / factorial(k - 1);
}

export function erlangCDF(t: number, k: number, mu: number): number {
  if (t < 0 || k < 1 || mu <= 0) return 0;
  k = Math.round(k);
  let sum = 0;
  for (let n = 0; n < k; n++) {
    sum += Math.pow(mu * t, n) * Math.exp(-mu * t) / factorial(n);
  }
  return 1 - sum;
}
