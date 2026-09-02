import { useEffect, useState } from "react";
import { api } from "../api/client";
import { PageShell } from '../components/PageShell';
import { useLocation } from 'react-router-dom';
import { Crumb, SectionHead } from '../components/royale';
import { GalleryCoverflow } from '../components/GalleryCoverflow';

export function Gallery() {

  const location = useLocation();

  const passedImages = (location.state as any)?.images;
  const selectedIndexFromState = (location.state as any)?.selectedIndex ?? null;
  const title = (location.state as any)?.title ?? "Gallery";

  const [images, setImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 5;

  const [allImages, setAllImages] = useState<any[]>([]);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    selectedIndexFromState
  );
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const closeViewer = () => setSelectedIndex(null);

  const nextImage = () => {
    setSelectedIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % images.length;
    });
  };

  const prevImage = () => {
    setSelectedIndex((prev) => {
      if (prev === null) return 0;
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const diff = touchStartX - e.changedTouches[0].clientX;

    if (diff > 50) nextImage();
    else if (diff < -50) prevImage();

    setTouchStartX(null);
  };

  const fetchImages = async (pageNumber: number) => {
    if (loading || (!hasMore && pageNumber !== 1)) return;

    setLoading(true);

    try {
      const res = await api.get(
        `api/media?usageType=gallery&page=${pageNumber}&page_size=5`
      );

      const data = Array.isArray(res.data) ? res.data : [];

      if (pageNumber === 1) {
        setImages(data);
      } else {
        setImages((prev) => [...prev, ...data]);
      }

      if (data.length < 5) {
        setHasMore(false);
      }

      setPage(pageNumber);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (passedImages) {
      const formatted = passedImages.map((url: string) => ({ url }));
      setAllImages(formatted);
      setImages(formatted.slice(0, PAGE_SIZE));
      setHasMore(formatted.length > PAGE_SIZE);
      return;
    }

    fetchImages(1);
  }, []);

  const loadMore = () => {
    if (passedImages) {
      const newCount = displayCount + PAGE_SIZE;

      setImages(allImages.slice(0, newCount));
      setDisplayCount(newCount);
      setHasMore(newCount < allImages.length);

      return;
    }

    fetchImages(page + 1);
  };

  return (
    <PageShell>
      <Crumb parts={[{ label: 'Home', to: '/home' }, { label: title }]} />

      <SectionHead
        tag="Moments"
        title={title}
        lede="Photographs from the sanctum — aartis, abhishekams and festival mornings at our partner temples."
      />

      {/* Featured 3D cover-flow slider */}
      <GalleryCoverflow
        items={images.map((g: any) => ({ url: g.url, caption: g.caption }))}
        onOpen={(i) => setSelectedIndex(i)}
      />

      {images.length === 0 && !loading && (
        <p className="mt-6 text-center text-sm text-muted-foreground">No images yet.</p>
      )}

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn-ghost"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95"
          onClick={closeViewer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeViewer();
            }}
            className="absolute top-4 right-4 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white"
          >
            ×
          </button>

          <img
            src={images[selectedIndex].url}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain px-6"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-3xl text-white"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-3xl text-white"
          >
            ›
          </button>

          <div className="absolute bottom-5 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </PageShell>
  );
}
