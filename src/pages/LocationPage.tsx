import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';

const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia';

export function LocationPage() {
  return (
    <PageTransition>
      <SEOHead
        title="Find Us Near Rialto"
        canonical="/location"
        description="Find Al Gobbo di Rialto at San Polo 649 in Venice, near the Rialto Bridge and market area. Open the map, get directions or call the restaurant."
        availableLanguages={['en']}
      />
      <main className="min-h-screen bg-venetian-sandstone/15 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-venetian-gold uppercase tracking-[0.2em] text-sm font-semibold mb-4">San Polo · Venice</p>
            <h1 className="font-serif text-4xl sm:text-6xl text-venetian-brown mb-5">Find Al Gobbo di Rialto</h1>
            <p className="text-lg text-venetian-brown/70 leading-relaxed">
              We are at San Polo 649, in the historic Rialto district. Open directions before you start walking: Venice rewards curiosity, but its calli can be wonderfully confusing.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-8">
            <div className="rounded-2xl overflow-hidden shadow-xl min-h-[460px] bg-white">
              <iframe
                title="Map showing Al Gobbo di Rialto in Venice"
                src="https://www.google.com/maps?q=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '460px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <aside className="rounded-2xl bg-venetian-brown text-white p-7 sm:p-8 shadow-xl">
              <div className="space-y-7">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-venetian-gold shrink-0" />
                  <div><h2 className="font-semibold mb-1">Address</h2><p className="text-venetian-sandstone/75">San Polo 649<br />30125 Venezia, Italy</p></div>
                </div>
                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-venetian-gold shrink-0" />
                  <div><h2 className="font-semibold mb-1">Opening</h2><p className="text-venetian-sandstone/75">Lunch and dinner<br />Closed Tuesday</p></div>
                </div>
                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-venetian-gold shrink-0" />
                  <div><h2 className="font-semibold mb-1">Phone</h2><a href="tel:+390415204603" className="text-venetian-sandstone/75 hover:text-venetian-gold">+39 041 520 4603</a></div>
                </div>
              </div>
              <div className="mt-9 space-y-3">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="click_directions"
                  className="flex items-center justify-center gap-2 rounded-xl bg-venetian-gold px-5 py-3.5 font-bold text-venetian-brown hover:bg-venetian-gold/90"
                >
                  <Navigation className="w-4 h-4" /> Get directions
                </a>
                <Link to="/book" className="block rounded-xl border border-white/25 px-5 py-3.5 text-center font-semibold hover:bg-white/10">
                  Book a table
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
