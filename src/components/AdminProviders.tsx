import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthProvider';
import { FeatureFlagsProvider } from '../lib/featureFlags';

export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
    </AuthProvider>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-venetian-sandstone/20 pt-24 dark:bg-venetian-brown/90">
        <div className="text-venetian-brown dark:text-venetian-sandstone">Loading…</div>
      </div>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/admin" state={{ from: location }} replace />;

  return <>{children}</>;
}
