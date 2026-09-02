import { useState, useEffect } from 'react';
import { PageShell } from '../components/PageShell';
import { SevaCard } from '../components/SevaCard';
import { Crumb, Tabs, stars, onImgError, TEMPLE_FALLBACK } from '../components/royale';
import { api } from '../api/client';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageViewer } from "../components/ImageViewer";
import { GalleryCoverflow } from "../components/GalleryCoverflow";
const tabs = ['Overview', 'Sevas', 'Special Puja', 'Gallery'] as const;
type Tab = (typeof tabs)[number];

/**
 * Temple details — mockup PAGES.temple.
 *
 * One unified experience: the same breadcrumb, `.banner` hero (with the
 * two rotating rings, deity tag, 40px title and meta row) and `.tabs`
 * strip stay mounted for every sub-page. Only the panel below the tabs
 * swaps, so Overview / Sevas / Special Puja / Gallery / Reviews all read
 * as one page rather than five separately designed screens.
 */
export function TempleDetail() {

  const navigate = useNavigate();
  const { templeId } = useParams();

  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [temple, setTemple] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const [sevas, setSevas] = useState<any[]>([]);
  const [sevasLoading, setSevasLoading] = useState(false);
  const [specialPujas, setSpecialPujas] = useState<any[]>([]);
  const [specialLoading, setSpecialLoading] = useState(false);

  useEffect(() => {
    if (!templeId) return;

    setLoading(true);
    api.get(`api/temples/${templeId}`)
      .then((response) => {
        const data = response.data;

        const mappedTemple = {
          id: data.id,
          name: data.name,
          city: data.location || "Unknown",
          image: data.profileImageUrl || TEMPLE_FALLBACK,
          rating: data.rating || 4.5,
          reviews: data.reviewCount || 0,
          deity: data.deity || "",
          timings: data.timings || "",
          phone: data.contactPhone,
          description: data.description,
          location: data.location,
          sevaName: data.title,
          price: data.basePrice,
          googleMapsUrl: data.googleMapsUrl,
          galleryImages: Array.isArray(data.galleryImageUrls) ? data.galleryImageUrls : [],
          latitude: data.latitude,
          longitude: data.longitude,
          openingHours: data.openingHours || '',
          dressCode: data.dressCode || '',
          reviewList: Array.isArray(data.reviews) ? data.reviews : [],
        };

        setTemple(mappedTemple);
      })
      .catch((err) => {
        console.error(err);
        alert(err?.response?.data?.message || 'Failed to load temple details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [templeId]);

  // Sevas for this temple (drives the Sevas tab)
  useEffect(() => {
    if (!templeId) return;
    setSevasLoading(true);
    api.get(`api/temples/${templeId}/sevas`)
      .then((response) => {
        const data = Array.isArray(response.data?.items) ? response.data.items : [];
        setSevas(data.map((item: any) => ({
          id: item.id,
          name: item.title,
          description: item.description,
          price: item.cost,
          duration: item.duration || '',
          category: item.category || 'Daily Seva',
          image: item.profileImageUrl,
          galleryImages: Array.isArray(item.galleryImageUrls) ? item.galleryImageUrls : [],
        })));
      })
      .catch((err) => console.error(err))
      .finally(() => setSevasLoading(false));
  }, [templeId]);

  // Special pujas for THIS temple — scoped the same way Sevas is scoped.
  // Previously this hit the global `api/special-pujas` endpoint with no
  // templeId filter, so the tab showed every temple's special pujas
  // instead of the current one's.
  useEffect(() => {
    if (!templeId) return;
    setSpecialLoading(true);
    api.get(`api/temples/${templeId}/special-pujas`)
      .then((response) => {
        const data = Array.isArray(response.data?.items)
          ? response.data.items
          : Array.isArray(response.data)
            ? response.data
            : [];
        setSpecialPujas(data.map((puja: any) => ({
          id: puja.id,
          name: puja.title,
          description: puja.description,
          price: puja.price || puja.cost || 0,
          duration: puja.duration || '',
          category: 'Special Seva',
          image: puja.profileImageUrl,
        })));
      })
      .catch((err) => console.error(err))
      .finally(() => setSpecialLoading(false));
  }, [templeId]);

  const gallery: string[] = temple?.galleryImages?.length
    ? temple.galleryImages
    : temple?.image
      ? [temple.image]
      : [];

  return (
    <PageShell>
      <Crumb
        parts={[
          { label: 'Home', to: '/home' },
          { label: 'Temples', to: '/temples' },
          { label: loading ? 'Loading…' : temple?.name || 'Temple' },
        ]}
      />

      {/* ===== Shared hero banner (identical on every sub-page) ===== */}
      <div
        className="banner"
        style={
          temple?.image
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(9,16,38,.2) 0%, rgba(9,16,38,.5) 55%, rgba(9,16,38,.93) 100%), url('${temple.image}')`,
              }
            : undefined
        }
      >
        <div className="ring" />
        <div className="ring two" />

        {temple?.deity && <span className="tag relative">{temple.deity}</span>}
        <h1>
          {loading ? (
            <span className="inline-block h-8 w-56 animate-pulse rounded bg-surface-2" />
          ) : (
            temple?.name
          )}
        </h1>
        {!loading && temple && (
          <div className="meta">
            {temple.city && <span>◉ {temple.city}</span>}
            <span className="text-gold-soft">
              {/* {stars(temple.rating)} {temple.rating} */}
              {/* {temple.reviews ? ` (${temple.reviews})` : ''} */}
            </span>
            {temple.timings && <span>◷ {temple.timings}</span>}
          </div>
        )}
      </div>

      {/* ===== Shared tab strip ===== */}
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {loading && (
        <div className="mt-6 space-y-4">
          <div className="card h-32 animate-pulse" />
          <div className="card h-40 animate-pulse" />
        </div>
      )}

      {/* ===== OVERVIEW ===== */}
      {!loading && temple && activeTab === 'Overview' && (
        <div className="split mt-6">
          <div className="card">
            <div className="mb-1.5 flex flex-wrap items-center gap-4">
              <div className="deity-portrait shimmer">
                <img src={temple.image} alt={temple.name} onError={onImgError} loading="lazy" />
              </div>
              <div>
                <h3 className="serif text-xl">About the Temple</h3>
                {temple.deity && <span className="pill mt-2 inline-block">{temple.deity}</span>}
              </div>
            </div>

            {temple.description && (
              <div className="mt-3 space-y-3 text-sm leading-[1.8] text-muted-foreground">
                {String(temple.description)
                  .split('\n')
                  .filter(Boolean)
                  .map((line: string, i: number) => (
                    <p key={i}>{line}</p>
                  ))}
              </div>
            )}

            <div className="divider" />

            {temple.openingHours && (
              <div className="row"><span>Opening hours</span><span>{temple.openingHours}</span></div>
            )}
            {temple.deity && (
              <div className="row"><span>Presiding deity</span><span>{temple.deity}</span></div>
            )}
            <div className="row">
              <span>Dress code</span>
              <span>{temple.dressCode || 'Traditional attire advised'}</span>
            </div>
            <div className="row"><span>Prasad dispatch</span><span>Pan-India, 2–4 days</span></div>
            {temple.phone && (
              <div className="row">
                <span>Contact</span>
                <a href={`tel:${temple.phone}`} className="text-gold-soft">{temple.phone}</a>
              </div>
            )}

            {/* Location + map (existing integration preserved) */}
            {(temple.location || temple.googleMapsUrl) && (
              <>
                <div className="divider" />
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="serif text-lg">Location</h3>
                  {temple.googleMapsUrl && (
                    <a
                      href={temple.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="whitespace-nowrap rounded-full border border-gold/40 px-3.5 py-1.5 text-xs font-medium text-gold-soft hover:bg-gold/10"
                    >
                      Open Maps →
                    </a>
                  )}
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{temple.location}</p>
                {temple.latitude && temple.longitude && (
                  <div className="relative overflow-hidden rounded-2xl border border-border">
                    <iframe
                      title={temple.name}
                      className="h-56 w-full border-0"
                      loading="lazy"
                      src={`https://www.google.com/maps?q=${parseFloat(
                        String(temple.latitude).replace(",", "")
                      )},${parseFloat(temple.longitude)}&z=17&output=embed`}
                    />
                    {temple.googleMapsUrl && (
                      <a
                        href={temple.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0"
                        aria-label="Open in Google Maps"
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="card sticky-col">
            <span className="tag">Today's Timings</span>
            {temple.timings ? (
              <div className="row"><span>Temple hours</span><span>{temple.timings}</span></div>
            ) : (
              <>
                <div className="row"><span>Suprabhata Seva</span><span>04:30 AM</span></div>
                <div className="row"><span>Abhishekam</span><span>06:00 AM</span></div>
                <div className="row"><span>Madhyahna Puja</span><span>12:30 PM</span></div>
                <div className="row"><span>Sandhya Aarti</span><span>06:45 PM</span></div>
              </>
            )}
            <button
              className="btn-primary mt-[18px] block w-full"
              onClick={() => setActiveTab('Sevas')}
            >
              Book Seva
            </button>
          </div>
        </div>
      )}

      {/* ===== SEVAS ===== */}
      {!loading && temple && activeTab === 'Sevas' && (
        <div className="list">
          {sevasLoading && <p className="py-8 text-center text-muted-foreground">Loading sevas...</p>}
          {!sevasLoading && sevas.length === 0 && (
            <div className="card py-10 text-center text-muted-foreground">No sevas available yet</div>
          )}
          {!sevasLoading &&
            sevas.map((seva) => (
              <SevaCard
                key={seva.id}
                {...seva}
                onClick={() =>
                  navigate(`/seva/${seva.id}/book`, {
                    state: { templeId },
                  })
                }
              />
            ))}
        </div>
      )}

      {/* ===== SPECIAL PUJA ===== */}
      {!loading && temple && activeTab === 'Special Puja' && (
        <div className="list">
          {specialLoading && <p className="py-8 text-center text-muted-foreground">Loading special pujas...</p>}
          {!specialLoading && specialPujas.length === 0 && (
            <div className="card py-10 text-center text-muted-foreground">
              No special pujas available yet
            </div>
          )}
          {!specialLoading &&
            specialPujas.map((puja) => (
              <SevaCard
                key={puja.id}
                {...puja}
                onClick={() =>
                  // Pass templeId along: GET /api/special-pujas/{id} doesn't
                  // return price/participants for Temple Special Pujas — that
                  // data only lives on GET /api/temples/{templeId}/special-pujas
                  // (as `cost`/`participants`). The booking page uses this to
                  // cross-reference and fill in what the detail endpoint lacks.
                  navigate(`/special-puja/${puja.id}/book`, {
                    state: { templeId },
                  })
                }
              />
            ))}
        </div>
      )}

      {/* ===== GALLERY ===== */}
      {/* {!loading && temple && activeTab === 'Gallery' && (
        gallery.length > 0 ? (
          <div className="gallery">
            {gallery.map((img: string, index: number) => (
              <button
                key={`${img}-${index}`}
                className="gph"
                onClick={() => setSelectedImage(index)}
                aria-label={`Open image ${index + 1}`}
              >
                <img src={img} alt={`${temple.name} ${index + 1}`} loading="lazy" onError={onImgError} />
              </button>
            ))}
          </div>
        ) : (
          <div className="card mt-6 py-10 text-center text-muted-foreground">
            No photographs yet
          </div>
        )
      )} */}

      {/* ===== GALLERY ===== */}
{!loading && temple && activeTab === 'Gallery' && (
  gallery.length > 0 ? (
    <div className="mt-6">
      <GalleryCoverflow
        items={gallery.map((img: string, index: number) => ({
          url: img,
          caption: `${temple.name} ${index + 1}`,
        }))}
        onOpen={(index) => setSelectedImage(index)}
      />
    </div>
  ) : (
    <div className="card mt-6 py-10 text-center text-muted-foreground">
      No photographs yet
    </div>
  )
)}

      {/* ===== REVIEWS ===== */}
      {/* {!loading && temple && activeTab === 'Reviews' && (
        <div className="mt-2">
          {temple.reviewList.length === 0 && (
            <div className="card mt-6 py-10 text-center text-muted-foreground">
              No reviews yet — be the first to share your experience.
            </div>
          )}
          {temple.reviewList.map((r: any, i: number) => (
            <div key={i} className="review">
              <div className="top">
                <b>{r.name || r.userName || 'Devotee'}</b>
                <span className="text-gold-soft">{stars(r.rating || 5)}</span>
              </div>
              {(r.date || r.createdAt) && (
                <div className="mt-1 text-[11.5px] text-gold-deep">
                  {new Date(r.date || r.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              )}
              <p>{r.comment || r.text || ''}</p>
            </div>
          ))}
        </div>
      )} */}

      {selectedImage !== null && (
        <ImageViewer
          images={gallery}
          selectedIndex={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </PageShell>
  );
}