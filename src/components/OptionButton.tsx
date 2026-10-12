import type { ReactNode } from 'react';

interface Props {
  index?: number;
  emoji?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export default function OptionButton({ index, emoji, selected, disabled, onClick, children, className = '' }: Props) {
  return (
    <button type="button" className={`option-card ${className}`} aria-pressed={selected} disabled={disabled} onClick={onClick}>
      {emoji && (
        <span className="mt-0.5 text-xl leading-none" aria-hidden>
          {emoji}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {index !== undefined && <span className="kbd mt-0.5">{index + 1}</span>}
    </button>
  );
}
