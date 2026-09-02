import { useEffect, useState } from "react";
import { PageShell } from '../components/PageShell';
import { Crumb, SectionHead } from '../components/royale';

/**
 * Contact Us — mockup PAGES.contact.
 *
 * `.split`: the "Send a Message" `.card` with the `.field` / `.grid2`
 * form on the left; "Reach Us", the "Find us" map card (with the slowly
 * rotating gold ring) and "Common Questions" stacked on the right.
 *
 * The real BookMyTemples contact details, GST line and Google Maps embed
 * are preserved — only the presentation changed.
 */
export function ContactDetails() {

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: 'Booking enquiry',
    bookingId: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSend = () => {
    if (!form.name.trim() || !form.message.trim()) {
      alert('Please add your name and a message so we can help.');
      return;
    }

    // Opens the devotee-care mailbox with the enquiry pre-filled.
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Mobile: ${form.mobile}`,
      form.bookingId ? `Booking ID: ${form.bookingId}` : '',
      '',
      form.message,
    ]
      .filter(Boolean)
      .join('\n');

    window.location.href = `mailto:info@bookmytemples.com?subject=${encodeURIComponent(
      form.subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <PageShell>
      <Crumb parts={[{ label: 'Home', to: '/home' }, { label: 'Contact Us' }]} />

      <SectionHead
        tag="We are listening"
        title="Contact Us"
        lede="Questions about a seva, a booking or prasad delivery — our devotee care team replies within a few hours, every day of the week."
      />

      <div className="split">
        {/* ---------- MESSAGE FORM ---------- */}
        <div className="card">
          <span className="tag">Send a Message</span>

          <div className="grid2">
            <div className="field">
              <label>Your Name</label>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Aarav Sharma"
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div className="grid2">
            <div className="field">
              <label>Mobile</label>
              <input
                value={form.mobile}
                onChange={(e) => set('mobile', e.target.value)}
                placeholder="+91"
              />
            </div>
            <div className="field">
              <label>Subject</label>
              <select value={form.subject} onChange={(e) => set('subject', e.target.value)}>
                <option>Booking enquiry</option>
                <option>Prasad delivery</option>
                <option>Refund &amp; cancellation</option>
                <option>Temple partnership</option>
                <option>Something else</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Booking ID (optional)</label>
            <input
              value={form.bookingId}
              onChange={(e) => set('bookingId', e.target.value)}
              placeholder="BMT85241"
            />
          </div>

          <div className="field">
            <label>Message</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
              placeholder="Tell us how we can help…"
            />
          </div>

          <button className="btn-primary shimmer" onClick={handleSend}>
            Send Message
          </button>

          {sent && (
            <p className="mt-3 text-[12.5px] text-gold-soft">
              Thank you — our devotee care team will reply shortly.
            </p>
          )}
        </div>

        {/* ---------- CONTACT DETAILS ---------- */}
        <div>
          <div className="card">
            <span className="tag">Reach Us</span>
            <div className="row">
              <span>☎ Phone</span>
              <a href="tel:+919964418889" className="text-foreground hover:text-gold-soft">
                +91 99644 18889
              </a>
            </div>
            <div className="row">
              <span>✉ Email</span>
              <a href="mailto:info@bookmytemples.com" className="text-foreground hover:text-gold-soft">
                info@bookmytemples.com
              </a>
            </div>
            <div className="row">
              <span>◷ Hours</span>
              <span>6 AM – 10 PM, all days</span>
            </div>
            <div className="row">
              <span>◉ Office</span>
              <span className="text-right">
                Chamundi Divine Ventures LLP,
                <br />
                19, 31st Main Rd, 7th Block, Banagirinagara,
                <br />
                Banashankari 3rd Stage, Bengaluru, Karnataka 560085
              </span>
            </div>
            <div className="row">
              <span>GST</span>
              <span>29AAWFC1469R1ZA</span>
            </div>
          </div>

          <div className="card relative mt-[18px] overflow-hidden">
            <div
              className="pointer-events-none absolute -right-[60px] -top-[60px] h-[200px] w-[200px] rounded-full border border-gold-deep opacity-35"
              style={{ animation: 'spin 26s linear infinite' }}
            />
            <span className="tag">Find us</span>
            <div className="overflow-hidden rounded-[14px] border border-border">
              <iframe
                title="Book My Temples office location"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d375.3321669048014!2d77.5595299!3d12.9224747!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3fbf323c88b9%3A0x99778125c8699faa!2sBook%20My%20Temples!5e1!3m2!1sen!2sin!4v1781335175425!5m2!1sen!2sin"
                className="h-[190px] w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          <div className="card mt-[18px]">
            <span className="tag">Common Questions</span>
            <div className="row"><span>Can I cancel a seva?</span><span>Yes, up to 24 h</span></div>
            <div className="row"><span>Do I get proof?</span><span>Sankalpa video</span></div>
            <div className="row"><span>Prasad delivery time</span><span>2–4 days</span></div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
