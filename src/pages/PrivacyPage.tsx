import { Cookie, Database, Download, Mail, Shield } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';

export function PrivacyPage() {
  const openCookieSettings = () => window.dispatchEvent(new Event('open-cookie-settings'));

  return (
    <PageTransition>
      <SEOHead
        title="Privacy and Cookie Policy"
        canonical="/privacy"
        description="How Al Gobbo di Rialto processes reservation, contact and website analytics data, and how to manage cookie preferences."
        availableLanguages={['en']}
      />
      <main className="min-h-screen bg-[#f7f3eb] pb-20 pt-[84px] dark:bg-venetian-brown">
        <article className="mx-auto max-w-5xl px-4 py-16 sm:px-7 sm:py-24">
          <div className="border-t border-venetian-brown bg-transparent pt-7 dark:border-white">
            <p className="editorial-kicker mb-5">Legal · Transparency</p>
            <h1 className="max-w-[10ch] font-serif text-6xl font-semibold leading-[0.82] text-venetian-brown sm:text-8xl dark:text-white">Privacy and Cookie Policy</h1>
            <p className="text-sm text-venetian-brown/60 dark:text-venetian-sandstone/60 mb-10">Last updated: 31 August 2026</p>

            <div className="mt-14 space-y-0 leading-relaxed text-venetian-brown/70 dark:text-white/65 [&>section]:border-t [&>section]:border-venetian-brown/15 [&>section]:py-8 dark:[&>section]:border-white/12">
              <section>
                <div className="flex items-center gap-3 mb-4"><Shield className="w-6 h-6 text-venetian-gold" /><h2 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">Who processes your data</h2></div>
                <p>Al Gobbo di Rialto, San Polo 649, 30125 Venezia, Italy, processes personal data submitted through this website. For privacy requests, use the website contact form or call <a href="tel:+390415204603" className="text-venetian-gold hover:underline">+39 041 520 4603</a>.</p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4"><Database className="w-6 h-6 text-venetian-gold" /><h2 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">Data and purposes</h2></div>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Reservation details: name, email, phone, date, time, party size, notes and booking status, used to manage the requested reservation.</li>
                  <li>Contact messages: name, email, subject and message, used to answer the request.</li>
                  <li>Technical security data, such as request time and network information, used to protect the service from misuse.</li>
                  <li>Campaign and website interaction data, used only when the relevant consent is given, to measure visits and completed bookings.</li>
                </ul>
                <p className="mt-4">The legal basis is taking steps requested by you and providing the reservation service; legitimate interests in keeping the service secure; and consent for optional analytics or advertising technologies. Required booking fields are needed to process the reservation.</p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4"><Cookie className="w-6 h-6 text-venetian-gold" /><h2 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">Cookies and measurement</h2></div>
                <p>Essential storage keeps language and consent choices and supports core website functions. With your permission, the site can load Google Analytics, Google Tag Manager, Google Ads measurement and the Meta Pixel. These services may process device, browsing and campaign data under their own terms. Optional tags remain disabled until you consent, and the site does not send your booking name, email, phone number or notes to analytics providers.</p>
                <button type="button" onClick={openCookieSettings} className="mt-5 inline-flex min-h-12 items-center justify-center border border-venetian-brown px-5 text-xs font-bold uppercase tracking-[0.14em] text-venetian-brown hover:border-venetian-terracotta hover:text-venetian-terracotta dark:border-white dark:text-white">Review cookie choices</button>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4"><Mail className="w-6 h-6 text-venetian-gold" /><h2 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">Service providers and transfers</h2></div>
                <p>The website uses Supabase for application data and authentication and Resend for transactional emails. If you enable optional measurement, Google and Meta technologies may also be used. Providers process data under their contractual safeguards; some processing may occur outside the European Economic Area using the safeguards made available by those providers.</p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4"><Download className="w-6 h-6 text-venetian-gold" /><h2 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">Retention and your rights</h2></div>
                <p>Data is retained only for as long as needed to handle the request, meet applicable legal obligations and resolve disputes. You may request access, correction, deletion, restriction, portability or object to processing where applicable. You may withdraw optional consent at any time through cookie settings, without affecting prior lawful processing. You may also complain to the competent data-protection authority.</p>
              </section>
            </div>
          </div>
        </article>
      </main>
    </PageTransition>
  );
}
