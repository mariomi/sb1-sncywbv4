import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCcw,
  Phone,
  Mail,
  MessageSquare,
  Settings,
  Power,
  Edit,
  Lock,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '../components/Button';
import { format, parseISO, isToday, isTomorrow, addDays, subDays } from 'date-fns';
import { useAuth } from '../components/AuthProvider';
import { cn } from '../lib/utils';
import { 
  getAvailableTimeSlots, 
  updateTimeSlot, 
  getClosedDates, 
  addClosedDate, 
  removeClosedDate, 
  getReservations, 
  updateReservationStatus,
  getRecurringClosures,
  createRecurringClosure,
  updateRecurringClosure,
  deleteRecurringClosure,
  type RecurringClosure
} from '../lib/api';
import toast from 'react-hot-toast';
import type { Database } from '../lib/database.types';

type Reservation = Database['public']['Tables']['reservations']['Row'];
type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
  remainingCapacity: number;
  maxCapacity: number;
  isActive: boolean;
  isLunch: boolean;
  isRecurringClosed: boolean;
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
};

const statusIcons = {
  pending: AlertCircle,
  confirmed: CheckCircle2,
  cancelled: XCircle,
  completed: CheckCircle2,
};

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export function AdminPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showTimeSlotsModal, setShowTimeSlotsModal] = useState(false);
  const [showClosedDatesModal, setShowClosedDatesModal] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [newClosedDate, setNewClosedDate] = useState('');
  const [updatingTimeSlot, setUpdatingTimeSlot] = useState(false);
  const [showAddRecurringModal, setShowAddRecurringModal] = useState(false);
  const [recurringClosures, setRecurringClosures] = useState<RecurringClosure[]>([]);
  const [newRecurringClosure, setNewRecurringClosure] = useState<Omit<RecurringClosure, 'id'>>({
    day_of_week: 0,
    start_time: '00:00',
    end_time: '23:59',
    active: true
  });

  useEffect(() => {
    if (!user) return;
    fetchReservations();
    fetchTimeSlots();
    fetchClosedDates();
    fetchRecurringClosures();
  }, [user, selectedDate]);

  const fetchRecurringClosures = async () => {
    try {
      const closures = await getRecurringClosures();
      setRecurringClosures(closures);
    } catch (error) {
      console.error('Error fetching recurring closures:', error);
      toast.error('Failed to load recurring closures');
    }
  };

  const handleAddRecurringClosure = async () => {
    try {
      await createRecurringClosure(newRecurringClosure);
      await fetchRecurringClosures();
      setShowAddRecurringModal(false);
      toast.success('Recurring closure added successfully');
    } catch (error) {
      console.error('Error adding recurring closure:', error);
      toast.error('Failed to add recurring closure');
    }
  };

  const handleUpdateRecurringClosure = async (id: string, data: Partial<RecurringClosure>) => {
    try {
      await updateRecurringClosure(id, data);
      await fetchRecurringClosures();
      toast.success('Recurring closure updated successfully');
    } catch (error) {
      console.error('Error updating recurring closure:', error);
      toast.error('Failed to update recurring closure');
    }
  };

  const handleDeleteRecurringClosure = async (id: string) => {
    try {
      await deleteRecurringClosure(id);
      await fetchRecurringClosures();
      toast.success('Recurring closure deleted successfully');
    } catch (error) {
      console.error('Error deleting recurring closure:', error);
      toast.error('Failed to delete recurring closure');
    }
  };

  const fetchClosedDates = async () => {
    try {
      const dates = await getClosedDates();
      setClosedDates(dates.map(d => d.date));
    } catch (error) {
      console.error('Error fetching closed dates:', error);
      toast.error('Failed to load closed dates');
    }
  };

  const handleAddClosedDate = async () => {
    if (!newClosedDate) return;
    
    try {
      await addClosedDate(newClosedDate);
      await fetchClosedDates();
      setNewClosedDate('');
      toast.success('Date closed successfully');
    } catch (error) {
      console.error('Error adding closed date:', error);
      toast.error('Failed to close date');
    }
  };

  const handleRemoveClosedDate = async (date: string) => {
    try {
      await removeClosedDate(date);
      await fetchClosedDates();
      toast.success('Date reopened successfully');
    } catch (error) {
      console.error('Error removing closed date:', error);
      toast.error('Failed to reopen date');
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const slots = await getAvailableTimeSlots(format(selectedDate, 'yyyy-MM-dd'));
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load time slots');
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservations(format(selectedDate, 'yyyy-MM-dd'));
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotUpdate = async (id: string, data: { is_active?: boolean; max_capacity?: number }) => {
    try {
      setUpdatingTimeSlot(true);
      await updateTimeSlot(id, data);
      await fetchTimeSlots();
      toast.success('Time slot updated successfully');
      if (editingTimeSlot) {
        setEditingTimeSlot(null);
      }
    } catch (error) {
      console.error('Error updating time slot:', error);
      toast.error('Failed to update time slot');
    } finally {
      setUpdatingTimeSlot(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await updateReservationStatus(id, status);
      await fetchReservations();
      setSelectedReservation(null);
      toast.success(`Reservation ${status} successfully`);
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('Failed to update reservation');
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(reservation.status);
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: filteredReservations.length,
    pending: filteredReservations.filter(r => r.status === 'pending').length,
    confirmed: filteredReservations.filter(r => r.status === 'confirmed').length,
    cancelled: filteredReservations.filter(r => r.status === 'cancelled').length,
    completed: filteredReservations.filter(r => r.status === 'completed').length,
    totalGuests: filteredReservations.reduce((sum, r) => sum + r.guests, 0),
  };

  return (
    <div className="min-h-screen bg-venetian-sandstone/20 dark:bg-venetian-brown/95 pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-3xl font-serif text-venetian-brown dark:text-venetian-sandstone sm:truncate">
              Reservation Management
            </h2>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
            <Button
              onClick={() => setShowClosedDatesModal(true)}
              className="bg-venetian-brown text-white hover:bg-venetian-brown/90 dark:bg-venetian-gold dark:text-venetian-brown"
            >
              <Lock className="w-4 h-4 mr-2" />
              Manage Closed Dates
            </Button>
            <Button
              onClick={() => setShowTimeSlotsModal(true)}
              className="bg-venetian-brown text-white hover:bg-venetian-brown/90 dark:bg-venetian-gold dark:text-venetian-brown"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Time Slots
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Date Navigation */}
            <motion.div
              className="bg-white/95 dark:bg-venetian-brown/50 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif text-venetian-brown dark:text-venetian-sandstone">
                  Date Selection
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-venetian-brown dark:text-venetian-sandstone hover:bg-venetian-brown/5 dark:hover:bg-white/5"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Today
                </Button>
              </div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedDate(prev => subDays(prev, 1))}
                  className="p-2 rounded-lg hover:bg-venetian-brown/5 dark:hover:bg-white/5 text-venetian-brown dark:text-venetian-sandstone"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="font-medium text-venetian-brown dark:text-venetian-sandstone">
                  {isToday(selectedDate) 
                    ? 'Today'
                    : isTomorrow(selectedDate)
                    ? 'Tomorrow'
                    : format(selectedDate, 'MMMM d, yyyy')}
                </span>
                <button
                  onClick={() => setSelectedDate(prev => addDays(prev, 1))}
                  className="p-2 rounded-lg hover:bg-venetian-brown/5 dark:hover:bg-white/5 text-venetian-brown dark:text-venetian-sandstone"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              {closedDates.includes(format(selectedDate, 'yyyy-MM-dd')) && (
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm rounded-lg flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  This date is closed for reservations
                </div>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              className="bg-white/95 dark:bg-venetian-brown/50 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-lg font-serif text-venetian-brown dark:text-venetian-sandstone mb-4">
                Today's Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-venetian-brown/70 dark:text-venetian-sandstone/70">Total Reservations</span>
                  <span className="font-medium text-venetian-brown dark:text-venetian-sandstone">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-venetian-brown/70 dark:text-venetian-sandstone/70">Total Guests</span>
                  <span className="font-medium text-venetian-brown dark:text-venetian-sandstone">{stats.totalGuests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-venetian-brown/70 dark:text-venetian-sandstone/70">Pending</span>
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">{stats.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-venetian-brown/70 dark:text-venetian-sandstone/70">Confirmed</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{stats.confirmed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-venetian-brown/70 dark:text-venetian-sandstone/70">Cancelled</span>
                  <span className="font-medium text-red-600 dark:text-red-400">{stats.cancelled}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-venetian-brown/70 dark:text-venetian-sandstone/70">Completed</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">{stats.completed}</span>
                </div>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              className="bg-white/95 dark:bg-venetian-brown/50 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif text-venetian-brown dark:text-venetian-sandstone">
                  Filters
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-venetian-brown dark:text-venetian-sandstone hover:bg-venetian-brown/5 dark:hover:bg-white/5"
                  onClick={() => setStatusFilter([])}
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-2">
                {['pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(prev => 
                        prev.includes(status) 
                          ? prev.filter(s => s !== status)
                          : [...prev, status]
                      );
                    }}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      statusFilter.includes(status)
                        ? statusColors[status as keyof typeof statusColors]
                        : 'bg-venetian-brown/5 dark:bg-white/5 text-venetian-brown/70 dark:text-venetian-sandstone/70 hover:bg-venetian-brown/10 dark:hover:bg-white/10'
                    )}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Actions */}
            <motion.div
              className="bg-white/95 dark:bg-venetian-brown/50 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-venetian-brown/40 dark:text-venetian-sandstone/40" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-venetian-brown/20 dark:border-venetian-sandstone/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 dark:bg-venetian-brown/10 dark:text-venetian-sandstone"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-venetian-brown dark:text-venetian-sandstone hover:bg-venetian-brown/5 dark:hover:bg-white/5"
                    onClick={() => fetchReservations()}
                  >
                    <RefreshCcw size={18} className="mr-2" />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    className="text-venetian-brown dark:text-venetian-sandstone hover:bg-venetian-brown/5 dark:hover:bg-white/5"
                    onClick={() => setStatusFilter([])}
                  >
                    <Filter size={18} className="mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Reservations List */}
            <motion.div
              className="bg-white/95 dark:bg-venetian-brown/50 rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {loading ? (
                <div className="p-8 text-center text-venetian-brown/70 dark:text-venetian-sandstone/70">
                  <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
                  Loading reservations...
                </div>
              ) : filteredReservations.length === 0 ? (
                <div className="p-8 text-center text-venetian-brown/70 dark:text-venetian-sandstone/70">
                  No reservations found for this date.
                </div>
              ) : (
                <div className="divide-y divide-venetian-brown/10 dark:divide-venetian-sandstone/10">
                  {filteredReservations.map((reservation) => (
                    <motion.div
                      key={reservation.id}
                      className="p-6 hover:bg-venetian-brown/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedReservation(reservation)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="text-lg font-medium text-venetian-brown dark:text-venetian-sandstone">
                              {reservation.name}
                            </h4>
                            <span className={cn(
                              'ml-3 px-2 py-1 rounded-full text-xs font-medium',
                              statusColors[reservation.status as keyof typeof statusColors]
                            )}>
                              {reservation.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-venetian-brown/70 dark:text-venetian-sandstone/70">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2" />
                              {reservation.time.slice(0, 5)}
                            </div>
                            <div className="flex items-center">
                              <Users size={16} className="mr-2" />
                              {reservation.guests} guests
                            </div>
                            <div className="flex items-center">
                              <Phone size={16} className="mr-2" />
                              {reservation.phone}
                            </div>
                            <div className="flex items-center">
                              <Mail size={16} className="mr-2" />
                              {reservation.email}
                            </div>
                          </div>
                          {reservation.special_requests && (
                            <div className="mt-2 flex items-start text-sm text-venetian-brown/70 dark:text-venetian-sandstone/70">
                              <MessageSquare size={16} className="mr-2 mt-1 flex-shrink-0" />
                              <p>{reservation.special_requests}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {reservation.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(reservation.id, 'confirmed');
                                }}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(reservation.id, 'cancelled');
                                }}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {reservation.status === 'confirmed' && (
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(reservation.id, 'completed');
                              }}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Time Slots Modal */}
      <AnimatePresence>
        {showTimeSlotsModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTimeSlotsModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-venetian-brown/90 rounded-2xl shadow-xl max-w-4xl w-full mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-6">
                  Manage Time Slots
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-venetian-brown dark:text-venetian-sandstone mb-4">
                      Lunch Service
                    </h4>
                    <div className="space-y-4">
                      {timeSlots
                        .filter(slot => slot.isLunch)
                        .map(slot => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between p-4 bg-venetian-brown/5 dark:bg-white/5 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-venetian-brown dark:text-venetian-sandstone">
                                {slot.time.slice(0, 5)}
                              </p>
                              <p className="text-sm text-venetian-brown/70 dark:text-venetian-sandstone/70">
                                Capacity: {slot.maxCapacity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingTimeSlot(slot)}
                                disabled={updatingTimeSlot}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant={slot.isActive ? 'outline' : 'primary'}
                                className={cn(
                                  slot.isActive
                                    ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                )}
                                onClick={() => handleTimeSlotUpdate(slot.id, { is_active: !slot.isActive })}
                                disabled={updatingTimeSlot}
                              >
                                {updatingTimeSlot ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Power size={16} />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-venetian-brown dark:text-venetian-sandstone mb-4">
                      Dinner Service
                    </h4>
                    <div className="space-y-4">
                      {timeSlots
                        .filter(slot => !slot.isLunch)
                        .map(slot => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between p-4 bg-venetian-brown/5 dark:bg-white/5 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-venetian-brown dark:text-venetian-sandstone">
                                {slot.time.slice(0, 5)}
                              </p>
                              <p className="text-sm text-venetian-brown/70 dark:text-venetian-sandstone/70">
                                Capacity: {slot.maxCapacity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingTimeSlot(slot)}
                                disabled={updatingTimeSlot}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant={slot.isActive ? 'outline' :  'primary'}
                                className={cn(
                                  slot.isActive
                                    ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                )}
                                onClick={() => handleTimeSlotUpdate(slot.id, { is_active: !slot.isActive })}
                                disabled={updatingTimeSlot}
                              >
                                {updatingTimeSlot ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Power size={16} />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-venetian-brown/5 dark:bg-white/5 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowTimeSlotsModal(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Time Slot Modal */}
      <AnimatePresence>
        {editingTimeSlot && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingTimeSlot(null)}
          >
            <motion.div
              className="bg-white dark:bg-venetian-brown/90 rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-6">
                  Edit Time Slot - {editingTimeSlot.time.slice(0, 5)}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-2">
                      Maximum Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editingTimeSlot.maxCapacity}
                      onChange={(e) => setEditingTimeSlot(prev => prev ? ({ ...prev, maxCapacity: parseInt(e.target.value) }) : null)}
                      className="w-full px-3 py-2 rounded-lg border border-venetian-brown/20 dark:border-venetian-sandstone/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 dark:bg-venetian-brown/10 dark:text-venetian-sandstone"
                      disabled={updatingTimeSlot}
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-venetian-brown/5 dark:bg-white/5 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingTimeSlot(null)}
                  disabled={updatingTimeSlot}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
                  onClick={() => {
                    if (editingTimeSlot) {
                      handleTimeSlotUpdate(editingTimeSlot.id, {
                        max_capacity: editingTimeSlot.maxCapacity
                      });
                    }
                  }}
                  disabled={updatingTimeSlot}
                >
                  {updatingTimeSlot ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Closed Dates Modal */}
      <AnimatePresence>
        {showClosedDatesModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClosedDatesModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-venetian-brown/90 rounded-2xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-6">
                  Manage Closures
                </h3>
                <div className="space-y-8">
                  {/* Specific Dates */}
                  <div>
                    <h4 className="text-lg font-medium text-venetian-brown dark:text-venetian-sandstone mb-4">
                      Specific Dates
                    </h4>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={newClosedDate}
                          min={format(new Date(), 'yyyy-MM-dd')}
                          onChange={(e) => setNewClosedDate(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-venetian-brown/20 dark:border-venetian-sandstone/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 dark:bg-venetian-brown/10 dark:text-venetian-sandstone"
                        />
                        <Button
                          onClick={handleAddClosedDate}
                          className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
                        >
                          Add Date
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {closedDates.length === 0 ? (
                          <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 text-center py-4">
                            No specific dates closed
                          </p>
                        ) : (
                          closedDates.map((date) => (
                            <div
                              key={date}
                              className="flex items-center justify-between p-3 bg-venetian-brown/5 dark:bg-white/5 rounded-lg"
                            >
                              <span className="text-venetian-brown dark:text-venetian-sandstone">
                                {format(parseISO(date), 'MMMM d, yyyy')}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => handleRemoveClosedDate(date)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recurring Closures */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-venetian-brown dark:text-venetian-sandstone">
                        Recurring Closures
                      </h4>
                      <Button
                        size="sm"
                        onClick={() => setShowAddRecurringModal(true)}
                        className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Recurring
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {recurringClosures.length === 0 ? (
                        <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 text-center py-4">
                          No recurring closures set
                        </p>
                      ) : (
                        recurringClosures.map((closure) => (
                          <div
                            key={closure.id}
                            className="flex items-center justify-between p-4 bg-venetian-brown/5 dark:bg-white/5 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-venetian-brown dark:text-venetian-sandstone">
                                {daysOfWeek[closure.day_of_week]}
                              </p>
                              <p className="text-sm text-venetian-brown/70 dark:text-venetian-sandstone/70">
                                {closure.start_time.slice(0, 5)} - {closure.end_time.slice(0, 5)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className={cn(
                                  closure.active
                                    ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    : 'border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                                )}
                                onClick={() => handleUpdateRecurringClosure(closure.id, { active: !closure.active })}
                              >
                                <Power size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => handleDeleteRecurringClosure(closure.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-venetian-brown/5 dark:bg-white/5 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowClosedDatesModal(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Recurring Closure Modal */}
      <AnimatePresence>
        {showAddRecurringModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddRecurringModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-venetian-brown/90 rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-6">
                  Add Recurring Closure
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-2">
                      Day of Week
                    </label>
                    <select
                      value={newRecurringClosure.day_of_week}
                      onChange={(e) => setNewRecurringClosure(prev => ({ ...prev, day_of_week: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-lg border border-venetian-brown/20 dark:border-venetian-sandstone/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 dark:bg-venetian-brown/10 dark:text-venetian-sandstone"
                    >
                      {daysOfWeek.map((day, index) => (
                        <option key={day} value={index}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={newRecurringClosure.start_time}
                        onChange={(e) => setNewRecurringClosure(prev => ({ ...prev, start_time: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-venetian-brown/20 dark:border-venetian-sandstone/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 dark:bg-venetian-brown/10 dark:text-venetian-sandstone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={newRecurringClosure.end_time}
                        onChange={(e) => setNewRecurringClosure(prev => ({ ...prev, end_time: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-venetian-brown/20 dark:border-venetian-sandstone/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 dark:bg-venetian-brown/10 dark:text-venetian-sandstone"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-venetian-brown/5 dark:bg-white/5 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddRecurringModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
                  onClick={handleAddRecurringClosure}
                >
                  Add Closure
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reservation Details Modal */}
      <AnimatePresence>
        {selectedReservation && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReservation(null)}
          >
            <motion.div
              className="bg-white dark:bg-venetian-brown/90 rounded-2xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-4">
                  Reservation Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-venetian-brown/70 dark:text-venetian-sandstone/70 mb-1">
                        Guest Name
                      </label>
                      <p className="text-venetian-brown dark:text-venetian-sandstone">{selectedReservation.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-venetian-brown/70 dark:text-venetian-sandstone/70 mb-1">
                        Status
                      </label>
                      <span className={cn(
                        'inline-block px-2 py-1 rounded-full text-xs font-medium',
                        statusColors[selectedReservation.status as keyof typeof statusColors]
                      )}>
                        {selectedReservation.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-venetian-brown/70 dark:text-venetian-sandstone/70 mb-1">
                        Date & Time
                      </label>
                      <p className="text-venetian-brown dark:text-venetian-sandstone">
                        {format(parseISO(selectedReservation.date), 'MMMM d, yyyy')} at{' '}
                        {selectedReservation.time.slice(0, 5)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-venetian-brown/70 dark:text-venetian-sandstone/70 mb-1">
                        Number of Guests
                      </label>
                      <p className="text-venetian-brown dark:text-venetian-sandstone">{selectedReservation.guests}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-venetian-brown/70 dark:text-venetian-sandstone/70 mb-1">
                        Phone
                      </label>
                      <p className="text-venetian-brown dark:text-venetian-sandstone">{selectedReservation.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-venetian-brown/70 dark:text-venetian-sandstone/70 mb-1">
                        Email
                      </label>
                      <p className="text-venetian-brown dark:text-venetian-sandstone">{selectedReservation.email}</p>
                    </div>
                  </div>
                  {selectedReservation.occasion && (
                    <div>
                      <label className="block text-sm font-medium text-venetian-brown/70 dark:text-venetian-sandstone/70 mb-1">
                        Occasion
                      </label>
                      <p className="text-venetian-brown dark:text-venetian-sandstone">{selectedReservation.occasion}</p>
                    </div>
                  )}
                  {selectedReservation.special_requests && (
                    <div>
                      <label className="block text-sm font-medium text-venetian-brown/70 dark:text-venetian-sandstone/70 mb-1">
                        Special Requests
                      </label>
                      <p className="text-venetian-brown dark:text-venetian-sandstone">{selectedReservation.special_requests}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-venetian-brown/5 dark:bg-white/5 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedReservation(null)}
                >
                  Close
                </Button>
                {selectedReservation.status === 'pending' && (
                  <>
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleStatusUpdate(selectedReservation.id, 'confirmed')}
                    >
                      Confirm Reservation
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleStatusUpdate(selectedReservation.id, 'cancelled')}
                    >
                      Cancel Reservation
                    </Button>
                  </>
                )}
                {selectedReservation.status === 'confirmed' && (
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => handleStatusUpdate(selectedReservation.id, 'completed')}
                  >
                    Mark as Completed
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}