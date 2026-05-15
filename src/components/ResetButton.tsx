import type { CSSProperties } from 'react';

interface ResetButtonProps {
  onClick: () => void;
  label?: string;
}

const buttonStyle: CSSProperties = {
  padding: '0.35rem 0.75rem',
  fontSize: '0.85rem',
  cursor: 'pointer',
  background: '#e5e7eb',
  border: '1px solid var(--color-border)',
  borderRadius: '4px',
  color: 'var(--color-text)',
  marginTop: '0.25rem',
};

export default function ResetButton({ onClick, label = 'Reset to defaults' }: ResetButtonProps) {
  return (
    <button type="button" style={buttonStyle} onClick={onClick}>
      {label}
    </button>
  );
}
