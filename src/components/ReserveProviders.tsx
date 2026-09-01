import type { ReactNode } from 'react';
import { FeatureFlagsProvider } from '../lib/featureFlags';

export function ReserveProviders({ children }: { children: ReactNode }) {
  return <FeatureFlagsProvider>{children}</FeatureFlagsProvider>;
}
