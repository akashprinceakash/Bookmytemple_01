import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Crumb } from '../components/royale';

/**
 * Settings — mockup PAGES.settings.
 *
 * `.split` layout: notification / preference / privacy `.card`s with the
 * gold `.toggle` switches on the left, and the `.menu` list plus the
 * "One Day Puja" promo card on the right.
 *
 * Preferences persist to localStorage only — no new backend calls are
 * introduced, and every row that maps to an existing screen routes there.
 */

const TOGGLE_DEFAULTS: Record<string, boolean> = {
  sevaReminders: true,
  prasadUpdates: true,
  festivalAnnouncements: false,
  promotionalOffers: false,
  twoFactor: true,
  showNameInRecords: false,
  biometricLock: true,
};

const STORAGE_KEY = 'bmt.settings';

export function Settings() {
  const navigate = useNavigate();

  const [toggles, setToggles] = useState<Record<string, boolean>>(TOGGLE_DEFAULTS);
  const [prefs, setPrefs] = useState({
    language: 'English',
    currency: 'INR ₹',
    city: 'Bengaluru',
    timeFormat: '12 Hour',
  });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved.toggles) setToggles((t) => ({ ...t, ...saved.toggles }));
      if (saved.prefs) setPrefs((p) => ({ ...p, ...saved.prefs }));
    } catch {
      /* ignore malformed local state */
    }
  }, []);

  const persist = (nextToggles: typeof toggles, nextPrefs: typeof prefs) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ toggles: nextToggles, prefs: nextPrefs })
      );
    } catch {
      /* storage unavailable — settings stay in-session */
    }
  };

  const toggle = (key: string) => {
    const next = { ...toggles, [key]: !toggles[key] };
    setToggles(next);
    persist(next, prefs);
  };

  const setPref = (key: keyof typeof prefs, value: string) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    persist(toggles, next);
  };

  const Row = ({ id, label, sub }: { id: string; label: string; sub: string }) => (
    <div className="setting-row">
      <div>
        <div className="text-sm">{label}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={!!toggles[id]}
        aria-label={label}
        className={`toggle ${toggles[id] ? 'on' : ''}`}
        onClick={() => toggle(id)}
      />
    </div>
  );

  return (
    <PageShell>
      <Crumb parts={[{ label: 'Home', to: '/home' }, { label: 'Settings' }]} />

      <h1 className="page-title">Settings</h1>
      <p className="lede">Control notifications, language, privacy and how your sevas are recorded.</p>

      <div className="split mt-[26px]">
        {/* ---------- LEFT ---------- */}
        <div>
          <div className="card">
            <span className="tag">Notifications</span>
            <Row id="sevaReminders" label="Seva reminders" sub="Alert 24 hours before every booked ritual" />
            <Row id="prasadUpdates" label="Prasad dispatch updates" sub="Courier tracking sent via SMS and email" />
            <Row id="festivalAnnouncements" label="Festival announcements" sub="Special pujas and temple festival calendars" />
            <Row id="promotionalOffers" label="Promotional offers" sub="Occasional offers from partner temples" />
          </div>

          <div className="card mt-[18px]">
            <span className="tag">Preferences</span>
            <div className="grid2">
              <div className="field">
                <label>Language</label>
                <select value={prefs.language} onChange={(e) => setPref('language', e.target.value)}>
                  <option>English</option>
                  <option>हिन्दी</option>
                  <option>தமிழ்</option>
                  <option>తెలుగు</option>
                  <option>ಕನ್ನಡ</option>
                </select>
              </div>
              <div className="field">
                <label>Currency</label>
                <select value={prefs.currency} onChange={(e) => setPref('currency', e.target.value)}>
                  <option>INR ₹</option>
                  <option>USD $</option>
                  <option>GBP £</option>
                </select>
              </div>
            </div>
            <div className="grid2">
              <div className="field">
                <label>Default City</label>
                <input value={prefs.city} onChange={(e) => setPref('city', e.target.value)} />
              </div>
              <div className="field">
                <label>Time Format</label>
                <select value={prefs.timeFormat} onChange={(e) => setPref('timeFormat', e.target.value)}>
                  <option>12 Hour</option>
                  <option>24 Hour</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card mt-[18px]">
            <span className="tag">Privacy &amp; Security</span>
            <Row id="twoFactor" label="Two-factor authentication" sub="OTP on every new device login" />
            <Row id="showNameInRecords" label="Show name in temple records" sub="Display your name on public seva registers" />
            <Row id="biometricLock" label="Biometric app lock" sub="Face or fingerprint to open the app" />
          </div>
        </div>

        {/* ---------- RIGHT ---------- */}
        <div>
          <div className="menu" style={{ marginTop: 0 }}>
            <button onClick={() => navigate('/profileDetails')}>
              Edit Profile <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/addressDetails')}>
              Saved Addresses <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/familyDetails')}>
              My Family <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/contact')}>
              Help Centre <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/contact')}>
              Terms &amp; Privacy Policy <span className="r">›</span>
            </button>
            <button disabled>
              About Book My Temples <span className="r">v2.4.0</span>
            </button>
          </div>

          <div className="card mt-[18px] text-center">
            <div className="text-[26px]">✦</div>
            <h4 className="serif mt-2 text-[17px]">One Day Puja</h4>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
              Sponsor a full day of rituals at any temple in your family's name.
            </p>
            <button className="btn-primary shimmer mt-3.5 block w-full" onClick={() => navigate('/pujas-homas')}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
