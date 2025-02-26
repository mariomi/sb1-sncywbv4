import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Invalid email or password');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-venetian-sandstone/20 pt-24">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          className="bg-white/95 rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-venetian-brown mb-2">
              Admin Login
            </h1>
            <p className="text-venetian-brown/70">
              Please sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-venetian-brown/80 mb-2"
              >
                <Mail className="w-4 h-4 inline-block mr-2" />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50"
                required
                placeholder="admin@ristorantealgobbodirialto.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-venetian-brown/80 mb-2"
              >
                <Lock className="w-4 h-4 inline-block mr-2" />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50"
                required
                placeholder="admin123"
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}