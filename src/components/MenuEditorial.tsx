import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Fish, Pizza, Wheat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories, menuData } from './Menu';
import { useLanguage, type Language } from '../lib/i18n';
import menuImage from '../Img/food/IMG_2985.webp';

const icons = { mare: Fish, terra: Wheat, pizza: Pizza };

const menuIntro: Record<Language, string> = {
  en: 'Venetian classics, seafood from the lagoon and Italian favourites made for the whole table.',
  it: 'Classici veneziani, pesce della laguna e grandi piatti italiani pensati per tutta la tavola.',
  fr: 'Classiques vénitiens, poissons de la lagune et grands plats italiens à partager.',
  de: 'Venezianische Klassiker, Fisch aus der Lagune und italienische Lieblingsgerichte für den ganzen Tisch.',
  es: 'Clásicos venecianos, pescado de la laguna y grandes platos italianos para compartir.',
};

export default function MenuEditorial() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'mare' | 'terra' | 'pizza'>('mare');
  const [activeSubcategory, setActiveSubcategory] = useState('antipasti');
  const activeCategoryData = categories.find((category) => category.id === activeCategory);
  const sections = menuData.filter((section) => section.category === activeCategory && section.subcategory === activeSubcategory);

  const changeCategory = (category: 'mare' | 'terra' | 'pizza') => {
    setActiveCategory(category);
    setActiveSubcategory(categories.find((item) => item.id === category)?.subcategories[0]?.id ?? '');
  };

  return (
    <main className="min-h-screen bg-[#f7f3eb] pt-[84px] dark:bg-venetian-brown">
      <section className="mx-auto grid max-w-[1480px] border-x border-venetian-brown/15 lg:grid-cols-[1.05fr_0.95fr] dark:border-white/10">
        <div className="flex min-h-[430px] flex-col justify-end px-5 py-12 sm:px-10 lg:px-16 lg:py-16">
          <p className="editorial-kicker">Cucina veneziana · Menu 2026</p>
          <h1 className="mt-5 max-w-[8ch] font-serif text-6xl font-semibold leading-[0.82] tracking-[-0.035em] text-venetian-brown sm:text-8xl dark:text-white">{t('menu.title')}</h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-venetian-brown/65 dark:text-white/60">{menuIntro[language]}</p>
        </div>
        <div className="relative min-h-[360px] overflow-hidden lg:min-h-[520px]">
          <img src={menuImage} alt="Piatto della cucina di Al Gobbo di Rialto" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 bg-venetian-terracotta px-5 py-4 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white">Sapori di laguna</div>
        </div>
      </section>

      <section className="sticky top-[72px] z-30 border-y border-venetian-brown/15 bg-[#f7f3eb]/95 backdrop-blur-lg dark:border-white/10 dark:bg-venetian-brown/95" aria-label="Menu filters">
        <div className="mx-auto max-w-[1480px] overflow-x-auto px-4 scrollbar-hide sm:px-7 lg:px-10">
          <div className="flex min-w-max items-center gap-1 py-3">
            {categories.map((category) => {
              const Icon = icons[category.id];
              return (
                <button key={category.id} type="button" onClick={() => changeCategory(category.id)} className={`inline-flex min-h-11 items-center gap-2 px-5 text-[0.68rem] font-bold uppercase tracking-[0.14em] transition-colors ${activeCategory === category.id ? 'bg-venetian-brown text-white dark:bg-venetian-gold dark:text-venetian-brown' : 'text-venetian-brown/55 hover:text-venetian-terracotta dark:text-white/55'}`}>
                  <Icon className="h-4 w-4" />{t(`menu.categories.${category.id}`)}
                </button>
              );
            })}
            <span className="mx-2 h-7 w-px bg-venetian-brown/15 dark:bg-white/15" />
            {activeCategoryData?.subcategories.map((subcategory) => (
              <button key={subcategory.id} type="button" onClick={() => setActiveSubcategory(subcategory.id)} className={`min-h-11 px-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] transition-colors ${activeSubcategory === subcategory.id ? 'text-venetian-terracotta underline decoration-2 underline-offset-8' : 'text-venetian-brown/50 hover:text-venetian-brown dark:text-white/50 dark:hover:text-white'}`}>
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
                <h2 className="font-serif text-5xl font-semibold leading-none text-venetian-brown sm:text-7xl dark:text-white">{section.title}</h2>
                {section.description ? <p className="text-sm leading-6 text-venetian-brown/55 sm:text-right dark:text-white/55">{section.description}</p> : null}
              </div>

              <div className="divide-y divide-venetian-brown/15 dark:divide-white/12">
                {section.items.map((item, index) => (
                  <motion.article key={`${section.id}-${item.name}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(index * 0.035, 0.3) }} className={`grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:items-start ${item.isSpecial ? 'border-l-2 border-venetian-terracotta pl-5' : ''}`}>
                    <div>
                      <h3 className="font-serif text-2xl font-semibold leading-tight text-venetian-brown sm:text-3xl dark:text-white">{item.name}</h3>
                      {item.translation ? <p className="mt-1 text-sm italic text-venetian-brown/50 dark:text-white/50">{item.translation}</p> : null}
                      {item.description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-venetian-brown/60 dark:text-white/60">{item.description}</p> : null}
                      {item.minPersons || item.note ? <p className="mt-2 text-xs font-semibold text-venetian-terracotta">{item.note || `Minimo ${item.minPersons} persone`}</p> : null}
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
            <p className="mt-2 max-w-2xl text-sm leading-6 text-venetian-brown/60 dark:text-white/60">{t('menu.allergens.note')} {language === 'it' ? 'Menu, prezzi e disponibilità possono cambiare in base alla stagione.' : 'Menu, prices and availability may change with the season.'}</p>
          </div>
          <Link to="/book" className="editorial-link">{t('nav.reserve')}<ArrowRight className="h-4 w-4" /></Link>
        </aside>
      </section>
    </main>
  );
}
