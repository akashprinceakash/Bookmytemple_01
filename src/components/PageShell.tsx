import type { ReactNode } from 'react';
import { RoyaleHeader } from './RoyaleHeader';
import { RoyaleFooter } from './RoyaleFooter';

/**
 * Standard Royale page wrapper: sticky top nav, the mockup's `.wrap`
 * content column (max-width 1240px, clamp(20px,6vw,64px) gutters) and
 * the Royale footer.
 *
 * The old shell capped content at max-w-6xl (1152px) with a flat px-4
 * gutter, which is what produced the narrow column and the wide empty
 * side margins. `.wrap` matches book-my-temples-royale (10).html exactly.
 */
export function PageShell({
  children,
  showSearch = true,
  showFooter = true,
  bare = false,
}: {
  children: ReactNode;
  showSearch?: boolean;
  showFooter?: boolean;
  /** bare: no `.wrap` around children (page manages its own full-bleed layout, e.g. the home hero) */
  bare?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col text-foreground">
      <RoyaleHeader showSearch={showSearch} />
      {bare ? (
        <main className="page-rise flex-1">{children}</main>
      ) : (
        <main className="page-rise flex-1">
          <div className="wrap">{children}</div>
        </main>
      )}
      {showFooter && <RoyaleFooter />}
    </div>
  );
}
