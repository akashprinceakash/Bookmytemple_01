import { useState, useEffect, useMemo } from 'react';
import { PageShell } from '../components/PageShell';
import { Reveal } from '../components/Reveal';
import { TempleCard } from '../components/TempleCard';
import { Crumb, SectionHead } from '../components/royale';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface TempleListProps {
  data?: any;
}

/**
 * All Temples — mockup PAGES.temples:
 * breadcrumb → "The Directory" tag + 44px page title + lede with the
 * search field on the right → deity chips → `.cards3` auto-fill grid of
 * `.gcard` photo cards with staggered reveal.
 */
export function TempleList({ data }: TempleListProps) {

  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [temples, setTemples] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const type = data?.type;

  const endpointMap: Record<string, string> = {
    special_darshan: 'api/temples/darshana',
    book_seva: 'api/temples',
  };

  const baseUrl = endpointMap[type] || 'api/temples';

  const url = `${baseUrl}?page=1&page_size=100`;

  useEffect(() => {
    setLoading(true);

    api.get(url)
      .then((response) => {
        const data = Array.isArray(response.data?.items) ? response.data.items : [];

        const mappedTemples = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          city: item.city || item.location || "Unknown",
          image: item.profileImageUrl || "https://images.unsplash.com/photo-1565195161077-f5c5f61f9ea2?fm=jpg&q=80&w=1080",
          // rating: item.rating || 4.5,
          // reviews: item.reviewCount || item.reviews || 0,
          deity: item.deity || "Unknown",
          distance: item.distance || "",
        }));

        setTemples(mappedTemples);
      })
      .catch((err) => {
        console.error(err);
        alert(err?.response?.data?.message || 'No Temples found');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Deity chips are derived from the data that actually came back, so the
  // filter row always reflects the live catalogue.
  const filters = useMemo(() => {
    const deities = Array.from(
      new Set(
        temples
          .map((t) => t.deity)
          .filter((d: string) => d && d !== 'Unknown')
      )
    );
    return ['All', ...deities];
  }, [temples]);

  const visibleTemples = useMemo(() => {
    const q = query.trim().toLowerCase();
    return temples.filter((t) => {
      const matchesFilter = activeFilter === 'All' || t.deity === activeFilter;
      const matchesQuery =
        !q ||
        [t.name, t.city, t.deity].some((v: string) => (v || '').toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    });
  }, [temples, activeFilter, query]);

  return (
    <PageShell>
      <Crumb parts={[{ label: 'Home', to: '/home' }, { label: 'All Temples' }]} />

      <SectionHead
        tag="The Directory"
        title="All Temples"
        lede="Living sanctums, each with its own rituals, timings and hereditary priesthood."
        right={
          <div className="field m-0 min-w-[240px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search temple, deity or city…"
              aria-label="Search temples"
            />
          </div>
        }
      />

      {filters.length > 1 && (
        <div className="chips">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`chip ${activeFilter === filter ? 'on' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      <div className="min-h-[300px]">
        {loading && (
          <div className="flex h-[240px] flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
            <p className="mt-3 text-muted-foreground">Loading temples...</p>
          </div>
        )}

        {!loading && visibleTemples.length === 0 && (
          <div className="flex h-[240px] items-center justify-center">
            <p className="text-muted-foreground">No temples found</p>
          </div>
        )}

        {!loading && visibleTemples.length > 0 && (
          <Reveal>
            <div className="cards3">
              {visibleTemples.map((temple, i) => (
                <div
                  key={temple.id}
                  className="stagger-item flex"
                  style={{ animationDelay: `${(i % 6) * 0.06}s` }}
                >
                  <TempleCard
                    {...temple}
                    onClick={() => navigate(`/temple/${temple.id}`)}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </PageShell>
  );
}
