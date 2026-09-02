import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SEOHead } from '../components/SEOHead';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast.success('Accesso effettuato');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Email o password non corretti');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EB] px-4 pb-20 pt-32 sm:pt-40">
      <SEOHead title="Accesso Admin" noindex />
      <div className="mx-auto max-w-md">
        <motion.div
          className="border-t-4 border-venetian-terracotta bg-white p-7 shadow-[0_24px_70px_rgba(25,22,18,0.10)] sm:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10 border-b border-venetian-brown/15 pb-8 text-center">
            <p className="editorial-kicker mb-4">Area riservata</p>
            <h1 className="mb-3 font-serif text-4xl font-semibold leading-none text-venetian-brown sm:text-5xl">
              Accesso amministrazione
            </h1>
            <p className="text-sm leading-6 text-venetian-brown/65">
              Inserisci le credenziali per gestire prenotazioni e tavoli
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-venetian-brown/70"
              >
                <Mail className="mr-2 inline-block h-4 w-4" />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-12 w-full border border-venetian-brown/25 bg-white px-4 py-3 outline-none transition focus:border-venetian-terracotta focus:ring-1 focus:ring-venetian-terracotta"
                required
                placeholder="admin@ristorantealgobbodirialto.it"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-venetian-brown/70"
              >
                <Lock className="mr-2 inline-block h-4 w-4" />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-h-12 w-full border border-venetian-brown/25 bg-white px-4 py-3 outline-none transition focus:border-venetian-terracotta focus:ring-1 focus:ring-venetian-terracotta"
                required
                placeholder="Password"
              />
            </div>

            <div>
              <Button
                type="submit"
                className="min-h-12 w-full bg-venetian-brown text-white hover:bg-venetian-terracotta"
                disabled={isLoading}
              >
                {isLoading ? 'Accesso in corso…' : 'Accedi'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
