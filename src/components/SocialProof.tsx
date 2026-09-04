import { ArrowUpRight, Award, BadgeCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/i18n';

const proof = [
  { platform: 'Google', rating: '4.6/5', detail: '1,700+ reviews', href: 'https://www.google.com/maps/search/?api=1&query=Al+Gobbo+di+Rialto+Venezia', icon: Star },
  { platform: 'TheFork', rating: '9.4/10', detail: '2,000+ verified reviews', href: 'https://www.thefork.com/restaurant/ristorante-pizzeria-al-gobbo-di-rialto-r594937/reviews', icon: BadgeCheck },
  { platform: 'Tripadvisor', rating: "Travellers' Choice", detail: '2025 · 4.6/5', href: 'https://www.tripadvisor.com/Restaurant_Review-g187870-d20083361-Reviews-Ristorante_Pizzeria_Al_Gobbo_di_Rialto-Venice_Veneto.html', icon: Award },
];

export function SocialProof() {
  const { language } = useLanguage();
  const title = language === 'it' ? 'Scelto dagli ospiti, ogni giorno' : 'Chosen by guests, every day';

  return (
    <section aria-labelledby="social-proof-title" className="border-y border-venetian-brown/15 bg-[#d7d4c7] dark:border-white/10 dark:bg-[#231f20]">
      <div className="mx-auto grid max-w-[1480px] border-x border-venetian-brown/15 md:grid-cols-[0.72fr_1fr_1fr_1fr] dark:border-white/10">
        <div className="flex min-h-32 items-center border-b border-venetian-brown/15 p-6 md:border-b-0 md:border-r dark:border-white/10">
          <h2 id="social-proof-title" className="max-w-[12rem] font-serif text-2xl font-semibold leading-none text-venetian-brown dark:text-white">{title}</h2>
        </div>
        {proof.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.a
              key={item.platform}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-32 items-center gap-4 border-b border-venetian-brown/15 p-6 transition-colors hover:bg-white/45 md:border-b-0 md:border-r last:md:border-r-0 dark:border-white/10 dark:hover:bg-white/5"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              aria-label={`${item.platform}: ${item.rating}, ${item.detail}`}
            >
              <Icon className="h-6 w-6 shrink-0 text-venetian-terracotta" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-xl font-semibold leading-tight text-venetian-brown dark:text-white">{item.rating}</span>
                <span className="mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.12em] text-venetian-brown/55 dark:text-white/50">{item.platform} · {item.detail}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-venetian-brown/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-white/35" />
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
