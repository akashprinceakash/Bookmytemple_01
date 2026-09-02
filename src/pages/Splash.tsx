import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const logoImg = '/assets/logo_transparent.jpeg';

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="royale-grid-bg h-screen flex flex-col items-center justify-center text-foreground px-6">
      <span className="glow-gold grid h-[130px] w-[130px] place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_28%,#EFCB84,#C0954D_58%,#9A7639_100%)]">
      <span className="mark">
              <img src={logoImg} alt="Book My Temples" className="h-full w-full object-cover" style={{ border: '2px solid #ccc'}} />
            </span>
      </span>

      <h1 className="page-title mt-6 mb-3 text-foreground">Book My Temples</h1>
      <p className="text-center text-[11.5px] uppercase tracking-[0.26em] text-gold-soft">Darshan · Seva · Prasadam</p>

      <div className="mt-12 flex gap-2">
        <div
          className="w-2 h-2 bg-gold rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <div
          className="w-2 h-2 bg-gold rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <div
          className="w-2 h-2 bg-gold rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}