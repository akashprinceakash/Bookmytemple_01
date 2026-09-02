import { useState } from "react";

type Props = {
  images: string[];
  selectedIndex: number;
  onClose: () => void;
};

export function ImageViewer({
  images,
  selectedIndex,
  onClose,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const nextImage = () =>
    setCurrentIndex((i) => (i + 1) % images.length);

  const prevImage = () =>
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStartX(e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const diff = touchStartX - e.changedTouches[0].clientX;

    if (diff > 50) nextImage();
    else if (diff < -50) prevImage();

    setTouchStartX(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center"
      style={{ zIndex: 100 }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white text-2xl"
      >
        ×
      </button>

      <img
        src={images[currentIndex]}
        className="max-w-full max-h-full object-contain px-6"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-3 text-white text-3xl bg-black/30 w-10 h-10 rounded-full"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 text-white text-3xl bg-black/30 w-10 h-10 rounded-full"
          >
            ›
          </button>
        </>
      )}

      {/* <div className="absolute bottom-5 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div> */}
    </div>
  );
}