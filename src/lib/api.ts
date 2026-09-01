import { supabase } from './supabase';
import { getDaysInMonth } from 'date-fns';
import { ReservationFormData } from './validators';
import { sendReservationConfirmation } from './notifications';
import type { Database } from './database.types';
import { getAttribution } from './analytics';
import { reservationChannel } from './reservationAttribution';

export type Table = Database['public']['Tables']['tables']['Row'];
export type WaitlistEntry = Database['public']['Tables']['waitlist']['Row'];
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export type ReservationUpdateData = Pick<
  Database['public']['Tables']['reservations']['Update'],
  | 'name'
  | 'email'
  | 'phone'
  | 'date'
  | 'time'
  | 'guests'
  | 'occasion'
  | 'special_requests'
  | 'admin_notes'
  | 'source'
  | 'status'
>;

export type ManualReservationData = {
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  occasion?: string;
  special_requests?: string;
  admin_notes?: string;
  source: 'phone' | 'walk_in' | 'online';
  send_confirmation_email: boolean;
  initial_status: 'pending' | 'confirmed';
};

// Cache for restaurant ID
let _restaurantId: string | null = null;

export async function getRestaurantId(): Promise<string> {
  if (_restaurantId) return _restaurantId;
  const { data, error } = await supabase
    .from('restaurants')
    .select('id')
    .limit(1)
    .single();
  if (error) throw error;
  if (!data) throw new Error('No restaurant found');
  _restaurantId = data.id;
  return data.id;
}

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
    const { data, error } = await supabase.rpc('get_public_availability', {
      p_date: date,
    });

    if (error) throw error;

    return (data || []).map(slot => ({
      id: slot.slot_id,
      time: slot.slot_time,
      available: slot.available,
      remainingCapacity: slot.remaining_capacity,
      maxCapacity: slot.max_capacity,
      isActive: true,
      isLunch: slot.is_lunch,
      isRecurringClosed: slot.is_recurring_closed,
    }));
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

export async function createReservation(data: ReservationFormData, locale = 'en') {
  try {
    const { data: result, error } = await supabase.rpc('create_public_reservation', {
      p_date: data.date,
      p_time: data.time,
      p_guests: data.guests,
      p_name: data.name,
      p_email: data.email,
      p_phone: data.phone,
      p_occasion: data.occasion || null,
      p_special_requests: data.special_requests || null,
      p_marketing_consent: data.marketing_consent,
      p_locale: locale,
      p_attribution: getAttribution(),
    });

    if (error) throw error;
    const reservation = result?.[0];
    if (!reservation) throw new Error('Failed to create reservation');

    let confirmationEmailSent = true;
    try {
      await sendReservationConfirmation(
        reservation.reservation_id,
        reservation.cancellation_token,
      );
    } catch (emailError) {
      confirmationEmailSent = false;
      console.error('Failed to send confirmation email:', emailError);
    }

    return {
      id: reservation.reservation_id,
      cancellation_token: reservation.cancellation_token,
      confirmation_email_sent: confirmationEmailSent,
    };
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

export async function updateReservationStatus(id: string, status: ReservationStatus) {
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

export async function createManualReservation(data: ManualReservationData) {
  try {
    const { data: reservation, error } = await supabase
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
        admin_notes: data.admin_notes || null,
        source: data.source,
        status: data.initial_status,
        marketing_consent: false,
      })
      .select('*')
      .single();

    if (error) throw error;
    if (!reservation) throw new Error('Failed to create reservation');

    if (data.send_confirmation_email) {
      try {
        await sendReservationConfirmation(
          reservation.id,
          reservation.cancellation_token,
        );
      } catch (emailError) {
        console.error('❌ Failed to send confirmation email (non-blocking):', emailError);
      }
    }

    return reservation;
  } catch (error) {
    console.error('Error in createManualReservation:', error);
    throw error;
  }
}

export async function getReservationsByMonth(
  year: number,
  month: number
): Promise<{ date: string; count: number; statuses: string[] }[]> {
  try {
    const lastDay = getDaysInMonth(new Date(year, month - 1));
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const { data, error } = await supabase
      .from('reservations')
      .select('date, status')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const grouped = new Map<string, string[]>();
    for (const r of data || []) {
      if (!grouped.has(r.date)) grouped.set(r.date, []);
      grouped.get(r.date)!.push(r.status);
    }

    return Array.from(grouped.entries()).map(([date, statuses]) => ({
      date,
      count: statuses.length,
      statuses,
    }));
  } catch (error) {
    console.error('Error fetching reservations by month:', error);
    throw error;
  }
}

// ─── Table Management ────────────────────────────────────────────────────────

export async function getTables(): Promise<Table[]> {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
}

export async function createTable(tableData: {
  name: string;
  capacity: number;
  location: string;
  is_active: boolean;
}): Promise<Table> {
  try {
    const restaurantId = await getRestaurantId();
    const { data, error } = await supabase
      .from('tables')
      .insert({ ...tableData, restaurant_id: restaurantId })
      .select('*')
      .single();
    if (error) throw error;
    if (!data) throw new Error('Failed to create table');
    return data;
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
}

export async function updateTable(id: string, tableData: Partial<Table>): Promise<Table> {
  try {
    const { data, error } = await supabase
      .from('tables')
      .update(tableData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    if (!data) throw new Error('Table not found');
    return data;
  } catch (error) {
    console.error('Error updating table:', error);
    throw error;
  }
}

export async function deleteTable(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('tables').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting table:', error);
    throw error;
  }
}

export async function getAvailableTables(
  date: string,
  time: string,
  guests: number
): Promise<Table[]> {
  try {
    // Get tables with enough capacity
    const { data: allTables, error: tablesError } = await supabase
      .from('tables')
      .select('*')
      .eq('is_active', true)
      .gte('capacity', guests)
      .order('capacity');

    if (tablesError) throw tablesError;

    // Get reservations for that date+time that already have a table assigned
    const { data: occupied, error: occError } = await supabase
      .from('reservations')
      .select('table_id')
      .eq('date', date)
      .eq('time', time)
      .in('status', ['pending', 'confirmed'])
      .not('table_id', 'is', null);

    if (occError) throw occError;

    const occupiedIds = new Set((occupied || []).map(r => r.table_id));
    return (allTables || []).filter(t => !occupiedIds.has(t.id));
  } catch (error) {
    console.error('Error fetching available tables:', error);
    throw error;
  }
}

export async function assignTableToReservation(
  reservationId: string,
  tableId: string | null
): Promise<void> {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ table_id: tableId })
      .eq('id', reservationId);
    if (error) throw error;
  } catch (error) {
    console.error('Error assigning table to reservation:', error);
    throw error;
  }
}

// ─── Waitlist ────────────────────────────────────────────────────────────────

export async function joinWaitlist(data: {
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  occasion?: string;
  special_requests?: string;
}): Promise<{ id: string; position: number }> {
  try {
    const { data: result, error } = await supabase.rpc('join_public_waitlist', {
      p_date: data.date,
      p_time: data.time,
      p_guests: data.guests,
      p_name: data.name,
      p_email: data.email,
      p_phone: data.phone,
      p_occasion: data.occasion || null,
      p_special_requests: data.special_requests || null,
    });
    if (error) throw error;
    const entry = result?.[0];
    if (!entry) throw new Error('Failed to join waitlist');
    return { id: entry.waitlist_id, position: entry.position };
  } catch (error) {
    console.error('Error joining waitlist:', error);
    throw error;
  }
}

export async function getWaitlistForSlot(
  date: string,
  time: string
): Promise<WaitlistEntry[]> {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('date', date)
      .eq('time', time)
      .order('position', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching waitlist for slot:', error);
    throw error;
  }
}

export async function notifyWaitlistEntry(
  id: string,
): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Admin session required');

    const { data, error } = await supabase.functions.invoke('send-waitlist-notification', {
      body: { waitlist_id: id },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);
  } catch (error) {
    console.error('Error notifying waitlist entry:', error);
    throw error;
  }
}

export async function updateReservationDetails(id: string, data: ReservationUpdateData) {
  try {
    const { data: updatedReservation, error } = await supabase
      .from('reservations')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    if (!updatedReservation) throw new Error('Reservation not found');

    return updatedReservation;
  } catch (error) {
    console.error('Error updating reservation details:', error);
    throw error;
  }
}

// ─── Reservation by cancellation token ──────────────────────────────────────

export type Reservation = Database['public']['Tables']['reservations']['Row'];
export type ReservationSummary = Pick<Reservation, 'id' | 'name' | 'date' | 'time' | 'guests' | 'status'>;
export type MarketingCampaignMetric = Database['public']['Tables']['marketing_campaign_metrics']['Row'];
export type MarketingCampaignMetricInput = Pick<
  Database['public']['Tables']['marketing_campaign_metrics']['Insert'],
  'metric_date' | 'channel' | 'campaign' | 'impressions' | 'clicks' | 'sessions' | 'spend_eur' | 'revenue_eur' | 'notes'
>;

export async function getReservationByToken(token: string): Promise<ReservationSummary | null> {
  try {
    const { data, error } = await supabase.rpc('get_reservation_summary_by_token', {
      p_token: token,
    });
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error fetching reservation by token:', error);
    throw error;
  }
}

export async function cancelReservationByToken(token: string): Promise<void> {
  try {
    const { data, error } = await supabase.rpc('cancel_reservation_by_token', {
      p_token: token,
    });
    if (error) throw error;
    if (data === 'already_cancelled' || data === 'already_completed') {
      throw new Error(data);
    }
  } catch (error) {
    console.error('Error cancelling reservation by token:', error);
    throw error;
  }
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export async function getReservationsForStats(
  startDate: string,
  endDate: string
): Promise<Reservation[]> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reservations for stats:', error);
    throw error;
  }
}

export async function getMarketingCampaignMetrics(
  startDate: string,
  endDate: string
): Promise<MarketingCampaignMetric[]> {
  const { data, error } = await supabase
    .from('marketing_campaign_metrics')
    .select('*')
    .gte('metric_date', startDate)
    .lte('metric_date', endDate)
    .order('metric_date', { ascending: false })
    .order('channel', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function upsertMarketingCampaignMetric(
  input: MarketingCampaignMetricInput
): Promise<MarketingCampaignMetric> {
  const campaign = (input.campaign || 'all').trim().toLowerCase().replace(/\s+/g, '_') || 'all';
  const normalized = {
    ...input,
    campaign,
    notes: input.notes?.trim() || null,
  };
  const { data, error } = await supabase
    .from('marketing_campaign_metrics')
    .upsert(normalized, { onConflict: 'metric_date,channel,campaign' })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMarketingCampaignMetric(id: string): Promise<void> {
  const { error } = await supabase
    .from('marketing_campaign_metrics')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export function exportReservationsToCSV(reservations: Reservation[], filename?: string): void {
  const header = 'ID,Data,Orario,Nome,Email,Telefono,Ospiti,Status,Occasione,Note admin,Fonte operativa,Canale marketing,Richieste speciali';
  const rows = reservations.map(r => [
    r.id.slice(0, 8),
    r.date,
    r.time.slice(0, 5),
    `"${r.name.replace(/"/g, '""')}"`,
    r.email,
    r.phone,
    r.guests,
    r.status,
    r.occasion ? `"${r.occasion.replace(/"/g, '""')}"` : '',
    r.admin_notes ? `"${r.admin_notes.replace(/"/g, '""')}"` : '',
    r.source ?? 'online',
    `"${reservationChannel(r).replace(/"/g, '""')}"`,
    r.special_requests ? `"${r.special_requests.replace(/"/g, '""')}"` : '',
  ].join(','));

  // BOM for correct Italian Excel UTF-8 rendering
  const csv = '\uFEFF' + [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? `prenotazioni-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function createContactMessage(data: {
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const { error } = await supabase.rpc('create_contact_message', {
      p_first_name: data.first_name,
      p_last_name: data.last_name,
      p_email: data.email,
      p_subject: data.subject,
      p_message: data.message,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving contact message:', error);
    throw error;
  }
}
