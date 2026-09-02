import { useState, useEffect } from 'react';
import { PageShell } from '../components/PageShell';
import { SevaCard } from '../components/SevaCard';
import { Crumb, SectionHead } from '../components/royale';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface SevaListProps {
  templeId: string;
  asTab?: boolean;
}

/** Renders the mockup `.list` of `.srow` offering rows. */
function SevaListInner({ navigate, sevas, loading }: any) {
  return (
    <div className="list">
      {loading && (
        <p className="py-8 text-center text-muted-foreground">Loading sevas...</p>
      )}

      {!loading && sevas.length === 0 && (
        <div className="card py-10 text-center text-muted-foreground">No sevas found</div>
      )}

      {!loading && sevas.map((seva: any) => (
        <SevaCard
          key={seva.id}
          {...seva}
          onClick={() => navigate(`/seva/${seva.id}/book`)}
        />
      ))}
    </div>
  );
}

export function SevaList({ templeId, asTab = false }: SevaListProps) {

  const navigate = useNavigate();

  const [sevas, setSevas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!templeId) return;

    setLoading(true);

    api.get(`api/temples/${templeId}/sevas`)
      .then((response) => {
        const data = Array.isArray(response.data?.items) ? response.data.items : [];

        const mappedSevas = data.map((item: any) => ({
          id: item.id,
          name: item.title,
          description: item.description,
          price: item.cost,
          duration: item.duration || '',
          category: item.category || 'Daily Seva',
          image: item.profileImageUrl,
          galleryImages: Array.isArray(item.galleryImageUrls) ? item.galleryImageUrls : []
        }));

        setSevas(mappedSevas);
      })
      .catch((err) => {
        console.error(err);
        alert(err?.response?.data?.message || 'Failed to load sevas');
      })
      .finally(() => setLoading(false));
  }, [templeId]);

  if (asTab) {
    return <SevaListInner templeId={templeId} navigate={navigate} sevas={sevas} loading={loading} />;
  }

  return (
    <PageShell>
      <Crumb parts={[{ label: 'Home', to: '/home' }, { label: 'Puja & Seva' }]} />
      <SectionHead
        tag="Offerings"
        title="Choose Your Seva"
        lede="Every ritual below is performed in the sanctum by temple priests, with your name and gotra in the sankalpa."
      />
      <SevaListInner templeId={templeId} navigate={navigate} sevas={sevas} loading={loading} />
    </PageShell>
  );
}
