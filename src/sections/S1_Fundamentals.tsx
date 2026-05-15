import { useState, useMemo } from 'react';
import PlotCanvas, { type Series } from '../components/PlotCanvas';
import Slider from '../components/Slider';
import ResetButton from '../components/ResetButton';
import { incidence, logLogSlope } from '../math/power-law';
import { weibullPDF } from '../math/weibull';
import { erlangPDF } from '../math/erlang';

const WIDGET1_DEFAULTS = { k: 6 };
const WIDGET2_DEFAULTS = { weibullK: 3, weibullLambda: 65, erlangK: 3, erlangMu: 0.05 };

function Widget1_MultistageBuilder() {
  const [k, setK] = useState(WIDGET1_DEFAULTS.k);

  const series = useMemo<Series[]>(() => {
    const logData: [number, number][] = [];
    for (let age = 5; age <= 90; age += 1) {
      const y = incidence(age, k, 1e-10);
      if (y > 0) logData.push([age, y]);
    }
    return [{ label: `k = ${k} (slope = ${logLogSlope(k)})`, data: logData, color: '#0f3460' }];
  }, [k]);

  return (
    <div id="widget-multistage-builder" role="group" aria-labelledby="w1-heading">
      <h4 id="w1-heading">Widget 1: Build a Multistage Process</h4>
      <p>
        Adjust the number of stages <em>k</em>. On a log-log plot, the
        Armitage-Doll incidence curve I(t) = c &middot; t<sup>k&minus;1</sup>{' '}
        appears as a straight line with slope <strong>k &minus; 1 = {logLogSlope(k)}</strong>.
      </p>
      <Slider
        id="w1-k"
        label="Number of stages (k)"
        min={1}
        max={12}
        step={1}
        value={k}
        onChange={setK}
      />
      <ResetButton onClick={() => setK(WIDGET1_DEFAULTS.k)} />
      <PlotCanvas
        id="plot-multistage"
        series={series}
        xLabel="Age (log scale)"
        yLabel="Incidence (log scale)"
        logX
        logY
        ariaDescription={`Log-log plot of age versus incidence for a ${k}-stage Armitage-Doll model. The line has slope ${logLogSlope(k)}.`}
      />
    </div>
  );
}

function Widget2_DistributionComparison() {
  const [params, setParams] = useState(WIDGET2_DEFAULTS);

  const updateParam = (key: keyof typeof WIDGET2_DEFAULTS, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const series = useMemo<Series[]>(() => {
    const weibullData: [number, number][] = [];
    const erlangData: [number, number][] = [];
    for (let t = 1; t <= 100; t += 1) {
      weibullData.push([t, weibullPDF(t, params.weibullK, params.weibullLambda)]);
      erlangData.push([t, erlangPDF(t, params.erlangK, params.erlangMu)]);
    }
    return [
      { label: `Weibull (k=${params.weibullK}, λ=${params.weibullLambda})`, data: weibullData, color: '#0f3460' },
      { label: `Erlang (k=${params.erlangK}, μ=${params.erlangMu})`, data: erlangData, color: '#e94560', dash: '6,4' },
    ];
  }, [params]);

  return (
    <div id="widget-distribution-comparison" role="group" aria-labelledby="w2-heading">
      <h4 id="w2-heading">Widget 2: Compare Distributions</h4>
      <p>
        The Weibull distribution generalises the multistage model&rsquo;s waiting-time to allow non-integer
        shape parameters, while the Erlang distribution is the exact sum of <em>k</em> independent
        exponential stages. Compare how their shapes respond to parameter changes.
      </p>
      <Slider
        id="w2-weibull-k"
        label="Weibull shape (k)"
        min={1}
        max={10}
        step={0.5}
        value={params.weibullK}
        onChange={(v) => updateParam('weibullK', v)}
      />
      <Slider
        id="w2-weibull-lambda"
        label="Weibull scale (λ)"
        min={10}
        max={100}
        step={5}
        value={params.weibullLambda}
        onChange={(v) => updateParam('weibullLambda', v)}
      />
      <Slider
        id="w2-erlang-k"
        label="Erlang stages (k)"
        min={1}
        max={10}
        step={1}
        value={params.erlangK}
        onChange={(v) => updateParam('erlangK', v)}
      />
      <Slider
        id="w2-erlang-mu"
        label="Erlang rate (μ)"
        min={0.01}
        max={0.2}
        step={0.01}
        value={params.erlangMu}
        onChange={(v) => updateParam('erlangMu', v)}
      />
      <ResetButton onClick={() => setParams(WIDGET2_DEFAULTS)} />
      <PlotCanvas
        id="plot-distributions"
        series={series}
        xLabel="Age"
        yLabel="Probability density"
        ariaDescription={`Overlaid Weibull and Erlang probability density functions. Weibull is solid blue with shape ${params.weibullK} and scale ${params.weibullLambda}. Erlang is dashed red with ${params.erlangK} stages and rate ${params.erlangMu}.`}
      />
    </div>
  );
}

export default function S1_Fundamentals() {
  return (
    <section id="fundamentals">
      <h2>1. Fundamentals of the Armitage-Doll Model</h2>

      <h3>The Core Idea</h3>
      <p>
        In 1954, Peter Armitage and Richard Doll proposed that cancer arises through a series of
        discrete, irreversible cellular transformations&mdash;a <strong>multistage process</strong>.
        Each &ldquo;stage&rdquo; is a rare mutational event occurring at a constant rate. A cell
        must accumulate all <em>k</em> stages, in a specific order, to become malignant.
      </p>

      <h3>Key Assumptions</h3>
      <ol>
        <li><strong>Discrete stages:</strong> Disease requires exactly <em>k</em> sequential transitions.</li>
        <li><strong>Fixed order:</strong> Transitions must occur in a specific sequence (stage 1 before stage 2, etc.).</li>
        <li><strong>Independence:</strong> Each transition occurs at a constant rate, independent of when previous transitions occurred.</li>
        <li><strong>Universal susceptibility:</strong> Every individual in the population is equally susceptible&mdash;there is no heterogeneity in intrinsic risk.</li>
      </ol>

      <h3>The Power-Law Prediction</h3>
      <p>
        Under these assumptions, the age-specific incidence of disease follows a power law:
      </p>
      <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
        <em>I(t) = c &middot; t<sup>k&minus;1</sup></em>
      </p>
      <p>
        where <em>t</em> is age, <em>k</em> is the number of stages, and <em>c</em> is a constant
        that absorbs all the individual transition rates. On a log-log plot, this is a straight line
        with slope <em>k &minus; 1</em>. This is the model&rsquo;s most famous and testable prediction.
      </p>

      <Widget1_MultistageBuilder />

      <h3>Waiting-Time Distributions</h3>
      <p>
        The time to complete all <em>k</em> stages can be described by standard probability distributions.
        When every stage has the same rate, the total waiting time follows an{' '}
        <strong>Erlang distribution</strong> (the sum of <em>k</em> independent exponentials).
        The more flexible <strong>Weibull distribution</strong> generalises this by allowing the shape
        parameter to be non-integer, which accommodates scenarios where transition rates vary between stages.
      </p>

      <Widget2_DistributionComparison />
    </section>
  );
}
