import { useRef, useEffect, type CSSProperties } from 'react';
import * as d3 from 'd3';

export interface Series {
  label: string;
  data: [number, number][];
  color: string;
  dash?: string; // e.g. "5,5" for dashed
}

interface PlotCanvasProps {
  id: string;
  series: Series[];
  xLabel: string;
  yLabel: string;
  xDomain?: [number, number];
  yDomain?: [number, number];
  logX?: boolean;
  logY?: boolean;
  width?: number;
  height?: number;
  ariaDescription: string;
}

const margin = { top: 20, right: 20, bottom: 50, left: 65 };

const containerStyle: CSSProperties = {
  width: '100%',
  maxWidth: '600px',
  margin: '1rem 0',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  background: '#fff',
  padding: '0.5rem',
};

export default function PlotCanvas({
  id,
  series,
  xLabel,
  yLabel,
  xDomain,
  yDomain,
  logX = false,
  logY = false,
  width = 560,
  height = 360,
  ariaDescription,
}: PlotCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const allPoints = series.flatMap((s) => s.data);
    const xExtent = xDomain ?? (d3.extent(allPoints, (d) => d[0]) as [number, number]);
    const yExtent = yDomain ?? (d3.extent(allPoints, (d) => d[1]) as [number, number]);

    const xMin = xExtent[0] ?? 1;
    const xMax = xExtent[1] ?? 100;
    const yMin = yExtent[0] ?? 0;
    const yMax = yExtent[1] ?? 1;

    const xScale = logX
      ? d3.scaleLog().domain([Math.max(xMin, 0.01), xMax]).range([0, innerW])
      : d3.scaleLinear().domain([xMin, xMax]).range([0, innerW]);

    const yScale = logY
      ? d3.scaleLog().domain([Math.max(yMin, 1e-10), yMax]).range([innerH, 0])
      : d3.scaleLinear().domain([yMin, yMax]).range([innerH, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .append('text')
      .attr('x', innerW / 2)
      .attr('y', 40)
      .attr('fill', 'var(--color-text)')
      .attr('text-anchor', 'middle')
      .attr('font-size', '0.85rem')
      .text(xLabel);

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(6))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerH / 2)
      .attr('y', -50)
      .attr('fill', 'var(--color-text)')
      .attr('text-anchor', 'middle')
      .attr('font-size', '0.85rem')
      .text(yLabel);

    for (const s of series) {
      const line = d3
        .line<[number, number]>()
        .x((d) => xScale(d[0]))
        .y((d) => yScale(d[1]))
        .defined(
          (d) =>
            Number.isFinite(d[0]) &&
            Number.isFinite(d[1]) &&
            (!logX || d[0] > 0) &&
            (!logY || d[1] > 0),
        );

      g.append('path')
        .datum(s.data)
        .attr('fill', 'none')
        .attr('stroke', s.color)
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', s.dash ?? '')
        .attr('d', line);
    }

    if (series.length > 1) {
      const legend = g.append('g').attr('transform', `translate(${innerW - 140}, 0)`);
      series.forEach((s, i) => {
        const row = legend.append('g').attr('transform', `translate(0, ${i * 22})`);
        row
          .append('line')
          .attr('x1', 0)
          .attr('x2', 20)
          .attr('y1', 6)
          .attr('y2', 6)
          .attr('stroke', s.color)
          .attr('stroke-width', 2.5)
          .attr('stroke-dasharray', s.dash ?? '');
        row
          .append('text')
          .attr('x', 26)
          .attr('y', 10)
          .attr('font-size', '0.75rem')
          .attr('fill', 'var(--color-text)')
          .text(s.label);
      });
    }
  }, [series, xLabel, yLabel, xDomain, yDomain, logX, logY, width, height]);

  return (
    <div style={containerStyle}>
      <svg
        ref={svgRef}
        id={id}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-label={ariaDescription}
      />
    </div>
  );
}
