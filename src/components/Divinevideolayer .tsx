interface DivineVideoLayerProps {
  src: string;
  opacity?: number;
}

/**
 * Optional ambient looping video layer (diya flame, incense smoke, rippling
 * water, etc). Muted + autoPlay + playsInline so it's allowed to autoplay
 * on mobile browsers. Render it as the first child of a `.rsection` or
 * `.cta-band`, same as <DivineBackdrop />, so the z-index rules in
 * index.css put it behind the real content.
 *
 * Point `src` at a short (10–20s), compressed (~1080p, crf ~28) mp4 loop
 * placed in `public/assets/video/`. Leave this component out of a section
 * entirely if you don't have footage yet — nothing else depends on it.
 */
export function DivineVideoLayer({ src, opacity = 0.16 }: DivineVideoLayerProps) {
  return (
    <video
      className="divine-video-bg"
      src={src}
      autoPlay
      muted
      loop
      playsInline
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}