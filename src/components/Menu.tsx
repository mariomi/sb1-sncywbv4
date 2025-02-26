import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fish, Wheat, Pizza, Loader2, Menu as MenuIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/i18n';

type MenuItem = {
  name: string;
  translation?: string;
  description: string;
  price: string;
  isSpecial?: boolean;
  minPersons?: number;
};

type MenuSection = {
  id: string;
  title: string;
  description: string;
  items: MenuItem[];
  category: 'mare' | 'terra' | 'pizza';
  subcategory: 'antipasti' | 'primi' | 'secondi' | 'classic' | 'special' | 'calzoni';
};

const menuData: MenuSection[] = [
  // ===========================
  // Antipasti di Mare
  // ===========================
  {
    id: 'antipasti-mare',
    title: 'Antipasti di Mare',
    description: 'Fresh seafood starters from the Venetian lagoon',
    category: 'mare',
    subcategory: 'antipasti',
    items: [
      {
        name: 'Insalata di mare',
        description: 'Fresh seafood salad with Mediterranean dressing',
        price: '€15'
      },
      {
        name: 'Sarde "in saòr"',
        description: 'Traditional Venetian sweet and sour sardines',
        price: '€13',
        isSpecial: true
      },
      {
        name: 'Salmone affumicato',
        description: 'Smoked salmon with lemon and toasted bread',
        price: '€15'
      },
      {
        name: 'Baccalà mantecato con polenta',
        description: 'Creamed salt cod served with polenta',
        price: '€15'
      },
      {
        name: 'Saltata di cozze e vongole',
        description: 'Sautéed mussels and clams with garlic and white wine',
        price: '€17'
      },
      {
        name: 'Capesante gratinate al forno',
        description: 'Baked scallops with a breadcrumb topping',
        price: '€18'
      },
      {
        name: 'Tartare di tonno',
        description: 'Raw tuna tartare with olive oil and capers',
        price: '€19'
      },
      {
        name: 'Antipasto misto di pesce',
        description: 'Mixed seafood appetizer with both raw and cooked fish',
        price: '€25'
      },
      {
        name: 'Scampi crudi',
        description: 'Fresh raw scampi with olive oil and lemon',
        price: '€24'
      }
    ]
  },
  // ===========================
  // Antipasti di Terra
  // ===========================
  {
    id: 'antipasti-terra',
    title: 'Antipasti di Terra',
    description: 'Traditional land starters',
    category: 'terra',
    subcategory: 'antipasti',
    items: [
      {
        name: 'Bruschetta',
        description: 'Toasted bread with fresh tomatoes',
        price: '€7'
      },
      {
        name: 'Antipasto misto di verdure',
        description: 'Mixed vegetable starter',
        price: '€15'
      },
      {
        name: 'Prosciutto crudo e melone',
        description: 'Cured ham with melon',
        price: '€14.5'
      },
      {
        name: 'Caprese con burrata',
        description: 'Tomato and burrata with basil',
        price: '€13'
      },
      {
        name: 'Prosciutto crudo e burrata',
        description: 'Cured ham with burrata',
        price: '€17'
      },
      {
        name: 'Carpaccio di bresaola con rucola e grana',
        description: 'Bresaola carpaccio with arugula and grated Grana Padano',
        price: '€15'
      },
      {
        name: 'Tagliere di formaggi misti con confettura',
        description: 'Mixed cheese platter with jam',
        price: '€18'
      },
      {
        name: 'Insalatona',
        description: 'Large mixed salad with tuna and mozzarella',
        price: '€16'
      },
      {
        name: 'Carpaccio di manzo con rucola e grana',
        description: 'Beef carpaccio with arugula and grated Grana Padano',
        price: '€18'
      },
      {
        name: 'Affettati misti',
        description: 'Assorted cured meats',
        price: '€17'
      },
      {
        name: 'Petto d’oca affumicato con crostini e burro',
        description: 'Smoked duck breast with toasted bread and butter',
        price: '€15'
      }
    ]
  },
  // ===========================
  // Primi di Mare
  // ===========================
  {
    id: 'primi-mare',
    title: 'Primi di Mare',
    description: 'Seafood pasta and risotto specialties',
    category: 'mare',
    subcategory: 'primi',
    items: [
      {
        name: 'Spaghetti alle vongole',
        description: 'Spaghetti with clams in white wine sauce',
        price: '€16'
      },
      {
        name: 'Spaghetti al nero di seppia',
        description: 'Spaghetti with cuttlefish ink sauce',
        price: '€16'
      },
      {
        name: 'Spaghetti allo scoglio',
        description: 'Seafood spaghetti with mixed shellfish and crustaceans',
        price: '€18'
      },
      {
        name: 'Gnocchi con crema di salmone',
        description: 'Potato gnocchi in a creamy salmon sauce',
        price: '€15'
      },
      {
        name: 'Pasticcio di pesce',
        description: 'Fish pie with egg pasta and bechamel sauce',
        price: '€14'
      },
      {
        name: 'Bigoli in salsa',
        description: 'Venetian bigoli pasta in an anchovy sauce',
        price: '€16'
      },
      {
        name: 'Spaghetti alla "bùsara"',
        description: 'Spaghetti with scampi in a spicy tomato sauce',
        price: '€20'
      },
      {
        name: 'Tagliatelle all’astice',
        description: 'Egg tagliatelle with lobster in tomato sauce',
        price: '€26'
      },
      {
        name: 'Risotto ai frutti di mare',
        description: 'Seafood risotto (min. 2 persons)',
        price: '€19',
        minPersons: 2
      },
      {
        name: 'Zuppetta di mare',
        description: 'Seafood soup with mixed shellfish and seafood',
        price: '€19'
      }
    ]
  },
  // ===========================
  // Primi di Terra
  // ===========================
  {
    id: 'primi-terra',
    title: 'Primi di Terra',
    description: 'Pasta and risotto specialties from the land',
    category: 'terra',
    subcategory: 'primi',
    items: [
      {
        name: 'Spaghetti al ragù o al pomodoro',
        description: 'Spaghetti with meat ragù or tomato sauce',
        price: '€12'
      },
      {
        name: 'Spaghetti alla carbonara',
        description: 'Spaghetti with pancetta, eggs and pecorino',
        price: '€15'
      },
      {
        name: 'Tortellini panna e prosciutto',
        description: 'Tortellini in cream sauce with ham',
        price: '€13'
      },
      {
        name: 'Lasagne al forno',
        description: 'Baked lasagna with meat ragù and bechamel sauce',
        price: '€14'
      },
      {
        name: 'Pasticcio di verdure di stagione',
        description: 'Vegetable pasta pie with bechamel and cheese',
        price: '€14'
      },
      {
        name: 'Parmigiana di melanzane al forno',
        description: 'Baked eggplant parmigiana with mozzarella and parmesan',
        price: '€14'
      },
      {
        name: 'Gnocchi ai quattro formaggi',
        description: 'Gnocchi with four cheeses',
        price: '€13'
      },
      {
        name: 'Penne all’arrabbiata',
        description: 'Penne in spicy tomato sauce',
        price: '€13'
      },
      {
        name: 'Penne Primavera',
        description: 'Penne with seasonal vegetables',
        price: '€13'
      },
      {
        name: 'Tagliolini con pomodorini, basilico e pecorino',
        description: 'Egg tagliatelle with cherry tomatoes, basil and pecorino',
        price: '€14.5'
      },
      {
        name: 'Risotto alle verdure',
        description: 'Vegetable risotto (min. 2 persons)',
        price: '€17',
        minPersons: 2
      },
      {
        name: 'Zuppa di verdure',
        description: 'Vegetable soup with seasonal vegetables',
        price: '€14'
      },
      {
        name: 'Pasta e fagioli',
        description: 'Pasta with beans and pancetta',
        price: '€14'
      }
    ]
  },
  // ===========================
  // Secondi di Mare
  // ===========================
  {
    id: 'secondi-mare',
    title: 'Secondi di Mare',
    description: 'Main seafood dishes',
    category: 'mare',
    subcategory: 'secondi',
    items: [
      {
        name: 'Branzino o orata ai ferri',
        description: 'Grilled sea bass or gilt-head bream',
        price: '€20'
      },
      {
        name: 'Salmone ai ferri',
        description: 'Grilled salmon fillet',
        price: '€18'
      },
      {
        name: 'Seppie alla veneziana con polenta',
        description: 'Venetian-style cuttlefish with polenta',
        price: '€18'
      },
      {
        name: 'Calamari fritti',
        description: 'Fried squid rings',
        price: '€18'
      },
      {
        name: 'Fritto misto',
        description: 'Mixed fried seafood',
        price: '€23'
      },
      {
        name: 'Scampi alla “bùsara”',
        description: 'Scampi in spicy tomato sauce',
        price: '€26'
      },
      {
        name: 'Rombo alla greca (al forno)',
        description: 'Baked turbot with Greek-inspired ingredients',
        price: '€27'
      },
      {
        name: 'Branzino al forno con patate',
        description: 'Baked sea bass with potatoes',
        price: '€25'
      },
      {
        name: 'Tagliata di tonno',
        description: 'Sliced grilled tuna with arugula and cherry tomatoes',
        price: '€25'
      },
      {
        name: 'Grigliata di pesce',
        description: 'Mixed grilled seafood platter',
        price: '€29'
      }
    ]
  },
  // ===========================
  // Secondi di Terra
  // ===========================
  {
    id: 'secondi-terra',
    title: 'Secondi di Terra',
    description: 'Main dishes from the land',
    category: 'terra',
    subcategory: 'secondi',
    items: [
      {
        name: 'Cotoletta di pollo con patate',
        description: 'Breaded chicken cutlet with potatoes',
        price: '€14'
      },
      {
        name: 'Petto di pollo ai funghi',
        description: 'Chicken breast with mushrooms in cream sauce',
        price: '€15'
      },
      {
        name: 'Bistecca di manzo ai ferri',
        description: 'Grilled beef steak',
        price: '€18'
      },
      {
        name: 'Fegato alla veneziana con polenta',
        description: 'Venetian-style calf liver with polenta',
        price: '€17'
      },
      {
        name: 'Scaloppine al vino bianco',
        description: 'Veal scaloppini in white wine sauce',
        price: '€16'
      },
      {
        name: 'Costicine di agnello ai ferri',
        description: 'Grilled lamb ribs',
        price: '€23'
      },
      {
        name: 'Tagliata di manzo rucola, grana con verdura e patate fritte',
        description: 'Sliced beef with arugula, grated Grana Padano, vegetables and fries',
        price: '€34'
      },
      {
        name: 'Filetto di manzo ai ferri',
        description: 'Grilled beef filet',
        price: '€27'
      },
      {
        name: 'Filetto di manzo al pepe verde',
        description: 'Beef filet with green pepper sauce',
        price: '€29'
      },
      {
        name: 'Filetto di manzo ai funghi porcini',
        description: 'Beef filet with porcini mushrooms',
        price: '€29'
      },
      {
        name: 'Contorno a scelta',
        description: 'Choice of side dish: salad, grilled vegetables, spinach, fries, roasted potatoes, steamed artichoke hearts',
        price: '€6'
      }
    ]
  },
  // ===========================
  // Pizze Classiche
  // ===========================
  {
    id: 'pizza-classic',
    title: 'Pizze Classiche',
    description: 'Traditional Venetian-style pizzas',
    category: 'pizza',
    subcategory: 'classic',
    items: [
      {
        name: 'Margherita',
        description: 'Classic Neapolitan pizza',
        price: '€10',
        isSpecial: true
      },
      {
        name: 'Siciliana',
        description: 'Pizza with anchovies, olives, capers and oregano',
        price: '€12'
      },
      {
        name: 'Viennese',
        description: 'Pizza with tomato, mozzarella and würstel',
        price: '€12'
      },
      {
        name: 'Diavola',
        description: 'Spicy pizza with salame piccante',
        price: '€13'
      },
      {
        name: 'Prosciutto e funghi',
        description: 'Pizza with ham and mushrooms',
        price: '€13'
      },
      {
        name: 'Capricciosa',
        description: 'Pizza with ham, mushrooms and artichokes',
        price: '€14'
      },
      {
        name: 'Quattro Stagioni',
        description: 'Pizza divided into four sections with different toppings',
        price: '€15'
      }
    ]
  },
  // ===========================
  // Calzoni
  // ===========================
  {
    id: 'pizza-calzoni',
    title: 'Calzoni',
    description: 'Traditional folded pizzas',
    category: 'pizza',
    subcategory: 'calzoni',
    items: [
      {
        name: 'Calzone Classico',
        description: 'Traditional folded pizza',
        price: '€14'
      },
      {
        name: 'Calzone Napoletano',
        description: 'Folded pizza with salame, ricotta and grana',
        price: '€15'
      }
    ]
  },
  // ===========================
  // Pizze Speciali
  // ===========================
  {
    id: 'pizza-special',
    title: 'Pizze Speciali',
    description: 'Gourmet specialty pizzas',
    category: 'pizza',
    subcategory: 'special',
    items: [
      {
        name: 'Quattro Formaggi',
        description: 'Four cheese pizza',
        price: '€14.50'
      },
      {
        name: 'Gorgospeck',
        description: 'Special pizza with gorgonzola and speck',
        price: '€14.50'
      },
      {
        name: 'Verdure',
        description: 'Vegetarian pizza with mixed vegetables',
        price: '€14'
      },
      {
        name: 'Ricotta e Spinaci',
        description: 'Pizza with ricotta and spinach',
        price: '€14'
      },
      {
        name: 'San Daniele',
        description: 'Pizza with San Daniele ham',
        price: '€15'
      },
      {
        name: 'Valtellina',
        description: 'Pizza with bresaola, arugula and Grana',
        price: '€15'
      },
      {
        name: 'Arrotolato Paradiso',
        description: 'Rolled pizza with mozzarella, porcini, tomato, speck and arugula',
        price: '€14'
      },
      {
        name: 'Gamberetti e Zucchine',
        description: 'Pizza with shrimp and zucchini',
        price: '€15'
      },
      {
        name: 'Carbonara',
        description: 'Pizza carbonara style',
        price: '€15'
      },
      {
        name: 'Scogliera',
        description: 'Seafood pizza with mixed seafood toppings',
        price: '€17'
      }
    ]
  }
];

const categories = [
  { 
    id: 'mare' as const, 
    name: 'Mare', 
    icon: Fish,
    subcategories: [
      { id: 'antipasti', name: 'Antipasti' },
      { id: 'primi', name: 'Primi' },
      { id: 'secondi', name: 'Secondi' }
    ]
  },
  { 
    id: 'terra' as const, 
    name: 'Terra', 
    icon: Wheat,
    subcategories: [
      { id: 'antipasti', name: 'Antipasti' },
      { id: 'primi', name: 'Primi' },
      { id: 'secondi', name: 'Secondi' }
    ]
  },
  { 
    id: 'pizza' as const, 
    name: 'Pizza', 
    icon: Pizza,
    subcategories: [
      { id: 'classic', name: 'Classiche' },
      { id: 'special', name: 'Speciali' },
      { id: 'calzoni', name: 'Calzoni' }
    ]
  }
];

const RestaurantMenu = () => {
  const [activeCategory, setActiveCategory] = useState<'mare' | 'terra' | 'pizza'>('mare');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('antipasti');
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeCategory_data = categories.find(c => c.id === activeCategory);
  const filteredSections = menuData.filter(
    section => section.category === activeCategory && section.subcategory === activeSubcategory
  );

  const handleCategoryChange = async (id: 'mare' | 'terra' | 'pizza') => {
    setIsLoading(true);
    setActiveCategory(id);
    setActiveSubcategory(categories.find(c => c.id === id)?.subcategories[0].id || '');
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsLoading(false);
    setShowMobileNav(false);
  };

  return (
    <div className="min-h-screen bg-venetian-sandstone/20">
      {/* Mobile Navigation Toggle */}
      <motion.button
        className="md:hidden fixed top-24 right-4 z-50 p-3 rounded-full bg-venetian-brown/80 text-white shadow-lg"
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMobileNav(!showMobileNav)}
      >
        <MenuIcon size={24} />
      </motion.button>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {showMobileNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowMobileNav(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-serif text-venetian-brown mb-4">Categories</h3>
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

              <h3 className="text-lg font-serif text-venetian-brown mt-6 mb-4">Subcategories</h3>
              <div className="space-y-2">
                {activeCategory_data?.subcategories.map(sub => (
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

      {/* Navigation Container */}
      <motion.div 
        className="sticky top-20 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col space-y-4">
          {/* Main Categories Nav */}
          <motion.div 
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-3"
            animate={{
              x: isScrolled ? 0 : -100,
              opacity: isScrolled ? 1 : 0,
            }}
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: activeCategory === id ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon size={18} />
                </motion.div>
                <span className="absolute left-12 bg-venetian-brown/90 text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium tracking-wide">
                  {name}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Subcategories Nav */}
          <motion.div 
            className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-3"
            animate={{
              x: isScrolled ? 0 : 100,
              opacity: isScrolled ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            {activeCategory_data?.subcategories.map(sub => (
              <motion.button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.id)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative group",
                  activeSubcategory === sub.id
                    ? "bg-venetian-gold/80 text-venetian-brown shadow-lg"
                    : "bg-venetian-brown/65 text-venetian-sandstone hover:text-white"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xs font-medium tracking-wider uppercase">{sub.name.slice(0, 2)}</span>
                <span className="absolute right-10 bg-venetian-brown/90 text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium tracking-wide">
                  {sub.name}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Main Navigation (visible only at top) */}
          <motion.div 
            className="mx-4 sm:mx-6 lg:mx-8 pt-6 pb-12"
            animate={{
              opacity: isScrolled ? 0 : 1,
              y: isScrolled ? -20 : 0,
            }}
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
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          animate={{ rotate: activeCategory === id ? 360 : 0 }}
                          transition={{ duration: 0.5 }}
                        >
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
                    {activeCategory_data?.subcategories.map(sub => (
                      <motion.button
                        key={sub.id}
                        onClick={() => setActiveSubcategory(sub.id)}
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-xs tracking-wide uppercase font-medium",
                          activeSubcategory === sub.id
                            ? "bg-white/20 text-white shadow-sm"
                            : "text-venetian-sandstone hover:text-white hover:bg-white/10"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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

      {/* Loading Indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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
              <p className="text-venetian-brown/80 mb-10 font-medium text-lg">
                {section.description}
              </p>
              <div className="space-y-8">
                <AnimatePresence>
                  {section.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
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
                          {item.minPersons && (
                            <span className="text-sm text-venetian-brown/60 ml-1">
                              *
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-venetian-brown/80 text-lg leading-relaxed">
                        {item.description}
                      </p>
                      {item.minPersons && (
                        <p className="text-sm text-venetian-brown/60 mt-2 italic">
                          * Minimum {item.minPersons} persons
                        </p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          ))}
        </AnimatePresence>

        {/* Allergen Information */}
        <div className="mt-20 p-8 bg-white/80 rounded-2xl shadow-md">
          <h3 className="text-lg font-serif text-venetian-brown mb-3">
            Allergen Information
          </h3>
          <p className="text-base text-venetian-brown/70 leading-relaxed">
            Please inform our staff about any allergies or dietary requirements.
            Some products may be frozen when fresh products are not available.
            Prices include service and VAT.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
