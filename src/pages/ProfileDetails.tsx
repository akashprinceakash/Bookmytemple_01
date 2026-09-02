import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Crumb, SectionHead } from '../components/royale';

/**
 * Profile details — the editable counterpart of the profile mockup.
 * Uses the same `.split` / `.card` / `.field` / `.grid2` system so it
 * reads as one page with /profile and /settings. Save + validation
 * behaviour and the profileCompleted flag are unchanged.
 */
export function ProfileDetails() {

  const navigate = useNavigate();

  const profileLabels: Record<string, string> = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone Number",
    nakshatra: "Nakshatra",
    gotra: "Gotra"
  };

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    nakshatra: "",
    gotra: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storedProfileCompleted, setStoredProfileCompleted] = useState(true);

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setLoading(true);

    const storedProfileCompleted =
      localStorage.getItem("profileCompleted") === "true";
    setStoredProfileCompleted(storedProfileCompleted);

    api.get('api/user/me')
      .then((res) => {
        const d = res.data;

        setProfile({
          firstName: d.firstName || '',
          lastName: d.lastName || '',
          phone: d.phone || '',
          email: d.email || '',
          nakshatra: d.nakshatra || '',
          gotra: d.gotra || ''
        });
      })
      .finally(() => setLoading(false));

    if (!storedProfileCompleted) {
      setIsEditing(true);
    }
  }, []);

  const handleSave = () => {
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      alert('Please enter valid email');
      return;
    }
    api.put('api/user/me', profile)
      .then(() => {
        setIsEditing(false);
        localStorage.setItem('profileCompleted', 'true');
        navigate('/profile');
      })
      .finally(() => { });
  };

  const formatLabel = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || 'G';
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  const fields = Object.keys(profile);

  return (
    <PageShell>
      <Crumb
        parts={[
          { label: 'Home', to: '/home' },
          { label: 'Profile', to: '/profile' },
          { label: 'My Profile' },
        ]}
      />

      <SectionHead
        tag="Your Account"
        title="My Profile"
        lede="Your name, gotra and nakshatra are read out in the sankalpa at every seva you offer."
      />

      <div className="split">
        <div className="card">
          <div className="mb-5 flex flex-wrap items-center gap-5">
            <div className="avatar">{initials}</div>
            <div className="min-w-[180px] flex-1">
              <h3 className="serif text-[22px]">{fullName || 'Devotee'}</h3>
              <p className="mt-1 text-[13.5px] text-muted-foreground">
                {profile.email || 'Add your email to receive receipts'}
              </p>
            </div>
          </div>

          <div className="divider" />

          <span className="tag">Personal Details</span>

          {loading && <p className="py-6 text-center text-muted-foreground">Loading profile...</p>}

          {!loading && (
            <>
              <div className="grid2">
                {fields.map((key) => (
                  <div
                    key={key}
                    className="field"
                    style={key === 'nakshatra' || key === 'gotra' ? undefined : undefined}
                  >
                    <label>{profileLabels[key] ?? formatLabel(key)}</label>
                    <input
                      value={(profile as any)[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      disabled={!isEditing}
                      placeholder={profileLabels[key] ?? formatLabel(key)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-4">
                {isEditing ? (
                  <>
                    <button className="btn-primary shimmer flex-1" onClick={handleSave}>
                      Save Changes
                    </button>
                    <button
                      className="btn-ghost flex-1"
                      onClick={() => setIsEditing(false)}
                      disabled={!storedProfileCompleted}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn-primary shimmer w-full" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div>
          <div className="menu" style={{ marginTop: 0 }}>
            <button onClick={() => navigate('/familyDetails')}>
              My Family <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/addressDetails')}>
              My Address <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/my-bookings')}>
              My Bookings <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/settings')}>
              Settings <span className="r">›</span>
            </button>
            <button onClick={() => navigate('/contact')}>
              Help &amp; Support <span className="r">›</span>
            </button>
          </div>

          <div className="card mt-[18px]">
            <span className="tag">Why we ask</span>
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">
              Your gotra and nakshatra let the priest chant the sankalpa correctly in your name.
              They are shared only with the temple performing your seva.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
