import { PageShell } from '../components/PageShell';
import { Crumb, money } from '../components/royale';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

/**
 * Profile — mockup PAGES.profile.
 *
 * `.split` layout: on the left the 90px gold `.avatar` identity card with
 * gotra/nakshatra pills and an "Edit Profile" ghost button, the `.bstat`
 * counters, and the Personal Details card; on the right the Recent
 * Bookings card and the `.menu` list. All existing auth, profile fetch
 * and navigation behaviour is unchanged.
 */
export function Profile() {

  const navigate = useNavigate();

  const [name, setName] = useState('Guest');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gotra, setGotra] = useState('');
  const [nakshatra, setNakshatra] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ count: 0, temples: 0, total: 0 });

  const fetchProfile = () => {
    api.get('api/user/me')
      .then((res) => {
        const d = res.data;

        setName(`${d.firstName || ''} ${d.lastName || ''}`.trim() || 'Devotee');
        setPhone(d.phone || '');
        setEmail(d.email || '');
        setGotra(d.gotra || '');
        setNakshatra(d.nakshatra || '');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchRecentBookings = () => {
    api.get('api/bookings?page=1&pageSize=5')
      .then((res) => {
        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        const mapped = items.map((item: any) => ({
          id: item.bookingId || 'N/A',
          seva: item.offeringTitle || 'Seva',
          temple: item.temple || '',
          date: item.date || '',
          amount: item.totalAmount || 0,
        }));
        setBookings(mapped);
        setStats({
          count: res.data?.totalCount ?? mapped.length,
          temples: new Set(mapped.map((m: any) => m.temple).filter(Boolean)).size,
          total: mapped.reduce((a: number, b: any) => a + (Number(b.amount) || 0), 0),
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      fetchProfile();
      fetchRecentBookings();
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const initials = (name || 'G')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'G';

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      : '';

  return (
    <PageShell>
      <Crumb parts={[{ label: 'Home', to: '/home' }, { label: 'Profile' }]} />

      <div className="split">
        {/* ---------- LEFT COLUMN ---------- */}
        <div>
          <div className="card flex flex-wrap items-center gap-5">
            <div className="avatar">{initials}</div>
            <div className="min-w-[180px] flex-1">
              <h1 className="serif text-[26px] font-normal">{name}</h1>
              <p className="mt-1.5 text-[13.5px] text-muted-foreground">
                {[email, phone && `+91 ${phone}`].filter(Boolean).join(' · ') || 'Complete your profile'}
              </p>
              {(gotra || nakshatra) && (
                <p className="mt-2.5 flex flex-wrap gap-2">
                  {gotra && <span className="pill">Gotra: {gotra}</span>}
                  {nakshatra && <span className="pill grey">Nakshatra: {nakshatra}</span>}
                </p>
              )}
            </div>
            <button className="btn-ghost" onClick={() => navigate('/profileDetails')}>
              Edit Profile
            </button>
          </div>

          {isLoggedIn && (
            <div className="bstat">
              <div>
                <div className="n">{stats.count}</div>
                <div className="l">Sevas Offered</div>
              </div>
              <div>
                <div className="n">{stats.temples}</div>
                <div className="l">Temples Visited</div>
              </div>
              <div>
                <div className="n">{money(stats.total)}</div>
                <div className="l">Total Offered</div>
              </div>
            </div>
          )}

          <div className="card mt-[18px]">
            <span className="tag">Personal Details</span>
            <div className="grid2">
              <div className="field">
                <label>Full Name</label>
                <input value={name} readOnly />
              </div>
              <div className="field">
                <label>Email</label>
                <input value={email} readOnly placeholder="Add your email" />
              </div>
            </div>
            <div className="grid2">
              <div className="field">
                <label>Mobile</label>
                <input value={phone ? `+91 ${phone}` : ''} readOnly placeholder="Add your mobile" />
              </div>
              <div className="field">
                <label>Gotra</label>
                <input value={gotra} readOnly placeholder="Add your gotra" />
              </div>
            </div>
            <div className="field">
              <label>Nakshatra</label>
              <input value={nakshatra} readOnly placeholder="Add your nakshatra" />
            </div>
            <button className="btn-primary shimmer" onClick={() => navigate('/profileDetails')}>
              Edit Details
            </button>
          </div>
        </div>

        {/* ---------- RIGHT COLUMN ---------- */}
        <div>
          {isLoggedIn && (
            <div className="card">
              <span className="tag">Recent Bookings</span>
              {bookings.length === 0 && (
                <p className="py-2 text-[13.5px] text-muted-foreground">No bookings yet</p>
              )}
              {bookings.slice(0, 3).map((b) => (
                <div key={b.id} className="row">
                  <span className="truncate text-foreground">{b.seva}</span>
                  <span className="shrink-0 text-gold-soft">{fmtDate(b.date)}</span>
                </div>
              ))}
              <button
                className="btn-ghost mt-4 block w-full"
                onClick={() => navigate('/my-bookings')}
              >
                View all bookings
              </button>
            </div>
          )}

          <div className="menu">
            <button onClick={() => navigate('/my-bookings')} disabled={!isLoggedIn}>
              My Bookings <span className="r">{isLoggedIn ? stats.count : '›'}</span>
            </button>
            <button onClick={() => navigate('/profileDetails')} disabled={!isLoggedIn}>
              My Profile <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/familyDetails')} disabled={!isLoggedIn}>
              My Family <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/addressDetails')} disabled={!isLoggedIn}>
              My Address <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/settings')}>
              Settings <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/contact')}>
              Help &amp; Support <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/gallery')}>
              Gallery <span className="r">›</span>
            </button>
            {isLoggedIn ? (
              <button style={{ color: '#D98A8A' }} onClick={handleLogout}>
                Log Out <span className="r">›</span>
              </button>
            ) : (
              <button className="text-gold-soft" onClick={() => navigate('/login')}>
                Sign In <span className="r">›</span>
              </button>
            )}
          </div>

          {!isLoggedIn && (
            <div className="card mt-[18px] text-center">
              <div className="text-[26px]">✦</div>
              <h4 className="serif mt-2 text-[17px]">Sign in to continue</h4>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                Log in to view your bookings, sankalpa videos and prasad tracking.
              </p>
              <button className="btn-primary mt-3.5 block w-full" onClick={() => navigate('/login')}>
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
