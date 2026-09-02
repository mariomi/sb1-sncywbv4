import { Fish, Leaf, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import dishImage from '../Img/al-gobbo-2026/risotto-wide-1600.webp';

const dishes = [
  { name: 'Sarde in saor', text: 'Sardines with onions and a sweet-and-sour balance: a recipe shaped by Venice’s historic need to preserve food.' },
  { name: 'Baccalà mantecato', text: 'Salt cod worked until creamy, traditionally paired with polenta and served as an antipasto.' },
  { name: 'Bigoli in salsa', text: 'Thick Venetian pasta with a deeply savoury onion and anchovy sauce.' },
  { name: 'Risotto di mare', text: 'Rice cooked gradually with seafood flavours, made for a relaxed meal around the table.' },
];

export function VenetianCuisinePage() {
  return (
    <PageTransition>
      <SEOHead
        title="Venetian Cuisine and Traditional Dishes"
        canonical="/venetian-cuisine"
        description="Discover Venetian cuisine through sarde in saor, baccalà mantecato, bigoli in salsa and lagoon seafood at Al Gobbo di Rialto in Venice."
        availableLanguages={['en']}
      />
      <main className="min-h-screen bg-[#f7f3eb] pt-[84px] dark:bg-venetian-brown">
        <section className="mx-auto grid max-w-[1480px] bg-venetian-brown text-white lg:grid-cols-2">
            <div className="flex min-h-[560px] flex-col justify-end px-5 py-14 sm:px-10 lg:px-16 lg:py-20">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-venetian-gold">The lagoon at the table</p>
              <h1 className="mt-6 max-w-[10ch] font-serif text-6xl font-semibold leading-[0.8] tracking-[-0.04em] sm:text-8xl">A Short Guide to Venetian Cuisine</h1>
              <p className="mt-7 max-w-xl border-l-2 border-venetian-terracotta pl-5 text-base leading-7 text-white/65">Venetian food grew from lagoon ingredients, trade, seasonality and practical preservation. Its best-known dishes are direct, distinctive and inseparable from the city that created them.</p>
            </div>
            <img src={dishImage} alt="Venetian seafood dish served at Al Gobbo di Rialto" className="h-full min-h-[460px] w-full object-cover" decoding="async" />
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-[1480px] px-4 sm:px-7 lg:px-10">
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: Fish, title: 'Sea and lagoon', text: 'Fish, shellfish and preserved seafood give the cuisine much of its character.' },
                { icon: Leaf, title: 'Simple ingredients', text: 'Onion, polenta, rice and seasonal produce become dishes with remarkable depth.' },
                { icon: UtensilsCrossed, title: 'Food with history', text: 'Recipes tell the story of sailors, merchants, markets and family tables.' },
              ].map(item => (
                <article key={item.title} className="border-t border-venetian-brown p-7 dark:border-white">
                  <item.icon className="w-7 h-7 text-venetian-gold mb-4" />
                  <h2 className="font-serif text-2xl text-venetian-brown mb-3 dark:text-white">{item.title}</h2>
                  <p className="text-venetian-brown/70 leading-relaxed dark:text-white/70">{item.text}</p>
                </article>
              ))}
            </div>

            <div className="max-w-3xl mx-auto">
              <h2 className="mb-10 text-center font-serif text-5xl font-semibold text-venetian-brown sm:text-6xl dark:text-white">Four dishes to know</h2>
              <div className="divide-y divide-venetian-brown/15 border-y border-venetian-brown/15 px-2 sm:px-5 dark:divide-white/15 dark:border-white/15">
                {dishes.map(dish => (
                  <article key={dish.name} className="py-7">
                    <h3 className="font-serif text-2xl text-venetian-brown mb-2 dark:text-white">{dish.name}</h3>
                    <p className="text-venetian-brown/70 leading-relaxed dark:text-white/70">{dish.text}</p>
                  </article>
                ))}
              </div>
              <p className="mt-6 text-sm text-center text-venetian-brown/60 dark:text-white/60">Dishes and availability may vary. Ask the team about ingredients and allergens.</p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/menu" className="editorial-link-light">Explore the menu</Link>
                <Link to="/book" className="editorial-link">Book a table</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
