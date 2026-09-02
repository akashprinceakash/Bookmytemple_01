import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGoBack } from './Backbutton';

/**
 * Small shared primitives ported from book-my-temples-royale (10).html.
 * These keep every page on the exact same type scale, spacing and motion
 * language instead of each page re-inventing its own headers/tabs.
 */

/* ---------- breadcrumb (mockup `crumb()`) ---------- */
export type CrumbPart = { label: string; to?: string };

/**
 * Every page that uses `Crumb` now gets a working "Back" arrow for free.
 *
 * `back` controls it:
 * - omitted / `true` (default) — renders the arrow. Fallback route (used
 *   when there's no in-app history to go back to, e.g. a direct link)
 *   is auto-derived as the nearest linkable ancestor in `parts` — the
 *   second-to-last part's `to` if there is one, else the first part's.
 * - a string — renders the arrow using that exact fallback instead of
 *   the auto-derived one (needed wherever the true "parent" page isn't
 *   expressible as a fixed route, e.g. FamilyDetails/AddressDetails
 *   returning to whichever booking page sent the user there).
 * - `false` — no arrow, for the rare page that renders its own back
 *   control separately and would otherwise end up with two.
 */
export function Crumb({
  parts,
  back = true,
}: {
  parts: CrumbPart[];
  back?: boolean | string;
}) {
  const linkableParts = parts.filter((p) => !!p.to);
  const autoFallback =
    linkableParts[linkableParts.length - 2]?.to ??
    linkableParts[0]?.to ??
    '/home';

  const fallback = typeof back === 'string' ? back : autoFallback;
  const showBack = back !== false;

  // Hooks can't be called conditionally, but `useGoBack` itself is cheap
  // (just wraps useNavigate) so it's fine to always call it.
  const goBack = useGoBack(fallback);

  return (
    <div className="mb-2 flex items-center ">
      {showBack && (
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-gold-soft"
        >
          <ArrowLeft className="h-4 w-4" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} />
        </button>
      )}
      <div className="crumb">
        {parts.map((p, i) => {
          const last = i === parts.length - 1;
          return (
            <span key={`${p.label}-${i}`} className="inline-flex items-center gap-2">
              {last ? (
                <b>{p.label}</b>
              ) : p.to ? (
                <Link to={p.to} className="transition-colors hover:text-gold-soft">
                  {p.label}
                </Link>
              ) : (
                <span>{p.label}</span>
              )}
              {!last && <span aria-hidden="true">›</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- section head (mockup `.section-head`) ---------- */
export function SectionHead({
  tag,
  title,
  lede,
  as = 'h1',
  right,
}: {
  tag?: string;
  title: ReactNode;
  lede?: ReactNode;
  /** h1 → `.page-title` (page headers), h2 → `.sec` (in-page sections) */
  as?: 'h1' | 'h2';
  right?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        {tag && <span className="tag">{tag}</span>}
        {as === 'h1' ? (
          <h1 className="page-title">{title}</h1>
        ) : (
          <h2 className="sec">{title}</h2>
        )}
        {lede && <p className="lede">{lede}</p>}
      </div>
      {right}
    </div>
  );
}

/* ---------- tabs (mockup `.tabs`) ---------- */
export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly T[];
  active: T;
  onChange: (t: T) => void;
}) {
  return (
    <div className="tabs no-scrollbar" role="tablist">
      {tabs.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={t === active}
          className={t === active ? 'on' : ''}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ---------- chips (mockup `.chips` / `.chip`) ---------- */
export function Chips<T extends string>({
  options,
  active,
  onChange,
}: {
  options: readonly T[];
  active: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="chips">
      {options.map((o) => (
        <button key={o} className={`chip ${o === active ? 'on' : ''}`} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

/* ---------- formatting helpers (mockup `stars()` / `money()`) ---------- */
export const stars = (r: number) =>
  '★'.repeat(Math.round(r || 0)) + '☆'.repeat(Math.max(0, 5 - Math.round(r || 0)));

export const money = (n: number | string) => {
  const value = typeof n === 'number' ? n : Number(n);
  if (!isFinite(value)) return String(n ?? '');
  return '₹' + value.toLocaleString('en-IN');
};

/* Deterministic decorative glyph + art class, so cards look varied
   the way the mockup does without needing new API fields. */
const GLYPHS = ['ॐ', '✦', '☸', '❂', '✸', '◉'];
export const glyphFor = (seed: string | number | undefined) => {
  const s = String(seed ?? '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return GLYPHS[h % GLYPHS.length];
};
export const artFor = (seed: string | number | undefined) => {
  const s = String(seed ?? '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 17 + s.charCodeAt(i)) >>> 0;
  return `art-${(h % 3) + 1}`;
};

export const TEMPLE_FALLBACK =
  'https://images.unsplash.com/photo-1565195161077-f5c5f61f9ea2?fm=jpg&q=80&w=1080';

export function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  if (e.currentTarget.src !== TEMPLE_FALLBACK) e.currentTarget.src = TEMPLE_FALLBACK;
}