import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';

type FeatureFlags = Record<string, boolean>;

type FeatureFlagsContextType = {
  flags: FeatureFlags;
  setFlag: (key: string, enabled: boolean) => Promise<void>;
  flagsMeta: FeatureFlagMeta[];
  loading: boolean;
  error: string | null;
};

export type FeatureFlagMeta = {
  id: string;
  key: string;
  label: string;
  description: string | null;
  enabled: boolean;
};

const FeatureFlagsContext = createContext<FeatureFlagsContextType>({
  flags: {},
  setFlag: async () => {},
  flagsMeta: [],
  loading: true,
  error: null,
});

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>({});
  const [flagsMeta, setFlagsMeta] = useState<FeatureFlagMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFlags = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: loadError } = await supabase
        .from('feature_flags')
        .select('id, key, label, description, enabled');
      if (loadError) throw loadError;
      const map: FeatureFlags = {};
      (data ?? []).forEach((f: FeatureFlagMeta) => { map[f.key] = f.enabled; });
      setFlags(map);
      setFlagsMeta(data ?? []);
    } catch {
      setFlags({});
      setFlagsMeta([]);
      setError('feature_flags_unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFlags(); }, []);

  const setFlag = async (key: string, enabled: boolean) => {
    const { error: updateError } = await supabase
      .from('feature_flags')
      .update({ enabled, updated_at: new Date().toISOString() })
      .eq('key', key);
    if (updateError) throw updateError;
    setFlags(prev => ({ ...prev, [key]: enabled }));
    setFlagsMeta(prev => prev.map(f => f.key === key ? { ...f, enabled } : f));
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, setFlag, flagsMeta, loading, error }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// Hooks and provider intentionally share this small module.
// eslint-disable-next-line react-refresh/only-export-components
export function useFeatureFlag(key: string, defaultValue = false): boolean {
  const { flags } = useContext(FeatureFlagsContext);
  return key in flags ? flags[key] : defaultValue;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFeatureFlags() {
  return useContext(FeatureFlagsContext);
}
