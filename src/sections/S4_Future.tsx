import { useState, useMemo } from 'react';
import PlotCanvas, { type Series } from '../components/PlotCanvas';
import Slider from '../components/Slider';
import ResetButton from '../components/ResetButton';

const W7_DEFAULTS = {
  geneticLoad: 0.3,
  envExposure: 0.2,
  agingRate: 0.015,
  threshold: 0.7,
};

function Widget7_ResilienceThreshold() {
  const [params, setParams] = useState(W7_DEFAULTS);
  const update = (key: keyof typeof W7_DEFAULTS, v: number) =>
    setParams((p) => ({ ...p, [key]: v }));

  const series = useMemo<Series[]>(() => {
    const damage: [number, number][] = [];
    const thresholdLine: [number, number][] = [];

    for (let age = 0; age <= 100; age += 1) {
      const genetic = params.geneticLoad;
      const environmental = params.envExposure * (1 - Math.exp(-0.03 * age));
      const aging = 1 - Math.exp(-params.agingRate * age);
      const total = Math.min(1, genetic + environmental + aging);
      damage.push([age, total]);
      thresholdLine.push([age, params.threshold]);
    }

    return [
      { label: 'Cumulative damage', data: damage, color: '#0f3460' },
      { label: 'Disease threshold', data: thresholdLine, color: '#e94560', dash: '6,4' },
    ];
  }, [params]);

  const crossingAge = useMemo(() => {
    for (let age = 0; age <= 100; age += 0.5) {
      const genetic = params.geneticLoad;
      const environmental = params.envExposure * (1 - Math.exp(-0.03 * age));
      const aging = 1 - Math.exp(-params.agingRate * age);
      const total = genetic + environmental + aging;
      if (total >= params.threshold) return age;
    }
    return null;
  }, [params]);

  return (
    <div id="widget-resilience-threshold" role="group" aria-labelledby="w7-heading">
      <h4 id="w7-heading">Widget 7: Resilience Threshold Simulator</h4>
      <p>
        Model disease as the point where cumulative damage (from genetics, environment, and aging)
        crosses a resilience threshold. Adjust each component to see how they interact.
      </p>
      <Slider id="w7-genetic" label="Genetic load" min={0} max={0.6} step={0.05} value={params.geneticLoad} onChange={(v) => update('geneticLoad', v)} formatValue={(v) => v.toFixed(2)} />
      <Slider id="w7-env" label="Environmental exposure" min={0} max={0.5} step={0.05} value={params.envExposure} onChange={(v) => update('envExposure', v)} formatValue={(v) => v.toFixed(2)} />
      <Slider id="w7-aging" label="Aging rate" min={0.005} max={0.04} step={0.005} value={params.agingRate} onChange={(v) => update('agingRate', v)} formatValue={(v) => v.toFixed(3)} />
      <Slider id="w7-threshold" label="Disease threshold" min={0.3} max={1.0} step={0.05} value={params.threshold} onChange={(v) => update('threshold', v)} formatValue={(v) => v.toFixed(2)} />
      <ResetButton onClick={() => setParams(W7_DEFAULTS)} />
      {crossingAge !== null ? (
        <p style={{ fontWeight: 600 }}>
          Disease onset predicted at age: <span style={{ color: '#b91c1c' }}>{crossingAge.toFixed(0)}</span>
        </p>
      ) : (
        <p style={{ fontWeight: 600 }}>Damage never reaches threshold within 100 years.</p>
      )}
      <PlotCanvas
        id="plot-resilience"
        series={series}
        xLabel="Age"
        yLabel="Cumulative damage / Threshold"
        yDomain={[0, 1.1]}
        ariaDescription={`Cumulative damage curve (solid blue) rising with age, crossing a disease threshold (dashed red) at ${crossingAge !== null ? `age ${crossingAge.toFixed(0)}` : 'never within 100 years'}. Components: genetic load ${params.geneticLoad}, environmental exposure ${params.envExposure}, aging rate ${params.agingRate}.`}
      />
    </div>
  );
}

export default function S4_Future() {
  return (
    <section id="future">
      <h2>4. Future Directions</h2>

      <h3>The Exposome as Probabilistic Modifier</h3>
      <p>
        Rather than counting discrete &ldquo;hits,&rdquo; a modern framework treats the exposome&mdash;the
        totality of environmental exposures over a lifetime&mdash;as a probabilistic modifier of disease
        risk. Chemical exposures, physical activity, diet, infections, and psychosocial stress all
        contribute to a cumulative damage burden that interacts with genetic susceptibility.
      </p>

      <h3>Early-Life Resilience</h3>
      <p>
        Not all damage is equal. The timing of exposure matters: early-life insults may set
        individuals on trajectories of reduced resilience, while later interventions may be less
        effective. This has implications for prevention: identifying and protecting high-risk
        individuals early in life could delay or prevent disease more effectively than treating
        accumulated damage later.
      </p>

      <h3>Senolytics and Anti-Aging Interventions</h3>
      <p>
        If age-related disease is driven by cumulative damage rather than discrete mutations, then
        interventions that reduce the rate of damage accumulation (anti-aging therapies, senolytics,
        neuroprotective agents) could be more effective than targeting specific molecular
        &ldquo;stages.&rdquo; The threshold model below lets you explore this idea: reducing the
        aging rate even slightly can delay disease onset by years.
      </p>

      <Widget7_ResilienceThreshold />

      <h3>Summary</h3>
      <p>
        The Armitage-Doll multistage model was a landmark contribution that framed disease as a
        quantifiable, step-wise process. For many cancers, this framework remains useful. But for
        ALS&mdash;and likely for other neurodegenerative diseases&mdash;the evidence points away from
        discrete stages and toward continuous, cumulative damage shaped by the lifelong interplay of
        genes and environment. Understanding this distinction is not just academic: it changes which
        interventions we pursue, which populations we target, and when in life we intervene.
      </p>
    </section>
  );
}
