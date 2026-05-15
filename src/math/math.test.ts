import { describe, it, expect } from 'vitest';
import { incidence, logLogSlope } from './power-law';
import { weibullPDF, weibullCDF } from './weibull';
import { erlangPDF, erlangCDF } from './erlang';
import { exponentialAccumulation } from './exponential';
import { fitPowerLaw, fitExponential } from './fitting';

describe('power-law', () => {
  it('I(t) = c * t^(k-1) for basic values', () => {
    // k=6 (6-step model), t=50, c=1 → 50^5 = 312500000
    expect(incidence(50, 6, 1)).toBeCloseTo(312_500_000, -1);
  });

  it('k=1 gives constant incidence c', () => {
    expect(incidence(10, 1, 5)).toBeCloseTo(5, 5);
    expect(incidence(100, 1, 5)).toBeCloseTo(5, 5);
  });

  it('returns 0 for t < 0', () => {
    expect(incidence(-1, 6)).toBe(0);
  });

  it('returns 0 for k < 1', () => {
    expect(incidence(50, 0)).toBe(0);
  });

  it('t=0 returns 0 for k > 1', () => {
    expect(incidence(0, 6)).toBe(0);
  });

  it('t=0 returns c for k=1', () => {
    expect(incidence(0, 1, 3)).toBeCloseTo(3, 5);
  });

  it('logLogSlope returns k - 1', () => {
    expect(logLogSlope(6)).toBe(5);
    expect(logLogSlope(1)).toBe(0);
    expect(logLogSlope(3)).toBe(2);
  });
});

describe('weibull', () => {
  it('CDF at t=0 is 0', () => {
    expect(weibullCDF(0, 2, 1)).toBe(0);
  });

  it('CDF approaches 1 for large t', () => {
    expect(weibullCDF(100, 2, 1)).toBeCloseTo(1, 5);
  });

  it('CDF with k=1 is exponential: 1 - exp(-t/λ)', () => {
    const lambda = 5;
    const t = 3;
    expect(weibullCDF(t, 1, lambda)).toBeCloseTo(1 - Math.exp(-t / lambda), 10);
  });

  it('PDF integrates to CDF (trapezoidal check)', () => {
    const k = 3, lambda = 10;
    const dt = 0.01;
    let integral = 0;
    for (let t = 0; t < 50; t += dt) {
      integral += weibullPDF(t + dt / 2, k, lambda) * dt;
    }
    expect(integral).toBeCloseTo(weibullCDF(50, k, lambda), 2);
  });

  // Hand-calculated: k=2, λ=1, t=1 → f(1) = 2·1·exp(-1) ≈ 0.73576
  it('PDF matches hand calculation (k=2, λ=1, t=1)', () => {
    expect(weibullPDF(1, 2, 1)).toBeCloseTo(2 * Math.exp(-1), 10);
  });

  it('returns 0 for negative t', () => {
    expect(weibullPDF(-1, 2, 1)).toBe(0);
    expect(weibullCDF(-1, 2, 1)).toBe(0);
  });

  it('returns 0 for invalid parameters', () => {
    expect(weibullPDF(1, 0, 1)).toBe(0);
    expect(weibullPDF(1, 2, 0)).toBe(0);
    expect(weibullPDF(1, -1, 1)).toBe(0);
  });
});

describe('erlang', () => {
  it('k=1 is exponential distribution', () => {
    const mu = 0.5;
    const t = 3;
    // Erlang(k=1, μ) PDF = μ·exp(-μt)
    expect(erlangPDF(t, 1, mu)).toBeCloseTo(mu * Math.exp(-mu * t), 10);
    // CDF = 1 - exp(-μt)
    expect(erlangCDF(t, 1, mu)).toBeCloseTo(1 - Math.exp(-mu * t), 10);
  });

  it('CDF at t=0 is 0', () => {
    expect(erlangCDF(0, 3, 1)).toBe(0);
  });

  it('CDF approaches 1 for large t', () => {
    expect(erlangCDF(100, 3, 1)).toBeCloseTo(1, 5);
  });

  // Hand-calculated: k=2, μ=1, t=2 → f(2) = 1^2 · 2^1 · exp(-2) / 1! = 2·exp(-2) ≈ 0.27067
  it('PDF matches hand calculation (k=2, μ=1, t=2)', () => {
    expect(erlangPDF(2, 2, 1)).toBeCloseTo(2 * Math.exp(-2), 10);
  });

  // Hand-calculated: k=3, μ=1, t=1 → f(1) = 1^3 · 1^2 · exp(-1) / 2! = exp(-1)/2 ≈ 0.18394
  it('PDF matches hand calculation (k=3, μ=1, t=1)', () => {
    expect(erlangPDF(1, 3, 1)).toBeCloseTo(Math.exp(-1) / 2, 10);
  });

  it('PDF integrates to CDF (trapezoidal check)', () => {
    const k = 4, mu = 0.5;
    const dt = 0.01;
    let integral = 0;
    for (let t = 0; t < 40; t += dt) {
      integral += erlangPDF(t + dt / 2, k, mu) * dt;
    }
    expect(integral).toBeCloseTo(erlangCDF(40, k, mu), 2);
  });

  it('returns 0 for negative t', () => {
    expect(erlangPDF(-1, 3, 1)).toBe(0);
    expect(erlangCDF(-1, 3, 1)).toBe(0);
  });

  it('returns 0 for invalid k or mu', () => {
    expect(erlangPDF(1, 0, 1)).toBe(0);
    expect(erlangPDF(1, 3, 0)).toBe(0);
  });
});

describe('exponentialAccumulation', () => {
  it('A(0) = 0', () => {
    expect(exponentialAccumulation(0, 1)).toBeCloseTo(0, 10);
  });

  it('approaches 1 for large t', () => {
    expect(exponentialAccumulation(1000, 0.1)).toBeCloseTo(1, 5);
  });

  // Hand-calculated: rate=0.1, t=10 → 1 - exp(-1) ≈ 0.63212
  it('matches hand calculation (rate=0.1, t=10)', () => {
    expect(exponentialAccumulation(10, 0.1)).toBeCloseTo(1 - Math.exp(-1), 10);
  });

  it('returns 0 for negative t', () => {
    expect(exponentialAccumulation(-5, 0.1)).toBe(0);
  });

  it('returns 0 for non-positive rate', () => {
    expect(exponentialAccumulation(10, 0)).toBe(0);
    expect(exponentialAccumulation(10, -1)).toBe(0);
  });
});

describe('fitting', () => {
  it('fitPowerLaw recovers known parameters from perfect data', () => {
    const k = 5, c = 0.001;
    const data: [number, number][] = [];
    for (let t = 10; t <= 80; t += 5) {
      data.push([t, c * Math.pow(t, k - 1)]);
    }
    const result = fitPowerLaw(data);
    expect(result.model).toBe('power-law');
    expect(result.params.k).toBeCloseTo(k, 1);
    expect(result.params.c).toBeCloseTo(c, 3);
  });

  it('fitExponential recovers known parameters from perfect data', () => {
    const rate = 0.05, scale = 100;
    const data: [number, number][] = [];
    for (let t = 5; t <= 80; t += 5) {
      data.push([t, scale * (1 - Math.exp(-rate * t))]);
    }
    const result = fitExponential(data);
    expect(result.model).toBe('exponential');
    expect(result.params.rate).toBeCloseTo(rate, 2);
    expect(Math.abs(result.params.scale - scale) / scale).toBeLessThan(0.05);
  });

  it('AIC/BIC prefer power-law for power-law data', () => {
    const k = 6, c = 1e-8;
    const data: [number, number][] = [];
    for (let t = 20; t <= 80; t += 2) {
      data.push([t, c * Math.pow(t, k - 1)]);
    }
    const plFit = fitPowerLaw(data);
    const expFit = fitExponential(data);
    expect(plFit.aic).toBeLessThan(expFit.aic);
  });

  it('AIC/BIC prefer exponential for exponential data', () => {
    const rate = 0.03, scale = 50;
    const data: [number, number][] = [];
    for (let t = 5; t <= 90; t += 2) {
      data.push([t, scale * (1 - Math.exp(-rate * t))]);
    }
    const plFit = fitPowerLaw(data);
    const expFit = fitExponential(data);
    expect(expFit.aic).toBeLessThan(plFit.aic);
  });

  it('fit results contain residuals of correct length', () => {
    const data: [number, number][] = [[10, 5], [20, 15], [30, 30], [40, 50]];
    const result = fitPowerLaw(data);
    expect(result.residuals).toHaveLength(4);
  });
});
