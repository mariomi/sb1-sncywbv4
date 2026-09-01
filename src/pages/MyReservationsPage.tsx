import { motion } from 'framer-motion';
import { CalendarCheck, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import img2939 from '../Img/G1/IMG_2939.webp';

export function MyReservationsPage() {
  return (
    <PageTransition>
      <SEOHead title="Gestisci la prenotazione" canonical="/my-reservations" noindex />
      <div className="min-h-screen bg-[#f7f3eb] pb-20 pt-[84px]">
        <section className="relative mx-auto h-[42vh] min-h-[390px] max-w-[1480px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img2939})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
          <div className="relative flex h-full items-end px-5 py-12 sm:px-10 lg:px-16">
            <div className="text-left">
              <p className="mb-5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-venetian-gold">Il tuo tavolo</p>
              <h1 className="max-w-[9ch] font-serif text-6xl font-semibold leading-[0.82] text-white sm:text-8xl">
                Gestisci la prenotazione
              </h1>
              <p className="mt-5 border-l-2 border-venetian-terracotta pl-5 text-base text-white/70 sm:text-lg">
                Un accesso privato, direttamente dalla tua email
              </p>
            </div>
          </div>
        </section>

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-7 sm:py-20">
          <motion.div
            className="border-t border-venetian-brown bg-transparent pt-7 sm:pt-9"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-7 grid h-14 w-14 place-items-center bg-venetian-terracotta text-white">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h2 className="mb-3 font-serif text-4xl font-semibold text-venetian-brown sm:text-5xl">
              Apri il link nella conferma
            </h2>
            <p className="text-venetian-brown/75 leading-relaxed mb-6">
              Per proteggere i tuoi dati non mostriamo prenotazioni cercando un semplice indirizzo email.
              Usa il link personale presente nell&apos;email di conferma per vedere i dettagli e cancellare
              in sicurezza.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3 border-t border-venetian-brown/15 py-4">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-venetian-terracotta" />
                <p className="text-sm text-venetian-brown/75">
                  Controlla anche la cartella spam. L&apos;oggetto contiene la conferma della prenotazione.
                </p>
              </div>
              <div className="flex items-start gap-3 border-y border-venetian-brown/15 py-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-venetian-terracotta" />
                <p className="text-sm text-venetian-brown/75">
                  Non trovi l&apos;email? Chiamaci al{' '}
                  <a className="font-medium text-venetian-brown hover:text-venetian-gold" href="tel:+390415204603">
                    +39 041 520 4603
                  </a>.
                </p>
              </div>
            </div>

            <Link
              to="/book"
              className="inline-flex min-h-12 w-full items-center justify-center bg-venetian-brown px-5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-venetian-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-terracotta"
            >
              <CalendarCheck className="w-4 h-4 mr-2" />
              Fai una nuova prenotazione
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
