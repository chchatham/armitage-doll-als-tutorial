import type { CSSProperties } from 'react';

interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

const sliderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '0.5rem',
};

const labelStyle: CSSProperties = {
  minWidth: '10rem',
  fontWeight: 500,
  fontSize: '0.9rem',
};

const valueStyle: CSSProperties = {
  minWidth: '3rem',
  textAlign: 'right',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.9rem',
};

export default function Slider({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
}: SliderProps) {
  return (
    <div style={sliderStyle}>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1 }}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <span style={valueStyle} aria-live="polite">
        {formatValue ? formatValue(value) : value}
      </span>
    </div>
  );
}
