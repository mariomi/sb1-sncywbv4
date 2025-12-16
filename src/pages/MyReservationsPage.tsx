import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, Search, AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { getUserReservations, cancelReservation } from '../lib/api';
import { PageTransition } from '../components/PageTransition';
import img2939 from '../Img/G1/IMG_2939.JPEG';

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

export function MyReservationsPage() {
    const [email, setEmail] = useState('');
    const [reservations, setReservations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setHasSearched(true);
        try {
            const data = await getUserReservations(email);
            setReservations(data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            toast.error('Failed to find reservations');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;

        setProcessingId(id);
        try {
            await cancelReservation(id, email);
            toast.success('Reservation cancelled successfully');
            // Refresh list
            const data = await getUserReservations(email);
            setReservations(data);
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            toast.error('Failed to cancel reservation');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-venetian-sandstone/20 pt-24">
                {/* Hero Section */}
                <motion.section
                    className="relative h-[30vh] overflow-hidden"
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
                                className="text-4xl sm:text-5xl font-serif text-white mb-4"
                                {...fadeIn}
                            >
                                My Reservations
                            </motion.h1>
                            <motion.p
                                className="text-lg text-venetian-sandstone"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Manage your booking details
                            </motion.p>
                        </div>
                    </div>
                </motion.section>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-20">
                    <motion.div
                        className="bg-white/95 rounded-2xl shadow-xl p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <form onSubmit={handleSearch} className="mb-8">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-grow">
                                    <label htmlFor="email" className="block text-sm font-medium text-venetian-brown/80 mb-2">
                                        Enter your email to find reservations
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50"
                                        required
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full sm:w-auto bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Search className="w-4 h-4 mr-2" />
                                                Find Reservation
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <AnimatePresence>
                            {hasSearched && reservations.length === 0 && !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 text-venetian-brown/60"
                                >
                                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No reservations found for {email}</p>
                                </motion.div>
                            )}

                            {reservations.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-xl font-serif text-venetian-brown mb-4">Your Bookings</h3>
                                    {reservations.map((reservation) => (
                                        <motion.div
                                            key={reservation.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`border rounded-xl p-6 ${reservation.status === 'cancelled'
                                                    ? 'bg-gray-50 border-gray-200 opacity-75'
                                                    : 'bg-white border-venetian-gold/30'
                                                }`}
                                        >
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                                reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    reservation.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                                        </span>
                                                        <span className="text-sm text-venetian-brown/50">#{reservation.id.slice(0, 8)}</span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-venetian-brown/80">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-venetian-gold" />
                                                            {format(new Date(reservation.date), 'MMMM d, yyyy')}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-venetian-gold" />
                                                            {reservation.time.slice(0, 5)}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-venetian-gold" />
                                                            {reservation.guests} Guests
                                                        </div>
                                                    </div>
                                                </div>

                                                {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                                                    <Button
                                                        onClick={() => handleCancel(reservation.id)}
                                                        disabled={processingId === reservation.id}
                                                        className="text-red-600 hover:bg-red-50 border border-red-200"
                                                        variant="outline"
                                                    >
                                                        {processingId === reservation.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-4 h-4 mr-2" />
                                                                Cancel
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
