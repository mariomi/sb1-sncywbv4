import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, UtensilsCrossed, ChefHat, Wine, CalendarClock, AlertCircle, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { Button } from '../components/Button';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getAvailableTimeSlots, createReservation, getClosedDates, joinWaitlist } from '../lib/api';
import { useFeatureFlag } from '../lib/featureFlags';
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

// Common country phone prefixes
const PHONE_PREFIXES = [
  { code: '+39', flag: '🇮🇹', label: 'Italia (+39)' },
  { code: '+44', flag: '🇬🇧', label: 'UK (+44)' },
  { code: '+33', flag: '🇫🇷', label: 'France (+33)' },
  { code: '+49', flag: '🇩🇪', label: 'Deutschland (+49)' },
  { code: '+34', flag: '🇪🇸', label: 'España (+34)' },
  { code: '+1',  flag: '🇺🇸', label: 'USA/CA (+1)' },
  { code: '+31', flag: '🇳🇱', label: 'Nederland (+31)' },
  { code: '+41', flag: '🇨🇭', label: 'Schweiz (+41)' },
  { code: '+43', flag: '🇦🇹', label: 'Österreich (+43)' },
  { code: '+32', flag: '🇧🇪', label: 'Belgique (+32)' },
  { code: '+351', flag: '🇵🇹', label: 'Portugal (+351)' },
  { code: '+46', flag: '🇸🇪', label: 'Sverige (+46)' },
  { code: '+47', flag: '🇳🇴', label: 'Norge (+47)' },
  { code: '+45', flag: '🇩🇰', label: 'Danmark (+45)' },
  { code: '+358', flag: '🇫🇮', label: 'Suomi (+358)' },
  { code: '+48', flag: '🇵🇱', label: 'Polska (+48)' },
  { code: '+420', flag: '🇨🇿', label: 'Česko (+420)' },
  { code: '+36', flag: '🇭🇺', label: 'Magyarország (+36)' },
  { code: '+40', flag: '🇷🇴', label: 'România (+40)' },
  { code: '+30', flag: '🇬🇷', label: 'Ελλάδα (+30)' },
  { code: '+55', flag: '🇧🇷', label: 'Brasil (+55)' },
  { code: '+81', flag: '🇯🇵', label: '日本 (+81)' },
  { code: '+86', flag: '🇨🇳', label: '中国 (+86)' },
  { code: '+91', flag: '🇮🇳', label: 'India (+91)' },
  { code: '+61', flag: '🇦🇺', label: 'Australia (+61)' },
  { code: 'other', flag: '🌍', label: 'Altro / Other...' },
];

export function ReservePage() {
  const navigate = useNavigate();
  const waitlistEnabled = useFeatureFlag('waitlist');
  const onlineReservationsEnabled = useFeatureFlag('online_reservations');
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
  const [phonePrefix, setPhonePrefix] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customPrefix, setCustomPrefix] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [showWaitlistBanner, setShowWaitlistBanner] = useState(false);
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Keep formData.phone in sync whenever prefix or number changes
  useEffect(() => {
    const prefix = phonePrefix === 'other' ? customPrefix : phonePrefix;
    setFormData(prev => ({ ...prev, phone: prefix && phoneNumber ? `${prefix} ${phoneNumber}` : '' }));
  }, [phonePrefix, phoneNumber, customPrefix]);

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
    setShowWaitlistBanner(false);
    setWaitlistSuccess(false);
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
      setShowWaitlistBanner(false);
    } catch (error) {
      console.error('Reservation error:', error);
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        const isCapacityError =
          msg.includes('capacity') ||
          msg.includes('available') ||
          msg.includes('remaining') ||
          msg.includes('no longer available');
        if (isCapacityError && formData.date && formData.time) {
          setShowWaitlistBanner(true);
        } else {
          toast.error(error.message, {
            duration: 5000,
            icon: <AlertCircle className="text-red-500" />
          });
        }
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

  const handleJoinWaitlist = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Compila nome, email e telefono prima di iscriverti alla lista d\'attesa');
      return;
    }
    setIsJoiningWaitlist(true);
    try {
      await joinWaitlist({
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        occasion: formData.occasion || undefined,
        special_requests: formData.special_requests || undefined,
      });
      setWaitlistSuccess(true);
      setShowWaitlistBanner(false);
    } catch (error) {
      console.error('Waitlist error:', error);
      toast.error('Errore nell\'iscrizione alla lista d\'attesa. Riprova.');
    } finally {
      setIsJoiningWaitlist(false);
    }
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
      <SEOHead
        title="Prenota un Tavolo"
        canonical="/reserve"
        description="Prenota il tuo tavolo al Ristorante Al Gobbo di Rialto a Venezia. Disponibilità in tempo reale, pranzo e cena. Prenotazione online semplice e veloce."
      />
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
              backgroundImage: `url(${img2939})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-venetian-brown/70 to-venetian-brown/90" />
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-3xl">
              <motion.h1
                className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white mb-2 sm:mb-4"
                {...fadeIn}
              >
                Make a Reservation
              </motion.h1>
              <motion.p
                className="text-base sm:text-xl text-venetian-sandstone"
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6 sm:-mt-16 relative z-10 pb-16">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Reservation Form */}
            <motion.div
              className="lg:col-span-2 bg-white/95 rounded-2xl shadow-xl p-4 sm:p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-serif text-venetian-brown mb-4 sm:mb-6">Reservation Details</h2>
              {!onlineReservationsEnabled ? (
                <div className="p-6 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <p className="text-venetian-brown font-semibold mb-1">Prenotazioni temporaneamente sospese</p>
                  <p className="text-venetian-brown/70 text-sm">
                    Le prenotazioni online sono temporaneamente sospese. Chiamaci al{' '}
                    <a href="tel:+390415204603" className="text-venetian-gold hover:underline font-medium">+39 041 520 4603</a>
                  </p>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-venetian-brown/80 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-venetian-brown/80 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-venetian-brown/80 mb-1.5">
                      Phone Number
                    </label>
                    <div className="flex flex-col gap-2">
                      {/* Prefix selector */}
                      <select
                        value={phonePrefix}
                        onChange={(e) => {
                          setPhonePrefix(e.target.value);
                          if (e.target.value !== 'other') setCustomPrefix('');
                        }}
                        className="w-full px-3 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base text-venetian-brown/80 cursor-pointer"
                        aria-label="Country code"
                        required
                      >
                        <option value="" disabled>🌍 Select country code *</option>
                        {PHONE_PREFIXES.map((p) => (
                          <option key={p.code} value={p.code}>
                            {p.flag} {p.label}
                          </option>
                        ))}
                      </select>
                      {/* Custom prefix input */}
                      {phonePrefix === 'other' && (
                        <input
                          type="text"
                          value={customPrefix}
                          onChange={(e) => setCustomPrefix(e.target.value.replace(/[^0-9+]/g, ''))}
                          placeholder="+00 custom prefix"
                          className="w-full px-4 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base"
                          maxLength={7}
                          required
                        />
                      )}
                      {/* Number input — shown only after prefix is selected */}
                      {phonePrefix && (
                        <div className="flex rounded-lg border border-venetian-brown/20 focus-within:border-venetian-gold focus-within:ring-1 focus-within:ring-venetian-gold overflow-hidden bg-white/50">
                          <span className="shrink-0 bg-venetian-brown/5 border-r border-venetian-brown/20 text-venetian-brown/70 text-sm font-medium px-3 flex items-center">
                            {phonePrefix === 'other' ? (customPrefix || '?') : phonePrefix}
                          </span>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9\s-]/g, ''))}
                            placeholder="Number"
                            className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-base min-w-0"
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-venetian-brown/80 mb-1.5">
                      <Users className="w-4 h-4 inline-block mr-2" />
                      Number of Guests
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData(prev => ({ ...prev, guests: Number(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base"
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
                <div>
                  <label className="block text-sm font-medium text-venetian-brown/80 mb-1.5">
                    <Calendar className="w-4 h-4 inline-block mr-2" />
                    Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    max={maxDateString}
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value, time: '' }))}
                    className="w-full px-4 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base"
                    required
                  />
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
                      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {timeSlots.map((slot) => (
                          <motion.button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setFormData(prev => ({ ...prev, time: slot.time }))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.time === slot.time
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
                    {/* New Year's Eve Warning */}
                    {formData.date === '2025-12-31' && formData.time && formData.time >= '19:00' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg my-6"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-800">
                              Special Event Notice / Avviso Evento Speciale
                            </h3>
                            <div className="mt-2 text-sm text-amber-700 space-y-2">
                              <p>
                                <strong>English:</strong> For reservations on December 31, 2025 from 7:00 PM onwards,
                                a minimum spend of <strong>€80 per person</strong> is required.
                              </p>
                              <p>
                                <strong>Italiano:</strong> Per le prenotazioni del 31 Dicembre 2025 dalle ore 19:00 in poi,
                                è richiesta una spesa minima di <strong>80€ a persona</strong>.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Waitlist banner */}
                <AnimatePresence>
                  {waitlistEnabled && showWaitlistBanner && !waitlistSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-amber-50 border-l-4 border-venetian-gold rounded-r-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-venetian-gold mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-venetian-brown text-sm">
                            Questo orario è esaurito.
                          </p>
                          <p className="text-sm text-venetian-brown/80 mt-1">
                            Vuoi metterti in lista d'attesa? Ti contatteremo se si libera un posto.
                          </p>
                          <button
                            type="button"
                            onClick={handleJoinWaitlist}
                            disabled={isJoiningWaitlist}
                            className="mt-3 px-4 py-2 bg-venetian-gold text-venetian-brown text-sm font-medium rounded-lg hover:bg-venetian-gold/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {isJoiningWaitlist ? (
                              <><Loader2 size={14} className="animate-spin" /> Iscrizione...</>
                            ) : (
                              'Sì, mettimi in lista d\'attesa'
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {waitlistSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-green-800 text-sm">
                            Sei in lista d'attesa!
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            Ti contatteremo appena si libera un posto per {formData.date} alle {formData.time.slice(0, 5)}.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-venetian-brown/80 mb-1.5">
                    <ChefHat className="w-4 h-4 inline-block mr-2" />
                    Occasion (Optional)
                  </label>
                  <select
                    value={formData.occasion || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base"
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
                  <label className="block text-sm font-medium text-venetian-brown/80 mb-1.5">
                    <UtensilsCrossed className="w-4 h-4 inline-block mr-2" />
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={formData.special_requests || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_requests: e.target.value }))}
                    rows={3}
                    placeholder="Dietary restrictions, allergies, seating preferences..."
                    className="w-full px-4 py-3 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 text-base"
                  />
                </div>

                <div className="space-y-3 mt-4">
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
              )}
            </motion.div>

            {/* Sidebar Information */}
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Reservation Policy */}
              <div className="bg-white/95 rounded-2xl shadow-lg p-4 sm:p-6">
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
              <div className="bg-white/95 rounded-2xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-serif text-venetian-brown mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-venetian-gold" />
                  Important Information
                </h3>
                <ul className="space-y-2 text-sm text-venetian-brown/70">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 mt-1.5 mr-2 shrink-0 rounded-full bg-venetian-gold" />
                    Tables are held for 15 minutes after reservation time
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 mt-1.5 mr-2 shrink-0 rounded-full bg-venetian-gold" />
                    Cancellations must be made at least 24 hours in advance
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 mt-1.5 mr-2 shrink-0 rounded-full bg-venetian-gold" />
                    Smart casual dress code is required
                  </li>
                </ul>
              </div>

              {/* Featured */}
              <div className="bg-venetian-brown/90 rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                <h3 className="text-lg sm:text-xl font-serif mb-3 flex items-center">
                  <Wine className="w-5 h-5 mr-2 text-venetian-gold" />
                  Chef's Recommendation
                </h3>
                <p className="text-sm text-venetian-sandstone/90 mb-3">
                  Join us for our special "Taste of Venice" tasting menu, available every evening with wine pairings.
                </p>
                <p className="text-xs text-venetian-sandstone/70">
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
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-3 overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="p-5 sm:p-6 text-center">
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