-- supabase/migrations/20260324000002_add_feature_flags.sql
CREATE TABLE feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read feature flags"
  ON feature_flags FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage feature flags"
  ON feature_flags FOR ALL TO authenticated USING (true);

-- Seed with existing features
INSERT INTO feature_flags (key, label, description, enabled) VALUES
  ('online_reservations',    'Prenotazioni online',        'Abilita/disabilita il form di prenotazione sul sito pubblico', true),
  ('waitlist',               'Lista d''attesa',             'Mostra il banner lista d''attesa quando un orario è pieno', true),
  ('reminder_emails',        'Reminder 24h',               'Invia email di promemoria 24h prima della prenotazione', true),
  ('cancellation_selfserve', 'Cancellazione self-service',  'Permette ai clienti di cancellare via link nell''email', true),
  ('calendar_view',          'Vista calendario admin',      'Mostra il toggle Lista/Calendario nell''admin', true),
  ('table_management',       'Gestione tavoli',             'Abilita assegnazione tavoli alle prenotazioni', true),
  ('manual_reservations',    'Prenotazioni manuali',        'Pulsante Nuova Prenotazione nell''admin', true);
