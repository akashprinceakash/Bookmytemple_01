interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick: () => void;
}

/** Mockup `.chip` — 9px/17px pill, 12.5px label, gold gradient when on. */
export function FilterChip({ label, active = false, onClick }: FilterChipProps) {
  return (
    <button onClick={onClick} className={`chip ${active ? 'on' : ''}`}>
      {label}
    </button>
  );
}
