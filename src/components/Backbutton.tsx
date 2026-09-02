import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Shared "go back" behavior, used by both `BackButton` below and by
 * `Crumb`'s built-in back arrow in components/royale.tsx.
 *
 * `history.state.idx` is how React Router's BrowserRouter tags how deep
 * the current entry is in *this* SPA session, so we only try
 * `navigate(-1)` when there's actually somewhere in-app to go back to —
 * otherwise (e.g. someone opened this URL directly) we fall back to a
 * sane default route instead of leaving the app entirely.
 */
export function useGoBack(fallback: string) {
  const navigate = useNavigate();

  return () => {
    const idx = (window.history.state as any)?.idx;
    if (typeof idx === 'number' && idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };
}

/**
 * Explicit in-app "Back" control, for pages that don't render a `Crumb`
 * (Payment, BookingConfirmation, OTPVerification, and the various
 * "invalid/not found" dead-end screens). Pages that DO render a `Crumb`
 * should use its built-in `back` prop instead — see royale.tsx — rather
 * than stacking both, to avoid two back arrows on the same page.
 */
export function BackButton({
  fallback = '/home',
  label = 'Back',
  className = '',
}: {
  fallback?: string;
  label?: string;
  className?: string;
}) {
  const handleBack = useGoBack(fallback);

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-gold-soft ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}