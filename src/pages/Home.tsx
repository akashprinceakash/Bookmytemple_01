// import { PageShell } from "../components/PageShell";
// import { Reveal } from "../components/Reveal";
// import { TempleBentoCard } from "../components/TempleCard";
// import { GalleryCoverflow } from "../components/GalleryCoverflow";
// import { useEffect, useMemo, useRef, useState } from 'react';
// import { api } from '../api/client';
// import { useNavigate } from "react-router-dom";

// /* ─────────────────────────────────────────────────────────────
//  * QUICK SERVICE THUMBNAILS
//  * To swap in new artwork, drop the files into
//  *   public/assets/small/        (and mirror to src/public/assets/small/)
//  * then change only the six paths below — nothing else needs editing.
//  * NOTE: filenames are case-sensitive on Linux hosting/CDNs, so the
//  * string here must match the file on disk exactly.
//  * ───────────────────────────────────────────────────────────── */
// const BookSevaImg = '/assets/small/BookSeva.webp';
// const BookClasses = '/assets/small/BookClasses.webp';
// const BookPandith = '/assets/small/BookPandith.webp';
// const SpecialDarshan = '/assets/small/SpecialDarshan.webp';
// const BookSpecialPooja = '/assets/small/BookSpecialPooja.webp';
// const ecommerce = '/assets/small/ecommerce.webp';

// const Shiva = '/assets/small/Shiva.webp';
// const Subramanya = '/assets/small/Subramanya.webp';
// const Ganesha = '/assets/small/Ganesha.webp';
// const Vishnu = '/assets/small/Vishnu.webp';
// const Chamundi = '/assets/small/Chamundi.webp';
// const Anjaneya = '/assets/small/Anjaneya.webp';
// const Suryadeva = '/assets/small/Suryadeva.webp';
// const ShaniMahatma = '/assets/small/ShaniMahatma.webp'

// // Every file in /assets/hero is a full-bleed 16:9 banner. They are all
// // rendered exactly like the Shiva reference — cover-sized across the whole
// // hero container, never shrunk into a small centred box.
// const HeroShiva = '/assets/hero/shiva.webp';
// const HeroSubramanya = '/assets/hero/subramanya.webp';
// const HeroGanesha = '/assets/hero/ganesha.webp';
// const HeroVishnu = '/assets/hero/vishnu.webp';
// const HeroChamundi = '/assets/hero/chamundi.webp';
// const HeroAnjaneya = '/assets/hero/anjaneya.webp';
// const HeroSuryadeva = '/assets/hero/suryadeva.webp';

// const heroDeities = [
//   { day: 'Monday', name: 'Lord Shiva', image: HeroShiva },
//   { day: 'Tuesday', name: 'Lord Subramanya', image: HeroSubramanya },
//   { day: 'Wednesday', name: 'Lord Ganesha', image: HeroGanesha },
//   { day: 'Thursday', name: 'Lord Vishnu', image: HeroVishnu },
//   { day: 'Friday', name: 'Goddess Chamundi', image: HeroChamundi },
//   { day: 'Saturday', name: 'Lord Anjaneya', image: HeroAnjaneya },
//   { day: 'Sunday', name: 'Surya Deva', image: HeroSuryadeva },
// ];

// const heroStats = [
//   { num: '120+', label: 'Temples' },
//   { num: '48k', label: 'Sevas Offered' },
//   { num: '4.9', label: 'Devotee Rating' },
//   { num: '100%', label: 'Prasad Delivered' },
// ];

// // Mockup QUICK_SERVICES — photo card, glyph medallion, blurb, "Explore →"
// const quickServices = [
//   {
//     title: 'Book Seva', icon: '✦', img: BookSevaImg, to: '/temples',
//     desc: "Reserve a daily ritual — abhishekam, archana or deepa aradhana — performed in your name by the temple's own hereditary priests.",
//   },
//   {
//     title: 'Book Classes', icon: 'ॐ', img: BookClasses, to: '/classes',
//     desc: 'Join guided sessions in Bhagavad Gita study, Vedic chanting and temple-style meditation, taught by resident acharyas.',
//   },
//   {
//     title: 'Special Pujas', icon: '✸', img: BookSpecialPooja, to: '/pujas-homas',
//     desc: 'Commission a homam, kalyanotsavam or vrat katha for occasions that call for a deeper, personalised offering.',
//   },
//   {
//     title: 'Special Darshan', icon: '❂', img: SpecialDarshan, to: null,
//     desc: 'Skip the general queue with an escorted VIP, Suvarna or night sighting darshan at the temple of your choice.',
//   },
//   {
//     title: 'Book Pandit', icon: '◉', img: BookPandith, to: null,
//     desc: 'Invite a trained priest to perform ceremonies at your home, with all samagri arranged for you.',
//   },
//   {
//     title: 'Puja Samagri', icon: '◇', img: ecommerce, to: null,
//     desc: 'Order lamps, kumkum, tulsi and complete ritual kits, delivered ready for the muhurta.',
//   },
// ];

// // Mockup "From sankalpa to prasad" flow
// const flowSteps = [
//   { n: 'i.', h: 'Choose the sanctum', p: 'Browse temples by deity, city or the festival that calls you.' },
//   { n: 'ii.', h: 'Offer the sankalpa', p: 'Give your name, gotra and nakshatra — the priest chants it for you.' },
//   { n: 'iii.', h: 'Confirm and pay', p: 'UPI, cards or net banking, secured end to end.' },
//   { n: 'iv.', h: 'Receive the grace', p: 'Sankalpa video, temple receipt and prasad shipped home.' },
// ];

// export function Home() {

//   const navigate = useNavigate();
//   const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const [galleryImages, setGalleryImages] = useState<any[]>([]);
//   const [highlightIndex, setHighlightIndex] = useState(0);

//   const [featuredTemples, setFeaturedTemples] = useState<any[]>([]);
//   const [featuredLoading, setFeaturedLoading] = useState(false);

//   const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
//   const [touchStartX, setTouchStartX] = useState<number | null>(null);

//   const closeViewer = () => setSelectedImageIndex(null);

//   const [banners, setBanners] = useState<any[]>([]);
//   const [currentBanner, setCurrentBanner] = useState(0);

//   const fetchBanners = async () => {
//     try {
//       const response = await api.get("api/media?usageType=banner&page=1&page_size=100");
//       setBanners(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("Banner fetch failed", error);
//     }
//   };

//   const fetchFeaturedTemples = async () => {
//     setFeaturedLoading(true);
//     try {
//       const response = await api.get('api/temples?page=1&page_size=8');
//       const data = Array.isArray(response.data?.items) ? response.data.items : [];
//       const mapped = data.map((item: any) => ({
//         id: item.id,
//         name: item.name,
//         city: item.city || item.location || 'Unknown',
//         image: item.profileImageUrl || 'https://images.unsplash.com/photo-1565195161077-f5c5f61f9ea2?fm=jpg&q=80&w=1080',
//         rating: item.rating || 4.5,
//         reviews: item.reviewCount || item.reviews || 0,
//       }));
//       setFeaturedTemples(mapped);
//     } catch (error) {
//       console.error('Featured temples fetch failed', error);
//     } finally {
//       setFeaturedLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (banners.length === 0) return;
//     const interval = setInterval(() => {
//       setCurrentBanner((prev) =>
//         prev === banners.length - 1 ? 0 : prev + 1
//       );
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [banners]);

//   const nextImage = () => {
//     setSelectedImageIndex((prev) => {
//       if (prev === null) return 0;
//       return (prev + 1) % galleryImages.length;
//     });
//   };

//   const prevImage = () => {
//     setSelectedImageIndex((prev) => {
//       if (prev === null) return 0;
//       return prev === 0 ? galleryImages.length - 1 : prev - 1;
//     });
//   };

//   const handleTouchStart = (e: React.TouchEvent) => {
//     setTouchStartX(e.touches[0].clientX);
//   };

//   const handleTouchEnd = (e: React.TouchEvent) => {
//     if (touchStartX === null) return;

//     const endX = e.changedTouches[0].clientX;
//     const diff = touchStartX - endX;

//     if (diff > 50) {
//       nextImage(); // swipe left
//     } else if (diff < -50) {
//       prevImage(); // swipe right
//     }

//     setTouchStartX(null);
//   };

//   useEffect(() => {
//     fetchGalleryImages();
//     fetchBanners();
//     fetchFeaturedTemples();
//   }, []);

//   const nextBanner = () => {
//     setCurrentBanner((prev) =>
//       prev === banners.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevBanner = () => {
//     setCurrentBanner((prev) =>
//       prev === 0 ? banners.length - 1 : prev - 1
//     );
//   };

//   const onBannerImageClick = (selectedBannerImage: any) => {
//     if (selectedBannerImage.redirectType == 'SPECIAL_PUJA') {
//       navigate(`/special-puja/${selectedBannerImage.redirectId}/book`)
//     } else if (selectedBannerImage.redirectType == 'CLASS') {
//       navigate('/classes');
//     }
//   }

//   const fetchGalleryImages = async () => {
//     try {
//       const response = await api.get(`api/media?usageType=gallery&page=1&page_size=12`);
//       const data = Array.isArray(response.data) ? response.data : [];
//       setGalleryImages(data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const [previewHeroDay, setPreviewHeroDay] = useState<string | null>(null);
//   const [pinnedHeroDay, setPinnedHeroDay] = useState<string | null>(null);
//   const heroTouchStartX = useRef<number | null>(null);

//   const sparkles = useMemo(() => Array.from({ length: 14 }).map(() => ({
//     top: (Math.random() * 70 + 4).toFixed(1),
//     left: (Math.random() * 96 + 2).toFixed(1),
//     size: (Math.random() * 2.2 + 1.4).toFixed(1),
//     dur: (Math.random() * 3 + 2.5).toFixed(1),
//     delay: (Math.random() * 5).toFixed(1),
//   })), []);

//   const embers = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
//     left: i % 2 === 0 ? (Math.random() * 10 + 2).toFixed(1) : (Math.random() * 10 + 86).toFixed(1),
//     size: (Math.random() * 3 + 2.5).toFixed(1),
//     dur: (Math.random() * 6 + 9).toFixed(1),
//     delay: (Math.random() * 10).toFixed(1),
//     drift: (Math.random() * 40 - 20).toFixed(0),
//   })), []);

//   const godsByDay: Record<string, string[]> = {
//     Monday: ["Shiva"],
//     Tuesday: ["Subramanya", "Anjaneya"],
//     Wednesday: ["Ganesha"],
//     Thursday: ["Vishnu"],
//     Friday: ["Goddess"],
//     Saturday: ["Anjaneya", "Shani Mahathma"],
//     Sunday: ["Suryadeva"],
//   };

//   const gods = [
//     { name: "Shiva", image: Shiva, day: "Monday", role: "The Auspicious One" },
//     { name: "Subramanya", image: Subramanya, day: "Tuesday", role: "Commander of the Devas" },
//     { name: "Ganesha", image: Ganesha, day: "Wednesday", role: "Remover of Obstacles" },
//     { name: "Vishnu", image: Vishnu, day: "Thursday", role: "The Preserver" },
//     { name: "Goddess", image: Chamundi, day: "Friday", role: "The Divine Mother" },
//     { name: "Anjaneya", image: Anjaneya, day: "Saturday", role: "The Devoted One" },
//     { name: "Suryadeva", image: Suryadeva, day: "Sunday", role: "Giver of Light" },
//     { name: "Shani Mahathma", image: ShaniMahatma, day: "Saturday", role: "Lord of Karma" },
//   ];

//   const weekDays = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];
//   const today = new Date().toLocaleDateString("en-US", {
//     weekday: "long",
//   });

//   const todayGods = godsByDay[today] || [];

//   useEffect(() => {
//     if (todayGods.length <= 1) return;

//     const interval = setInterval(() => {
//       setHighlightIndex((prev) => (prev + 1) % todayGods.length);
//     }, 2500);

//     return () => clearInterval(interval);
//   }, [todayGods]);
//   const activeGodName = todayGods[highlightIndex] || todayGods[0];

//   useEffect(() => {
//     if (dayRefs.current[today]) {
//       dayRefs.current[today]?.scrollIntoView({
//         behavior: "smooth",
//         inline: "center",
//         block: "nearest",
//       });
//     }
//   }, [today]);

//   const activeHeroDay = previewHeroDay ?? pinnedHeroDay ?? today;
//   const activeHeroDeity = heroDeities.find((d) => d.day === activeHeroDay) ?? heroDeities[0];

//   const cycleHeroDay = (dir: number) => {
//     const idx = heroDeities.findIndex((d) => d.day === activeHeroDay);
//     const nextIdx = (idx + dir + heroDeities.length) % heroDeities.length;
//     setPinnedHeroDay(heroDeities[nextIdx].day);
//   };

//   const handleHeroTouchStart = (e: React.TouchEvent) => {
//     heroTouchStartX.current = e.touches[0].clientX;
//   };

//   const handleHeroTouchEnd = (e: React.TouchEvent) => {
//     if (heroTouchStartX.current === null) return;
//     const diff = heroTouchStartX.current - e.changedTouches[0].clientX;
//     if (diff > 40) cycleHeroDay(1);
//     else if (diff < -40) cycleHeroDay(-1);
//     heroTouchStartX.current = null;
//   };

//   // Bento sizing from the mockup: first tile is the tall b-xl hero,
//   // second spans two columns, the rest are b-sm.
//   const bentoSize = (i: number): 'b-xl' | 'b-md' | 'b-sm' =>
//     i === 0 ? 'b-xl' : i === 1 ? 'b-md' : 'b-sm';

//   return (
//     <PageShell bare>
//       {/* ============ HERO ============
//           All deity banners fill the hero exactly like the Shiva reference. */}
//       <section
//         className="hero hero-portal border-b border-border"
//         onTouchStart={handleHeroTouchStart}
//         onTouchEnd={handleHeroTouchEnd}
//       >
//         {heroDeities.map((d) => (
//           <div
//             key={d.day}
//             className={`hero-bg ${d.day === activeHeroDay ? 'is-active' : ''}`}
//             style={{ backgroundImage: `url(${d.image})` }}
//           />
//         ))}
//         <div className="hero-overlay" />
//         <div className="hero-sparkles">
//           {sparkles.map((s, i) => (
//             <span
//               key={i}
//               className="spark"
//               style={{ top: `${s.top}%`, left: `${s.left}%`, width: `${s.size}px`, height: `${s.size}px`, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
//             />
//           ))}
//         </div>
//         <div className="hero-embers">
//           {embers.map((e, i) => (
//             <span
//               key={i}
//               className="ember"
//               style={{ left: `${e.left}%`, width: `${e.size}px`, height: `${e.size}px`, animationDuration: `${e.dur}s`, animationDelay: `${e.delay}s`, ['--drift' as any]: `${e.drift}px` }}
//             />
//           ))}
//         </div>

//         <div className="hero-copy">
//           <span className="eyebrow">A Sacred Digital Sanctum</span>
//           <h1>
//             Divine Seva,
//             <br />
//             <em>Divine Blessings</em>
//           </h1>
//           <p>
//             Offer abhishekam, archana and alankara at India's most revered temples — booked in a
//             breath, performed by hereditary priests, proven with prasad at your door.
//           </p>

//           <div className="hero-actions">
//             <button className="btn-primary shimmer glow-gold" onClick={() => navigate('/temples')}>
//               Explore Temples
//             </button>
//             <button className="btn-ghost" onClick={() => navigate('/pujas-homas')}>
//               Special Pujas
//             </button>
//           </div>

//           <div className="stat-strip" style={{marginTop:'5rem'}}>
//             {/* {heroStats.map((s) => (
//               <div key={s.label}>
//                 <div className="num">{s.num}</div>
//                 <div className="lbl">{s.label}</div>
//               </div>
//             ))} */}
//           </div>
//         </div>

//         {/* <p className="relative z-10 mt-6 font-serif-alt text-[21px] italic text-gold-soft">
//           {activeHeroDeity.name} — today's blessing
//         </p> */}
//       </section>

//       {/* ===== Everything below the hero sits on the animated Divine Glow
//              backdrop (the hero has its own deity artwork, so it is
//              deliberately excluded). ===== */}
//       <div className="divine-glow">
//         <div className="divine-glow-wash" aria-hidden="true" />

//       {/* ============ DEITIES OF THE SANCTUM ============ */}
//       <Reveal>
//         <section className="rsection">
//           <div className="section-head">
//             <div>
//               <span className="tag">Divine Blessings</span>
//               <h2 className="sec">Deities of the sanctum</h2>
//             </div>
//             <p className="max-w-[340px] text-sm text-muted-foreground">
//               The forms devotees turn to most often — {today}'s blessing is highlighted.
//             </p>
//           </div>

//           <div className="deity-strip no-scrollbar">
//             {weekDays.map((day) => {
//               const godName = godsByDay[day]?.[0];
//               const god = gods.find((g) => g.name === godName);
//               if (!god) return null;
//               const isActive = day === activeHeroDay;
//               return (
//                 <button
//                   key={day}
//                   ref={(el) => { dayRefs.current[day] = el as any; }}
//                   onClick={() => setPinnedHeroDay(day)}
//                   onMouseEnter={() => setPreviewHeroDay(day)}
//                   onMouseLeave={() => setPreviewHeroDay(null)}
//                   className={`deity-chip ${isActive ? 'on' : ''}`}
//                   style={{padding:'3%'}}
//                 >
//                   <div className="ring shimmer">
//                     <img src={god.image} alt={god.name} loading="lazy" />
//                   </div>
//                   <div className="dname">{god.name}</div>
//                   <div className="drole">{day === today ? "Today's blessing" : day}</div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* Today's divine highlight */}
//           {gods
//             .filter((g) => activeGodName === g.name)
//             .map((god) => (
//               <div key={god.name} className="card shimmer mt-8 flex flex-wrap items-center gap-5">
//                 <div className="deity-portrait">
//                   <img src={god.image} alt={god.name} />
//                 </div>
//                 <div className="min-w-[200px] flex-1">
//                   <span className="tag">Today · {today}</span>
//                   <h3 className="serif text-[22px] text-gold-soft">{god.name}</h3>
//                   <p className="mt-1.5 text-sm text-muted-foreground">
//                     {god.role} — offer a seva today and receive the sankalpa in your name.
//                   </p>
//                 </div>
//                 <button className="btn-ghost" onClick={() => navigate('/temples')}>
//                   Offer a Seva
//                 </button>
//               </div>
//             ))}
//         </section>
//       </Reveal>

//       {/* ============ PROMOTIONAL BANNERS (API driven) ============ */}
//       {banners.length > 0 && (
//         <Reveal>
//           <section className="rsection pt-0">
//             <div
//               className="promo-banner group relative w-full rounded-[26px] border border-border bg-surface shadow-panel"
//               style={{ aspectRatio: "416 / 186", maxHeight: "50vh" }}
//             >
//               {/* blurred copy fills the frame so the creative itself is
//                   never cropped, whatever aspect ratio it was authored at */}
//               <span
//                 className="promo-blur"
//                 style={{ backgroundImage: `url(${banners[currentBanner]?.url || ""})` }}
//                 aria-hidden="true"
//               />
//               <img
//                 src={banners[currentBanner]?.url || ""}
//                 alt="Banner"
//                 onClick={() => onBannerImageClick(banners[currentBanner])}
//                 className="promo-img cursor-pointer transition-transform duration-500 group-hover:scale-[1.005]"
//               />
//               <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[rgba(15,27,60,.35)] to-transparent" />

//               {banners.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevBanner}
//                     aria-label="Previous banner"
//                     className="absolute left-3 top-1/2 z-[3] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-gold/30 bg-background/70 text-xl text-foreground backdrop-blur transition-colors hover:border-gold"
//                   >
//                     ‹
//                   </button>
//                   <button
//                     onClick={nextBanner}
//                     aria-label="Next banner"
//                     className="absolute right-3 top-1/2 z-[3] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-gold/30 bg-background/70 text-xl text-foreground backdrop-blur transition-colors hover:border-gold"
//                   >
//                     ›
//                   </button>
//                 </>
//               )}
//             </div>
//           </section>
//         </Reveal>
//       )}

//       {/* ============ QUICK SERVICES ============ */}
//       <Reveal>
//         <section className="rsection">
//           <div className="section-head">
//             <div>
//               <span className="tag">Quick Services</span>
//               <h2 className="sec">Begin your offering</h2>
//             </div>
//             <p className="max-w-[340px] text-sm text-muted-foreground">
//               Doorways into worship — each one takes less than a minute to start.
//             </p>
//           </div>

//           <div className="qs-grid">
//             {quickServices.map((q) => (
//               <button
//                 key={q.title}
//                 onClick={() => q.to && navigate(q.to)}
//                 disabled={!q.to}
//                 className="qs-card shimmer stagger-item"
//               >
//                 <div className="media">
//                   <img src={q.img} alt={q.title} loading="lazy" />
//                   <span className="qs-ic">{q.icon}</span>
//                 </div>
//                 <div className="body">
//                   <h4>{q.title}</h4>
//                   <p>{q.desc}</p>
//                   <span className="qs-link">
//                     {q.to ? 'Explore' : 'Coming soon'} <span className="arrow">→</span>
//                   </span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </section>
//       </Reveal>

//       {/* ============ FEATURED — TEMPLES OF THE SEASON (bento) ============ */}
//       <Reveal>
//         <section className="rsection">
//           <div className="section-head">
//             <div>
//               <span className="tag">Featured</span>
//               <h2 className="sec">Temples of the season</h2>
//             </div>
//             <button className="btn-ghost" onClick={() => navigate('/temples')}>
//               View all temples
//             </button>
//           </div>

//           {featuredLoading && <p className="text-sm text-muted-foreground">Loading temples...</p>}
//           {!featuredLoading && featuredTemples.length === 0 && (
//             <p className="text-sm text-muted-foreground">No temples found</p>
//           )}

//           {featuredTemples.length > 0 && (
//             <div className="bento">
//               {featuredTemples.slice(0, 6).map((t, i) => (
//                 <TempleBentoCard
//                   key={t.id}
//                   {...t}
//                   size={bentoSize(i)}
//                   onClick={() => navigate(`/temple/${t.id}`)}
//                 />
//               ))}
//             </div>
//           )}
//         </section>
//       </Reveal>

//       {/* ============ HOW IT WORKS — FROM SANKALPA TO PRASAD ============ */}
//       <Reveal>
//         <section className="rsection">
//           <div className="section-head">
//             <div>
//               <span className="tag">How it works</span>
//               <h2 className="sec">From sankalpa to prasad</h2>
//             </div>
//           </div>

//           <div className="flow">
//             <div className="flow-steps">
//               {flowSteps.map((s, i) => (
//                 <div key={s.n} className={`fstep ${i < 2 ? 'active' : ''}`}>
//                   <span className="fnum">{s.n}</span>
//                   <div>
//                     <h4>{s.h}</h4>
//                     <p>{s.p}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="card">
//               <div className="mb-[18px] flex items-center justify-between gap-3">
//                 <h4 className="serif text-[19px]">Rudra Abhishekam</h4>
//                 <span className="pill">Slot held</span>
//               </div>
//               <div className="row"><span>Temple</span><span>Kashi Vishwanath</span></div>
//               <div className="row"><span>Date &amp; Time</span><span>22 May 2026, 09:00 AM</span></div>
//               <div className="row"><span>Devotees</span><span>2</span></div>
//               <div className="row"><span>Booking charges</span><span>₹19</span></div>
//               <div className="mt-4 flex justify-between border-t border-dashed border-border pt-4">
//                 <span className="text-[13.5px] text-muted-foreground">Total payable</span>
//                 <span className="serif text-2xl text-gold-soft">₹1,119</span>
//               </div>
//               <button
//                 className="btn-primary mt-[18px] block w-full"
//                 onClick={() => navigate('/temples')}
//               >
//                 Proceed to Payment
//               </button>
//             </div>
//           </div>
//         </section>
//       </Reveal>

//       {/* ============ GALLERY ============ */}
//       {galleryImages.length > 0 && (
//         <Reveal>
//           <section className="rsection">
//             <div className="section-head">
//               <div>
//                 <span className="tag">Moments</span>
//                 <h2 className="sec">Gallery</h2>
//               </div>
//               <button className="btn-ghost" onClick={() => navigate("/gallery")}>
//                 View all
//               </button>
//             </div>

//             <GalleryCoverflow
//               items={galleryImages.map((g: any) => ({ url: g.url, caption: g.caption }))}
//               onOpen={(i) => setSelectedImageIndex(i)}
//             />
//           </section>
//         </Reveal>
//       )}

//       {/* ============ CTA BAND ============ */}
//       <Reveal>
//         <div className="cta-band">
//           <h2>Let the lamp be lit in your name tomorrow at dawn</h2>
//           {/* <p>Over 48,000 sevas offered on behalf of devotees across 23 countries.</p> */}
//           <button className="btn-primary shimmer" onClick={() => navigate('/pujas-homas')}>
//             Offer a Seva
//           </button>
//         </div>
//       </Reveal>

//       </div>
//       {/* /divine-glow */}

//       {/* FULL SCREEN GALLERY VIEWER (logic unchanged) */}
//       {selectedImageIndex !== null && (
//         <div
//           className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95"
//           onClick={closeViewer}
//           onTouchStart={handleTouchStart}
//           onTouchEnd={handleTouchEnd}
//         >
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               closeViewer();
//             }}
//             className="absolute top-4 right-4 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white"
//           >
//             ×
//           </button>

//           <img
//             src={galleryImages[selectedImageIndex].url}
//             onClick={(e) => e.stopPropagation()}
//             className="max-w-full max-h-full object-contain px-6"
//           />

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               prevImage();
//             }}
//             className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-3xl text-white"
//           >
//             ‹
//           </button>

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               nextImage();
//             }}
//             className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-3xl text-white"
//           >
//             ›
//           </button>

//           <div className="absolute bottom-5 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
//             {selectedImageIndex + 1} / {galleryImages.length}
//           </div>
//         </div>
//       )}
//     </PageShell>
//   );
// }
import { PageShell } from "../components/PageShell";
import { Reveal } from "../components/Reveal";
import { TempleBentoCard } from "../components/TempleCard";
import { GalleryCoverflow } from "../components/GalleryCoverflow";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
 * QUICK SERVICE THUMBNAILS
 * ───────────────────────────────────────────────────────────── */
const BookSevaImg = "/assets/small/BookSeva.webp";
const BookClasses = "/assets/small/BookClasses.webp";
const BookPandith = "/assets/small/BookPandith.webp";
const SpecialDarshan = "/assets/small/SpecialDarshan.webp";
const BookSpecialPooja = "/assets/small/BookSpecialPooja.webp";
const ecommerce = "/assets/small/ecommerce.webp";

const Shiva = "/assets/small/Shiva.webp";
const Subramanya = "/assets/small/Subramanya.webp";
const Ganesha = "/assets/small/Ganesha.webp";
const Vishnu = "/assets/small/Vishnu.webp";
const Chamundi = "/assets/small/Chamundi.webp";
const Anjaneya = "/assets/small/Anjaneya.webp";
const Suryadeva = "/assets/small/Suryadeva.webp";
const ShaniMahatma = "/assets/small/ShaniMahatma.webp";

/* ─────────────────────────────────────────────────────────────
 * HERO IMAGES
 *
 * You can add multiple images for the same day.
 *
 * Tuesday:
 *   Subramanya <-> Anjaneya
 *
 * Friday:
 *   Add 5-6 Goddess images here.
 *
 * Saturday:
 *   Anjaneya <-> Shani Mahathma
 * ───────────────────────────────────────────────────────────── */

const HeroShiva = "/assets/hero/shiva.webp";

const HeroSubramanya = "/assets/hero/subramanya.webp";
const HeroAnjaneya = "/assets/hero/anjaneya.webp";

const HeroGanesha = "/assets/hero/ganesha.webp";
const HeroVishnu = "/assets/hero/vishnu.webp";

/* Friday Goddess images */
const HeroGoddess1 = "/assets/hero/chamundi.webp";
const HeroGoddess2 = "/assets/hero/goddess5.webp";
const HeroGoddess3 = "/assets/hero/goddess3.webp";
// const HeroGoddess4 = "/assets/hero/goddess4.png";
const HeroGoddess5 = "/assets/hero/goddess2.webp";
// const HeroGoddess6 = "/assets/hero/goddess6.png";

const HeroShaniMahatma = "/assets/hero/shani-mahatma.png";

const HeroSuryadeva = "/assets/hero/suryadeva.webp";

/*
 * Each day can now have multiple hero images.
 *
 * For Friday, if you only have 3 images initially,
 * simply remove/comment the unused ones.
 */
const heroDeities = [
  {
    day: "Monday",
    images: [HeroShiva],
    names: ["Lord Shiva"],
  },

  {
    day: "Tuesday",
    images: [HeroSubramanya, HeroAnjaneya],
    names: ["Lord Subramanya", "Lord Anjaneya"],
  },

  {
    day: "Wednesday",
    images: [HeroGanesha],
    names: ["Lord Ganesha"],
  },

  {
    day: "Thursday",
    images: [HeroVishnu],
    names: ["Lord Vishnu"],
  },

  {
    day: "Friday",
    images: [
      HeroGoddess1,
      HeroGoddess2,
      HeroGoddess3,
      // HeroGoddess4,
      HeroGoddess5,
      // HeroGoddess6,
    ],
    names: [
      "Goddess",
      "Goddess",
      "Goddess",
      // "Goddess",
      "Goddess",
      // "Goddess",
    ],
  },

  {
    day: "Saturday",
    images: [HeroAnjaneya, HeroShaniMahatma],
    names: ["Lord Anjaneya", "Shani Mahathma"],
  },

  {
    day: "Sunday",
    images: [HeroSuryadeva],
    names: ["Surya Deva"],
  },
];

const heroStats = [
  { num: "120+", label: "Temples" },
  { num: "48k", label: "Sevas Offered" },
  { num: "4.9", label: "Devotee Rating" },
  { num: "100%", label: "Prasad Delivered" },
];

/* ─────────────────────────────────────────────────────────────
 * QUICK SERVICES
 * ───────────────────────────────────────────────────────────── */

const quickServices = [
  {
    title: "Book Seva",
    icon: "✦",
    img: BookSevaImg,
    to: "/temples",
    desc: "Reserve a daily ritual — abhishekam, archana or deepa aradhana — performed in your name by the temple's own hereditary priests.",
  },
  {
    title: "Book Classes",
    icon: "ॐ",
    img: BookClasses,
    to: "/classes",
    desc: "Join guided sessions in Bhagavad Gita study, Vedic chanting and temple-style meditation, taught by resident acharyas.",
  },
  {
    title: "Special Pujas",
    icon: "✸",
    img: BookSpecialPooja,
    to: "/pujas-homas",
    desc: "Commission a homam, kalyanotsavam or vrat katha for occasions that call for a deeper, personalised offering.",
  },
  {
    title: "Special Darshan",
    icon: "❂",
    img: SpecialDarshan,
    to: null,
    desc: "Skip the general queue with an escorted VIP, Suvarna or night sighting darshan at the temple of your choice.",
  },
  {
    title: "Book Pandit",
    icon: "◉",
    img: BookPandith,
    to: null,
    desc: "Invite a trained priest to perform ceremonies at your home, with all samagri arranged for you.",
  },
  {
    title: "Puja Samagri",
    icon: "◇",
    img: ecommerce,
    to: null,
    desc: "Order lamps, kumkum, tulsi and complete ritual kits, delivered ready for the muhurta.",
  },
];

/* ─────────────────────────────────────────────────────────────
 * FLOW
 * ───────────────────────────────────────────────────────────── */

const flowSteps = [
  {
    n: "i.",
    h: "Choose the sanctum",
    p: "Browse temples by deity, city or the festival that calls you.",
  },
  {
    n: "ii.",
    h: "Offer the sankalpa",
    p: "Give your name, gotra and nakshatra — the priest chants it for you.",
  },
  {
    n: "iii.",
    h: "Confirm and pay",
    p: "UPI, cards or net banking, secured end to end.",
  },
  {
    n: "iv.",
    h: "Receive the grace",
    p: "Sankalpa video, temple receipt and prasad shipped home.",
  },
];

export function Home() {
  const navigate = useNavigate();

  /* ─────────────────────────────────────────────────────────────
   * GALLERY
   * ───────────────────────────────────────────────────────────── */

  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const [selectedImageIndex, setSelectedImageIndex] = useState<
    number | null
  >(null);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const closeViewer = () => setSelectedImageIndex(null);

  /* ─────────────────────────────────────────────────────────────
   * FEATURED TEMPLES
   * ───────────────────────────────────────────────────────────── */

  const [featuredTemples, setFeaturedTemples] = useState<any[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  /* ─────────────────────────────────────────────────────────────
   * BANNERS
   * ───────────────────────────────────────────────────────────── */

  const [banners, setBanners] = useState<any[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  const fetchBanners = async () => {
    try {
      const response = await api.get(
        "api/media?usageType=banner&page=1&page_size=100"
      );

      setBanners(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Banner fetch failed", error);
    }
  };

  const fetchFeaturedTemples = async () => {
    setFeaturedLoading(true);

    try {
      const response = await api.get("api/temples?page=1&page_size=8");

      const data = Array.isArray(response.data?.items)
        ? response.data.items
        : [];

      const mapped = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        city: item.city || item.location || "Unknown",
        image:
          item.profileImageUrl ||
          "https://images.unsplash.com/photo-1565195161077-f5c5f61f9ea2?fm=jpg&q=80&w=1080",
        rating: item.rating || 4.5,
        reviews: item.reviewCount || item.reviews || 0,
      }));

      setFeaturedTemples(mapped);
    } catch (error) {
      console.error("Featured temples fetch failed", error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  /* ─────────────────────────────────────────────────────────────
   * GALLERY NAVIGATION
   * ───────────────────────────────────────────────────────────── */

  const nextImage = () => {
    setSelectedImageIndex((prev) => {
      if (prev === null || galleryImages.length === 0) return 0;

      return (prev + 1) % galleryImages.length;
    });
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => {
      if (prev === null || galleryImages.length === 0) return 0;

      return prev === 0 ? galleryImages.length - 1 : prev - 1;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX - endX;

    if (diff > 50) {
      nextImage();
    } else if (diff < -50) {
      prevImage();
    }

    setTouchStartX(null);
  };

  /* ─────────────────────────────────────────────────────────────
   * API FETCH
   * ───────────────────────────────────────────────────────────── */

  useEffect(() => {
    fetchGalleryImages();
    fetchBanners();
    fetchFeaturedTemples();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await api.get(
        "api/media?usageType=gallery&page=1&page_size=12"
      );

      const data = Array.isArray(response.data) ? response.data : [];

      setGalleryImages(data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ─────────────────────────────────────────────────────────────
   * PROMOTIONAL BANNERS
   * ───────────────────────────────────────────────────────────── */

  const nextBanner = () => {
    if (banners.length === 0) return;

    setCurrentBanner((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  const prevBanner = () => {
    if (banners.length === 0) return;

    setCurrentBanner((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const onBannerImageClick = (selectedBannerImage: any) => {
    if (selectedBannerImage.redirectType === "SPECIAL_PUJA") {
      navigate(`/special-puja/${selectedBannerImage.redirectId}/book`);
    } else if (selectedBannerImage.redirectType === "CLASS") {
      navigate("/classes");
    }
  };

  /* ─────────────────────────────────────────────────────────────
   * HERO / DEITY STATE
   * ───────────────────────────────────────────────────────────── */

  const [previewHeroDay, setPreviewHeroDay] = useState<string | null>(
    null
  );

  const [pinnedHeroDay, setPinnedHeroDay] = useState<string | null>(
    null
  );

  /*
   * This is the important new state.
   *
   * It controls which image is currently shown for the active day.
   *
   * Tuesday:
   *   0 = Subramanya
   *   1 = Anjaneya
   *
   * Friday:
   *   0 -> 1 -> 2 -> 3 -> 4 -> 5
   *
   * Saturday:
   *   0 = Anjaneya
   *   1 = Shani Mahathma
   */
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const heroTouchStartX = useRef<number | null>(null);

  /* ─────────────────────────────────────────────────────────────
   * ANIMATION PARTICLES
   * ───────────────────────────────────────────────────────────── */

  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }).map(() => ({
        top: (Math.random() * 70 + 4).toFixed(1),
        left: (Math.random() * 96 + 2).toFixed(1),
        size: (Math.random() * 2.2 + 1.4).toFixed(1),
        dur: (Math.random() * 3 + 2.5).toFixed(1),
        delay: (Math.random() * 5).toFixed(1),
      })),
    []
  );

  const embers = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        left:
          i % 2 === 0
            ? (Math.random() * 10 + 2).toFixed(1)
            : (Math.random() * 10 + 86).toFixed(1),
        size: (Math.random() * 3 + 2.5).toFixed(1),
        dur: (Math.random() * 6 + 9).toFixed(1),
        delay: (Math.random() * 10).toFixed(1),
        drift: (Math.random() * 40 - 20).toFixed(0),
      })),
    []
  );

  /* ─────────────────────────────────────────────────────────────
   * DEITIES
   * ───────────────────────────────────────────────────────────── */

  const godsByDay: Record<string, string[]> = {
    Monday: ["Shiva"],
    Tuesday: ["Subramanya", "Anjaneya"],
    Wednesday: ["Ganesha"],
    Thursday: ["Vishnu"],
    Friday: ["Goddess"],
    Saturday: ["Anjaneya", "Shani Mahathma"],
    Sunday: ["Suryadeva"],
  };

  const gods = [
    {
      name: "Shiva",
      image: Shiva,
      day: "Monday",
      role: "The Auspicious One",
    },
    {
      name: "Subramanya",
      image: Subramanya,
      day: "Tuesday",
      role: "Commander of the Devas",
    },
    {
      name: "Ganesha",
      image: Ganesha,
      day: "Wednesday",
      role: "Remover of Obstacles",
    },
    {
      name: "Vishnu",
      image: Vishnu,
      day: "Thursday",
      role: "The Preserver",
    },
    {
      name: "Goddess",
      image: Chamundi,
      day: "Friday",
      role: "The Divine Mother",
    },
    {
      name: "Anjaneya",
      image: Anjaneya,
      day: "Saturday",
      role: "The Devoted One",
    },
    {
      name: "Suryadeva",
      image: Suryadeva,
      day: "Sunday",
      role: "Giver of Light",
    },
    {
      name: "Shani Mahathma",
      image: ShaniMahatma,
      day: "Saturday",
      role: "Lord of Karma",
    },
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const todayGods = godsByDay[today] || [];

  /* ─────────────────────────────────────────────────────────────
   * TODAY SECTION ROTATION
   *
   * This preserves the existing functionality.
   *
   * Tuesday:
   *   Subramanya -> Anjaneya
   *
   * Saturday:
   *   Anjaneya -> Shani Mahathma
   * ───────────────────────────────────────────────────────────── */

  useEffect(() => {
    if (todayGods.length <= 1) {
      setHighlightIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % todayGods.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [today]);

  const activeGodName =
    todayGods[highlightIndex] || todayGods[0];

  /* ─────────────────────────────────────────────────────────────
   * AUTO HERO ROTATION
   *
   * Hero now follows the same deity rotation.
   *
   * Tuesday:
   *   Subramanya -> Anjaneya -> Subramanya...
   *
   * Friday:
   *   Goddess 1 -> Goddess 2 -> ... -> Goddess 6
   *
   * Saturday:
   *   Anjaneya -> Shani Mahathma -> Anjaneya...
   *
   * Single-deity days do not rotate.
   * ───────────────────────────────────────────────────────────── */

  const activeHeroDay =
    previewHeroDay ?? pinnedHeroDay ?? today;

  const activeHeroData =
    heroDeities.find((d) => d.day === activeHeroDay) ??
    heroDeities[0];

  /*
   * Whenever the active day changes, start that day's hero
   * rotation from the first image.
   */
  useEffect(() => {
    setHeroImageIndex(0);
  }, [activeHeroDay]);

  /*
   * Rotate hero image every 5 seconds.
   */
  useEffect(() => {
    if (!activeHeroData || activeHeroData.images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setHeroImageIndex((prev) => {
        return (prev + 1) % activeHeroData.images.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeHeroDay, activeHeroData.images.length]);

  /*
   * Make sure the index is valid if images change.
   */
  useEffect(() => {
    if (
      heroImageIndex >= activeHeroData.images.length
    ) {
      setHeroImageIndex(0);
    }
  }, [heroImageIndex, activeHeroData.images.length]);

  /*
   * Keep the existing day auto-scroll.
   */
  const dayRefs = useRef<
    Record<string, HTMLDivElement | null>
  >({});

  // useEffect(() => {
  //   if (dayRefs.current[today]) {
  //     dayRefs.current[today]?.scrollIntoView({
  //       behavior: "smooth",
  //       inline: "center",
  //       block: "nearest",
  //     });
  //   }
  // }, [today]);

  useEffect(() => {
  const el = dayRefs.current[today];
  const strip = el?.closest(".deity-strip") as HTMLElement | null;

  if (el && strip) {
    // Scroll only the horizontal chip strip into position — never the page.
    const target =
      el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2;
    strip.scrollTo({ left: target, behavior: "smooth" });
  }
}, [today]);

  /* ─────────────────────────────────────────────────────────────
   * HERO MANUAL NAVIGATION
   *
   * Swipe still works.
   *
   * If there are multiple images for the selected day,
   * swipe changes the image.
   *
   * If there is only one image, swipe changes the day.
   * ───────────────────────────────────────────────────────────── */

  const cycleHeroImage = (dir: number) => {
    const totalImages = activeHeroData.images.length;

    if (totalImages > 1) {
      setHeroImageIndex((prev) => {
        return (
          (prev + dir + totalImages) %
          totalImages
        );
      });

      return;
    }

    cycleHeroDay(dir);
  };

  const cycleHeroDay = (dir: number) => {
    const idx = heroDeities.findIndex(
      (d) => d.day === activeHeroDay
    );

    const nextIdx =
      (idx + dir + heroDeities.length) %
      heroDeities.length;

    setPinnedHeroDay(heroDeities[nextIdx].day);
    setHeroImageIndex(0);
  };

  const handleHeroTouchStart = (
    e: React.TouchEvent
  ) => {
    heroTouchStartX.current =
      e.touches[0].clientX;
  };

  const handleHeroTouchEnd = (
    e: React.TouchEvent
  ) => {
    if (heroTouchStartX.current === null) return;

    const diff =
      heroTouchStartX.current -
      e.changedTouches[0].clientX;

    if (diff > 40) {
      cycleHeroImage(1);
    } else if (diff < -40) {
      cycleHeroImage(-1);
    }

    heroTouchStartX.current = null;
  };

  /* ─────────────────────────────────────────────────────────────
   * CURRENT HERO IMAGE
   * ───────────────────────────────────────────────────────────── */

  const activeHeroImage =
    activeHeroData.images[
      heroImageIndex
    ] || activeHeroData.images[0];

  const activeHeroName =
    activeHeroData.names[
      heroImageIndex
    ] || activeHeroData.names[0];

  /* ─────────────────────────────────────────────────────────────
   * BENTO
   * ───────────────────────────────────────────────────────────── */

  const bentoSize = (
    i: number
  ): "b-xl" | "b-md" | "b-sm" =>
    i === 0
      ? "b-xl"
      : i === 1
      ? "b-md"
      : "b-sm";

  return (
    <PageShell bare>
      
      {/* =========================================================
          HERO
          ========================================================= */}

      <section
        className="hero hero-portal border-b border-border"
        onTouchStart={handleHeroTouchStart}
        onTouchEnd={handleHeroTouchEnd}
      >

        {heroDeities.map((d) => {
          /*
           * Only render the current day's image as active.
           *
           * This keeps the existing hero-bg CSS transition.
           */
          const image =
            d.day === activeHeroDay
              ? activeHeroImage
              : d.images[0];

          return (
            <div
              key={d.day}
              className={`hero-bg ${
                d.day === activeHeroDay
                  ? "is-active"
                  : ""
              }`}
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          );
        })}

        <div className="hero-overlay" />

        {/* Sparkles */}
        <div className="hero-sparkles">
          {sparkles.map((s, i) => (
            <span
              key={i}
              className="spark"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDuration: `${s.dur}s`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Embers */}
        <div className="hero-embers">
          {embers.map((e, i) => (
            <span
              key={i}
              className="ember"
              style={{
                left: `${e.left}%`,
                width: `${e.size}px`,
                height: `${e.size}px`,
                animationDuration: `${e.dur}s`,
                animationDelay: `${e.delay}s`,
                ["--drift" as any]: `${e.drift}px`,
              }}
            />
          ))}
        </div>

        <div className="hero-copy">
          <span className="eyebrow">
            A Sacred Digital Sanctum
          </span>

          <h1>
            Divine Seva,
            <br />
            <em>Divine Blessings</em>
          </h1>

          <p>
            Offer abhishekam, archana and alankara
            at India's most revered temples —
            booked in a breath, performed by
            hereditary priests, proven with prasad
            at your door.
          </p>

          <div className="hero-actions">
            <button
              className="btn-primary shimmer glow-gold"
              onClick={() =>
                navigate("/temples")
              }
            >
              Explore Temples
            </button>

            <button
              className="btn-ghost"
              onClick={() =>
                navigate("/pujas-homas")
              }
            >
              Special Pujas
            </button>
          </div>

          <div
            className="stat-strip"
            style={{
              marginTop: "5rem",
            }}
          >
            {/* Existing stats intentionally hidden */}
          </div>
        </div>

      </section>

      {/* =========================================================
          EVERYTHING BELOW HERO
          ========================================================= */}

      <div className="divine-glow">
        <div
          className="divine-glow-wash"
          aria-hidden="true"
        />

        {/* =======================================================
            DEITIES OF THE SANCTUM
            ======================================================= */}

        <Reveal>
          <section className="rsection">
          
            <div className="section-head">
              <div>
                <span className="tag">
                  Divine Blessings
                </span>

                <h2 className="sec">
                  Deities of the sanctum
                </h2>
              </div>

              <p className="max-w-[340px] text-sm text-muted-foreground">
                The forms devotees turn to most
                often — {today}'s blessing is
                highlighted.
              </p>
            </div>

            <div className="deity-strip no-scrollbar">

              {weekDays.map((day) => {

                const godName =
                  godsByDay[day]?.[0];

                const god = gods.find(
                  (g) => g.name === godName
                );

                if (!god) return null;

                const isActive =
                  day === activeHeroDay;

                return (
                  <button
                    key={day}
                    ref={(el) => {
                      dayRefs.current[day] =
                        el as any;
                    }}
                    onClick={() => {
                      setPinnedHeroDay(day);
                      setPreviewHeroDay(null);
                      setHeroImageIndex(0);
                    }}
                    onMouseEnter={() =>
                      setPreviewHeroDay(day)
                    }
                    onMouseLeave={() =>
                      setPreviewHeroDay(null)
                    }
                    className={`deity-chip ${
                      isActive ? "on" : ""
                    }`}
                    style={{
                      padding: "3%",
                    }}
                  >
                    <div className="ring shimmer">
                      <img
                        src={god.image}
                        alt={god.name}
                        loading="lazy"
                      />
                    </div>

                    <div className="dname">
                      {god.name}
                    </div>

                    <div className="drole">
                      {day === today
                        ? "Today's blessing"
                        : day}
                    </div>
                  </button>
                );
              })}

            </div>

            {/* ===================================================
                TODAY'S DIVINE HIGHLIGHT
                =================================================== */}

            {gods
              .filter(
                (g) =>
                  activeGodName === g.name
              )
              .map((god) => (
                <div
                  key={god.name}
                  className="card shimmer mt-8 flex flex-wrap items-center gap-5"
                >
                  <div className="deity-portrait">
                    <img
                      src={god.image}
                      alt={god.name}
                    />
                  </div>

                  <div className="min-w-[200px] flex-1">
                    <span className="tag">
                      Today · {today}
                    </span>

                    <h3 className="serif text-[22px] text-gold-soft">
                      {god.name}
                    </h3>

                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {god.role} — offer a seva
                      today and receive the
                      sankalpa in your name.
                    </p>
                  </div>

                  <button
                    className="btn-ghost"
                    onClick={() =>
                      navigate("/temples")
                    }
                  >
                    Offer a Seva
                  </button>
                </div>
              ))}

          </section>
        </Reveal>

        {/* =======================================================
            PROMOTIONAL BANNERS
            ======================================================= */}

        {banners.length > 0 && (
          <Reveal>
            <section className="rsection pt-0">

              <div
                className="promo-banner group relative w-full rounded-[26px] border border-border bg-surface shadow-panel"
                style={{
                  aspectRatio: "416 / 186",
                  maxHeight: "50vh",
                }}
              >

                <span
                  className="promo-blur"
                  style={{
                    backgroundImage: `url(${
                      banners[
                        currentBanner
                      ]?.url || ""
                    })`,
                  }}
                  aria-hidden="true"
                />

                <img
                  src={
                    banners[currentBanner]
                      ?.url || ""
                  }
                  alt="Banner"
                  onClick={() =>
                    onBannerImageClick(
                      banners[currentBanner]
                    )
                  }
                  className="promo-img cursor-pointer transition-transform duration-500 group-hover:scale-[1.005]"
                />

                <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[rgba(15,27,60,.35)] to-transparent" />

                {banners.length > 1 && (
                  <>
                    <button
                      onClick={prevBanner}
                      aria-label="Previous banner"
                      className="absolute left-3 top-1/2 z-[3] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-gold/30 bg-background/70 text-xl text-foreground backdrop-blur transition-colors hover:border-gold"
                    >
                      ‹
                    </button>

                    <button
                      onClick={nextBanner}
                      aria-label="Next banner"
                      className="absolute right-3 top-1/2 z-[3] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-gold/30 bg-background/70 text-xl text-foreground backdrop-blur transition-colors hover:border-gold"
                    >
                      ›
                    </button>
                  </>
                )}

              </div>

            </section>
          </Reveal>
        )}

        {/* =======================================================
            QUICK SERVICES
            ======================================================= */}

        <Reveal>
          <section className="rsection">

            <div className="section-head">
              <div>
                <span className="tag">
                  Quick Services
                </span>

                <h2 className="sec">
                  Begin your offering
                </h2>
              </div>

              <p className="max-w-[340px] text-sm text-muted-foreground">
                Doorways into worship — each one
                takes less than a minute to start.
              </p>
            </div>

            <div className="qs-grid">

              {quickServices.map((q) => (
                <button
                  key={q.title}
                  onClick={() =>
                    q.to && navigate(q.to)
                  }
                  disabled={!q.to}
                  className="qs-card shimmer stagger-item"
                >

                  <div className="media">
                    <img
                      src={q.img}
                      alt={q.title}
                      loading="lazy"
                    />

                    <span className="qs-ic">
                      {q.icon}
                    </span>
                  </div>

                  <div className="body">
                    <h4>{q.title}</h4>

                    <p>{q.desc}</p>

                    <span className="qs-link">
                      {q.to
                        ? "Explore"
                        : "Coming soon"}

                      <span className="arrow">
                        →
                      </span>
                    </span>
                  </div>

                </button>
              ))}

            </div>

          </section>
        </Reveal>

        {/* =======================================================
            FEATURED TEMPLES
            ======================================================= */}

        <Reveal>
          <section className="rsection">

            <div className="section-head">
              <div>
                <span className="tag">
                  Featured
                </span>

                <h2 className="sec">
                  Temples of the season
                </h2>
              </div>

              <button
                className="btn-ghost"
                onClick={() =>
                  navigate("/temples")
                }
              >
                View all temples
              </button>
            </div>

            {featuredLoading && (
              <p className="text-sm text-muted-foreground">
                Loading temples...
              </p>
            )}

            {!featuredLoading &&
              featuredTemples.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No temples found
                </p>
              )}

            {featuredTemples.length > 0 && (
              <div className="bento">

                {featuredTemples
                  .slice(0, 6)
                  .map((t, i) => (
                    <TempleBentoCard
                      key={t.id}
                      {...t}
                      size={bentoSize(i)}
                      onClick={() =>
                        navigate(
                          `/temple/${t.id}`
                        )
                      }
                    />
                  ))}

              </div>
            )}

          </section>
        </Reveal>

        {/* =======================================================
            HOW IT WORKS
            ======================================================= */}

        <Reveal>
          <section className="rsection">

            <div className="section-head">
              <div>
                <span className="tag">
                  How it works
                </span>

                <h2 className="sec">
                  From sankalpa to prasad
                </h2>
              </div>
            </div>

            <div className="flow">

              <div className="flow-steps">

                {flowSteps.map((s, i) => (
                  <div
                    key={s.n}
                    className={`fstep ${
                      i < 2 ? "active" : ""
                    }`}
                  >
                    <span className="fnum">
                      {s.n}
                    </span>

                    <div>
                      <h4>{s.h}</h4>
                      <p>{s.p}</p>
                    </div>
                  </div>
                ))}

              </div>

              <div className="card">

                <div className="mb-[18px] flex items-center justify-between gap-3">

                  <h4 className="serif text-[19px]">
                    Rudra Abhishekam
                  </h4>

                  <span className="pill">
                    Slot held
                  </span>

                </div>

                <div className="row">
                  <span>Temple</span>
                  <span>
                    Kashi Vishwanath
                  </span>
                </div>

                <div className="row">
                  <span>Date &amp; Time</span>
                  <span>
                    22 May 2026, 09:00 AM
                  </span>
                </div>

                <div className="row">
                  <span>Devotees</span>
                  <span>2</span>
                </div>

                <div className="row">
                  <span>Booking charges</span>
                  <span>₹19</span>
                </div>

                <div className="mt-4 flex justify-between border-t border-dashed border-border pt-4">

                  <span className="text-[13.5px] text-muted-foreground">
                    Total payable
                  </span>

                  <span className="serif text-2xl text-gold-soft">
                    ₹1,119
                  </span>

                </div>

                <button
                  className="btn-primary mt-[18px] block w-full"
                  onClick={() =>
                    navigate("/temples")
                  }
                >
                  Proceed to Payment
                </button>

              </div>

            </div>

          </section>
        </Reveal>

        {/* =======================================================
            GALLERY
            ======================================================= */}

        {galleryImages.length > 0 && (
          <Reveal>
            <section className="rsection">

              <div className="section-head">
                <div>
                  <span className="tag">
                    Moments
                  </span>

                  <h2 className="sec">
                    Gallery
                  </h2>
                </div>

                <button
                  className="btn-ghost"
                  onClick={() =>
                    navigate("/gallery")
                  }
                >
                  View all
                </button>
              </div>

              <GalleryCoverflow
                items={galleryImages.map(
                  (g: any) => ({
                    url: g.url,
                    caption: g.caption,
                  })
                )}
                onOpen={(i) =>
                  setSelectedImageIndex(i)
                }
              />

            </section>
          </Reveal>
        )}

        {/* =======================================================
            CTA
            ======================================================= */}

        <Reveal>
          <div className="cta-band">

            <h2>
              Let the lamp be lit in your name
              tomorrow at dawn
            </h2>

            <button
              className="btn-primary shimmer"
              onClick={() =>
                navigate("/pujas-homas")
              }
            >
              Offer a Seva
            </button>

          </div>
        </Reveal>

      </div>

      {/* =========================================================
          FULL SCREEN GALLERY VIEWER
          ========================================================= */}

      {selectedImageIndex !== null && (
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
            src={
              galleryImages[
                selectedImageIndex
              ].url
            }
            onClick={(e) =>
              e.stopPropagation()
            }
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
            {selectedImageIndex + 1} /{" "}
            {galleryImages.length}
          </div>

        </div>
      )}

    </PageShell>
  );
}