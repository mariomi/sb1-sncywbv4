import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';

type FeatureFlags = Record<string, boolean>;

type FeatureFlagsContextType = {
  flags: FeatureFlags;
  setFlag: (key: string, enabled: boolean) => Promise<void>;
  flagsMeta: FeatureFlagMeta[];
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
});

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>({});
  const [flagsMeta, setFlagsMeta] = useState<FeatureFlagMeta[]>([]);

  const loadFlags = async () => {
    const { data } = await supabase
      .from('feature_flags')
      .select('id, key, label, description, enabled');
    if (data) {
      const map: FeatureFlags = {};
      data.forEach((f: FeatureFlagMeta) => { map[f.key] = f.enabled; });
      setFlags(map);
      setFlagsMeta(data);
    }
  };

  useEffect(() => { loadFlags(); }, []);

  const setFlag = async (key: string, enabled: boolean) => {
    await supabase
      .from('feature_flags')
      .update({ enabled, updated_at: new Date().toISOString() })
      .eq('key', key);
    setFlags(prev => ({ ...prev, [key]: enabled }));
    setFlagsMeta(prev => prev.map(f => f.key === key ? { ...f, enabled } : f));
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, setFlag, flagsMeta }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlag(key: string, defaultValue = true): boolean {
  const { flags } = useContext(FeatureFlagsContext);
  return key in flags ? flags[key] : defaultValue;
}

export function useFeatureFlags() {
  return useContext(FeatureFlagsContext);
}
