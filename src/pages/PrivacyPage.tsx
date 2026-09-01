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
      <main className="min-h-screen bg-venetian-sandstone/20 pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 dark:bg-venetian-brown/90 rounded-2xl shadow-xl p-6 sm:p-10">
            <h1 className="text-4xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-3">Privacy and Cookie Policy</h1>
            <p className="text-sm text-venetian-brown/60 dark:text-venetian-sandstone/60 mb-10">Last updated: 31 August 2026</p>

            <div className="space-y-10 text-venetian-brown/75 dark:text-venetian-sandstone/75 leading-relaxed">
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
                <button type="button" onClick={openCookieSettings} className="mt-5 rounded-xl border border-venetian-gold px-5 py-2.5 font-semibold text-venetian-brown dark:text-venetian-sandstone hover:bg-venetian-gold/10">Review cookie choices</button>
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
