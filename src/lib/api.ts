import { supabase } from './supabase';
import { ReservationFormData } from './validators';
import { addDays, format, isAfter, isBefore, parseISO, startOfDay } from 'date-fns';
import { sendReservationConfirmation } from './notifications';

export type TimeSlot = {
  id: string;
  time: string;
  max_capacity: number;
  is_lunch: boolean;
  is_active: boolean;
  created_at: string;
};

export async function getAvailableTimeSlots(date: string) {
  try {
    // Get all time slots
    const { data: timeSlots, error: timeSlotsError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('is_active', true)
      .order('time');

    if (timeSlotsError) throw timeSlotsError;
    if (!timeSlots) return [];

    // Get existing reservations for the date
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('time, guests')
      .eq('date', date)
      .in('status', ['pending', 'confirmed']);

    if (reservationsError) throw reservationsError;

    // Get recurring closures for the day of week
    const dayOfWeek = parseISO(date).getDay();
    const { data: recurringClosures, error: recurringClosuresError } = await supabase
      .from('recurring_closures')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .eq('active', true);

    if (recurringClosuresError) throw recurringClosuresError;

    // Calculate availability
    return timeSlots.map(slot => {
      const isRecurringClosed = recurringClosures?.some(closure => 
        slot.time >= closure.start_time && slot.time <= closure.end_time
      ) || false;

      const reservationsForSlot = reservations?.filter(r => r.time === slot.time) || [];
      const totalGuests = reservationsForSlot.reduce((sum, r) => sum + r.guests, 0);
      const available = !isRecurringClosed && totalGuests < slot.max_capacity;

      return {
        id: slot.id,
        time: slot.time,
        available,
        remainingCapacity: Math.max(0, slot.max_capacity - totalGuests),
        maxCapacity: slot.max_capacity,
        isActive: slot.is_active,
        isLunch: slot.is_lunch,
        isRecurringClosed
      };
    });
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw error;
  }
}

export async function createTimeSlot(data: { time: string; max_capacity: number; is_lunch: boolean }) {
  try {
    const { data: timeSlot, error } = await supabase
      .from('time_slots')
      .insert(data)
      .select('*')
      .single();

    if (error) throw error;
    if (!timeSlot) throw new Error('Failed to create time slot');

    return timeSlot;
  } catch (error) {
    console.error('Error creating time slot:', error);
    throw error;
  }
}

export async function updateTimeSlot(id: string, data: { is_active?: boolean; max_capacity?: number }) {
  try {
    const { data: updatedSlot, error } = await supabase
      .from('time_slots')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    if (!updatedSlot) throw new Error('Time slot not found');

    return updatedSlot;
  } catch (error) {
    console.error('Error updating time slot:', error);
    throw error;
  }
}

export async function deleteTimeSlot(id: string) {
  try {
    const { error } = await supabase
      .from('time_slots')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting time slot:', error);
    throw error;
  }
}

export async function createReservation(data: ReservationFormData) {
  try {
    // Check if the time slot is still available
    const timeSlots = await getAvailableTimeSlots(data.date);
    const selectedSlot = timeSlots.find(slot => slot.time === data.time);
    
    if (!selectedSlot) {
      throw new Error('Selected time slot not found');
    }

    if (!selectedSlot.available) {
      throw new Error('Selected time slot is no longer available');
    }

    if (selectedSlot.remainingCapacity < data.guests) {
      throw new Error(`Not enough capacity for ${data.guests} guests. Only ${selectedSlot.remainingCapacity} spots remaining.`);
    }

    // Check for duplicate reservations
    const { data: existingReservation, error: checkError } = await supabase
      .from('reservations')
      .select('id')
      .eq('date', data.date)
      .eq('time', data.time)
      .eq('email', data.email)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing reservation:', checkError);
      throw new Error('Failed to verify reservation availability');
    }
    
    if (existingReservation) {
      throw new Error('You already have a reservation for this date and time');
    }

    // Create the reservation
    const { data: reservation, error: insertError } = await supabase
      .from('reservations')
      .insert({
        date: data.date,
        time: data.time,
        guests: data.guests,
        name: data.name,
        email: data.email,
        phone: data.phone,
        occasion: data.occasion || null,
        special_requests: data.special_requests || null,
        marketing_consent: data.marketing_consent,
        status: 'pending'
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Error creating reservation:', insertError);
      throw new Error('Failed to create reservation');
    }

    if (!reservation) {
      throw new Error('Failed to create reservation');
    }

    // Send confirmation email
    try {
      await sendReservationConfirmation(data);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the reservation if email fails
      // But we should log this for monitoring
    }

    return reservation;
  } catch (error) {
    console.error('Error in createReservation:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while creating your reservation');
  }
}

export async function getReservations(date: string) {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('date', date)
      .order('time', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
}

export async function getUserReservations(email: string) {
  try {
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('email', email)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;
    return reservations || [];
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    throw error;
  }
}

export async function updateReservationStatus(id: string, status: 'confirmed' | 'cancelled' | 'completed') {
  try {
    const { data: updatedReservation, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    if (!updatedReservation) throw new Error('Reservation not found');

    return updatedReservation;
  } catch (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
}

export async function cancelReservation(id: string, email: string) {
  try {
    const { data: reservation, error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('email', email)
      .select('*')
      .single();

    if (error) throw error;
    if (!reservation) throw new Error('Reservation not found');

    return reservation;
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    throw error;
  }
}

export async function getClosedDates() {
  try {
    const { data, error } = await supabase
      .from('closed_dates')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching closed dates:', error);
    throw error;
  }
}

export async function addClosedDate(date: string) {
  try {
    const { data, error } = await supabase
      .from('closed_dates')
      .insert({ date })
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to add closed date');

    return data;
  } catch (error) {
    console.error('Error adding closed date:', error);
    throw error;
  }
}

export async function removeClosedDate(date: string) {
  try {
    const { error } = await supabase
      .from('closed_dates')
      .delete()
      .eq('date', date);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing closed date:', error);
    throw error;
  }
}

export async function getRecurringClosures() {
  try {
    const { data, error } = await supabase
      .from('recurring_closures')
      .select('*')
      .order('day_of_week');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recurring closures:', error);
    throw error;
  }
}

export async function createRecurringClosure(data: Omit<RecurringClosure, 'id' | 'created_at'>) {
  try {
    const { data: closure, error } = await supabase
      .from('recurring_closures')
      .insert(data)
      .select('*')
      .single();

    if (error) throw error;
    if (!closure) throw new Error('Failed to create recurring closure');

    return closure;
  } catch (error) {
    console.error('Error creating recurring closure:', error);
    throw error;
  }
}

export async function updateRecurringClosure(id: string, data: Partial<Omit<RecurringClosure, 'id' | 'created_at'>>) {
  try {
    const { data: closure, error } = await supabase
      .from('recurring_closures')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    if (!closure) throw new Error('Recurring closure not found');

    return closure;
  } catch (error) {
    console.error('Error updating recurring closure:', error);
    throw error;
  }
}

export async function deleteRecurringClosure(id: string) {
  try {
    const { error } = await supabase
      .from('recurring_closures')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting recurring closure:', error);
    throw error;
  }
}

export type RecurringClosure = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  active: boolean;
  created_at: string;
};