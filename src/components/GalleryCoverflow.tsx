import { useCallback, useEffect, useRef, useState } from 'react';

export interface GalleryItem {
  url: string;
  caption?: string;
}

/**
 * Divine Gallery — 3D cover-flow slider.
 *
 * One large sharp image holds the centre; the neighbouring images sit
 * behind it, rotated on the Y axis, pushed back in Z, scaled down and
 * faded, so the strip reads as a continuous 3D carousel.
 *
 * Built with plain React state + CSS 3D transforms — no carousel
 * dependency. Supports prev/next, click-a-side-card-to-focus, pointer
 * drag, touch swipe, keyboard arrows, autoplay (pauses on interaction)
 * and infinite looping in both directions.
 *
 * Images are never cropped: the sharp image is `object-fit: contain`
 * over a blurred `cover` copy of itself, so portrait deity photos and
 * wide temple shots both sit correctly in the same card.
 */
export function GalleryCoverflow({
  items,
  onOpen,
  autoPlay = true,
  interval = 4500,
}: {
  items: GalleryItem[];
  onOpen?: (index: number) => void;
  autoPlay?: boolean;
  interval?: number;
}) {
  const count = items.length;
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [paused, setPaused] = useState(false);

  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  /** Shortest signed distance from `i` to the active card, wrapping both ways. */
  const offsetOf = useCallback(
    (i: number) => {
      if (count === 0) return 0;
      let d = i - active;
      if (d > count / 2) d -= count;
      if (d < -count / 2) d += count;
      return d;
    },
    [active, count]
  );

  const go = useCallback(
    (dir: number) => setActive((a) => (a + dir + count) % count),
    [count]
  );

  /* ---------- autoplay ---------- */
  useEffect(() => {
    if (!autoPlay || paused || count < 2) return;
    const id = setInterval(() => go(1), interval);
    return () => clearInterval(id);
  }, [autoPlay, paused, interval, go, count]);

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [go]);

  /* ---------- pointer drag / touch swipe ---------- */
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    dragged.current = false;
    setPaused(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    if (Math.abs(dx) > 4) dragged.current = true;
    // Resistance so the strip feels weighted rather than loose.
    setDragX(Math.max(-160, Math.min(160, dx * 0.55)));
  };

  const endDrag = () => {
    if (dragStart.current === null) return;
    if (dragX > 45) go(-1);
    else if (dragX < -45) go(1);
    dragStart.current = null;
    setDragX(0);
    setPaused(false);
  };

  if (count === 0) return null;

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      className="coverflow"
      role="region"
      aria-roledescription="carousel"
      aria-label="Temple gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        endDrag();
      }}
    >
      <div
        className="cf-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {items.map((item, i) => {
          const off = offsetOf(i);
          const abs = Math.abs(off);

          // Only the active card and two neighbours each side are mounted.
          if (abs > 2) return null;

          const isActive = off === 0;
          const dragNudge = isActive ? dragX : dragX * 0.4;

          const style: React.CSSProperties = {
            transform: [
              `translate(-50%, -50%)`,
              `translateX(calc(${off * 46}% + ${dragNudge}px))`,
              `translateZ(${-abs * 190}px)`,
              `rotateY(${off * -26}deg)`,
              `scale(${1 - abs * 0.12})`,
            ].join(' '),
            opacity: abs === 0 ? 1 : abs === 1 ? 0.72 : 0.32,
            zIndex: 20 - abs,
            filter: isActive ? 'none' : `blur(${abs * 1.2}px)`,
            transition: dragStart.current !== null
              ? 'none'
              : 'transform .75s cubic-bezier(.22,.65,.25,1), opacity .6s ease, filter .6s ease',
          };

          return (
            <button
              key={`${item.url}-${i}`}
              className={`cf-card ${isActive ? 'is-active' : ''}`}
              style={style}
              tabIndex={isActive ? 0 : -1}
              aria-hidden={!isActive}
              aria-label={isActive ? 'Open image' : `Go to image ${i + 1}`}
              onClick={() => {
                if (dragged.current) return; // ignore the click that ends a drag
                if (isActive) onOpen?.(i);
                else setActive(i);
              }}
            >
              {/* blurred backdrop keeps the frame filled without cropping */}
              <span
                className="cf-blur"
                style={{ backgroundImage: `url(${item.url})` }}
                aria-hidden="true"
              />
              <img src={item.url} alt={item.caption || ''} loading="lazy" draggable={false} />
              <span className="cf-sheen" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <button className="cf-nav prev" onClick={() => go(-1)} aria-label="Previous image">
            ‹
          </button>
          <button className="cf-nav next" onClick={() => go(1)} aria-label="Next image">
            ›
          </button>

          <div className="cf-dots" role="tablist">
            {items.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                aria-label={`Go to image ${i + 1}`}
                className={`cf-dot ${i === active ? 'on' : ''}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
