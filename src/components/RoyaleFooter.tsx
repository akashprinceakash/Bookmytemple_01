import { Link } from 'react-router-dom';

const logoImg = '/assets/logo_transparent.jpeg';

/**
 * Royale footer — mockup `footer` + `.fgrid`: a 1.4fr/1fr/1fr/1fr grid
 * inside the same 1240px column as the rest of the site, 46px logo mark
 * beside the wordmark, 13px muted links and the centred `.fbot` rule.
 */
export function RoyaleFooter() {
  return (
    <footer className="rfooter">
      <div className="fgrid">
        <div>
          <div className="foot-brand-row">
            <span className="foot-logo">
              <img src={logoImg} alt="Book My Temples" className="h-full w-full object-cover" style={{ border: '2px solid #ccc' }} />
            </span>
            <h5>Book My Temples</h5>
          </div>
          <p>
            Sacred sevas, pujas and darshan bookings at India's most revered temples — offered with
            devotion, delivered with proof.
          </p>
        </div>

        <div>
          <h5>Explore</h5>
          <Link to="/temples">All Temples</Link>
          <Link to="/pujas-homas">Special Pujas</Link>
          <Link to="/classes">Classes</Link>
        </div>

        <div>
          <h5>Account</h5>
          <Link to="/profile">Profile</Link>
          {/* <Link to="/settings">Settings</Link> */}
          <Link to="/my-bookings">My Bookings</Link>
          {/* <Link to="/gallery">Gallery</Link> */}
        </div>

        <div>
          <h5>Support</h5>
          {/* <a href="mailto:info@bookmytemples.com">info@bookmytemples.com</a> */}
          <a href="tel:+919964418889">+91 99644 18889</a>
          <Link to="/contact">Contact Us</Link>
          <Link to="/contact">Privacy &amp; Terms</Link>
        </div>
      </div>

      <div className="fbot">
        © {new Date().getFullYear()} Book My Temples · Crafted with devotion
      </div>
    </footer>
  );
}
