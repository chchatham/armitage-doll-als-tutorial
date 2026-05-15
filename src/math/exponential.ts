// Continuous exponential accumulation: A(t) = 1 − exp(−rate · t)
// Models cumulative damage as a continuous process rather than discrete stages.
export function exponentialAccumulation(t: number, rate: number): number {
  if (t < 0 || rate <= 0) return 0;
  return 1 - Math.exp(-rate * t);
}
