import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import {
  startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, format, isSameMonth,
  isToday, isSameDay, addMonths, subMonths
} from 'date-fns';
import { cn } from '../../lib/utils';
import { getReservationsByMonth, getReservations, getClosedDates, getRecurringClosures } from '../../lib/api';
import type { Database } from '../../lib/database.types';

type Reservation = Database['public']['Tables']['reservations']['Row'];

type DayData = {
  date: string;
  count: number;
  statuses: string[];
};

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

function getDotColor(statuses: string[]): string {
  if (statuses.length === 0) return 'bg-gray-300 dark:bg-gray-600';
  if (statuses.some(s => s === 'pending')) return 'bg-yellow-400';
  if (statuses.some(s => s === 'confirmed')) return 'bg-green-500';
  if (statuses.every(s => s === 'cancelled')) return 'bg-red-400';
  return 'bg-gray-400';
}

type Props = {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
};

export function ReservationCalendar({ onSelectDate, selectedDate }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthData, setMonthData] = useState<DayData[]>([]);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [recurringClosures, setRecurringClosures] = useState<{ day_of_week: number; active: boolean }[]>([]);
  const [dayReservations, setDayReservations] = useState<Reservation[]>([]);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);

  useEffect(() => {
    loadMonthData();
  }, [currentMonth]);

  useEffect(() => {
    if (selectedDate) {
      loadDayReservations(selectedDate);
    }
  }, [selectedDate]);

  const loadMonthData = async () => {
    setLoadingMonth(true);
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const [data, closed, recurring] = await Promise.all([
        getReservationsByMonth(year, month),
        getClosedDates(),
        getRecurringClosures(),
      ]);
      setMonthData(data);
      setClosedDates(closed.map(d => d.date));
      setRecurringClosures(recurring);
    } catch (error) {
      console.error('Error loading month data:', error);
    } finally {
      setLoadingMonth(false);
    }
  };

  const loadDayReservations = async (date: Date) => {
    setLoadingDay(true);
    try {
      const data = await getReservations(format(date, 'yyyy-MM-dd'));
      setDayReservations(data);
    } catch (error) {
      console.error('Error loading day reservations:', error);
    } finally {
      setLoadingDay(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const getDayData = (date: Date): DayData | undefined =>
    monthData.find(d => d.date === format(date, 'yyyy-MM-dd'));

  const isClosed = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (closedDates.includes(dateStr)) return true;
    const dow = date.getDay();
    return recurringClosures.some(c => c.active && c.day_of_week === dow);
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  };

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
          className="p-2 rounded-lg hover:bg-venetian-brown/5 dark:hover:bg-white/5 text-venetian-brown dark:text-venetian-sandstone"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-serif text-venetian-brown dark:text-venetian-sandstone capitalize">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
          className="p-2 rounded-lg hover:bg-venetian-brown/5 dark:hover:bg-white/5 text-venetian-brown dark:text-venetian-sandstone"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-venetian-brown/50 dark:text-venetian-sandstone/50 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {loadingMonth ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-venetian-brown/40" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {calDays.map(day => {
            const dayData = getDayData(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDay = isToday(day);
            const isDayClosed = isClosed(day);

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: 1.05 }}
                onClick={() => onSelectDate(day)}
                className={cn(
                  'relative p-2 rounded-lg text-sm transition-colors min-h-[44px] flex flex-col items-center justify-start gap-1',
                  isCurrentMonth
                    ? 'text-venetian-brown dark:text-venetian-sandstone'
                    : 'text-venetian-brown/30 dark:text-venetian-sandstone/30',
                  isSelected
                    ? 'bg-venetian-gold/20 border border-venetian-gold'
                    : isDayClosed
                    ? 'bg-red-50 dark:bg-red-900/10'
                    : 'hover:bg-venetian-brown/5 dark:hover:bg-white/5'
                )}
              >
                {/* Today indicator */}
                {isTodayDay && (
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-venetian-gold" />
                )}
                <span className={cn('font-medium text-xs', isTodayDay && 'text-venetian-gold')}>
                  {format(day, 'd')}
                </span>
                {/* Reservation dot */}
                {dayData && dayData.count > 0 && (
                  <div className="flex items-center gap-0.5">
                    <div className={cn('w-1.5 h-1.5 rounded-full', getDotColor(dayData.statuses))} />
                    <span className="text-[9px] text-venetian-brown/60 dark:text-venetian-sandstone/60">
                      {dayData.count}
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-venetian-brown/60 dark:text-venetian-sandstone/60">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Confermate</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400" /> In attesa</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /> Cancellate</div>
      </div>

      {/* Selected day reservations */}
      {selectedDate && (
        <div className="mt-4 border-t border-venetian-brown/10 dark:border-venetian-sandstone/10 pt-4">
          <h4 className="text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-3">
            Prenotazioni del {format(selectedDate, 'd MMMM yyyy')}
          </h4>
          {loadingDay ? (
            <div className="flex justify-center py-4">
              <Loader2 size={20} className="animate-spin text-venetian-brown/40" />
            </div>
          ) : dayReservations.length === 0 ? (
            <p className="text-sm text-venetian-brown/50 dark:text-venetian-sandstone/50 text-center py-2">
              Nessuna prenotazione
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dayReservations.map(r => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 bg-venetian-brown/5 dark:bg-white/5 rounded-lg text-sm"
                >
                  <div>
                    <span className="font-medium text-venetian-brown dark:text-venetian-sandstone">{r.name}</span>
                    <span className="ml-2 text-venetian-brown/60 dark:text-venetian-sandstone/60">
                      {r.time.slice(0, 5)} · {r.guests} ospiti
                    </span>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[r.status] ?? 'bg-gray-100 text-gray-800')}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
