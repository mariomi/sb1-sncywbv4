import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { LanguageProvider } from './components/LanguageProvider';
import { ThemeProvider } from './lib/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { CookieConsent } from './components/CookieConsent';
import { Analytics } from './components/Analytics';
import { SiteFooter } from './components/SiteFooter';
import { Home } from './pages/Home';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { useLanguage, type Language } from './lib/i18n';

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
const AdminProviders = lazy(() => import('./components/AdminProviders').then(module => ({ default: module.AdminProviders })));
const ProtectedRoute = lazy(() => import('./components/AdminProviders').then(module => ({ default: module.ProtectedRoute })));
const ReserveProviders = lazy(() => import('./components/ReserveProviders').then(module => ({ default: module.ReserveProviders })));

const loadingCopy: Record<Language, string> = {
  it: 'Caricamento…', en: 'Loading…', fr: 'Chargement…', de: 'Wird geladen…', es: 'Cargando…',
};

function RouteFallback() {
  const { language } = useLanguage();
  return (
    <div className="flex min-h-screen items-center justify-center bg-venetian-sandstone/20 pt-24 dark:bg-venetian-brown/95" role="status" aria-live="polite">
      <div className="text-venetian-brown dark:text-venetian-sandstone">{loadingCopy[language]}</div>
    </div>
  );
}

function LegacyRedirect({ to }: { to: string }) {
  const { search } = useLocation();
  return <Navigate to={{ pathname: to, search }} replace />;
}

function RouteLifecycle() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP' && pathname !== '/' && !hash) return;

    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const frame = window.requestAnimationFrame(() => {
      const hashTarget = hash ? document.getElementById(hash.slice(1)) : null;
      const focusTarget = hashTarget ?? document.getElementById('main-content');
      focusTarget?.focus({ preventScroll: true });
      hashTarget?.scrollIntoView({ block: 'start' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash, navigationType, pathname]);

  return null;
}

const skipCopy: Record<Language, string> = {
  it: 'Vai al contenuto',
  en: 'Skip to content',
  fr: 'Aller au contenu',
  de: 'Zum Inhalt springen',
  es: 'Ir al contenido',
};

function SkipLink() {
  const { language } = useLanguage();
  return (
    <a href="#main-content" className="sr-only z-[100] bg-white px-5 py-3 text-sm font-bold text-venetian-brown shadow-xl focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
      {skipCopy[language]}
    </a>
  );
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

function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen dark:bg-venetian-brown">
      <RouteLifecycle />
      <SkipLink />
      <Navbar />
      <Analytics />
      <div id="main-content" tabIndex={-1} className="outline-none"><AppErrorBoundary key={pathname}><AppRoutes /></AppErrorBoundary></div>
      <SiteFooter />
      <CookieConsent />
      <Toaster position="top-right" />
    </div>
  );
}

function ScopedAppShell() {
  const { pathname } = useLocation();
  const shell = <AppShell />;

  if (pathname.startsWith('/admin')) {
    return <Suspense fallback={<RouteFallback />}><AdminProviders>{shell}</AdminProviders></Suspense>;
  }

  if (pathname === '/book' || pathname.startsWith('/cancella/')) {
    return <Suspense fallback={<RouteFallback />}><ReserveProviders>{shell}</ReserveProviders></Suspense>;
  }

  return shell;
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <LanguageProvider>
          <Router><ScopedAppShell /></Router>
        </LanguageProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}

export default App;
