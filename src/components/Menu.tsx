import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fish, Wheat, Pizza, Loader2, Menu as MenuIcon } from 'lucide-react';

// Se usi questa util e i18n come nel progetto originale, lasciali;
// altrimenti puoi rimuovere cn/useLanguage e usare classi statiche.
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/i18n';

type MenuItem = {
  name: string;
  translation?: string;
  description?: string;
  price: string;
  isSpecial?: boolean;
  minPersons?: number;
  note?: string;
};

type MenuSection = {
  id: string;
  title: string;
  description?: string;
  items: MenuItem[];
  category: 'mare' | 'terra' | 'pizza';
  subcategory: 'antipasti' | 'primi' | 'secondi' | 'classic' | 'special' | 'calzoni';
};

// ===========================
// DATI MENU 2026 (aderenti al PDF)
// ===========================
const menuData: MenuSection[] = [
  // Antipasti di Mare
  {
    id: 'antipasti-mare',
    title: 'Antipasti di Mare',
    description: 'Antipasti di pesce della tradizione veneziana',
    category: 'mare',
    subcategory: 'antipasti',
    items: [
      { name: 'Insalata di mare', price: '€18' },
      { name: 'Sarde “in saòr”', price: '€15', isSpecial: true },
      { name: 'Salmone affumicato', price: '€16' },
      { name: 'Baccalà mantecato con polenta', price: '€18' },
      { name: 'Saltata di cozze e vongole', price: '€19' },
      { name: 'Capesante gratinate al forno (4 pz)', price: '€20' },
      { name: 'Tartare di tonno', price: '€22' },
      { name: 'Antipasto misto di pesce', price: '€30' },
      { name: 'Scampi crudi', price: '€24' },
    ],
  },

  // Antipasti di Terra
  {
    id: 'antipasti-terra',
    title: 'Antipasti di Terra',
    description: 'Selezione di antipasti “di terra”',
    category: 'terra',
    subcategory: 'antipasti',
    items: [
      { name: 'Bruschetta', price: '€7' },
      { name: 'Antipasto misto di verdure', price: '€16' },
      { name: 'Prosciutto crudo e melone', price: '€16' },
      { name: 'Caprese con burrata', price: '€15' },
      { name: 'Prosciutto crudo e burrata', price: '€19' },
      { name: 'Carpaccio di bresaola con rucola e grana', price: '€18' },
      { name: 'Tagliere di formaggi misti con confettura', price: '€20' },
      { name: 'Insalatona', price: '€18' },
      { name: 'Carpaccio di manzo con rucola e grana', price: '€20' },
      { name: 'Affettati misti', price: '€19' },
      { name: 'Petto d’oca affumicato con crostini e burro', price: '€18' },
    ],
  },

  // Primi di Mare
  {
    id: 'primi-mare',
    title: 'Primi di Mare',
    description: 'Paste e risotti di pesce',
    category: 'mare',
    subcategory: 'primi',
    items: [
      { name: 'Spaghetti alle vongole', price: '€18' },
      { name: 'Spaghetti al nero di seppia', price: '€18' },
      { name: 'Spaghetti allo scoglio', price: '€20' },
      { name: 'Gnocchi con crema di salmone', price: '€17' },
      { name: 'Pasticcio di pesce', price: '€16' },
      { name: 'Bigoli in salsa', price: '€18' },
      { name: 'Spaghetti alla «bùsara»', price: '€24' },
      { name: 'Tagliatelle all’astice', price: '€28' },
      { name: 'Risotto ai frutti di mare', price: '€22', minPersons: 2, note: 'Prezzo per persona, minimo 2' },
      { name: 'Zuppetta di mare', price: '€22' },
    ],
  },

  // Primi di Terra
  {
    id: 'primi-terra',
    title: 'Primi di Terra',
    description: 'Classici della cucina italiana',
    category: 'terra',
    subcategory: 'primi',
    items: [
      { name: 'Spaghetti al ragù o al pomodoro', price: '€15' },
      { name: 'Spaghetti alla carbonara', price: '€17' },
      { name: 'Tortellini panna e prosciutto', price: '€15' },
      { name: 'Lasagne al forno', price: '€16' },
      { name: 'Pasticcio di verdure di stagione', price: '€16' },
      { name: 'Parmigiana di melanzane al forno', price: '€16' },
      { name: 'Gnocchi ai quattro formaggi', price: '€15' },
      { name: 'Penne all’arrabbiata', price: '€15' },
      { name: 'Penne Primavera', price: '€15' },
      { name: 'Tagliolini con pomodorini, basilico e pecorino', price: '€17' },
      { name: 'Risotto alle verdure', price: '€20', minPersons: 2, note: 'Prezzo per persona, minimo 2' },
      { name: 'Zuppa di verdure', price: '€16' },
      { name: 'Pasta e fagioli', price: '€16' },
    ],
  },

  // Secondi di Mare
  {
    id: 'secondi-mare',
    title: 'Secondi di Mare',
    description: 'Secondi piatti di pesce',
    category: 'mare',
    subcategory: 'secondi',
    items: [
      { name: 'Branzino o orata ai ferri', price: '€22' },
      { name: 'Salmone ai ferri', price: '€20' },
      { name: 'Seppie alla veneziana con polenta', price: '€20' },
      { name: 'Calamari fritti', price: '€21' },
      { name: 'Fritto misto', price: '€26' },
      { name: 'Scampi alla «bùsara»', price: '€26' },
      { name: 'Rombo alla greca (al forno)', price: '€30' },
      { name: 'Branzino al forno con patate', price: '€28' },
      { name: 'Tagliata di tonno', price: '€28' },
      { name: 'Grigliata di pesce', price: '€34' },
      { name: 'Branzino al sale', price: '€70', minPersons: 2, note: 'Prezzo per 2 porzioni' },
      { name: 'Branzino al cartoccio', price: '€90', minPersons: 2, note: 'Prezzo per 2 porzioni' },
    ],
  },

  // Secondi di Terra
  {
    id: 'secondi-terra',
    title: 'Secondi di Terra',
    description: 'Carni e specialità',
    category: 'terra',
    subcategory: 'secondi',
    items: [
      { name: 'Cotoletta di pollo con patate', price: '€16' },
      { name: 'Galletto alla brace con patate e salsa speciale', price: '€28' },
      { name: 'Bistecca di manzo ai ferri', price: '€20' },
      { name: 'Fegato alla veneziana con polenta', price: '€19' },
      { name: 'Scaloppine al vino bianco', price: '€18' },
      { name: 'Costicine di agnello ai ferri', price: '€26' },
      { name: 'Costata o fiorentina di manzo alla brace (con salsa di melanzane affumicata e patatine fritte)', price: '€37' },
      { name: 'Filetto di manzo ai ferri', price: '€29' },
      { name: 'Filetto di manzo al pepe verde', price: '€32' },
      { name: 'Filetto di manzo ai funghi porcini', price: '€32' },
      { name: 'Contorno a scelta', price: '€6', note: 'Insalata mista, verdure ai ferri, spinaci, patate fritte, patate al forno, fondi di carciofo al vapore' },
    ],
  },

  // Pizze Classiche
  {
    id: 'pizza-classic',
    title: 'Pizze Classiche',
    category: 'pizza',
    subcategory: 'classic',
    items: [
      { name: 'Margherita', price: '€11', isSpecial: true },
      { name: 'Siciliana', price: '€13' },
      { name: 'Viennese', price: '€13' },
      { name: 'Diavola', price: '€14' },
      { name: 'Prosciutto e funghi', price: '€14' },
      { name: 'Capricciosa', price: '€15' },
      { name: '4 stagioni', price: '€16' },
    ],
  },

  // Calzoni
  {
    id: 'pizza-calzoni',
    title: 'Calzoni',
    category: 'pizza',
    subcategory: 'calzoni',
    items: [
      { name: 'Calzone classico', price: '€15' },
      { name: 'Calzone napoletano', price: '€16' },
    ],
  },

  // Pizze Speciali
  {
    id: 'pizza-special',
    title: 'Pizze Speciali',
    category: 'pizza',
    subcategory: 'special',
    items: [
      { name: '4 formaggi', price: '€16' },
      { name: 'Gorgospeck', price: '€16' },
      { name: 'Verdure', price: '€15' },
      { name: 'Ricotta e spinaci', price: '€15' },
      { name: 'San Daniele', price: '€16' },
      { name: 'Valtellina', price: '€16' },
      { name: 'Arrotolato paradiso', price: '€16' },
      { name: 'Gamberetti e zucchine', price: '€16' },
      { name: 'Carbonara', price: '€16' },
      { name: 'Scogliera', price: '€18' },
    ],
  },
];

const categories = [
  {
    id: 'mare' as const,
    name: 'Mare',
    icon: Fish,
    subcategories: [
      { id: 'antipasti', name: 'Antipasti' },
      { id: 'primi', name: 'Primi' },
      { id: 'secondi', name: 'Secondi' },
    ],
  },
  {
    id: 'terra' as const,
    name: 'Terra',
    icon: Wheat,
    subcategories: [
      { id: 'antipasti', name: 'Antipasti' },
      { id: 'primi', name: 'Primi' },
      { id: 'secondi', name: 'Secondi' },
    ],
  },
  {
    id: 'pizza' as const,
    name: 'Pizza',
    icon: Pizza,
    subcategories: [
      { id: 'classic', name: 'Classiche' },
      { id: 'special', name: 'Speciali' },
      { id: 'calzoni', name: 'Calzoni' },
    ],
  },
];

const RestaurantMenu2026 = () => {
  const [activeCategory, setActiveCategory] = useState<'mare' | 'terra' | 'pizza'>('mare');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('antipasti');
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { language } = useLanguage?.() || { language: 'it' };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeCategoryData = categories.find(c => c.id === activeCategory);
  const filteredSections = menuData.filter(
    section => section.category === activeCategory && section.subcategory === activeSubcategory
  );

  const handleCategoryChange = async (id: 'mare' | 'terra' | 'pizza') => {
    setIsLoading(true);
    setActiveCategory(id);
    setActiveSubcategory(categories.find(c => c.id === id)?.subcategories[0].id || '');
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsLoading(false);
    setShowMobileNav(false);
  };

  return (
    <div className="min-h-screen bg-venetian-sandstone/20">
      {/* Toggle Mobile */}
      <motion.button
        className="md:hidden fixed top-24 right-4 z-50 p-3 rounded-full bg-venetian-brown/80 text-white shadow-lg"
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMobileNav(!showMobileNav)}
        aria-label="Apri menu categorie"
      >
        <MenuIcon size={24} />
      </motion.button>

      {/* Drawer Mobile */}
      <AnimatePresence>
        {showMobileNav && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowMobileNav(false)}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-serif text-venetian-brown mb-4">Categorie</h3>
              <div className="space-y-2">
                {categories.map(({ id, name, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleCategoryChange(id)}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg flex items-center space-x-2",
                      activeCategory === id
                        ? "bg-venetian-gold/90 text-venetian-brown"
                        : "bg-venetian-brown/5 text-venetian-brown/70"
                    )}
                  >
                    <Icon size={18} />
                    <span>{name}</span>
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-serif text-venetian-brown mt-6 mb-4">Sottocategorie</h3>
              <div className="space-y-2">
                {activeCategoryData?.subcategories.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setActiveSubcategory(sub.id);
                      setShowMobileNav(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg text-sm font-medium",
                      activeSubcategory === sub.id
                        ? "bg-venetian-gold/80 text-venetian-brown"
                        : "bg-venetian-brown/5 text-venetian-brown/70"
                    )}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barre laterali categorie */}
      <motion.div
        className="sticky top-20 z-40"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col space-y-4">
          {/* Categorie (sinistra) */}
          <motion.div
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-3"
            animate={{ x: isScrolled ? 0 : -100, opacity: isScrolled ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {categories.map(({ id, name, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => handleCategoryChange(id)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative group",
                  activeCategory === id
                    ? "bg-venetian-gold/90 text-venetian-brown shadow-lg"
                    : "bg-venetian-brown/75 text-venetian-sandstone hover:text-white"
                )}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              >
                <motion.div animate={{ rotate: activeCategory === id ? 360 : 0 }} transition={{ duration: 0.5 }}>
                  <Icon size={18} />
                </motion.div>
                <span className="absolute left-12 bg-venetian-brown/90 text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium tracking-wide">
                  {name}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Sottocategorie (destra) */}
          <motion.div
            className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-3"
            animate={{ x: isScrolled ? 0 : 100, opacity: isScrolled ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeCategoryData?.subcategories.map(sub => (
              <motion.button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.id)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative group",
                  activeSubcategory === sub.id
                    ? "bg-venetian-gold/80 text-venetian-brown shadow-lg"
                    : "bg-venetian-brown/65 text-venetian-sandstone hover:text-white"
                )}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              >
                <span className="text-xs font-medium tracking-wider uppercase">{sub.name.slice(0, 2)}</span>
                <span className="absolute right-10 bg-venetian-brown/90 text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium tracking-wide">
                  {sub.name}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Header nav (solo top) */}
          <motion.div
            className="mx-4 sm:mx-6 lg:mx-8 pt-6 pb-12"
            animate={{ opacity: isScrolled ? 0 : 1, y: isScrolled ? -20 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-3">
              <motion.div
                className="bg-venetian-brown/75 backdrop-blur-sm shadow-xl rounded-2xl py-6"
                whileHover={{ backgroundColor: 'rgba(92, 64, 51, 0.85)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-center space-x-4">
                    {categories.map(({ id, name, icon: Icon }) => (
                      <motion.button
                        key={id}
                        onClick={() => handleCategoryChange(id)}
                        className={cn(
                          "px-6 py-2 rounded-xl flex items-center space-x-2",
                          activeCategory === id
                            ? "bg-venetian-gold/90 text-venetian-brown shadow-lg"
                            : "text-venetian-sandstone hover:text-white hover:bg-white/10"
                        )}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      >
                        <motion.div animate={{ rotate: activeCategory === id ? 360 : 0 }} transition={{ duration: 0.5 }}>
                          <Icon size={16} />
                        </motion.div>
                        <span className="font-medium text-sm tracking-wide">{name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-venetian-brown/65 backdrop-blur-sm shadow-lg rounded-xl py-3"
                whileHover={{ backgroundColor: 'rgba(92, 64, 51, 0.75)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-center space-x-4">
                    {activeCategoryData?.subcategories.map(sub => (
                      <motion.button
                        key={sub.id}
                        onClick={() => setActiveSubcategory(sub.id)}
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-xs tracking-wide uppercase font-medium",
                          activeSubcategory === sub.id
                            ? "bg-white/20 text-white shadow-sm"
                            : "text-venetian-sandstone hover:text-white hover:bg-white/10"
                        )}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      >
                        {sub.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Overlay loading */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-venetian-brown/20 backdrop-blur-sm z-50"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full p-3 bg-venetian-gold/20 backdrop-blur-md"
            >
              <Loader2 className="w-8 h-8 text-venetian-gold" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenuti */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        <AnimatePresence mode="wait">
          {filteredSections.map((section) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-4xl font-serif text-venetian-brown mb-3 tracking-wide">
                {section.title}
              </h2>
              {section.description && (
                <p className="text-venetian-brown/80 mb-10 font-medium text-lg">
                  {section.description}
                </p>
              )}

              <div className="space-y-8">
                <AnimatePresence>
                  {section.items.map((item, index) => (
                    <motion.div
                      key={`${section.id}-${item.name}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className={cn(
                        "p-8 rounded-2xl bg-white/95 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
                        item.isSpecial && "border-l-4 border-venetian-gold"
                      )}
                    >
                      <div className="flex justify-between items-start gap-8 mb-3">
                        <div>
                          <h3 className="text-2xl font-serif text-venetian-brown mb-1">
                            {item.name}
                          </h3>
                          {item.translation && (
                            <p className="text-base text-venetian-brown/60 italic font-medium">
                              {item.translation}
                            </p>
                          )}
                        </div>
                        <span className="text-xl font-serif text-venetian-brown whitespace-nowrap">
                          {item.price}
                          {(item.minPersons || item.note) && (
                            <span className="text-sm text-venetian-brown/60 ml-1">*</span>
                          )}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-venetian-brown/80 text-lg leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      {(item.minPersons || item.note) && (
                        <p className="text-sm text-venetian-brown/60 mt-2 italic">
                          {item.note || (item.minPersons ? `Minimo ${item.minPersons} persone` : '')}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          ))}
        </AnimatePresence>

        {/* Allergen / Note finali */}
        <div className="mt-20 p-8 bg-white/80 rounded-2xl shadow-md">
          <h3 className="text-lg font-serif text-venetian-brown mb-3">
            Allergeni e informazioni
          </h3>
          <p className="text-base text-venetian-brown/70 leading-relaxed">
            Comunica allo staff eventuali allergie o intolleranze. In base alla stagione
            alcuni prodotti potrebbero essere surgelati.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu2026;
