import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';

export function NotFoundPage() {
  return (
    <PageTransition>
      <SEOHead title="Page not found" noindex />
      <main className="min-h-screen bg-venetian-sandstone/20 pt-32 px-4 text-center">
        <p className="text-venetian-gold font-semibold tracking-widest uppercase mb-4">404</p>
        <h1 className="font-serif text-4xl text-venetian-brown mb-4">This calle leads somewhere else</h1>
        <p className="text-venetian-brown/70 mb-8">The page you requested is not available.</p>
        <Link to="/" className="inline-block rounded-xl bg-venetian-brown px-7 py-3 text-white font-semibold hover:bg-venetian-brown/90">
          Return home
        </Link>
      </main>
    </PageTransition>
  );
}
