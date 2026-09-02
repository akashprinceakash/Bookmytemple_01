import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, Search } from 'lucide-react';

const logoImg = '/assets/logo_transparent.jpeg';

const navLinks = [
  { to: '/temples', label: 'Temples' },
  { to: '/pujas-homas', label: 'Special Pujas' },
  { to: '/classes', label: 'Classes' },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/profile', label: 'Profile' },
  { to: '/contact', label: 'Contact' },
];

const drawerLinks = [
  { to: '/home', label: 'Home' },
  { to: '/temples', label: 'Temples' },
  { to: '/pujas-homas', label: 'Special Pujas' },
  { to: '/classes', label: 'Classes' },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/profile', label: 'Profile' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact Us' },
];

/**
 * Royale nav — matches the mockup `.nav`: 16px / clamp(20px,5vw,64px)
 * padding, 38px logo mark, 15.5px Marcellus wordmark with the 9.5px
 * gold tagline, 13.5px links with the sliding gold underline, and the
 * pill "Explore Temples" CTA.
 */
export function RoyaleHeader({ showSearch = true }: { showSearch?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'));
  }, [location.pathname]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <>
      <header className="rnav">
        <Link to="/home" className="nav-brand min-w-0">
          {/* <span className="mark">
            <img src={logoImg} alt="Book My Temples" className="h-full w-full object-cover" style={{ border: '2px solid #ccc' }} />
          </span>
          <span className="word block truncate" style={{fontFamily: 'Poppins, sans-serif'}}>
            Book My Temples
            <span>DIVINE SEVA, DIVINE GRACE</span>
          </span> */}

                <span className="nav-brand-logocol">
            <span className="mark">
              <img src={logoImg} alt="Book My Temples" className="h-full w-full object-cover" style={{ border: '2px solid #ccc'}} />
            </span>
            <span className="nav-brand-tagline">DIVINE SEVA</span>
              <span className="nav-brand-tagline">DIVINE GRACE</span>
          </span>
          <span className="nav-wordstack">
            <h5 className="word-line">BOOK MY</h5>
            <h5 className="word-line">TEMPLES</h5>
          </span>
        </Link>

        <nav className="nav-links">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className={isActive(l.to) ? 'on' : ''}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav-right">
          {showSearch && (
            <button
              onClick={() => navigate('/temples')}
              aria-label="Search temples"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] border border-border bg-[rgba(35,56,109,.6)] text-gold-soft transition-colors hover:border-gold min-[901px]:hidden max-[640px]:h-9 max-[640px]:w-9"
            >
              <Search className="h-4 w-4" />
            </button>
          )}

          <Link to="/temples" className="nav-cta shimmer">
            Explore Temples
          </Link>

          <Link
            to={loggedIn ? '/profile' : '/login'}
            className="hidden items-center gap-2 rounded-full border border-border bg-surface py-1 pr-3 pl-1 transition-colors hover:border-gold/50 min-[901px]:flex"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-gold text-xs font-bold text-primary-foreground">
              {loggedIn ? 'A' : '☺'}
            </span>
            <span className="text-[13.5px] text-foreground">{loggedIn ? 'Account' : 'Sign In'}</span>
          </Link>

          <button className="burger" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
            <span />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity min-[901px]:hidden ${
          drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!drawerOpen}
      >
        <div
          className="absolute inset-0 bg-[rgba(15,27,60,.95)] backdrop-blur-[10px]"
          onClick={() => setDrawerOpen(false)}
        />
        <div className="relative flex h-full flex-col items-center justify-center gap-[22px] font-display text-[22px]">
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="absolute right-6 top-[22px] text-gold-soft"
          >
            <X className="h-7 w-7" />
          </button>

          {drawerLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`transition-colors ${
                isActive(l.to) ? 'text-gold-soft' : 'text-muted-foreground hover:text-gold-soft'
              }`}
            >
              {l.label}
            </Link>
          ))}

          <Link to={loggedIn ? '/profile' : '/login'} className="btn-primary mt-3">
            {loggedIn ? 'My Account' : 'Sign In'}
          </Link>
        </div>
      </div>
    </>
  );
}
