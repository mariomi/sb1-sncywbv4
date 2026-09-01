import { Gallery } from '../components/Gallery';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';

export function GalleryPage() {
  return (
    <PageTransition>
      <SEOHead
        title="Gallery"
        canonical="/gallery"
        description="Explore the dishes and atmosphere of Ristorante Al Gobbo di Rialto in Venice, near the Rialto district."
      />
      <main className="bg-venetian-brown pt-[84px]">
        <Gallery />
      </main>
    </PageTransition>
  );
}
