import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';

export function NotFoundPage() {
  return (
    <PageTransition>
      <SEOHead title="Page not found" noindex />
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f7f3eb] px-4 pb-20 pt-32 text-center dark:bg-venetian-brown">
        <p className="editorial-kicker mb-5">404 · Venezia</p>
        <h1 className="max-w-3xl font-serif text-6xl font-semibold leading-[0.82] text-venetian-brown sm:text-8xl dark:text-white">This calle leads somewhere else</h1>
        <p className="mb-9 mt-6 text-venetian-brown/65 dark:text-white/60">The page you requested is not available.</p>
        <Link to="/" className="editorial-link">
          Return home
        </Link>
      </main>
    </PageTransition>
  );
}
