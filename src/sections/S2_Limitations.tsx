import { useState, useMemo } from 'react';
import PlotCanvas, { type Series } from '../components/PlotCanvas';
import Slider from '../components/Slider';
import ResetButton from '../components/ResetButton';
import { incidence } from '../math/power-law';

const REF_AGE = 55;
const W3_DEFAULTS = { k: 6, expRate: 0.09, scaleFactor: 1.0 };
const W4_DEFAULTS = { peakAge: 75, betaStrength: 0.07, susceptibleFraction: 0.4 };

function Widget3_CurveFittingTrap() {
  const [params, setParams] = useState(W3_DEFAULTS);
  const update = (key: keyof typeof W3_DEFAULTS, v: number) =>
    setParams((p) => ({ ...p, [key]: v }));

  const series = useMemo<Series[]>(() => {
    const powerData: [number, number][] = [];
    const expData: [number, number][] = [];
    const scale = 10 * params.scaleFactor;
    for (let age = 20; age <= 80; age += 1) {
      powerData.push([age, scale * Math.pow(age / REF_AGE, params.k - 1)]);
      expData.push([age, scale * Math.exp(params.expRate * (age - REF_AGE))]);
    }
    return [
      { label: `Power-law (k=${params.k})`, data: powerData, color: '#0f3460' },
      { label: `Exponential (rate=${params.expRate})`, data: expData, color: '#e94560', dash: '6,4' },
    ];
  }, [params]);

  return (
    <div id="widget-curve-fitting-trap" role="group" aria-labelledby="w3-heading">
      <h4 id="w3-heading">Widget 3: The Curve-Fitting Trap</h4>
      <p>
        Two biologically different models&mdash;a discrete multistage process and a continuous
        exponential growth model&mdash;can produce nearly identical curves over working ages. Both
        are normalised to the same value at age {REF_AGE}. Adjust the parameters to see how closely
        they overlap, demonstrating that a good fit does <em>not</em> prove the underlying mechanism.
      </p>
      <Slider id="w3-k" label="Power-law stages (k)" min={2} max={10} step={1} value={params.k} onChange={(v) => update('k', v)} />
      <Slider id="w3-rate" label="Exponential rate" min={0.05} max={0.15} step={0.005} value={params.expRate} onChange={(v) => update('expRate', v)} />
      <Slider id="w3-scale" label="Shared scale" min={0.5} max={3} step={0.1} value={params.scaleFactor} onChange={(v) => update('scaleFactor', v)} formatValue={(v) => v.toFixed(1)} />
      <ResetButton onClick={() => setParams(W3_DEFAULTS)} />
      <PlotCanvas
        id="plot-curve-trap"
        series={series}
        xLabel="Age"
        yLabel="Incidence (arbitrary units)"
        ariaDescription="Two curves — a power-law and an exponential — that look nearly identical over working ages, illustrating how fit quality cannot determine mechanism."
      />
    </div>
  );
}

function Widget4_OldAgePlateau() {
  const [params, setParams] = useState(W4_DEFAULTS);
  const update = (key: keyof typeof W4_DEFAULTS, v: number) =>
    setParams((p) => ({ ...p, [key]: v }));

  const series = useMemo<Series[]>(() => {
    const base: [number, number][] = [];
    const betaModel: [number, number][] = [];
    const susceptModel: [number, number][] = [];

    const k = 6;
    const c = 1e-10;

    for (let age = 20; age <= 100; age += 1) {
      const raw = incidence(age, k, c);
      base.push([age, raw]);

      const extinctionFactor = Math.exp(-params.betaStrength * Math.max(0, age - params.peakAge));
      betaModel.push([age, raw * (age > params.peakAge ? extinctionFactor : 1)]);

      const susceptible = params.susceptibleFraction;
      const depletion = age > params.peakAge
        ? susceptible * Math.exp(-0.08 * (age - params.peakAge))
        : susceptible;
      susceptModel.push([age, raw * depletion]);
    }

    return [
      { label: 'Pure power-law', data: base, color: '#6b7280', dash: '3,3' },
      { label: 'Beta (extinction)', data: betaModel, color: '#0f3460' },
      { label: 'Susceptibility depletion', data: susceptModel, color: '#e94560', dash: '6,4' },
    ];
  }, [params]);

  return (
    <div id="widget-old-age-plateau" role="group" aria-labelledby="w4-heading">
      <h4 id="w4-heading">Widget 4: Old-Age Plateau</h4>
      <p>
        The pure multistage model predicts incidence rising forever with age. In reality, cancer and
        ALS incidence levels off or declines after about age 80. Two explanations:
      </p>
      <ul>
        <li><strong>Beta (extinction) model:</strong> Competing mortality removes individuals from the at-risk pool before they develop disease.</li>
        <li><strong>Susceptibility depletion:</strong> Only a fraction of the population is truly susceptible; as they develop disease, the remaining pool has lower intrinsic risk.</li>
      </ul>
      <Slider id="w4-peak" label="Turnover age" min={60} max={90} step={1} value={params.peakAge} onChange={(v) => update('peakAge', v)} />
      <Slider id="w4-beta" label="Extinction rate" min={0.005} max={0.1} step={0.005} value={params.betaStrength} onChange={(v) => update('betaStrength', v)} formatValue={(v) => v.toFixed(3)} />
      <Slider id="w4-suscept" label="Susceptible fraction" min={0.1} max={1} step={0.05} value={params.susceptibleFraction} onChange={(v) => update('susceptibleFraction', v)} formatValue={(v) => v.toFixed(2)} />
      <ResetButton onClick={() => setParams(W4_DEFAULTS)} />
      <PlotCanvas
        id="plot-old-age"
        series={series}
        xLabel="Age"
        yLabel="Incidence"
        ariaDescription="Three curves showing how pure power-law incidence (dashed grey) is modified by extinction (solid blue) and susceptibility depletion (dashed red), each explaining the observed old-age decline."
      />
    </div>
  );
}

export default function S2_Limitations() {
  return (
    <section id="limitations">
      <h2>2. Limitations &amp; Elaborations</h2>

      <h3>Affirming the Consequent</h3>
      <p>
        The Armitage-Doll model makes a specific prediction: if disease requires <em>k</em> stages,
        then age-incidence follows a power law with slope <em>k &minus; 1</em>. Many researchers observed
        that cancer incidence data fits a straight line on a log-log plot and concluded that cancer
        must be a multistage process. But this is a logical fallacy&mdash;<em>affirming the consequent</em>.
      </p>
      <p>
        A power-law curve can arise from many different generative mechanisms. The fact that the data
        fits the prediction does not prove the model is correct; it only means the model is
        <em>consistent with</em> the data. Other models, including those with completely different
        biological assumptions, can produce equally good fits.
      </p>

      <Widget3_CurveFittingTrap />

      <h3>The Old-Age Problem</h3>
      <p>
        For many cancers, incidence does not keep rising as a power of age. After about age 75&ndash;85,
        rates level off or decline. The pure multistage model cannot explain this without modification.
        Two main extensions have been proposed:
      </p>

      <Widget4_OldAgePlateau />

      <h3>Relaxing the Assumptions</h3>
      <p>
        More fundamentally, the model&rsquo;s core assumptions&mdash;sequential progression, independence,
        universal susceptibility&mdash;are biologically unrealistic for many diseases. Real cellular
        transitions may not follow a single linear pathway, some individuals may be more susceptible
        than others (due to genetics, environment, or both), and the rate of each transition may
        depend on which transitions have already occurred. These complications don&rsquo;t invalidate
        the multistage idea entirely, but they mean the simple power-law prediction is at best an
        approximation.
      </p>
    </section>
  );
}
