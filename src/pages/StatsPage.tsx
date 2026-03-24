import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ChevronLeft, Download, Loader2 } from 'lucide-react';
import { format, subDays, subMonths, startOfYear, parseISO } from 'date-fns';
import { SEOHead } from '../components/SEOHead';
import { Button } from '../components/Button';
import { getReservationsForStats, exportReservationsToCSV } from '../lib/api';
import type { Reservation } from '../lib/api';

const COLORS = {
  confirmed: '#5C4033',
  pending:   '#D4AF37',
  cancelled: '#9E4638',
  completed: '#708D81',
};

type Period = 'week' | 'month' | '3months' | 'year';

function getPeriodDates(period: Period): { start: string; end: string; label: string } {
  const today = new Date();
  const end = format(today, 'yyyy-MM-dd');
  switch (period) {
    case 'week':    return { start: format(subDays(today, 7), 'yyyy-MM-dd'),      end, label: 'Ultima settimana' };
    case 'month':   return { start: format(subMonths(today, 1), 'yyyy-MM-dd'),    end, label: 'Ultimo mese' };
    case '3months': return { start: format(subMonths(today, 3), 'yyyy-MM-dd'),    end, label: 'Ultimi 3 mesi' };
    case 'year':    return { start: format(startOfYear(today), 'yyyy-MM-dd'),     end, label: "Quest'anno" };
  }
}

function KpiCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <motion.div
      className="bg-white dark:bg-venetian-brown/50 rounded-xl shadow p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-sm text-venetian-brown/60 dark:text-venetian-sandstone/60 mb-1">{label}</p>
      <p className={`text-3xl font-bold font-serif ${color ?? 'text-venetian-brown dark:text-venetian-sandstone'}`}>{value}</p>
      {sub && <p className="text-xs text-venetian-brown/50 dark:text-venetian-sandstone/50 mt-1">{sub}</p>}
    </motion.div>
  );
}

export function StatsPage() {
  const [period, setPeriod] = useState<Period>('month');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { start, end } = getPeriodDates(period);
      const data = await getReservationsForStats(start, end);
      setReservations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { loadData(); }, [loadData]);

  // KPIs
  const total     = reservations.length;
  const guests    = reservations.reduce((s, r) => s + r.guests, 0);
  const active    = reservations.filter(r => r.status !== 'cancelled');
  const confirmed = reservations.filter(r => r.status === 'confirmed' || r.status === 'completed').length;
  const cancelled = reservations.filter(r => r.status === 'cancelled').length;
  const confirmRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;
  const noShowRate  = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  // Chart 1: reservations per day
  const byDay: Record<string, Record<string, number>> = {};
  for (const r of reservations) {
    if (!byDay[r.date]) byDay[r.date] = { confirmed: 0, pending: 0, cancelled: 0, completed: 0 };
    byDay[r.date][r.status] = (byDay[r.date][r.status] ?? 0) + 1;
  }
  const dailyData = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({
      date: format(parseISO(date), 'd/M'),
      ...counts,
    }));

  // Chart 2: by time slot
  const byTime: Record<string, number> = {};
  for (const r of active) {
    const t = r.time.slice(0, 5);
    byTime[t] = (byTime[t] ?? 0) + 1;
  }
  const timeData = Object.entries(byTime)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, count]) => ({ time, count }));

  // Chart 3: occasions pie
  const occasionCounts: Record<string, number> = {};
  for (const r of reservations) {
    if (r.occasion) {
      occasionCounts[r.occasion] = (occasionCounts[r.occasion] ?? 0) + 1;
    }
  }
  const pieData = Object.entries(occasionCounts).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ['#5C4033', '#D4AF37', '#9E4638', '#708D81', '#A3865B'];

  // Table: by day of week
  const DOW_LABELS = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const byDow: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const r of reservations) {
    const dow = parseISO(r.date).getDay();
    byDow[dow]++;
  }
  const maxDow = Math.max(...Object.values(byDow));

  const handleExportCSV = () => {
    const csv = exportReservationsToCSV(reservations);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prenotazioni-${getPeriodDates(period).start}-${getPeriodDates(period).end}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-venetian-sandstone/20 dark:bg-venetian-brown/95 pt-24 pb-16">
      <SEOHead title="Statistiche Admin" noindex />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="text-venetian-brown/60 dark:text-venetian-sandstone/60 hover:text-venetian-brown dark:hover:text-venetian-sandstone transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-serif text-venetian-brown dark:text-venetian-sandstone">
              Statistiche
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={period}
              onChange={e => setPeriod(e.target.value as Period)}
              className="px-3 py-2 rounded-lg border border-venetian-brown/20 dark:border-venetian-sandstone/20 bg-white dark:bg-venetian-brown/40 text-venetian-brown dark:text-venetian-sandstone text-sm focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
            >
              <option value="week">Ultima settimana</option>
              <option value="month">Ultimo mese</option>
              <option value="3months">Ultimi 3 mesi</option>
              <option value="year">Quest'anno</option>
            </select>
            <Button
              onClick={handleExportCSV}
              className="bg-venetian-brown text-white hover:bg-venetian-brown/90 dark:bg-venetian-gold dark:text-venetian-brown"
            >
              <Download className="w-4 h-4 mr-2" />
              Esporta CSV
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-venetian-gold" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard label="Totale prenotazioni" value={total} />
              <KpiCard label="Ospiti totali" value={guests} />
              <KpiCard
                label="Tasso conferma"
                value={`${confirmRate}%`}
                sub={`${confirmed} di ${total}`}
                color="text-green-600 dark:text-green-400"
              />
              <KpiCard
                label="Tasso cancellazione"
                value={`${noShowRate}%`}
                sub={`${cancelled} di ${total}`}
                color="text-red-600 dark:text-red-400"
              />
            </div>

            {/* Chart 1: Daily bar chart */}
            <div className="bg-white dark:bg-venetian-brown/50 rounded-xl shadow p-6">
              <h2 className="font-serif text-lg text-venetian-brown dark:text-venetian-sandstone mb-4">
                Prenotazioni per giorno
              </h2>
              {dailyData.length === 0 ? (
                <p className="text-center py-8 text-venetian-brown/50 dark:text-venetian-sandstone/50 text-sm">Nessun dato nel periodo selezionato</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9E8272' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#9E8272' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: '1px solid #e0c99a', background: '#fdf6ee' }}
                      labelStyle={{ color: '#5C4033', fontWeight: 600 }}
                    />
                    <Bar dataKey="confirmed" name="Confermata" stackId="a" fill={COLORS.confirmed} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="pending"   name="In attesa"  stackId="a" fill={COLORS.pending}   />
                    <Bar dataKey="cancelled" name="Cancellata" stackId="a" fill={COLORS.cancelled} />
                    <Bar dataKey="completed" name="Completata" stackId="a" fill={COLORS.completed} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Chart 2: By time slot */}
              <div className="bg-white dark:bg-venetian-brown/50 rounded-xl shadow p-6">
                <h2 className="font-serif text-lg text-venetian-brown dark:text-venetian-sandstone mb-4">
                  Fascia oraria più richiesta
                </h2>
                {timeData.length === 0 ? (
                  <p className="text-center py-8 text-venetian-brown/50 dark:text-venetian-sandstone/50 text-sm">Nessun dato</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={timeData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#9E8272' }} allowDecimals={false} />
                      <YAxis dataKey="time" type="category" tick={{ fontSize: 11, fill: '#9E8272' }} width={42} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: '1px solid #e0c99a', background: '#fdf6ee' }}
                        labelStyle={{ color: '#5C4033', fontWeight: 600 }}
                      />
                      <Bar dataKey="count" name="Prenotazioni" fill={COLORS.confirmed} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Chart 3: Occasions pie */}
              <div className="bg-white dark:bg-venetian-brown/50 rounded-xl shadow p-6">
                <h2 className="font-serif text-lg text-venetian-brown dark:text-venetian-sandstone mb-4">
                  Occasioni più popolari
                </h2>
                {pieData.length === 0 ? (
                  <p className="text-center py-8 text-venetian-brown/50 dark:text-venetian-sandstone/50 text-sm">Nessun dato</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: '1px solid #e0c99a', background: '#fdf6ee' }}
                        labelStyle={{ color: '#5C4033' }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Day of week table */}
            <div className="bg-white dark:bg-venetian-brown/50 rounded-xl shadow p-6">
              <h2 className="font-serif text-lg text-venetian-brown dark:text-venetian-sandstone mb-4">
                Distribuzione per giorno della settimana
              </h2>
              <div className="space-y-2">
                {DOW_LABELS.map((day, idx) => {
                  const count = byDow[idx];
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  const isMax = count === maxDow && maxDow > 0;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <span className={`w-24 text-sm shrink-0 ${isMax ? 'font-semibold text-venetian-gold' : 'text-venetian-brown/70 dark:text-venetian-sandstone/70'}`}>
                        {day}
                      </span>
                      <div className="flex-1 bg-venetian-brown/10 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isMax ? 'bg-venetian-gold' : 'bg-venetian-brown/40 dark:bg-venetian-sandstone/40'}`}
                          style={{ width: `${maxDow > 0 ? (count / maxDow) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm w-16 text-right text-venetian-brown/60 dark:text-venetian-sandstone/60 shrink-0">
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
