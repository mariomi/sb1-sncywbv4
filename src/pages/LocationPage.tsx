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
      <main className="min-h-screen bg-[#f7f3eb] pb-20 pt-[84px] dark:bg-venetian-brown">
        <div className="mx-auto max-w-[1480px] border-x border-venetian-brown/15 px-4 py-16 sm:px-10 sm:py-24 lg:px-16 dark:border-white/10">
          <div className="mb-12 grid gap-7 border-t border-venetian-brown pt-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-end dark:border-white">
            <div><p className="editorial-kicker">San Polo · Venice</p><h1 className="mt-5 max-w-[9ch] font-serif text-6xl font-semibold leading-[0.82] tracking-[-0.04em] text-venetian-brown sm:text-8xl dark:text-white">Find Al Gobbo di Rialto</h1></div>
            <p className="max-w-2xl text-base leading-7 text-venetian-brown/65 lg:justify-self-end dark:text-white/60">
              We are at San Polo 649, in the historic Rialto district. Open directions before you start walking: Venice rewards curiosity, but its calli can be wonderfully confusing.
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="min-h-[520px] overflow-hidden border border-venetian-brown/15 bg-white">
              <iframe
                title="Map showing Al Gobbo di Rialto in Venice"
                src="https://www.google.com/maps?q=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '520px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <aside className="bg-venetian-brown p-7 text-white sm:p-10">
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
                  className="flex min-h-12 items-center justify-center gap-2 bg-venetian-gold px-5 text-xs font-bold uppercase tracking-[0.14em] text-venetian-brown hover:bg-white"
                >
                  <Navigation className="w-4 h-4" /> Get directions
                </a>
                <Link to="/book" className="flex min-h-12 items-center justify-center border border-white/25 px-5 text-xs font-bold uppercase tracking-[0.14em] hover:border-white">
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
