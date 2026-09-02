import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

/**
 * First-run screen: instead of a generic feature-tour onboarding, we
 * greet the user with a few sacred shlokas — a calmer, more meaningful
 * first impression that fits a temple-booking app.
 */
const shlokas = [
  {
    om: "ॐ",
    heading: "Guru Shloka",
    lines: [
      "Gurur Brahma Gurur Vishnu",
      "Gurur Devo Maheshwarah",
      "Guru Saakshaat Para Brahma",
      "Tasmai Shree Gurave Namah",
    ],
    meaning: "Salutations to the Guru, who is Brahma, Vishnu and Maheshwara themselves.",
  },
  {
    om: "🕉",
    heading: "Ganesha Shloka",
    lines: [
      "Vakratunda Mahakaya",
      "Surya Koti Samaprabha",
      "Nirvighnam Kuru Me Deva",
      "Sarva-Karyeshu Sarvada",
    ],
    meaning: "O Lord of the curved trunk, radiant as a million suns, remove all obstacles from every endeavour.",
  },
  {
    om: "❁",
    heading: "Morning Shloka",
    lines: [
      "Karagre Vasate Lakshmi",
      "Karamadhye Saraswati",
      "Karamule Tu Govindah",
      "Prabhate Karadarshanam",
    ],
    meaning: "At the tip of the hand resides Lakshmi, at the centre Saraswati, at the base Govinda — beheld each morning.",
  },
  {
    om: "☼",
    heading: "Shanti Mantra",
    lines: [
      "Om Sarvesham Swastir Bhavatu",
      "Sarvesham Shantir Bhavatu",
      "Sarvesham Poornam Bhavatu",
      "Sarvesham Mangalam Bhavatu",
    ],
    meaning: "May there be well-being, peace, fullness and auspiciousness for all.",
  },
];

// Two short ritual clips used as the ambient background — we alternate
// between them based on the shloka of the day so the screen doesn't feel
// static, without ever showing more than one shloka at a time.
const backgroundVideos = [
  "/assets/Videos/homa-ritual.mp4",
  "/assets/Videos/sacred-fire-offering.mp4",
];

const AUTO_ADVANCE_DURATION = 10000;

/** Same shloka all day, changes the next day — never a mid-session carousel. */
function getShlokaOfTheDayIndex() {
  const startOfYear = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (Date.now() - startOfYear.getTime()) / 86400000
  );
  return dayOfYear % shlokas.length;
}

export function Onboarding() {
  const navigate = useNavigate();
  const [index] = useState(getShlokaOfTheDayIndex);

  const slide = shlokas[index];
  const video = backgroundVideos[index % backgroundVideos.length];

  useEffect(() => {
    const timer = setTimeout(() => navigate('/home'), AUTO_ADVANCE_DURATION);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col bg-background">
      {/* Ambient ritual footage as the backdrop */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        src={video}
      />
      {/* Dark gold-tinted overlay so the shloka text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/55 to-background/90" />
      <div className="absolute inset-0 bg-background/20" />

      {/* Skip */}
      <div className="relative z-10 flex justify-end px-6 pt-6">
        <button
          onClick={() => navigate('/home')}
          className="text-sm text-muted-foreground transition-colors hover:text-gold-soft"
        >
          Skip
        </button>
      </div>

      {/* Content — a single shloka, no sliding */}
      <div className="animate-fade-in relative z-10 flex flex-1 flex-col items-center justify-center px-8 text-center">
        <span className="glow-gold mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_28%,#EFCB84,#C0954D_58%,#9A7639_100%)] text-3xl text-[#12203F]">
          {slide.om}
        </span>

        <p className="mb-1 text-[11px] uppercase tracking-[0.32em] text-gold-soft">
          {slide.heading}
        </p>

        <div className="font-serif-alt mx-auto mb-6 max-w-md space-y-1.5">
          {slide.lines.map((line, i) => (
            <p
              key={i}
              className="text-[21px] italic leading-snug text-foreground sm:text-[24px]"
            >
              {line}
            </p>
          ))}
        </div>

        <p className="lede mx-auto max-w-sm text-center text-muted-foreground">
          {slide.meaning}
        </p>
      </div>

      {/* Progress + manual continue */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-8 pb-10">
        <div className="h-1 w-40 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-gold"
            style={{
              animation: `shloka-progress ${AUTO_ADVANCE_DURATION}ms linear forwards`,
            }}
          />
        </div>
        <button
          onClick={() => navigate('/home')}
          className="text-xs uppercase tracking-[0.24em] text-gold-soft transition-colors hover:text-gold"
        >
          Enter the Temple →
        </button>
      </div>

      <style>{`
        @keyframes shloka-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}