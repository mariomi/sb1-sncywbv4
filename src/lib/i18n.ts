import { createContext, useContext } from 'react';

export type Language = 'en' | 'it' | 'fr' | 'de' | 'es';

const baseTranslations = {
  en: {
    nav: {
      menu: 'Menu',
      about: 'About',
      gallery: 'Gallery',
      location: 'Location',
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
      title: 'Our Menu',
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
      gallery: 'Galleria',
      location: 'Dove siamo',
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
      title: 'Il Nostro Menu',
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

export const translations = {
  ...baseTranslations,
  fr: {
    ...baseTranslations.en,
    nav: {
      menu: 'Menu',
      about: 'Notre histoire',
      gallery: 'Galerie',
      location: 'Nous trouver',
      contact: 'Contact',
      reserve: 'Réserver',
      myReservations: 'Gérer ma réservation',
    },
    hero: {
      tagline: 'Depuis 1955 · San Polo, Venise',
      title: 'Venise s’invite\nà votre table',
      subtitle: 'Trois générations de passion vénitienne. Poissons et fruits de mer, pâtes et recettes traditionnelles — à quelques pas du Rialto.',
      reserveButton: 'Réserver une table',
      viewMenu: 'Découvrir le menu',
      scrollHint: 'Découvrir notre histoire',
    },
    story: {
      badge: 'Notre histoire',
      title: 'Une adresse vénitienne fidèle à ses racines',
      body1: 'Depuis 1955, Al Gobbo di Rialto accueille ses hôtes à San Polo 649, tout près du pont et du marché du Rialto. Trois générations ont transmis le même sens de l’hospitalité et le goût de la cuisine vénitienne.',
      body2: 'La ville évolue, notre cuisine reste attachée aux produits, aux gestes simples et aux saveurs de la lagune.',
      cta: 'Découvrir notre histoire',
    },
    whyUs: {
      badge: 'Pourquoi Al Gobbo',
      title: 'Une table qui raconte Venise',
      items: [
        { title: 'Près du marché du Rialto', description: 'Une adresse à San Polo, au cœur du quartier historique du Rialto.' },
        { title: 'Recettes vénitiennes', description: 'Sarde in saor, bigoli in salsa et baccalà mantecato parmi les spécialités de la maison.' },
        { title: 'Trois générations', description: 'Une hospitalité familiale et une histoire qui commence en 1955.' },
      ],
    },
    ctaBanner: {
      title: 'Votre table à Venise vous attend',
      subtitle: 'Déjeuner et dîner, tous les jours sauf le mardi. Réservez en ligne en une minute.',
      reserve: 'Réserver',
      orCall: 'ou appelez-nous',
    },
    gallery: {
      title: 'Les saveurs de Venise en images',
      subtitle: 'Découvrez nos plats, nos ingrédients et l’atmosphère d’Al Gobbo di Rialto.',
      groups: {
        dishes: { title: 'Plats signature', description: 'Les spécialités vénitiennes de la maison' },
        ingredients: { title: 'Ingrédients', description: 'Des produits choisis avec attention' },
        ambiance: { title: 'Le restaurant', description: 'Une atmosphère chaleureuse à San Polo' },
        desserts: { title: 'Desserts', description: 'Une touche sucrée pour terminer' },
      },
    },
    menu: {
      title: 'Notre Carte',
      categories: { mare: 'Poissons et fruits de mer', terra: 'Viandes et légumes', pizza: 'Pizza' },
      subcategories: { antipasti: 'Entrées', primi: 'Pâtes et risottos', secondi: 'Plats', classic: 'Pizzas classiques', special: 'Pizzas spéciales', calzoni: 'Calzoni', contorni: 'Accompagnements' },
      allergens: {
        title: 'Informations sur les allergènes',
        note: 'Signalez toute allergie ou exigence alimentaire à notre équipe.',
        list: { gluten: 'Gluten', milk: 'Lait', eggs: 'Œufs', fish: 'Poisson', shellfish: 'Crustacés', molluscs: 'Mollusques', nuts: 'Fruits à coque', celery: 'Céleri', sulfites: 'Sulfites' },
      },
    },
  },
  de: {
    ...baseTranslations.en,
    nav: {
      menu: 'Speisekarte',
      about: 'Unsere Geschichte',
      gallery: 'Galerie',
      location: 'Anfahrt',
      contact: 'Kontakt',
      reserve: 'Reservieren',
      myReservations: 'Reservierung verwalten',
    },
    hero: {
      tagline: 'Seit 1955 · San Polo, Venedig',
      title: 'Venedig kommt\nauf den Tisch',
      subtitle: 'Drei Generationen venezianischer Leidenschaft. Fisch und Meeresfrüchte, Pasta und traditionelle Rezepte — nur wenige Schritte vom Rialto entfernt.',
      reserveButton: 'Tisch reservieren',
      viewMenu: 'Speisekarte ansehen',
      scrollHint: 'Unsere Geschichte entdecken',
    },
    story: {
      badge: 'Unsere Geschichte',
      title: 'Eine venezianische Adresse mit festen Wurzeln',
      body1: 'Seit 1955 empfängt Al Gobbo di Rialto seine Gäste in San Polo 649, nahe der Rialtobrücke und dem Markt. Drei Generationen teilen dieselbe Gastfreundschaft und Liebe zur venezianischen Küche.',
      body2: 'Venedig verändert sich, doch unsere Küche bleibt den Zutaten, ehrlichem Handwerk und den Aromen der Lagune treu.',
      cta: 'Unsere Geschichte entdecken',
    },
    whyUs: {
      badge: 'Warum Al Gobbo',
      title: 'Ein Tisch, der von Venedig erzählt',
      items: [
        { title: 'Nahe dem Rialtomarkt', description: 'Mitten in San Polo, im historischen Rialtoviertel.' },
        { title: 'Venezianische Rezepte', description: 'Sarde in saor, Bigoli in salsa und Baccalà mantecato gehören zu unseren Spezialitäten.' },
        { title: 'Drei Generationen', description: 'Familiäre Gastfreundschaft und eine Geschichte, die 1955 begann.' },
      ],
    },
    ctaBanner: {
      title: 'Ihr Tisch in Venedig wartet',
      subtitle: 'Mittag- und Abendessen, täglich außer Dienstag. Online in einer Minute reservieren.',
      reserve: 'Jetzt reservieren',
      orCall: 'oder anrufen',
    },
    gallery: {
      title: 'Venedigs Aromen in Bildern',
      subtitle: 'Entdecken Sie unsere Gerichte, Zutaten und die Atmosphäre im Al Gobbo di Rialto.',
      groups: {
        dishes: { title: 'Spezialitäten', description: 'Beliebte venezianische Gerichte' },
        ingredients: { title: 'Zutaten', description: 'Sorgfältig ausgewählte Produkte' },
        ambiance: { title: 'Restaurant', description: 'Herzliche Atmosphäre in San Polo' },
        desserts: { title: 'Desserts', description: 'Ein süßer Abschluss' },
      },
    },
    menu: {
      title: 'Unsere Speisekarte',
      categories: { mare: 'Fisch und Meeresfrüchte', terra: 'Fleisch und Gemüse', pizza: 'Pizza' },
      subcategories: { antipasti: 'Vorspeisen', primi: 'Pasta und Risotto', secondi: 'Hauptgerichte', classic: 'Klassische Pizzen', special: 'Spezialpizzen', calzoni: 'Calzoni', contorni: 'Beilagen' },
      allergens: {
        title: 'Allergeninformationen',
        note: 'Bitte informieren Sie unser Team über Allergien oder besondere Ernährungswünsche.',
        list: { gluten: 'Gluten', milk: 'Milch', eggs: 'Eier', fish: 'Fisch', shellfish: 'Krebstiere', molluscs: 'Weichtiere', nuts: 'Schalenfrüchte', celery: 'Sellerie', sulfites: 'Sulfite' },
      },
    },
  },
  es: {
    ...baseTranslations.en,
    nav: {
      menu: 'Carta',
      about: 'Nuestra historia',
      gallery: 'Galería',
      location: 'Cómo llegar',
      contact: 'Contacto',
      reserve: 'Reservar',
      myReservations: 'Gestionar reserva',
    },
    hero: {
      tagline: 'Desde 1955 · San Polo, Venecia',
      title: 'Venecia se sienta\na la mesa',
      subtitle: 'Tres generaciones de pasión veneciana. Pescado y marisco, pasta y recetas tradicionales — a pocos pasos de Rialto.',
      reserveButton: 'Reservar una mesa',
      viewMenu: 'Ver la carta',
      scrollHint: 'Descubrir nuestra historia',
    },
    story: {
      badge: 'Nuestra historia',
      title: 'Un rincón veneciano fiel a sus raíces',
      body1: 'Desde 1955, Al Gobbo di Rialto recibe a sus clientes en San Polo 649, cerca del puente y del mercado de Rialto. Tres generaciones comparten la misma hospitalidad y pasión por la cocina veneciana.',
      body2: 'Venecia cambia, pero nuestra cocina sigue fiel al producto, al trabajo honesto y a los sabores de la laguna.',
      cta: 'Descubrir nuestra historia',
    },
    whyUs: {
      badge: 'Por qué Al Gobbo',
      title: 'Una mesa que cuenta Venecia',
      items: [
        { title: 'Cerca del mercado de Rialto', description: 'En San Polo, en pleno barrio histórico de Rialto.' },
        { title: 'Recetas venecianas', description: 'Sarde in saor, bigoli in salsa y baccalà mantecato entre nuestras especialidades.' },
        { title: 'Tres generaciones', description: 'Hospitalidad familiar y una historia que comenzó en 1955.' },
      ],
    },
    ctaBanner: {
      title: 'Tu mesa en Venecia te espera',
      subtitle: 'Comida y cena, todos los días excepto el martes. Reserva online en un minuto.',
      reserve: 'Reservar ahora',
      orCall: 'o llámanos',
    },
    gallery: {
      title: 'Los sabores de Venecia en imágenes',
      subtitle: 'Descubre nuestros platos, ingredientes y el ambiente de Al Gobbo di Rialto.',
      groups: {
        dishes: { title: 'Platos destacados', description: 'Especialidades venecianas de la casa' },
        ingredients: { title: 'Ingredientes', description: 'Productos elegidos con cuidado' },
        ambiance: { title: 'El restaurante', description: 'Un ambiente acogedor en San Polo' },
        desserts: { title: 'Postres', description: 'El final más dulce' },
      },
    },
    menu: {
      title: 'Nuestra Carta',
      categories: { mare: 'Pescado y marisco', terra: 'Carnes y verduras', pizza: 'Pizza' },
      subcategories: { antipasti: 'Entrantes', primi: 'Pasta y risotto', secondi: 'Platos principales', classic: 'Pizzas clásicas', special: 'Pizzas especiales', calzoni: 'Calzoni', contorni: 'Guarniciones' },
      allergens: {
        title: 'Información sobre alérgenos',
        note: 'Informa a nuestro equipo sobre cualquier alergia o necesidad alimentaria.',
        list: { gluten: 'Gluten', milk: 'Leche', eggs: 'Huevos', fish: 'Pescado', shellfish: 'Crustáceos', molluscs: 'Moluscos', nuts: 'Frutos secos', celery: 'Apio', sulfites: 'Sulfitos' },
      },
    },
  },
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
