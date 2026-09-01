import { Award, BadgeCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/i18n';

const proof = [
  {
    platform: 'Google',
    rating: '4.6/5',
    detail: '1,700+ reviews',
    href: 'https://www.google.com/maps/search/?api=1&query=Al+Gobbo+di+Rialto+Venezia',
    icon: Star,
  },
  {
    platform: 'TheFork',
    rating: '9.4/10',
    detail: '2,000+ verified reviews',
    href: 'https://www.thefork.com/restaurant/ristorante-pizzeria-al-gobbo-di-rialto-r594937/reviews',
    icon: BadgeCheck,
  },
  {
    platform: 'Tripadvisor',
    rating: "Travellers' Choice",
    detail: '2025 · 4.6/5',
    href: 'https://www.tripadvisor.com/Restaurant_Review-g187870-d20083361-Reviews-Ristorante_Pizzeria_Al_Gobbo_di_Rialto-Venice_Veneto.html',
    icon: Award,
  },
];

export function SocialProof() {
  const { language } = useLanguage();
  const isItalian = language === 'it';

  return (
    <section aria-labelledby="social-proof-title" className="bg-venetian-brown py-7 border-y border-venetian-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="social-proof-title" className="sr-only">
          {isItalian ? 'Valutazioni verificate degli ospiti' : 'Verified guest ratings'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-6">
          {proof.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.platform}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center sm:justify-start gap-3 rounded-xl px-4 py-3 hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                aria-label={`${item.platform}: ${item.rating}, ${item.detail}`}
              >
                <Icon className="w-6 h-6 text-venetian-gold shrink-0" aria-hidden="true" />
                <span>
                  <span className="block text-white font-semibold leading-tight">{item.rating}</span>
                  <span className="block text-venetian-sandstone/90 text-xs mt-1">
                    {item.platform} · {item.detail}
                  </span>
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
