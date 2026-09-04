import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Fish, Pizza, Wheat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories, menuData } from './Menu';
import { useLanguage, type Language } from '../lib/i18n';
import menuImage from '../Img/al-gobbo-2026/pasta-wide-1600.webp';

const icons = { mare: Fish, terra: Wheat, pizza: Pizza };

const menuIntro: Record<Language, string> = {
  en: 'Venetian classics, seafood from the lagoon and Italian favourites made for the whole table.',
  it: 'Classici veneziani, pesce della laguna e grandi piatti italiani pensati per tutta la tavola.',
  fr: 'Classiques vénitiens, poissons de la lagune et grands plats italiens à partager.',
  de: 'Venezianische Klassiker, Fisch aus der Lagune und italienische Lieblingsgerichte für den ganzen Tisch.',
  es: 'Clásicos venecianos, pescado de la laguna y grandes platos italianos para compartir.',
};

const editorialCopy: Record<Language, { kicker: string; imageAlt: string; imageLabel: string; filters: string; categories: string; courses: string; seasonal: string; minimum: (count: number) => string }> = {
  it: { kicker: 'Cucina veneziana · Menu 2026', imageAlt: 'Un piatto della cucina di Al Gobbo di Rialto', imageLabel: 'Sapori di laguna', filters: 'Filtri del menu', categories: 'Categorie', courses: 'Portate', seasonal: 'Menu, prezzi e disponibilità possono cambiare in base alla stagione.', minimum: (count) => `Minimo ${count} persone` },
  en: { kicker: 'Venetian cuisine · Menu 2026', imageAlt: 'A dish from the kitchen of Al Gobbo di Rialto', imageLabel: 'Flavours of the lagoon', filters: 'Menu filters', categories: 'Categories', courses: 'Courses', seasonal: 'Menu, prices and availability may change with the season.', minimum: (count) => `Minimum ${count} people` },
  fr: { kicker: 'Cuisine vénitienne · Carte 2026', imageAlt: 'Un plat de la cuisine d’Al Gobbo di Rialto', imageLabel: 'Saveurs de la lagune', filters: 'Filtres de la carte', categories: 'Catégories', courses: 'Plats', seasonal: 'La carte, les prix et les disponibilités peuvent varier selon la saison.', minimum: (count) => `Minimum ${count} personnes` },
  de: { kicker: 'Venezianische Küche · Speisekarte 2026', imageAlt: 'Ein Gericht aus der Küche des Al Gobbo di Rialto', imageLabel: 'Aromen der Lagune', filters: 'Filter der Speisekarte', categories: 'Kategorien', courses: 'Gänge', seasonal: 'Speisekarte, Preise und Verfügbarkeit können sich saisonal ändern.', minimum: (count) => `Mindestens ${count} Personen` },
  es: { kicker: 'Cocina veneciana · Carta 2026', imageAlt: 'Un plato de la cocina de Al Gobbo di Rialto', imageLabel: 'Sabores de la laguna', filters: 'Filtros de la carta', categories: 'Categorías', courses: 'Platos', seasonal: 'La carta, los precios y la disponibilidad pueden variar según la temporada.', minimum: (count) => `Mínimo ${count} personas` },
};

export default function MenuEditorial() {
  const { language, t } = useLanguage();
  const copy = editorialCopy[language];
  const [activeCategory, setActiveCategory] = useState<'mare' | 'terra' | 'pizza'>('mare');
  const [activeSubcategory, setActiveSubcategory] = useState('antipasti');
  const activeCategoryData = categories.find((category) => category.id === activeCategory);
  const sections = menuData.filter((section) => section.category === activeCategory && section.subcategory === activeSubcategory);

  const changeCategory = (category: 'mare' | 'terra' | 'pizza') => {
    setActiveCategory(category);
    setActiveSubcategory(categories.find((item) => item.id === category)?.subcategories[0]?.id ?? '');
  };

  return (
    <main className="min-h-screen bg-venetian-sandstone pt-[84px] dark:bg-venetian-brown">
      <section className="mx-auto grid max-w-[1480px] border-x border-venetian-brown/15 lg:grid-cols-[1.05fr_0.95fr] dark:border-white/10">
        <div className="flex min-h-[280px] flex-col justify-end px-5 py-9 sm:min-h-[360px] sm:px-10 sm:py-12 lg:min-h-[520px] lg:px-16 lg:py-16">
          <p className="editorial-kicker">{copy.kicker}</p>
          <h1 className="mt-5 max-w-[9ch] font-serif text-6xl font-black uppercase leading-[0.76] tracking-[-0.05em] text-venetian-brown dark:text-white sm:text-9xl">{t('menu.title')}</h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-venetian-brown/70 dark:text-white/70 sm:mt-7 sm:text-base sm:leading-7">{menuIntro[language]}</p>
        </div>
        <div className="relative min-h-[240px] overflow-hidden sm:min-h-[320px] lg:min-h-[520px]">
          <img src={menuImage} alt={copy.imageAlt} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 bg-venetian-terracotta px-5 py-4 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white">{copy.imageLabel}</div>
        </div>
      </section>

      <section className="sticky top-[72px] z-30 border-y border-venetian-brown/15 bg-venetian-sandstone/95 backdrop-blur-lg dark:border-white/10 dark:bg-venetian-brown/95" aria-label={copy.filters}>
        <div className="mx-auto grid max-w-[1480px] gap-2 px-4 py-3 sm:px-7 lg:grid-cols-[auto_1fr] lg:items-center lg:px-10">
          <div className="grid grid-cols-3 gap-1" role="group" aria-label={copy.categories}>
            {categories.map((category) => {
              const Icon = icons[category.id];
              return (
                <button key={category.id} type="button" onClick={() => changeCategory(category.id)} aria-pressed={activeCategory === category.id} className={`inline-flex min-h-11 items-center justify-center gap-1.5 px-2 text-center text-[0.62rem] font-bold uppercase tracking-[0.08em] transition-colors sm:gap-2 sm:px-5 sm:text-[0.68rem] sm:tracking-[0.14em] ${activeCategory === category.id ? 'bg-venetian-brown text-white dark:bg-venetian-gold dark:text-venetian-brown' : 'text-venetian-brown/70 hover:text-venetian-terracotta dark:text-white/70'}`}>
                  <Icon className="h-4 w-4" />{t(`menu.categories.${category.id}`)}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-0 border-t border-venetian-brown/10 pt-2 dark:border-white/10 lg:justify-end lg:border-l lg:border-t-0 lg:pl-3 lg:pt-0" role="group" aria-label={copy.courses}>
            {activeCategoryData?.subcategories.map((subcategory) => (
              <button key={subcategory.id} type="button" onClick={() => setActiveSubcategory(subcategory.id)} aria-pressed={activeSubcategory === subcategory.id} className={`min-h-10 px-2.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] transition-colors sm:min-h-11 sm:px-4 sm:text-[0.68rem] sm:tracking-[0.14em] ${activeSubcategory === subcategory.id ? 'text-venetian-terracotta underline decoration-2 underline-offset-8' : 'text-venetian-brown/60 hover:text-venetian-brown dark:text-white/60 dark:hover:text-white'}`}>
                {t(`menu.subcategories.${subcategory.id}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-7 sm:py-24">
        <AnimatePresence mode="wait">
          {sections.map((section) => (
            <motion.div key={section.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <div className="grid gap-5 border-b border-venetian-brown pb-8 sm:grid-cols-[0.75fr_1.25fr] sm:items-end dark:border-white">
                <h2 className="font-serif text-5xl font-black uppercase leading-[0.82] tracking-[-0.04em] text-venetian-brown sm:text-7xl dark:text-white">{section.title}</h2>
                {section.description ? <p className="text-sm leading-6 text-venetian-brown/55 sm:text-right dark:text-white/55">{section.description}</p> : null}
              </div>

              <div className="divide-y divide-venetian-brown/15 dark:divide-white/10">
                {section.items.map((item, index) => (
                  <motion.article key={`${section.id}-${item.name}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(index * 0.035, 0.3) }} className={`grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:items-start ${item.isSpecial ? 'border-l-2 border-venetian-terracotta pl-5' : ''}`}>
                    <div>
                      <h3 className="font-serif text-2xl font-semibold leading-tight text-venetian-brown sm:text-3xl dark:text-white">{item.name}</h3>
                      {item.translation ? <p className="mt-1 text-sm italic text-venetian-brown/50 dark:text-white/50">{item.translation}</p> : null}
                      {item.description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-venetian-brown/60 dark:text-white/60">{item.description}</p> : null}
                      {item.minPersons || item.note ? <p className="mt-2 text-xs font-semibold text-venetian-terracotta">{item.note || copy.minimum(item.minPersons ?? 0)}</p> : null}
                    </div>
                    <p className="font-serif text-2xl font-semibold text-venetian-terracotta sm:text-3xl">{item.price}</p>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <aside className="mt-16 grid gap-5 border border-venetian-brown/20 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8 dark:border-white/20">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-venetian-brown dark:text-white">{t('menu.allergens.title')}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-venetian-brown/70 dark:text-white/70">{t('menu.allergens.note')} {copy.seasonal}</p>
          </div>
          <Link to="/book" className="editorial-link">{t('nav.reserve')}<ArrowRight className="h-4 w-4" /></Link>
        </aside>
      </section>
    </main>
  );
}
