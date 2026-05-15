import { useState, useMemo } from 'react';
import PlotCanvas, { type Series } from '../components/PlotCanvas';
import Slider from '../components/Slider';
import ResetButton from '../components/ResetButton';
import { incidence } from '../math/power-law';
import { fitPowerLaw, fitExponential, type FitResult } from '../math/fitting';
import { syntheticALSIncidence, SYNTHETIC_LABEL } from '../data/synthetic-als';

const W5_DEFAULTS = { showPowerLaw: true, showExponential: true };
const W6_DEFAULTS = { k: 6, carrierK: 3 };

function FitStats({ label, fit }: { label: string; fit: FitResult }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
      <strong>{label}:</strong> AIC = {fit.aic.toFixed(1)}, BIC = {fit.bic.toFixed(1)}
      {fit.model === 'power-law' && <span> (k = {fit.params.k.toFixed(2)})</span>}
      {fit.model === 'exponential' && <span> (rate = {fit.params.rate.toFixed(4)}, scale = {fit.params.scale.toFixed(1)})</span>}
    </div>
  );
}

function Widget5_FitOff() {
  const [show, setShow] = useState(W5_DEFAULTS);

  const plFit = useMemo(() => fitPowerLaw(syntheticALSIncidence), []);
  const expFit = useMemo(() => fitExponential(syntheticALSIncidence), []);

  const series = useMemo<Series[]>(() => {
    const result: Series[] = [
      { label: 'Synthetic ALS data', data: syntheticALSIncidence, color: '#374151' },
    ];

    if (show.showPowerLaw) {
      const plCurve: [number, number][] = [];
      for (let t = 30; t <= 90; t += 1) {
        plCurve.push([t, plFit.params.c * Math.pow(t, plFit.params.k - 1)]);
      }
      result.push({ label: 'Power-law fit', data: plCurve, color: '#0f3460', dash: '6,4' });
    }

    if (show.showExponential) {
      const expCurve: [number, number][] = [];
      for (let t = 30; t <= 90; t += 1) {
        expCurve.push([t, expFit.params.scale * (1 - Math.exp(-expFit.params.rate * t))]);
      }
      result.push({ label: 'Exponential fit', data: expCurve, color: '#e94560', dash: '8,3' });
    }

    return result;
  }, [show, plFit, expFit]);

  const winner = expFit.aic < plFit.aic ? 'exponential' : 'power-law';

  return (
    <div id="widget-fit-off" role="group" aria-labelledby="w5-heading">
      <h4 id="w5-heading">Widget 5: ALS Age-Incidence Fit-Off</h4>
      <p>
        <em>{SYNTHETIC_LABEL}</em>
      </p>
      <p>
        Fit both a power-law and an exponential model to the data. The model with the lower AIC/BIC
        is preferred. Toggle each fit on or off to compare visually.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
        <label>
          <input
            type="checkbox"
            checked={show.showPowerLaw}
            onChange={(e) => setShow((s) => ({ ...s, showPowerLaw: e.target.checked }))}
          />{' '}
          Show power-law fit
        </label>
        <label>
          <input
            type="checkbox"
            checked={show.showExponential}
            onChange={(e) => setShow((s) => ({ ...s, showExponential: e.target.checked }))}
          />{' '}
          Show exponential fit
        </label>
      </div>
      <FitStats label="Power-law" fit={plFit} />
      <FitStats label="Exponential" fit={expFit} />
      <p style={{ fontWeight: 600 }}>
        Preferred model (lower AIC): <span style={{ color: winner === 'exponential' ? '#b91c1c' : '#0f3460' }}>{winner}</span>
      </p>
      <ResetButton onClick={() => setShow(W5_DEFAULTS)} />
      <PlotCanvas
        id="plot-fit-off"
        series={series}
        xLabel="Age"
        yLabel="Incidence (per 100k)"
        ariaDescription={`Synthetic ALS incidence data points with overlaid power-law and exponential fits. The ${winner} model has the lower AIC.`}
      />
    </div>
  );
}

function Widget6_StepsToSlopes() {
  const [params, setParams] = useState(W6_DEFAULTS);

  const series = useMemo<Series[]>(() => {
    const c = 1e-10;
    const generalPop: [number, number][] = [];
    const carriers: [number, number][] = [];
    for (let age = 5; age <= 90; age += 1) {
      const gVal = incidence(age, params.k, c);
      const cVal = incidence(age, params.carrierK, c * 1e4);
      if (gVal > 0) generalPop.push([age, gVal]);
      if (cVal > 0) carriers.push([age, cVal]);
    }
    return [
      { label: `General pop. (k=${params.k})`, data: generalPop, color: '#0f3460' },
      { label: `Mutation carriers (k=${params.carrierK})`, data: carriers, color: '#e94560', dash: '6,4' },
    ];
  }, [params]);

  return (
    <div id="widget-steps-to-slopes" role="group" aria-labelledby="w6-heading">
      <h4 id="w6-heading">Widget 6: From Steps to Slopes</h4>
      <p>
        If genetic mutation carriers (e.g., SOD1, C9orf72) inherit one or more
        &ldquo;pre-completed&rdquo; stages, the multistage model predicts their incidence curve should
        have a shallower slope (fewer remaining steps). Adjust the number of stages for each group
        to see the predicted shift.
      </p>
      <Slider id="w6-k" label="General population (k)" min={2} max={12} step={1} value={params.k} onChange={(v) => setParams((p) => ({ ...p, k: v }))} />
      <Slider id="w6-carrier-k" label="Carrier stages (k)" min={1} max={10} step={1} value={params.carrierK} onChange={(v) => setParams((p) => ({ ...p, carrierK: v }))} />
      <ResetButton onClick={() => setParams(W6_DEFAULTS)} />
      <PlotCanvas
        id="plot-steps-slopes"
        series={series}
        xLabel="Age (log scale)"
        yLabel="Incidence (log scale)"
        logX
        logY
        ariaDescription={`Log-log incidence curves for general population (${params.k} stages, solid blue) and mutation carriers (${params.carrierK} stages, dashed red). Fewer stages means a shallower slope.`}
      />
    </div>
  );
}

export default function S3_ALS() {
  return (
    <section id="als">
      <h2>3. Application to ALS</h2>

      <h3>The Six-Step Interpretation</h3>
      <p>
        When the Armitage-Doll model was first applied to ALS (amyotrophic lateral sclerosis), the
        age-incidence curve appeared to follow a power law with slope approximately 5, suggesting a
        6-step process (Al-Chalabi et al., 2014). This was an intriguing parallel to cancer: perhaps
        motor neuron degeneration, like carcinogenesis, required a specific number of &ldquo;hits.&rdquo;
      </p>
      <p>
        Under this interpretation, individuals with known ALS-causing mutations (such as SOD1 or
        C9orf72 repeat expansions) would &ldquo;start&rdquo; with one or more steps already completed,
        explaining their earlier disease onset and steeper incidence rise.
      </p>

      <Widget6_StepsToSlopes />

      <h3>The Exponential Challenge</h3>
      <p>
        However, more careful analysis reveals that the ALS age-incidence curve is not truly a
        power law. When you fit both a power-law and an exponential model, the exponential model
        provides a better fit (lower AIC/BIC), particularly because it naturally accommodates the
        incidence decline after the peak age&mdash;something the pure power law cannot.
      </p>
      <p>
        This is a critical finding: if the data is better described by an exponential process, then
        the multistage &ldquo;counting steps&rdquo; framework is not the right model for ALS.
        Instead, ALS may arise from continuous, cumulative damage where risk reflects the total
        burden of genetic susceptibility and environmental exposure over a lifetime, rather than a
        discrete sequence of mutations.
      </p>

      <Widget5_FitOff />

      <h3>From Discrete Steps to Continuous Damage</h3>
      <p>
        The failure of the multistage model for ALS points toward a fundamentally different
        framework: one where disease emerges when cumulative damage&mdash;from genetic load,
        environmental toxins, aging-related decline, and stochastic cellular damage&mdash;crosses
        a threshold. This is not a sequence of specific events, but a continuous process shaped by
        the interplay of genes and environment over an entire lifespan.
      </p>
    </section>
  );
}
