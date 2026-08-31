import { useState, type FormEvent } from 'react';
import { Loader2, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  deleteMarketingCampaignMetric,
  upsertMarketingCampaignMetric,
  type MarketingCampaignMetric,
} from '../../lib/api';

export const MARKETING_CHANNELS = [
  { value: 'google_ads', label: 'Google Ads', paid: true },
  { value: 'meta_ads', label: 'Meta Ads', paid: true },
  { value: 'tiktok_ads', label: 'TikTok Ads', paid: true },
  { value: 'google_business', label: 'Google Business Profile', paid: false },
  { value: 'organic_search', label: 'Ricerca organica', paid: false },
  { value: 'instagram_organic', label: 'Instagram organico', paid: false },
  { value: 'thefork', label: 'TheFork', paid: false },
  { value: 'tripadvisor', label: 'Tripadvisor', paid: false },
  { value: 'referral', label: 'Referral', paid: false },
  { value: 'other', label: 'Altro', paid: false },
] as const;

const CHANNEL_LABELS = new Map<string, string>(
  MARKETING_CHANNELS.map(channel => [channel.value, channel.label])
);

type FormState = {
  metric_date: string;
  channel: string;
  campaign: string;
  impressions: string;
  clicks: string;
  sessions: string;
  spend_eur: string;
  revenue_eur: string;
  notes: string;
};

type NumericFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  step?: string;
};

function NumericField({ id, label, value, onChange, step = '1' }: NumericFieldProps) {
  return (
    <label htmlFor={id} className="block text-sm text-venetian-brown/75 dark:text-venetian-sandstone/75">
      {label}
      <input
        id={id}
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={event => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-venetian-brown/20 bg-white px-3 py-2 text-venetian-brown focus:border-venetian-gold focus:outline-none focus:ring-1 focus:ring-venetian-gold dark:border-venetian-sandstone/20 dark:bg-venetian-brown/60 dark:text-venetian-sandstone"
      />
    </label>
  );
}

function createInitialState(date: string): FormState {
  return {
    metric_date: date,
    channel: 'google_ads',
    campaign: 'all',
    impressions: '0',
    clicks: '0',
    sessions: '0',
    spend_eur: '0',
    revenue_eur: '0',
    notes: '',
  };
}

function numberValue(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });

export function MarketingMetricsPanel({
  metrics,
  defaultDate,
  onChanged,
}: {
  metrics: MarketingCampaignMetric[];
  defaultDate: string;
  onChanged: () => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(() => createInitialState(defaultDate));
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const setField = (field: keyof FormState, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await upsertMarketingCampaignMetric({
        metric_date: form.metric_date,
        channel: form.channel,
        campaign: form.campaign,
        impressions: numberValue(form.impressions),
        clicks: numberValue(form.clicks),
        sessions: numberValue(form.sessions),
        spend_eur: numberValue(form.spend_eur),
        revenue_eur: numberValue(form.revenue_eur),
        notes: form.notes || null,
      });
      toast.success('Dati marketing salvati');
      setForm(current => ({
        ...createInitialState(current.metric_date),
        channel: current.channel,
      }));
      await onChanged();
    } catch (error) {
      console.error(error);
      toast.error('Impossibile salvare i dati marketing');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (metric: MarketingCampaignMetric) => {
    if (!window.confirm(`Eliminare ${metric.campaign} del ${metric.metric_date}?`)) return;
    setDeletingId(metric.id);
    try {
      await deleteMarketingCampaignMetric(metric.id);
      toast.success('Riga eliminata');
      await onChanged();
    } catch (error) {
      console.error(error);
      toast.error('Impossibile eliminare la riga');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow dark:bg-venetian-brown/50" aria-labelledby="marketing-input-title">
      <div className="mb-5">
        <h2 id="marketing-input-title" className="font-serif text-lg text-venetian-brown dark:text-venetian-sandstone">
          Dati campagne
        </h2>
        <p className="mt-1 text-xs text-venetian-brown/55 dark:text-venetian-sandstone/55">
          Inserisci dati aggregati dagli export delle piattaforme. La stessa combinazione data, canale e campagna aggiorna la riga esistente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label htmlFor="metric-date" className="block text-sm text-venetian-brown/75 dark:text-venetian-sandstone/75">
            Data
            <input
              id="metric-date"
              type="date"
              required
              value={form.metric_date}
              onChange={event => setField('metric_date', event.target.value)}
              className="mt-1 w-full rounded-lg border border-venetian-brown/20 bg-white px-3 py-2 text-venetian-brown focus:border-venetian-gold focus:outline-none focus:ring-1 focus:ring-venetian-gold dark:border-venetian-sandstone/20 dark:bg-venetian-brown/60 dark:text-venetian-sandstone"
            />
          </label>
          <label htmlFor="metric-channel" className="block text-sm text-venetian-brown/75 dark:text-venetian-sandstone/75">
            Canale
            <select
              id="metric-channel"
              value={form.channel}
              onChange={event => setField('channel', event.target.value)}
              className="mt-1 w-full rounded-lg border border-venetian-brown/20 bg-white px-3 py-2 text-venetian-brown focus:border-venetian-gold focus:outline-none focus:ring-1 focus:ring-venetian-gold dark:border-venetian-sandstone/20 dark:bg-venetian-brown/60 dark:text-venetian-sandstone"
            >
              {MARKETING_CHANNELS.map(channel => (
                <option key={channel.value} value={channel.value}>{channel.label}</option>
              ))}
            </select>
          </label>
          <label htmlFor="metric-campaign" className="block text-sm text-venetian-brown/75 dark:text-venetian-sandstone/75">
            Campagna
            <input
              id="metric-campaign"
              type="text"
              required
              maxLength={120}
              value={form.campaign}
              onChange={event => setField('campaign', event.target.value)}
              placeholder="es. search_rialto_en"
              className="mt-1 w-full rounded-lg border border-venetian-brown/20 bg-white px-3 py-2 text-venetian-brown focus:border-venetian-gold focus:outline-none focus:ring-1 focus:ring-venetian-gold dark:border-venetian-sandstone/20 dark:bg-venetian-brown/60 dark:text-venetian-sandstone"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <NumericField id="metric-impressions" label="Impression" value={form.impressions} onChange={value => setField('impressions', value)} />
          <NumericField id="metric-clicks" label="Clic" value={form.clicks} onChange={value => setField('clicks', value)} />
          <NumericField id="metric-sessions" label="Sessioni" value={form.sessions} onChange={value => setField('sessions', value)} />
          <NumericField id="metric-spend" label="Spesa €" value={form.spend_eur} onChange={value => setField('spend_eur', value)} step="0.01" />
          <NumericField id="metric-revenue" label="Ricavi attribuiti €" value={form.revenue_eur} onChange={value => setField('revenue_eur', value)} step="0.01" />
        </div>

        <label htmlFor="metric-notes" className="block text-sm text-venetian-brown/75 dark:text-venetian-sandstone/75">
          Note facoltative
          <input
            id="metric-notes"
            type="text"
            maxLength={500}
            value={form.notes}
            onChange={event => setField('notes', event.target.value)}
            className="mt-1 w-full rounded-lg border border-venetian-brown/20 bg-white px-3 py-2 text-venetian-brown focus:border-venetian-gold focus:outline-none focus:ring-1 focus:ring-venetian-gold dark:border-venetian-sandstone/20 dark:bg-venetian-brown/60 dark:text-venetian-sandstone"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center rounded-lg bg-venetian-brown px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-venetian-brown/90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-venetian-gold dark:text-venetian-brown"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salva o aggiorna
        </button>
      </form>

      <div className="mt-7 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-venetian-brown/50 dark:text-venetian-sandstone/50">
            <tr>
              <th className="px-2 py-2">Data</th>
              <th className="px-2 py-2">Canale</th>
              <th className="px-2 py-2">Campagna</th>
              <th className="px-2 py-2 text-right">Clic</th>
              <th className="px-2 py-2 text-right">Sessioni</th>
              <th className="px-2 py-2 text-right">Spesa</th>
              <th className="px-2 py-2 text-right">Ricavi</th>
              <th className="px-2 py-2"><span className="sr-only">Azioni</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-venetian-brown/10 dark:divide-white/10">
            {metrics.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-2 py-8 text-center text-venetian-brown/50 dark:text-venetian-sandstone/50">
                  Nessun dato campagna nel periodo selezionato
                </td>
              </tr>
            ) : metrics.map(metric => (
              <tr key={metric.id}>
                <td className="whitespace-nowrap px-2 py-3 text-venetian-brown/70 dark:text-venetian-sandstone/70">{metric.metric_date}</td>
                <td className="whitespace-nowrap px-2 py-3 text-venetian-brown/70 dark:text-venetian-sandstone/70">{CHANNEL_LABELS.get(metric.channel) ?? metric.channel}</td>
                <td className="px-2 py-3 text-venetian-brown dark:text-venetian-sandstone">{metric.campaign}</td>
                <td className="px-2 py-3 text-right text-venetian-brown/70 dark:text-venetian-sandstone/70">{metric.clicks}</td>
                <td className="px-2 py-3 text-right text-venetian-brown/70 dark:text-venetian-sandstone/70">{metric.sessions}</td>
                <td className="whitespace-nowrap px-2 py-3 text-right text-venetian-brown/70 dark:text-venetian-sandstone/70">{eur.format(metric.spend_eur)}</td>
                <td className="whitespace-nowrap px-2 py-3 text-right text-venetian-brown/70 dark:text-venetian-sandstone/70">{eur.format(metric.revenue_eur)}</td>
                <td className="px-2 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(metric)}
                    disabled={deletingId === metric.id}
                    className="rounded-md p-2 text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 dark:text-red-300 dark:hover:bg-red-950/30"
                    aria-label={`Elimina ${metric.campaign} del ${metric.metric_date}`}
                  >
                    {deletingId === metric.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
