import { createContext, useContext } from 'react';

export type Language = 'en' | 'it';

export const translations = {
  en: {
    nav: {
      menu: 'Menu',
      about: 'About',
      contact: 'Contact',
      reserve: 'Reserve'
    },
    hero: {
      title: 'Authentic Venetian Cuisine',
      subtitle: 'Experience the finest traditional dishes in the heart of Venice, where every meal tells a story of our rich culinary heritage.',
      reserveButton: 'Reserve a Table',
      viewMenu: 'View Menu'
    },
    gallery: {
      title: 'A Culinary Journey Through Venice',
      subtitle: 'Experience the artistry of our kitchen, where traditional Venetian recipes meet contemporary presentation',
      groups: {
        dishes: {
          title: 'Signature Dishes',
          description: 'Our most beloved Venetian specialties'
        },
        ingredients: {
          title: 'Fresh Ingredients',
          description: 'Quality local produce from Venice'
        },
        ambiance: {
          title: 'Restaurant Ambiance',
          description: 'Experience our warm atmosphere'
        },
        desserts: {
          title: 'Desserts',
          description: 'Sweet endings to your meal'
        }
      }
    },
    menu: {
      categories: {
        mare: 'Seafood',
        terra: 'Land',
        pizza: 'Pizza'
      },
      subcategories: {
        antipasti: 'Starters',
        primi: 'First Courses',
        secondi: 'Main Courses',
        classic: 'Classic Pizzas',
        special: 'Special Pizzas',
        calzoni: 'Calzoni',
        contorni: 'Side Dishes'
      },
      allergens: {
        title: 'Allergen Information',
        note: 'Please inform our staff about any allergies or dietary requirements.',
        list: {
          gluten: 'Gluten',
          milk: 'Milk',
          eggs: 'Eggs',
          fish: 'Fish',
          shellfish: 'Shellfish',
          molluscs: 'Molluscs',
          nuts: 'Nuts',
          celery: 'Celery',
          sulfites: 'Sulfites'
        }
      }
    }
  },
  it: {
    nav: {
      menu: 'Menu',
      about: 'Chi Siamo',
      contact: 'Contatti',
      reserve: 'Prenota'
    },
    hero: {
      title: 'Autentica Cucina Veneziana',
      subtitle: 'Scopri i migliori piatti tradizionali nel cuore di Venezia, dove ogni pietanza racconta una storia del nostro ricco patrimonio culinario.',
      reserveButton: 'Prenota un Tavolo',
      viewMenu: 'Vedi il Menu'
    },
    gallery: {
      title: 'Un Viaggio Culinario a Venezia',
      subtitle: 'Scopri l\'arte della nostra cucina, dove le ricette tradizionali veneziane incontrano la presentazione contemporanea',
      groups: {
        dishes: {
          title: 'Piatti Signature',
          description: 'Le nostre specialità veneziane più amate'
        },
        ingredients: {
          title: 'Ingredienti Freschi',
          description: 'Prodotti locali di qualità da Venezia'
        },
        ambiance: {
          title: 'Atmosfera del Ristorante',
          description: 'Vivi la nostra calda atmosfera'
        },
        desserts: {
          title: 'Dessert',
          description: 'Dolci conclusioni per il tuo pasto'
        }
      }
    },
    menu: {
      categories: {
        mare: 'Pesce',
        terra: 'Terra',
        pizza: 'Pizza'
      },
      subcategories: {
        antipasti: 'Antipasti',
        primi: 'Primi Piatti',
        secondi: 'Secondi Piatti',
        classic: 'Pizze Classiche',
        special: 'Pizze Speciali',
        calzoni: 'Calzoni',
        contorni: 'Contorni'
      },
      allergens: {
        title: 'Informazioni Allergeni',
        note: 'Si prega di informare il personale di eventuali allergie o esigenze alimentari.',
        list: {
          gluten: 'Glutine',
          milk: 'Latte',
          eggs: 'Uova',
          fish: 'Pesce',
          shellfish: 'Crostacei',
          molluscs: 'Molluschi',
          nuts: 'Frutta a guscio',
          celery: 'Sedano',
          sulfites: 'Anidride solforosa'
        }
      }
    }
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}