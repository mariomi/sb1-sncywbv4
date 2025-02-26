import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, UtensilsCrossed, ChefHat, Wine, CalendarClock, AlertCircle, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { Button } from '../components/Button';
import { format, parseISO } from 'date-fns';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getAvailableTimeSlots, createReservation, getClosedDates } from '../lib/api';
import type { ReservationFormData } from '../lib/validators';
import { PageTransition } from '../components/PageTransition';
import img2939 from '../Img/G1/IMG_2939.JPEG';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

type TimeSlot = {
  time: string;
  available: boolean;
  remainingCapacity: number;
};

export function ReservePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ReservationFormData>({
    date: '',
    time: '',
    guests: 2,
    name: '',
    email: '',
    phone: '',
    occasion: '',
    special_requests: '',
    marketing_consent: false
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  useEffect(() => {
    fetchClosedDates();
  }, []);

  useEffect(() => {
    if (formData.date) {
      if (closedDates.includes(formData.date)) {
        toast.error('This date is not available for reservations', {
          icon: <Lock className="text-red-500" />,
          duration: 4000
        });
        setFormData(prev => ({ ...prev, date: '', time: '' }));
        return;
      }
      loadTimeSlots();
    }
  }, [formData.date, closedDates]);

  const fetchClosedDates = async () => {
    try {
      const dates = await getClosedDates();
      setClosedDates(dates.map(d => d.date));
    } catch (error) {
      console.error('Error fetching closed dates:', error);
      toast.error('Failed to load closed dates');
    }
  };

  const loadTimeSlots = async () => {
    setIsLoadingTimeSlots(true);
    try {
      const slots = await getAvailableTimeSlots(formData.date);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!privacyConsent) {
      toast.error('Please accept the privacy policy to continue');
      return;
    }

    if (closedDates.includes(formData.date)) {
      toast.error('This date is not available for reservations', {
        icon: <Lock className="text-red-500" />,
        duration: 4000
      });
      return;
    }

    setIsLoading(true);

    try {
      const reservationData = {
        ...formData,
        marketing_consent: marketingConsent
      };

      console.log('Submitting reservation with data:', reservationData);
      await createReservation(reservationData);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Reservation error:', error);
      if (error instanceof Error) {
        toast.error(error.message, {
          duration: 5000,
          icon: <AlertCircle className="text-red-500" />
        });
      } else {
        toast.error('An unexpected error occurred. Please try again later.', {
          duration: 5000,
          icon: <AlertCircle className="text-red-500" />
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigate('/');
  };

  // Update marketing consent
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      marketing_consent: marketingConsent
    }));
  }, [marketingConsent]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-venetian-sandstone/20 pt-24">
        {/* Hero Section */}
        <motion.section 
          className="relative h-[40vh] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${img2939})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-venetian-brown/70 to-venetian-brown/90" />
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-3xl">
              <motion.h1 
                className="text-5xl sm:text-6xl font-serif text-white mb-4"
                {...fadeIn}
              >
                Make a Reservation
              </motion.h1>
              <motion.p 
                className="text-xl text-venetian-sandstone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join us for an unforgettable dining experience
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Reservation Form */}
            <motion.div
              className="lg:col-span-2 bg-white/95 rounded-2xl shadow-xl p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-serif text-venetian-brown mb-6">Reservation Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-venetian-brown/80 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-venetian-brown/80 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-venetian-brown/80 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-venetian-brown/80 mb-2">
                      <Users className="w-4 h-4 inline-block mr-2" />
                      Number of Guests
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData(prev => ({ ...prev, guests: Number(e.target.value) }))}
                      className="w-full px-4 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date & Time Selection */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-venetian-brown/80 mb-2">
                      <Calendar className="w-4 h-4 inline-block mr-2" />
                      Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      max={maxDateString}
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value, time: '' }))}
                      className="w-full px-4 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50"
                      required
                    />
                  </div>
                </div>

                {/* Time Slots */}
                {formData.date && (
                  <div>
                    <label className="block text-sm font-medium text-venetian-brown/80 mb-3">
                      <Clock className="w-4 h-4 inline-block mr-2" />
                      Available Time Slots
                    </label>
                    {isLoadingTimeSlots ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 text-venetian-brown animate-spin" />
                      </div>
                    ) : timeSlots.length === 0 ? (
                      <p className="text-venetian-brown/70 text-center py-4">
                        No available time slots for this date
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {timeSlots.map((slot) => (
                          <motion.button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setFormData(prev => ({ ...prev, time: slot.time }))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              formData.time === slot.time
                                ? 'bg-venetian-gold text-venetian-brown'
                                : slot.available
                                ? 'bg-white/80 text-venetian-brown hover:bg-venetian-gold/10'
                                : 'bg-venetian-brown/5 text-venetian-brown/40 cursor-not-allowed'
                            }`}
                            whileHover={slot.available ? { scale: 1.02 } : {}}
                            whileTap={slot.available ? { scale: 0.98 } : {}}
                          >
                            {slot.time.slice(0, 5)}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-venetian-brown/80 mb-2">
                    <ChefHat className="w-4 h-4 inline-block mr-2" />
                    Occasion (Optional)
                  </label>
                  <select
                    value={formData.occasion || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50"
                  >
                    <option value="">Select an occasion</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="business">Business Dinner</option>
                    <option value="date">Date Night</option>
                    <option value="other">Other Special Occasion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-venetian-brown/80 mb-2">
                    <UtensilsCrossed className="w-4 h-4 inline-block mr-2" />
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={formData.special_requests || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_requests: e.target.value }))}
                    rows={4}
                    placeholder="Dietary restrictions, allergies, seating preferences..."
                    className="w-full px-4  py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50"
                  />
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="privacyConsent"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-1"
                      required
                    />
                    <label htmlFor="privacyConsent" className="text-sm text-venetian-brown/70">
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
                    <label htmlFor="marketingConsent" className="text-sm text-venetian-brown/70">
                      I would like to receive marketing communications about special offers, events, and news. 
                      You can unsubscribe at any time.
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit"
                    className="w-full bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
                    disabled={isLoading || closedDates.includes(formData.date)}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      'Confirm Reservation'
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            {/* Sidebar Information */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Reservation Policy */}
              <div className="bg-white/95 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-serif text-venetian-brown mb-4 flex items-center">
                  <CalendarClock className="w-5 h-5 mr-2 text-venetian-gold" />
                  Reservation Policy
                </h3>
                <ul className="space-y-3 text-venetian-brown/70">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 mt-2 mr-2 rounded-full bg-venetian-gold" />
                    Reservations can be made up to 3 months in advance
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 mt-2 mr-2 rounded-full bg-venetian-gold" />
                    For same-day reservations, please call us directly
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 mt-2 mr-2 rounded-full bg-venetian-gold" />
                    Large group bookings (9+ guests) require direct contact
                  </li>
                </ul>
              </div>

              {/* Special Notes */}
              <div className="bg-white/95 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-serif text-venetian-brown mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-venetian-gold" />
                  Important Information
                </h3>
                <ul className="space-y-3 text-venetian-brown/70">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 mt-2 mr-2 rounded-full bg-venetian-gold" />
                    Tables are held for 15 minutes after reservation time
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 mt-2 mr-2 rounded-full bg-venetian-gold" />
                    Cancellations must be made at least 24 hours in advance
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 mt-2 mr-2 rounded-full bg-venetian-gold" />
                    Smart casual dress code is required
                  </li>
                </ul>
              </div>

              {/* Featured */}
              <div className="bg-venetian-brown/90 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-serif mb-4 flex items-center">
                  <Wine className="w-5 h-5 mr-2 text-venetian-gold" />
                  Chef's Recommendation
                </h3>
                <p className="text-venetian-sandstone/90 mb-4">
                  Join us for our special "Taste of Venice" tasting menu, available every evening with wine pairings.
                </p>
                <p className="text-sm text-venetian-sandstone/70">
                  Please note in special requests if you're interested in the tasting menu.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-serif text-venetian-brown mb-2">
                    Reservation Confirmed!
                  </h3>
                  <p className="text-venetian-brown/70 mb-6">
                    Thank you for choosing Al Gobbo di Rialto. We look forward to serving you on{' '}
                    {format(new Date(formData.date), 'MMMM d, yyyy')} at {formData.time.slice(0, 5)}.
                  </p>
                  <div className="bg-venetian-brown/5 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-venetian-brown mb-2">Reservation Details</h4>
                    <ul className="space-y-2 text-sm text-venetian-brown/70">
                      <li>Name: {formData.name}</li>
                      <li>Guests: {formData.guests}</li>
                      <li>Date: {format(new Date(formData.date), 'MMMM d, yyyy')}</li>
                      <li>Time: {formData.time.slice(0, 5)}</li>
                    </ul>
                  </div>
                  <p className="text-sm text-venetian-brown/60 mb-6">
                    A confirmation email has been sent to {formData.email}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleConfirmationClose}
                      className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
                    >
                      Return to Home
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}