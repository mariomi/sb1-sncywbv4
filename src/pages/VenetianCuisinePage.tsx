import { Fish, Leaf, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import dishImage from '../Img/food/IMG_2980.webp';

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
      <main className="min-h-screen bg-venetian-sandstone/15 pt-20">
        <section className="bg-venetian-brown text-white py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-venetian-gold uppercase tracking-[0.2em] text-sm font-semibold mb-5">The lagoon at the table</p>
              <h1 className="font-serif text-4xl sm:text-6xl leading-tight mb-6">A Short Guide to Venetian Cuisine</h1>
              <p className="text-lg text-venetian-sandstone/85 leading-relaxed">Venetian food grew from lagoon ingredients, trade, seasonality and practical preservation. Its best-known dishes are direct, distinctive and inseparable from the city that created them.</p>
            </div>
            <img src={dishImage} alt="Venetian seafood dish served at Al Gobbo di Rialto" className="w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl" decoding="async" />
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: Fish, title: 'Sea and lagoon', text: 'Fish, shellfish and preserved seafood give the cuisine much of its character.' },
                { icon: Leaf, title: 'Simple ingredients', text: 'Onion, polenta, rice and seasonal produce become dishes with remarkable depth.' },
                { icon: UtensilsCrossed, title: 'Food with history', text: 'Recipes tell the story of sailors, merchants, markets and family tables.' },
              ].map(item => (
                <article key={item.title} className="rounded-2xl bg-white border border-venetian-brown/10 p-7 shadow-sm">
                  <item.icon className="w-7 h-7 text-venetian-gold mb-4" />
                  <h2 className="font-serif text-2xl text-venetian-brown mb-3">{item.title}</h2>
                  <p className="text-venetian-brown/70 leading-relaxed">{item.text}</p>
                </article>
              ))}
            </div>

            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl sm:text-4xl text-venetian-brown text-center mb-10">Four dishes to know</h2>
              <div className="divide-y divide-venetian-brown/15 rounded-2xl bg-white px-6 sm:px-9 shadow-sm">
                {dishes.map(dish => (
                  <article key={dish.name} className="py-7">
                    <h3 className="font-serif text-2xl text-venetian-brown mb-2">{dish.name}</h3>
                    <p className="text-venetian-brown/70 leading-relaxed">{dish.text}</p>
                  </article>
                ))}
              </div>
              <p className="mt-6 text-sm text-center text-venetian-brown/60">Dishes and availability may vary. Ask the team about ingredients and allergens.</p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/menu" className="rounded-xl border border-venetian-brown px-7 py-3.5 text-center font-semibold text-venetian-brown hover:bg-venetian-brown/5">Explore the menu</Link>
                <Link to="/book" className="rounded-xl bg-venetian-brown px-7 py-3.5 text-center font-bold text-white hover:bg-venetian-brown/90">Book a table</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
