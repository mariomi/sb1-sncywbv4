import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SEOHead } from '../components/SEOHead';
import { MapPin, Clock, Phone, Facebook, Instagram, Utensils } from 'lucide-react';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';
import toast from 'react-hot-toast';
import img2947 from '../Img/G1/IMG_2947.webp';
import { createContactMessage } from '../lib/api';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'reservation',
    message: ''
  });
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!privacyConsent) {
      toast.error('Please accept the privacy policy to continue');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createContactMessage({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      toast.success('Message sent successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'reservation',
        message: ''
      });
      setPrivacyConsent(false);
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <SEOHead
        title="Contatti"
        canonical="/contact"
        availableLanguages={['en']}
        description="Contatta il Ristorante Al Gobbo di Rialto a Venezia. Siamo in Sestiere San Polo 649, vicino al Ponte di Rialto. Tel: +39 041 520 4603. Scrivi un messaggio o vieni a trovarci."
      />
      <div className="min-h-screen bg-[#f7f3eb] pt-[84px] dark:bg-venetian-brown">
        {/* Hero Section */}
        <motion.section
          className="relative mx-auto h-[46vh] min-h-[420px] max-w-[1480px] overflow-hidden border-x border-venetian-brown/15 dark:border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${img2947})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
          <div className="relative flex h-full items-end px-5 py-12 sm:px-10 lg:px-16">
            <div className="max-w-3xl text-left">
              <p className="mb-5 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-venetian-gold">San Polo · Rialto</p>
              <motion.h1
                className="max-w-[8ch] font-serif text-6xl font-semibold leading-[0.82] text-white sm:text-8xl"
                {...fadeIn}
              >
                Contact Us
              </motion.h1>
              <motion.p
                className="mt-5 border-l-2 border-venetian-terracotta pl-5 text-base text-white/70 sm:text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                We'd love to hear from you
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="relative z-10 mx-auto max-w-[1480px] px-4 py-20 sm:px-7 sm:py-28 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              className="border-t border-venetian-brown p-0 pt-7 sm:pt-9 dark:border-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-7 font-serif text-4xl font-semibold text-venetian-brown sm:text-6xl dark:text-white">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-venetian-brown/80 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="min-h-12 w-full border border-venetian-brown/20 bg-white/40 px-4 text-base focus:border-venetian-terracotta focus:outline-none focus:ring-1 focus:ring-venetian-terracotta"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-venetian-brown/80 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="min-h-12 w-full border border-venetian-brown/20 bg-white/40 px-4 text-base focus:border-venetian-terracotta focus:outline-none focus:ring-1 focus:ring-venetian-terracotta"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-venetian-brown/80 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="min-h-12 w-full border border-venetian-brown/20 bg-white/40 px-4 text-base focus:border-venetian-terracotta focus:outline-none focus:ring-1 focus:ring-venetian-terracotta"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-venetian-brown/80 mb-1.5">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="min-h-12 w-full border border-venetian-brown/20 bg-white/40 px-4 text-base focus:border-venetian-terracotta focus:outline-none focus:ring-1 focus:ring-venetian-terracotta"
                  >
                    <option value="reservation">Make a Reservation</option>
                    <option value="event">Private Event Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-venetian-brown/80 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full border border-venetian-brown/20 bg-white/40 px-4 py-3 text-base focus:border-venetian-terracotta focus:outline-none focus:ring-1 focus:ring-venetian-terracotta"
                    required
                  ></textarea>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="privacyConsent"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-1"
                      required
                    />
                    <label htmlFor="privacyConsent" className="text-sm text-venetian-brown/70 dark:text-venetian-sandstone/70">
                      I have read and agree to the{' '}
                      <a href="/privacy" target="_blank" className="text-venetian-gold hover:underline">
                        Privacy Policy
                      </a>
                      . I understand how my personal data will be processed. *
                    </label>
                  </div>

                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit"
                    className="min-h-12 w-full rounded-none bg-venetian-brown text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-venetian-terracotta"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-5 sm:space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Map */}
              <div className="overflow-hidden border border-venetian-brown/15 bg-white/80">
                <iframe
                  src="https://www.google.com/maps?q=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia&output=embed"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                ></iframe>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  {
                    icon: MapPin,
                    title: 'Address',
                    content: 'Sestiere San Polo 649\n30125 Venice, Italy'
                  },
                  {
                    icon: Clock,
                    title: 'Opening Hours',
                    content: 'Lunch and dinner\nClosed on Tuesday'
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    content: '(+39) 041 520 4603'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="border border-venetian-brown/15 bg-white/55 p-4 sm:p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <item.icon className="w-5 h-5 text-venetian-gold mb-2" />
                    <h3 className="text-base sm:text-lg font-serif text-venetian-brown mb-1">{item.title}</h3>
                    <p className="text-sm text-venetian-brown/70 whitespace-pre-line leading-snug">{item.content}</p>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <motion.div
                className="border border-venetian-brown/15 bg-white/55 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <h3 className="text-lg font-serif text-venetian-brown mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/ristorantealgobbodirialto' },
                    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/algobbodirialto/' },
                    { icon: Utensils, label: 'TripAdvisor', href: 'https://www.tripadvisor.it/Restaurant_Review-g187870-d20083361-Reviews-Ristorante_Pizzeria_Al_Gobbo_di_Rialto-Venice_Veneto.html' }
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="grid h-11 w-11 place-items-center border border-venetian-brown/15 text-venetian-brown transition-colors hover:border-venetian-terracotta hover:text-venetian-terracotta"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Additional Information */}
          <motion.div
            className="mt-12 border-t border-venetian-brown/15 p-6 text-center sm:mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-venetian-brown/70 max-w-2xl mx-auto">
              For immediate assistance or same-day reservations, please call us directly.
              For events and large group bookings, please email us or use the contact form above.
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
