import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { MenuPage } from './pages/MenuPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ReservePage } from './pages/ReservePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { MessagesPage } from './pages/MessagesPage';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { LanguageProvider } from './components/LanguageProvider';
import { ThemeProvider } from './lib/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { CookieConsent } from './components/CookieConsent';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-venetian-sandstone/20 dark:bg-venetian-brown/90 pt-24 flex items-center justify-center">
      <div className="text-venetian-brown dark:text-venetian-sandstone">Loading...</div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reserve" element={<ReservePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
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
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <main className="min-h-screen dark:bg-venetian-brown/95">
              <Navbar />
              <AppRoutes />
              <CookieConsent />
              <Toaster position="top-right" />
            </main>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;