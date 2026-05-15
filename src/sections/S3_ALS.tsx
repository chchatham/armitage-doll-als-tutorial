import { useState, useMemo } from 'react';
import PlotCanvas, { type Series } from '../components/PlotCanvas';
import Slider from '../components/Slider';
import ResetButton from '../components/ResetButton';
import { incidence } from '../math/power-law';
import { fitPowerLaw, fitTurnover, type FitResult } from '../math/fitting';
import { syntheticALSIncidence, SYNTHETIC_LABEL } from '../data/synthetic-als';

const W5_DEFAULTS = { showPowerLaw: true, showTurnover: true };
const W6_DEFAULTS = { k: 6, carrierK: 3 };

function FitStats({ label, fit }: { label: string; fit: FitResult }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
      <strong>{label}:</strong> AIC = {fit.aic.toFixed(1)}, BIC = {fit.bic.toFixed(1)}
      {fit.model === 'power-law' && <span> (k = {fit.params.k.toFixed(2)})</span>}
      {fit.model === 'turnover' && <span> (k = {fit.params.k.toFixed(1)}, &beta; = {fit.params.beta.toFixed(4)}, peak age &asymp; {((fit.params.k - 1) / fit.params.beta).toFixed(0)})</span>}
    </div>
  );
}

function Widget5_FitOff() {
  const [show, setShow] = useState(W5_DEFAULTS);

  const plFit = useMemo(() => fitPowerLaw(syntheticALSIncidence), []);
  const toFit = useMemo(() => fitTurnover(syntheticALSIncidence), []);

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

    if (show.showTurnover) {
      const toCurve: [number, number][] = [];
      for (let t = 30; t <= 90; t += 1) {
        toCurve.push([t, toFit.params.c * Math.pow(t, toFit.params.k - 1) * Math.exp(-toFit.params.beta * t)]);
      }
      result.push({ label: 'Turnover fit', data: toCurve, color: '#e94560', dash: '8,3' });
    }

    return result;
  }, [show, plFit, toFit]);

  const winner = toFit.aic < plFit.aic ? 'turnover' : 'power-law';

  return (
    <div id="widget-fit-off" role="group" aria-labelledby="w5-heading">
      <h4 id="w5-heading">Widget 5: ALS Age-Incidence Fit-Off</h4>
      <p>
        <em>{SYNTHETIC_LABEL}</em>
      </p>
      <p>
        Compare a pure power-law model (which rises forever) against a turnover model that adds
        competing mortality: I(t) = c &middot; t<sup>k&minus;1</sup> &middot; e<sup>&minus;&beta;t</sup>.
        The model with the lower AIC is preferred. Toggle each fit to compare visually.
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
            checked={show.showTurnover}
            onChange={(e) => setShow((s) => ({ ...s, showTurnover: e.target.checked }))}
          />{' '}
          Show turnover fit
        </label>
      </div>
      <FitStats label="Power-law" fit={plFit} />
      <FitStats label="Turnover" fit={toFit} />
      <p style={{ fontWeight: 600 }}>
        Preferred model (lower AIC): <span style={{ color: winner === 'turnover' ? '#b91c1c' : '#0f3460' }}>{winner}</span>
      </p>
      <ResetButton onClick={() => setShow(W5_DEFAULTS)} />
      <PlotCanvas
        id="plot-fit-off"
        series={series}
        xLabel="Age"
        yLabel="Incidence (per 100k)"
        ariaDescription={`Synthetic ALS incidence data with overlaid power-law and turnover fits. The ${winner} model has the lower AIC, capturing the peak and decline in incidence.`}
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
      const cVal = incidence(age, params.carrierK, c * 2e5);
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
        age-incidence curve appeared to follow a power law with a log-log slope consistent with
        approximately 6 steps, though fitted values vary by population (Al-Chalabi et al., 2014).
        This was an intriguing parallel to cancer: perhaps motor neuron degeneration, like
        carcinogenesis, required a specific number of &ldquo;hits.&rdquo;
      </p>
      <p>
        Under this interpretation, individuals with known ALS-associated mutations (such as SOD1 or
        C9orf72 repeat expansions) would &ldquo;start&rdquo; with one or more steps already completed,
        explaining their earlier disease onset and <em>shallower</em> log-log slope (fewer remaining
        steps). Note that this &ldquo;pre-completed steps&rdquo; framing is an analogy within the
        multistage model; the actual biological mechanisms (e.g., SOD1 toxic gain-of-function) are
        distinct from the abstract stages the model posits.
      </p>

      <Widget6_StepsToSlopes />

      <h3>Beyond the Pure Power Law</h3>
      <p>
        However, more careful analysis reveals that the ALS age-incidence curve is not truly a
        power law. When you fit both a pure power-law model and a turnover model (the multistage
        process modified by competing mortality: I(t) = c &middot; t<sup>k&minus;1</sup> &middot;
        e<sup>&minus;&beta;t</sup>), the turnover model provides a substantially better fit (lower
        AIC/BIC), because it captures the observed incidence decline after peak age&mdash;something
        the pure power law cannot.
      </p>
      <p>
        This is a critical finding: the data requires a turnover component, meaning the simple
        &ldquo;counting steps&rdquo; framework is incomplete for ALS. The incidence peak and decline
        suggest that cumulative damage, competing mortality, and susceptibility depletion all play
        roles&mdash;pointing toward a framework where risk reflects the total burden of genetic
        susceptibility and environmental exposure over a lifetime, rather than a discrete sequence of
        mutations alone.
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
