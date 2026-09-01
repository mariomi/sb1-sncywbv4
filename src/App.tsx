import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { LanguageProvider } from './components/LanguageProvider';
import { ThemeProvider } from './lib/ThemeProvider';
import { FeatureFlagsProvider } from './lib/featureFlags';
import { Toaster } from 'react-hot-toast';
import { CookieConsent } from './components/CookieConsent';
import { Analytics } from './components/Analytics';
import { SiteFooter } from './components/SiteFooter';

const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const MenuPage = lazy(() => import('./pages/MenuPage').then(module => ({ default: module.MenuPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const ReservePage = lazy(() => import('./pages/ReservePage').then(module => ({ default: module.ReservePage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const MessagesPage = lazy(() => import('./pages/MessagesPage').then(module => ({ default: module.MessagesPage })));
const MyReservationsPage = lazy(() => import('./pages/MyReservationsPage').then(module => ({ default: module.MyReservationsPage })));
const FaqPage = lazy(() => import('./pages/FaqPage').then(module => ({ default: module.FaqPage })));
const CancelReservationPage = lazy(() => import('./pages/CancelReservationPage').then(module => ({ default: module.CancelReservationPage })));
const StatsPage = lazy(() => import('./pages/StatsPage').then(module => ({ default: module.StatsPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then(module => ({ default: module.GalleryPage })));
const LocationPage = lazy(() => import('./pages/LocationPage').then(module => ({ default: module.LocationPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const RestaurantNearRialtoPage = lazy(() => import('./pages/IntentLandingPage').then(module => ({ default: module.RestaurantNearRialtoPage })));
const VenetianRestaurantPage = lazy(() => import('./pages/IntentLandingPage').then(module => ({ default: module.VenetianRestaurantPage })));
const SeafoodRestaurantPage = lazy(() => import('./pages/IntentLandingPage').then(module => ({ default: module.SeafoodRestaurantPage })));
const VenetianCuisinePage = lazy(() => import('./pages/VenetianCuisinePage').then(module => ({ default: module.VenetianCuisinePage })));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-venetian-sandstone/20 dark:bg-venetian-brown/95 pt-24 flex items-center justify-center">
      <div className="text-venetian-brown dark:text-venetian-sandstone">Caricamento…</div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-venetian-sandstone/20 dark:bg-venetian-brown/90 pt-24 flex items-center justify-center">
      <div className="text-venetian-brown dark:text-venetian-sandstone">Loading...</div>
    </div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function LegacyRedirect({ to }: { to: string }) {
  const { search } = useLocation();
  return <Navigate to={{ pathname: to, search }} replace />;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/our-story" element={<AboutPage />} />
        <Route path="/about" element={<LegacyRedirect to="/our-story" />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book" element={<ReservePage />} />
        <Route path="/reserve" element={<LegacyRedirect to="/book" />} />
        <Route path="/restaurant-near-rialto" element={<RestaurantNearRialtoPage />} />
        <Route path="/venetian-restaurant-venice" element={<VenetianRestaurantPage />} />
        <Route path="/authentic-venetian-food" element={<LegacyRedirect to="/venetian-restaurant-venice" />} />
        <Route path="/seafood-restaurant-rialto" element={<SeafoodRestaurantPage />} />
        <Route path="/venetian-cuisine" element={<VenetianCuisinePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/cancella/:token" element={<CancelReservationPage />} />
        <Route path="/my-reservations" element={<MyReservationsPage />} />
        <Route path="/admin" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/messages" element={<LegacyRedirect to="/admin/messages" />} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
        <FeatureFlagsProvider>
          <Router>
            <div className="min-h-screen dark:bg-venetian-brown">
              <Navbar />
              <Analytics />
              <div id="main-content"><AppRoutes /></div>
              <SiteFooter />
              <CookieConsent />
              <Toaster position="top-right" />
            </div>
          </Router>
        </FeatureFlagsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
