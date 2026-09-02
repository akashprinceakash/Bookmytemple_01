import { useState, useEffect } from 'react';
import { PageShell } from '../components/PageShell';
import { Reveal } from '../components/Reveal';
import { Crumb, SectionHead, artFor, onImgError } from '../components/royale';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

/**
 * Classes — mockup PAGES.classes.
 * "Learn & Practice" header → `.cards3` grid of `.gcard` photo cards with
 * the price/Enrol row, closing on the `.cta-band`. Enrolment behaviour
 * and the API call are unchanged.
 */
export function Classes() {

  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleEnroll = (_classId: string) => {
    alert('Enrollment feature coming soon! You will be notified when classes begin.');
  };

  useEffect(() => {
    setLoading(true);

    api.get(`api/classes`)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];

        const mappedClasses = data.map((item: any) => ({
          id: item.id,
          name: item.title,
          description: item.description,
          duration: item.duration || 'TBD',
          image: item.profileImageUrl,
          price: 'Coming Soon',
          participants: 'TBD'
        }));

        setClasses(mappedClasses);
      })
      .catch((err) => {
        console.error(err);
        alert(
          err?.response?.data?.message ||
          'Failed to load classes'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell>
      <Crumb parts={[{ label: 'Home', to: '/home' }, { label: 'Classes' }]} />

      <SectionHead
        tag="Learn &amp; Practice"
        title="Classes"
        lede="Small-group sessions taught by resident acharyas and priests — for devotees who want to understand the ritual, not just receive it."
      />

      {loading && <p className="py-10 text-center text-muted-foreground">Loading classes...</p>}

      {!loading && classes.length === 0 && (
        <div className="card py-12 text-center text-muted-foreground">No classes found</div>
      )}

      {!loading && classes.length > 0 && (
        <Reveal>
          <div className="cards3">
            {classes.map((classItem, i) => (
              <div
                key={classItem.id}
                className="stagger-item flex"
                style={{ animationDelay: `${(i % 6) * 0.06}s` }}
              >
                <div className="gcard shimmer w-full flex-1" style={{ cursor: 'default' }}>
                  <div className={`art ${artFor(classItem.id || classItem.name)}`}>
                    {classItem.image && (
                      <img
                        src={classItem.image}
                        alt={classItem.name}
                        loading="lazy"
                        onError={onImgError}
                      />
                    )}
                  </div>

                  <div className="body">
                    <h4>{classItem.name}</h4>
                    {classItem.description && <p>{classItem.description}</p>}
                    <p className="text-gold-deep">
                      {[classItem.duration, classItem.participants].filter(Boolean).join(' · ')}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-3.5">
                      <span className="serif text-[18px] text-gold-soft">{classItem.price}</span>
                      <button className="mini" onClick={() => handleEnroll(classItem.id)}>
                        Enrol
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      <div className="card mt-10">
        <span className="tag">How It Works</span>
        <div className="row"><span>1 · Enrol</span><span>Select your preferred class and reserve a seat</span></div>
        <div className="row"><span>2 · Attend</span><span>Join live sessions via video call at scheduled times</span></div>
        <div className="row"><span>3 · Revisit</span><span>Access recordings and study materials anytime</span></div>
      </div>

      <div className="cta-band mt-12" style={{ marginLeft: 0, marginRight: 0, marginBottom: 0 }}>
        <h2>Learning deepens what devotion begins</h2>
        <p>All classes are held online and in person at select temples, with recordings shared after every session.</p>
        <button className="btn-primary shimmer" onClick={() => navigate('/contact')}>
          Ask a Question
        </button>
      </div>
    </PageShell>
  );
}
