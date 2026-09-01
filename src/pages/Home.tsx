import { Hero } from '../components/Hero';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';

export function Home() {
  return (
    <PageTransition>
      <SEOHead
        canonical="/"
        description="Ristorante storico a Venezia dal 1955. Cucina veneziana e un giardino nascosto a San Polo, vicino a Rialto. Prenota online."
      />
      <main className="overflow-x-clip bg-[#faf8f3]">
        <Hero />
      </main>
    </PageTransition>
  );
}
