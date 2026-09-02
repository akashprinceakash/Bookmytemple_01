interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

/**
 * Maps to the mockup's `.btn-primary` / `.btn-ghost`:
 * 14px/30px pill, 14px 700-weight label, gold gradient with the
 * 0 12px 32px gold glow, lifting 1px on hover.
 */
export function Button({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const variantClass =
    variant === 'primary'
      ? 'btn-primary shimmer'
      : variant === 'secondary'
        ? 'btn-ghost'
        : 'btn-ghost border-gold text-gold-soft';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClass} ${fullWidth ? 'block w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
