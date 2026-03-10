import { createContext, useContext } from 'react';

export type Language = 'en' | 'it';

export const translations = {
  en: {
    nav: {
      menu: 'Menu',
      about: 'About',
      contact: 'Contact',
      reserve: 'Reserve',
      myReservations: 'My Reservations'
    },
    hero: {
      tagline: 'Since 1955 · San Polo, Venice',
      title: 'Where Venice\nComes to the Table',
      subtitle: 'Three generations of Venetian passion. Fresh fish from the lagoon, handmade pasta, and recipes that have survived centuries — served to you, tonight.',
      reserveButton: 'Reserve Your Table',
      viewMenu: 'Explore the Menu',
      scrollHint: 'Discover our story'
    },
    story: {
      badge: 'Our Story',
      title: 'A Corner of Venice That Never Changes',
      body1: 'In 1955, a small osteria opened its doors at San Polo 649 — a stone\'s throw from the Rialto Bridge, in the very heart of Venice. Three generations later, Al Gobbo di Rialto is still here, still cooking the same recipes, still welcoming guests as if they were family.',
      body2: 'We\'ve watched the tides of the lagoon for over seventy years. We\'ve seen the city change, but our kitchen has stayed true: local ingredients, honest cooking, the unmistakable flavors of the Venetian tradition.',
      cta: 'Discover Our History'
    },
    whyUs: {
      badge: 'Why Al Gobbo',
      title: 'The Reasons Our Guests Return',
      items: [
        {
          title: 'Fish from the Rialto Market',
          description: 'Every morning we choose the freshest catch at the historic Rialto fish market, 200 metres from our kitchen.'
        },
        {
          title: 'Recipes Handed Down for Generations',
          description: 'Bigoli in salsa, sarde in saor, risotto di gò — authentic Venetian recipes that our family has preserved for 70 years.'
        },
        {
          title: 'In the Heart of Venice',
          description: 'A hidden gem steps from the Rialto Bridge. Arrive on foot, by vaporetto, or by gondola — Venice will lead you here.'
        }
      ]
    },
    testimonials: {
      badge: 'Voices of Our Guests',
      title: 'What People Say About Us',
      items: [
        {
          text: 'The best Venetian meal of our entire trip. The sarde in saor were extraordinary, just like a Venetian grandma would make them. We will definitely be back.',
          author: 'James & Laura',
          origin: 'London, UK',
          stars: 5
        },
        {
          text: 'Authentic, warm, and unforgettable. The risotto di mare was a poem. The staff made us feel at home from the first moment.',
          author: 'Sophie M.',
          origin: 'Paris, France',
          stars: 5
        },
        {
          text: 'We ate here three evenings in a row — that says it all. The fritto misto was the best we had in all of Italy. Highly recommended!',
          author: 'Marco & Anna',
          origin: 'Milan, Italy',
          stars: 5
        }
      ]
    },
    ctaBanner: {
      title: 'Your Table in Venice is Waiting',
      subtitle: 'Lunch and dinner, every day except Tuesday. Book online in 60 seconds.',
      reserve: 'Book Now',
      orCall: 'or call us'
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
          description: 'Quality local produce from the Rialto Market'
        },
        ambiance: {
          title: 'Restaurant Ambiance',
          description: 'Experience our warm Venetian atmosphere'
        },
        desserts: {
          title: 'Desserts',
          description: 'Sweet endings to your Venetian meal'
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
      reserve: 'Prenota',
      myReservations: 'Le Mie Prenotazioni'
    },
    hero: {
      tagline: 'Dal 1955 · San Polo, Venezia',
      title: 'Dove Venezia\nSi Mette a Tavola',
      subtitle: 'Tre generazioni di passione veneziana. Pesce fresco della laguna, pasta fatta in casa, e ricette che resistono ai secoli — servite a te, questa sera.',
      reserveButton: 'Prenota il Tuo Tavolo',
      viewMenu: 'Scopri il Menu',
      scrollHint: 'Scopri la nostra storia'
    },
    story: {
      badge: 'La Nostra Storia',
      title: 'Un Angolo di Venezia che Non Cambia Mai',
      body1: 'Nel 1955 una piccola osteria aprì le porte a San Polo 649 — a due passi dal Ponte di Rialto, nel cuore pulsante di Venezia. Tre generazioni dopo, Al Gobbo di Rialto è ancora qui, a cucinare le stesse ricette, ad accogliere gli ospiti come fossero di famiglia.',
      body2: 'Osserviamo le maree della laguna da oltre settant\'anni. Abbiamo visto la città cambiare, ma la nostra cucina è rimasta fedele a se stessa: materie prime locali, cotture oneste, i sapori inconfondibili della tradizione veneziana.',
      cta: 'Scopri la Nostra Storia'
    },
    whyUs: {
      badge: 'Perché Al Gobbo',
      title: 'I Motivi per Cui i Nostri Ospiti Tornano',
      items: [
        {
          title: 'Pesce dal Mercato di Rialto',
          description: 'Ogni mattina scegliamo il pescato più fresco al mercato ittico del Rialto, a 200 metri dalla nostra cucina.'
        },
        {
          title: 'Ricette Tramandate di Generazione in Generazione',
          description: 'Bigoli in salsa, sarde in saor, risotto di gò — ricette veneziane autentiche che la nostra famiglia custodisce da 70 anni.'
        },
        {
          title: 'Nel Cuore di Venezia',
          description: 'Un angolo nascosto a pochi passi dal Ponte di Rialto. Arriva a piedi, in vaporetto, o in gondola — Venezia ti porta qui.'
        }
      ]
    },
    testimonials: {
      badge: 'Le Voci dei Nostri Ospiti',
      title: 'Cosa Dicono di Noi',
      items: [
        {
          text: 'Il miglior pasto veneziano di tutto il nostro viaggio. Le sarde in saor erano straordinarie, proprio come le farebbe una nonna veneziana. Torneremo sicuramente.',
          author: 'James & Laura',
          origin: 'Londra, UK',
          stars: 5
        },
        {
          text: 'Autentico, caldo, indimenticabile. Il risotto di mare era una poesia. Il personale ci ha fatto sentire a casa fin dal primo momento.',
          author: 'Sophie M.',
          origin: 'Parigi, Francia',
          stars: 5
        },
        {
          text: 'Siamo venuti tre sere di fila — questo la dice lunga. Il fritto misto era il migliore che abbiamo mangiato in tutta Italia. Consigliatissimo!',
          author: 'Marco & Anna',
          origin: 'Milano, Italia',
          stars: 5
        }
      ]
    },
    ctaBanner: {
      title: 'Il Tuo Tavolo a Venezia Ti Aspetta',
      subtitle: 'Pranzo e cena, tutti i giorni tranne il martedì. Prenota online in 60 secondi.',
      reserve: 'Prenota Ora',
      orCall: 'oppure chiamaci'
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
          description: 'Prodotti locali di qualità dal Mercato di Rialto'
        },
        ambiance: {
          title: 'Atmosfera del Ristorante',
          description: 'Vivi la nostra calda atmosfera veneziana'
        },
        desserts: {
          title: 'Dessert',
          description: 'Dolci conclusioni per il tuo pasto veneziano'
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
