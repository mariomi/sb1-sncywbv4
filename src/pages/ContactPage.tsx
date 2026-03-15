import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Instagram, Facebook, Utensils } from 'lucide-react';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';
import toast from 'react-hot-toast';
import img2947 from '../Img/G1/IMG_2947.JPEG';
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
  const [marketingConsent, setMarketingConsent] = useState(false);
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
      setMarketingConsent(false);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-venetian-sandstone/20 pt-20 sm:pt-24">
        {/* Hero Section */}
        <motion.section
          className="relative h-[28vh] sm:h-[40vh] overflow-hidden"
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
          <div className="absolute inset-0 bg-gradient-to-b from-venetian-brown/70 to-venetian-brown/90" />
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-3xl">
              <motion.h1
                className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white mb-2 sm:mb-4"
                {...fadeIn}
              >
                Contact Us
              </motion.h1>
              <motion.p
                className="text-base sm:text-xl text-venetian-sandstone"
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6 sm:-mt-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Contact Form */}
            <motion.div
              className="bg-white/95 rounded-2xl shadow-xl p-4 sm:p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-serif text-venetian-brown mb-4 sm:mb-6">Send us a Message</h2>
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
                      className="w-full px-4 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base"
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
                      className="w-full px-4 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base"
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
                    className="w-full px-4 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base"
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
                    className="w-full px-4 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base"
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
                    className="w-full px-4 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base"
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

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="marketingConsent"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="marketingConsent" className="text-sm text-venetian-brown/70 dark:text-venetian-sandstone/70">
                      I would like to receive marketing communications about special offers, events, and news. 
                      You can unsubscribe at any time.
                    </label>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit"
                    className="w-full bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-4 sm:space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Map */}
              <div className="bg-white/95 rounded-2xl shadow-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2799.935720139675!2d12.333893776271696!3d45.43802573632649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477eb1c7fefa139f%3A0x5a3c4b0e784ea266!2sPonte%20di%20Rialto!5e0!3m2!1sen!2sus!4v1709294611439!5m2!1sen!2sus"
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
                    content: 'Open Daily: 11:00 - 23:00\nClosed on Tuesday'
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    content: '(+39) 041 520 4603'
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    content: 'info@ristorantealgobbodirialto.it'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="bg-white/95 rounded-xl shadow-lg p-4 sm:p-6"
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
                className="bg-white/95 rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <h3 className="text-lg font-serif text-venetian-brown mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/ristorantealgobbodirialto' },
                    { icon: Utensils, label: 'TripAdvisor', href: 'https://www.tripadvisor.it/Restaurant_Review-g187870-d20083361-Reviews-Ristorante_Pizzeria_Al_Gobbo_di_Rialto-Venice_Veneto.html' }
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-venetian-brown/5 text-venetian-brown hover:bg-venetian-gold/10 transition-colors"
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
            className="mt-6 sm:mt-12 bg-white/80 rounded-xl p-4 sm:p-6 text-center"
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
