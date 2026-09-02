import { artFor, glyphFor, onImgError, stars } from './royale';

interface TempleCardProps {
  id: string;
  name: string;
  city: string;
  image: string;
  rating: number;
  reviews?: number;
  deity?: string;
  distance?: string;
  onClick: () => void;
}

/**
 * Temple listing card — mockup `.gcard`:
 * 152px photo band with the deity glyph badge and gradient scrim, then a
 * 16px body with a 16px Marcellus title, the ◉ location line and the gold
 * star/rating row. Lifts 4px and turns its border gold on hover.
 */
export function TempleCard({
  id,
  name,
  city,
  image,
  rating,
  reviews,
  deity,
  distance,
  onClick,
}: TempleCardProps) {
  return (
    <button type="button" onClick={onClick} className="gcard shimmer w-full flex-1">
      <div className={`art ${artFor(id || name)}`}>
        <img src={image} alt={name} loading="lazy" onError={onImgError} />
        <span className="glyph-badge">{glyphFor(id || name)}</span>
        {distance && (
          <span className="absolute left-3 top-3 z-[2] rounded-full border border-gold/40 bg-background/80 px-2.5 py-1 text-[11px] text-gold-soft backdrop-blur-sm">
            {distance}
          </span>
        )}
      </div>

      <div className="body">
        <h4>{name}</h4>
        <p>◉ {city}</p>
        {deity && deity !== 'Unknown' && <p className="text-gold-deep">{deity}</p>}
        {/* <p className="mt-auto pt-2 text-gold-soft">
          {stars(rating)}{' '}
          <span className="text-muted-foreground">
            {rating}
            {typeof reviews === 'number' && reviews > 0 ? ` · ${reviews} reviews` : ''}
          </span>
        </p> */}
      </div>
    </button>
  );
}

/**
 * Homepage "Temples of the season" bento tile — mockup `.tcard`.
 * `size` maps to the mockup's b-xl / b-md / b-sm grid spans so the first
 * temple fills the tall 440px hero tile exactly as in the reference.
 */
export function TempleBentoCard({
  id,
  name,
  city,
  image,
  rating,
  reviews,
  size = 'b-sm',
  onClick,
}: {
  id: string;
  name: string;
  city: string;
  image: string;
  rating: number;
  reviews?: number;
  size?: 'b-xl' | 'b-md' | 'b-sm';
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={`tcard shimmer ${size} ${artFor(id || name)}`}>
      <div className="media">
        <img src={image} alt={name} loading="lazy" onError={onImgError} />
      </div>
      <span className="glyph">{glyphFor(id || name)}</span>
      <div className="inner">
        <h3>{name}</h3>
        <div className="loc">{city}</div>
        <div className="rating">
          {stars(rating)}{' '}
          <span className="text-muted-foreground">
            {rating}
            {typeof reviews === 'number' && reviews > 0 ? ` · ${reviews}` : ''}
          </span>
        </div>
      </div>
    </button>
  );
}
