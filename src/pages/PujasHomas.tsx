import { useState, useEffect, useMemo } from 'react';
import { PageShell } from '../components/PageShell';
import { Reveal } from '../components/Reveal';
import { Crumb, SectionHead, money, glyphFor } from '../components/royale';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

/**
 * Puja & Seva — mockup PAGES.seva.
 *
 * "Offerings" header + lede → category `.chips` → `.list` of `.srow`
 * offering rows (medallion · name · description · duration line · price ·
 * Book Now pill), then the "What's Included" card. Data fetching and the
 * special-puja booking route are unchanged.
 */
export function PujasHomas() {

  const navigate = useNavigate();

  const [pujasHomas, setPujasHomas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  const handleBookNow = (pujaId: string) => {
    navigate(`/special-puja/${pujaId}/book`);
  };

  useEffect(() => {
    setLoading(true);

    api.get(`api/special-pujas`)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];

        const mapped = data.map((puja: any) => ({
          id: puja.id,
          name: puja.title,
          description: puja.description,
          duration: puja.duration || '',
          price: puja.price || '',
          image: puja.profileImageUrl,
          category: puja.category || 'Special',
          benefits: puja.benefits || []
        }));

        setPujasHomas(mapped);
      })
      .catch((err) => {
        console.error(err);
        alert(
          err?.response?.data?.message ||
          'Failed to load pujas & homas'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(pujasHomas.map((p) => p.category).filter(Boolean)));
    return ['All', ...cats];
  }, [pujasHomas]);

  const visible = useMemo(
    () => pujasHomas.filter((p) => filter === 'All' || p.category === filter),
    [pujasHomas, filter]
  );

  return (
    <PageShell>
      <Crumb parts={[{ label: 'Home', to: '/home' }, { label: 'Special Pujas' }]} />

      <SectionHead
        tag="Offerings"
        title="Special Pujas"
        lede="Every ritual below is performed in the sanctum by temple priests, with your name and gotra in the sankalpa."
      />

      {categories.length > 1 && (
        <div className="chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${filter === c ? 'on' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="py-10 text-center text-muted-foreground">Loading pujas...</p>}

      {!loading && visible.length === 0 && (
        <div className="card mt-6 py-12 text-center text-muted-foreground">
          No pujas found
        </div>
      )}

      {!loading && visible.length > 0 && (
        <Reveal>
          <div className="list">
            {visible.map((puja, i) => (
              <div
                key={puja.id}
                className="srow shimmer stagger-item"
                style={{ animationDelay: `${(i % 6) * 0.06}s` }}
              >
                <div className="medallion">
                  {puja.image ? (
                    <img src={puja.image} alt="" loading="lazy" />
                  ) : (
                    glyphFor(puja.id || puja.name)
                  )}
                </div>

                <div className="min-w-0">
                  <h4>{puja.name}</h4>
                  {puja.description && (
                    <p className="line-clamp-2">
                      {String(puja.description).split('\n').filter(Boolean)[0]}
                    </p>
                  )}
                  <p className="text-gold-deep">
                    {[puja.duration, puja.category && `${puja.category} Seva`]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  {puja.benefits.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {puja.benefits.slice(0, 3).map((b: string, idx: number) => (
                        <span key={idx} className="pill">{b}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="actions">
                  <span className="price">
                    {typeof puja.price === 'number' ? money(puja.price) : puja.price}
                  </span>
                  <button className="mini" onClick={() => handleBookNow(puja.id)}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      <div className="card mt-10">
        <span className="tag">What's Included</span>
        <div className="row"><span>Ritual</span><span>Performed by experienced temple priests</span></div>
        <div className="row"><span>Samagri</span><span>All puja materials and sacred items included</span></div>
        <div className="row"><span>Prasadam</span><span>Delivered to your home, 2–4 days</span></div>
        <div className="row"><span>Proof</span><span>Sankalpa video and temple receipt</span></div>
      </div>
    </PageShell>
  );
}
