import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

// Sensible defaults baked in directly so the map/directions work even if
// no .env file has been created yet — override via VITE_GOOGLE_MAPS_URL /
// VITE_GOOGLE_MAPS_EMBED_URL in .env if the shop address changes.
const DEFAULT_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=142+Gandhi+Bazaar+Main+Road+Chennai+Tamil+Nadu+600004';
const DEFAULT_MAPS_EMBED_URL = 'https://www.openstreetmap.org/export/embed.html?bbox=80.2607%2C13.0777%2C80.2807%2C13.0877&layer=mapnik&marker=13.0827%2C80.2707';

const mapsEmbedUrl = import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL || DEFAULT_MAPS_EMBED_URL;
const mapsUrl = import.meta.env.VITE_GOOGLE_MAPS_URL || DEFAULT_MAPS_URL;

export default function Contact() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Get in touch</span>
          <h1>Contact Us</h1>
        </div>

        <div className="contact-grid">
          <div className="contact-details">
            <div className="contact-row">
              <MapPin size={20} />
              <div>
                <strong>Address</strong>
                <p>142, Gandhi Bazaar Main Road, Chennai, Tamil Nadu 600004</p>
                {mapsUrl && (
                  <a href={mapsUrl} target="_blank" rel="noreferrer" className="directions-link">
                    Get Directions <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
            <div className="contact-row">
              <Phone size={20} />
              <div>
                <strong>Phone</strong>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="contact-row">
              <Mail size={20} />
              <div>
                <strong>Email</strong>
                <p>hello@sriramcakes.in</p>
              </div>
            </div>
            <div className="contact-row">
              <Clock size={20} />
              <div>
                <strong>Working Hours</strong>
                <p>Daily, 9:00 AM – 9:30 PM</p>
              </div>
            </div>
          </div>

          <div className="map-embed card">
            {mapsEmbedUrl ? (
              <iframe
                title="Sriram Cakes & Sweets Shop location"
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            ) : (
              <div className="map-placeholder">
                <MapPin size={28} />
                <p>Map will appear here once VITE_GOOGLE_MAPS_EMBED_URL is configured.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 2.5rem;
        }
        .contact-details { display: flex; flex-direction: column; gap: 1.5rem; }
        .contact-row { display: flex; gap: 1rem; align-items: flex-start; color: var(--maroon); }
        .contact-row strong { display: block; color: var(--brown); margin-bottom: 0.2rem; }
        .contact-row p { color: var(--brown-soft); margin: 0; }
        .directions-link {
          display: inline-flex; align-items: center; gap: 0.3rem;
          color: var(--maroon); font-weight: 700; font-size: 0.82rem;
          margin-top: 0.4rem;
        }
        .directions-link:hover { text-decoration: underline; }
        .map-embed {
          min-height: 340px;
          overflow: hidden;
          display: flex;
        }
        .map-placeholder {
          margin: auto;
          text-align: center;
          color: var(--brown-soft);
          padding: 2rem;
        }
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
