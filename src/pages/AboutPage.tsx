import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Mail, ChefHat, Users, Utensils } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stats = [
  {
    icon: ChefHat,
    value: '1955',
    label: 'Founded',
  },
  {
    icon: Users,
    value: '10+',
    label: 'Team Members',
  },
  {
    icon: Utensils,
    value: '150+',
    label: 'Recipes',
  },
];

export function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-venetian-sandstone/20 pt-24">
        {/* Hero Section */}
        <motion.section
          className="relative h-[60vh] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://venicelover.com/images/things_to_do_in_venice_italy.jpg")'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-venetian-brown/70 to-venetian-brown/90" />
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-3xl">
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl font-serif text-white mb-6"
                {...fadeIn}
              >
                Our Story
              </motion.h1>
              <motion.p
                className="text-xl text-venetian-sandstone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                A culinary journey through time in the heart of Venice
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="relative -mt-16 z-10 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/95 rounded-2xl p-6 text-center shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-venetian-gold" />
                  <p className="text-3xl font-serif text-venetian-brown mb-1">{stat.value}</p>
                  <p className="text-sm text-venetian-brown/70 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* History Section */}
        <motion.section
          className="py-20 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-serif text-venetian-brown mb-6">Our Heritage</h2>
                <div className="space-y-4 text-lg text-venetian-brown/80">
                  <p>
                    Founded in 1955 by the Rossi family, Al Gobbo di Rialto has been a cornerstone
                    of Venetian culinary excellence for over six decades. Our restaurant takes its
                    name from the iconic Gobbo di Rialto statue, a historic landmark that has
                    witnessed centuries of Venice's rich history.
                  </p>
                  <p>
                    What began as a modest osteria has evolved into one of Venice's most
                    celebrated dining destinations, maintaining our commitment to traditional
                    Venetian cuisine and warm hospitality.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                  <img
                    src="https://lh3.googleusercontent.com/p/AF1QipNtmONU-ttdk2MO0fstFTJz3s6fXvtRvtDwr9xk=s1360-w1360-h1020"
                    alt="Historic Venice"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-venetian-brown/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Philosophy Section */}
        <motion.section
          className="py-20 bg-venetian-brown/5 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl md:order-2 group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Our Philosophy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-venetian-brown/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
              <motion.div
                className="md:order-1"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-serif text-venetian-brown mb-6">Our Philosophy</h2>
                <div className="space-y-4 text-lg text-venetian-brown/80">
                  <p>
                    At Al Gobbo di Rialto, we believe in preserving the authenticity of Venetian
                    cuisine while embracing innovation. Our philosophy is rooted in three core principles:
                    respect for traditional recipes, commitment to local ingredients, and dedication to
                    exceptional service.
                  </p>
                  <p>
                    Every dish we serve tells a story of Venice's rich culinary heritage, enhanced by
                    our chef's contemporary interpretations and presented with the elegance our guests
                    have come to expect.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Contact Information */}
        <motion.section
          className="py-20 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/95 rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-serif text-venetian-brown mb-8 text-center">Visit Us</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: MapPin,
                    title: 'Address',
                    content: 'Sestiere San Polo 649\n30125 Venice, Italy'
                  },
                  {
                    icon: Clock,
                    title: 'Hours',
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
                    content: 'info@ristorantealgobbodirialto.com'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <item.icon className="w-6 h-6 mx-auto mb-3 text-venetian-gold" />
                    <h3 className="text-lg font-serif text-venetian-brown mb-2">{item.title}</h3>
                    <p className="text-venetian-brown/70 whitespace-pre-line">{item.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </PageTransition>
  );
}