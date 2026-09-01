import { CheckCircle2, MapPin, Star, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { SocialProof } from '../components/SocialProof';
import seafoodImage from '../Img/food/IMG_2980.webp';
import restaurantImage from '../Img/G1/IMG_2960.webp';

type LandingConfig = {
  canonical: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lead: string;
  image: string;
  imageAlt: string;
  sectionTitle: string;
  sectionBody: string;
  highlights: { title: string; text: string }[];
  dishes: { name: string; description: string }[];
};

const configs = {
  rialto: {
    canonical: '/restaurant-near-rialto',
    title: 'Restaurant Near Rialto Bridge',
    description: 'Looking for a restaurant near Rialto Bridge? Discover authentic Venetian cooking, seafood and family hospitality at Al Gobbo di Rialto, San Polo 649.',
    eyebrow: 'San Polo 649 · Venice',
    heading: 'A Venetian Restaurant Near Rialto Bridge',
    lead: 'Step away from the busiest route around Rialto and settle into a quieter corner of San Polo. Al Gobbo di Rialto brings together traditional Venetian dishes, seafood, pizza and warm family hospitality.',
    image: restaurantImage,
    imageAlt: 'Dining room at Al Gobbo di Rialto near Rialto Bridge in Venice',
    sectionTitle: 'A table in the historic heart of Rialto',
    sectionBody: 'The Rialto district is where Venice has traded, cooked and gathered for centuries. Our restaurant is at San Polo 649, close to the bridge and market area, making it a practical stop for lunch or dinner while exploring the city on foot.',
    highlights: [
      { title: 'Close to Rialto', text: 'A San Polo address near the bridge and the historic market district.' },
      { title: 'Venetian choices', text: 'Sarde in saor, baccalà mantecato, bigoli in salsa and seafood risotto appear on the menu.' },
      { title: 'Book direct', text: 'See availability and reserve online without leaving the restaurant website.' },
    ],
    dishes: [
      { name: 'Sarde in saor', description: 'A Venetian sweet-and-sour preparation with deep roots in lagoon cooking.' },
      { name: 'Bigoli in salsa', description: 'Thick Venetian pasta served with the traditional savoury onion and fish sauce.' },
      { name: 'Seafood risotto', description: 'A classic choice for sharing the flavours of the sea at the table.' },
    ],
  },
  venetian: {
    canonical: '/venetian-restaurant-venice',
    title: 'Authentic Venetian Restaurant in Venice',
    description: 'Experience Venetian cuisine in Venice: traditional recipes, seafood and three generations of hospitality at Al Gobbo di Rialto near the Rialto district.',
    eyebrow: 'Venetian cuisine · Since 1955',
    heading: 'Authentic Venetian Food, Served with Family Hospitality',
    lead: 'Venetian cooking is shaped by the lagoon, trade routes and recipes designed to let good ingredients speak. At Al Gobbo di Rialto, those traditions sit alongside familiar Italian favourites in a relaxed San Polo setting.',
    image: seafoodImage,
    imageAlt: 'Venetian seafood dish at Al Gobbo di Rialto in Venice',
    sectionTitle: 'What makes a meal Venetian?',
    sectionBody: 'It is the balance between sea and land: preserved fish, creamy baccalà, pasta with deeply savoury sauces and risotto cooked for the whole table. The names stay in Italian because each dish carries a piece of local history.',
    highlights: [
      { title: 'Recipes with roots', text: 'Traditional dishes are presented clearly, with their original Venetian names.' },
      { title: 'A menu for the table', text: 'Seafood, meat, vegetarian choices and pizza make mixed groups easy to welcome.' },
      { title: 'Three generations', text: 'The restaurant’s story begins in 1955 and continues in the heart of San Polo.' },
    ],
    dishes: [
      { name: 'Baccalà mantecato', description: 'Salt cod whipped until creamy and served with polenta.' },
      { name: 'Sarde in saor', description: 'Sardines balanced with onions and the sweet-sour character of the Venetian pantry.' },
      { name: 'Bigoli in salsa', description: 'A robust pasta dish built around onions and anchovy, simple and unmistakably local.' },
    ],
  },
  seafood: {
    canonical: '/seafood-restaurant-rialto',
    title: 'Seafood Restaurant Near Rialto, Venice',
    description: 'Seafood restaurant in the Rialto area of Venice. Explore Venetian fish dishes, pasta, risotto and grilled seafood at Al Gobbo di Rialto.',
    eyebrow: 'Seafood · Rialto · Venice',
    heading: 'Seafood and Venetian Flavours Near Rialto',
    lead: 'From sarde in saor to grilled fish and seafood pasta, the menu follows Venice’s natural relationship with the lagoon and the Adriatic. Choose a classic recipe or build a relaxed seafood dinner to share.',
    image: seafoodImage,
    imageAlt: 'Seafood served at Al Gobbo di Rialto near Rialto in Venice',
    sectionTitle: 'From antipasto to the main course',
    sectionBody: 'Start with Venetian preserved fish or baccalà, continue with pasta, risotto or a seafood soup, then choose grilled or fried fish. The full menu also includes meat, vegetarian dishes and pizza for guests who prefer something different.',
    highlights: [
      { title: 'Venetian starters', text: 'Sarde in saor, baccalà mantecato and mixed seafood are among the available antipasti.' },
      { title: 'Pasta and risotto', text: 'Bigoli, spaghetti, gnocchi and seafood risotto cover both local and familiar favourites.' },
      { title: 'Grilled and fried fish', text: 'Sea bass, sea bream, tuna, calamari and mixed fry feature across the main courses.' },
    ],
    dishes: [
      { name: 'Spaghetti alle vongole', description: 'A direct, classic expression of pasta and clams.' },
      { name: 'Fritto misto', description: 'Mixed fried seafood served as a generous main course.' },
      { name: 'Grigliata di pesce', description: 'A mixed grill for diners who want to explore several flavours of the sea.' },
    ],
  },
} satisfies Record<string, LandingConfig>;

function LandingPage({ config }: { config: LandingConfig }) {
  return (
    <PageTransition>
      <SEOHead
        title={config.title}
        description={config.description}
        canonical={config.canonical}
        availableLanguages={['en']}
      />
      <main className="min-h-screen bg-venetian-sandstone/15 pt-20">
        <section className="bg-venetian-brown text-white py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-venetian-gold uppercase tracking-[0.2em] text-sm font-semibold mb-5">{config.eyebrow}</p>
              <h1 className="font-serif text-4xl sm:text-6xl leading-tight mb-6">{config.heading}</h1>
              <p className="text-lg text-venetian-sandstone/85 leading-relaxed mb-9 max-w-2xl">{config.lead}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/book" className="rounded-xl bg-venetian-gold px-7 py-3.5 text-center font-bold text-venetian-brown hover:bg-venetian-gold/90">
                  Book a table
                </Link>
                <Link to="/menu" className="rounded-xl border border-white/35 px-7 py-3.5 text-center font-semibold text-white hover:bg-white/10">
                  Explore the menu
                </Link>
              </div>
            </div>
            <img
              src={config.image}
              alt={config.imageAlt}
              className="w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl"
              decoding="async"
            />
          </div>
        </section>

        <SocialProof />

        <section className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <MapPin className="w-8 h-8 text-venetian-gold mb-5" />
              <h2 className="font-serif text-3xl sm:text-4xl text-venetian-brown mb-5">{config.sectionTitle}</h2>
              <p className="text-lg text-venetian-brown/75 leading-relaxed">{config.sectionBody}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {config.highlights.map(item => (
                <article key={item.title} className="rounded-2xl bg-white p-7 shadow-sm border border-venetian-brown/10">
                  <CheckCircle2 className="w-6 h-6 text-venetian-gold mb-4" />
                  <h3 className="font-serif text-xl text-venetian-brown mb-3">{item.title}</h3>
                  <p className="text-venetian-brown/70 leading-relaxed">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <UtensilsCrossed className="w-8 h-8 text-venetian-gold mx-auto mb-5" />
              <h2 className="font-serif text-3xl sm:text-4xl text-venetian-brown mb-4">A taste of the menu</h2>
              <p className="text-venetian-brown/65">Availability and recipes may vary. Please ask the team about daily choices and allergens.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {config.dishes.map(dish => (
                <article key={dish.name} className="rounded-2xl bg-venetian-sandstone/20 p-7">
                  <Star className="w-5 h-5 fill-venetian-gold text-venetian-gold mb-4" />
                  <h3 className="font-serif text-xl text-venetian-brown mb-3">{dish.name}</h3>
                  <p className="text-venetian-brown/70 leading-relaxed">{dish.description}</p>
                </article>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/book" className="inline-block rounded-xl bg-venetian-brown px-8 py-4 font-bold text-white hover:bg-venetian-brown/90">
                Your table in Venice is waiting
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}

export function RestaurantNearRialtoPage() {
  return <LandingPage config={configs.rialto} />;
}

export function VenetianRestaurantPage() {
  return <LandingPage config={configs.venetian} />;
}

export function SeafoodRestaurantPage() {
  return <LandingPage config={configs.seafood} />;
}
