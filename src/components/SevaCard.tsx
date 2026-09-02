import { useEffect, useState } from 'react';
import { glyphFor, money } from './royale';

interface SevaCardProps {
  id: string;
  name: string;
  price: number;
  duration: string;
  description?: string;
  category?: string;
  image?: string;
  galleryImages?: string[];
  onClick: () => void;
}

/**
 * Seva / offering row — mockup `.srow`:
 * 60px gold medallion · title + description + gold-dim duration line ·
 * right-aligned 17.5px Marcellus price above the gold "Book Now" pill.
 * Collapses to a 52px medallion with a full-width action row under 620px.
 *
 * The sign-in / complete-profile gating below is unchanged from before.
 */
export function SevaCard({
  id,
  name,
  price,
  duration,
  description,
  category,
  image,
  onClick,
}: SevaCardProps) {
  const [token, setToken] = useState<string | null>(null);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedProfileCompleted = localStorage.getItem('profileCompleted') === 'true';
    setProfileCompleted(storedProfileCompleted);
    setToken(token);
  }, []);

  const label = !token
    ? 'Sign in to Book'
    : !profileCompleted
      ? 'Complete Profile'
      : 'Book Now';

  const meta = [duration, category].filter(Boolean).join(' · ');

  return (
    <div className="srow shimmer">
      <div className="medallion">
        {image ? <img src={image} alt="" loading="lazy" /> : glyphFor(id || name)}
      </div>

      <div className="min-w-0">
        <h4>{name}</h4>
        {description && <p className="line-clamp-2">{description}</p>}
        {meta && <p className="text-gold-deep">{meta}</p>}
      </div>

      <div className="actions">
        <span className="price">{money(price)}</span>
        <button className="mini" onClick={onClick}>
          {label}
        </button>
      </div>
    </div>
  );
}
