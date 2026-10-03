import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertTriangle } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8 bg-brand-ivory min-h-[70vh] flex flex-col justify-center">
      <SEO title="Account Login" />

      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-brand-gold tracking-widest uppercase font-mono">Member Access</span>
        <h1 className="text-3xl font-extrabold text-brand-espresso uppercase font-display tracking-tight">Welcome Back</h1>
        <p className="text-xs text-brand-grey">Sign in to track your orders and saved preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 border border-brand-beige shadow-fashion-sm space-y-5">
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" /> {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-brand-espresso uppercase mb-1.5 font-mono">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full bg-brand-cream border border-brand-beige pl-10 pr-4 py-3 text-xs text-brand-espresso focus:outline-none focus:border-brand-espresso focus:bg-white transition-all font-sans"
            />
            <Mail className="w-4 h-4 text-brand-grey absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold text-brand-espresso uppercase font-mono">Password</label>
            <Link to="/forgot-password" className="text-[11px] font-semibold text-brand-gold hover:underline font-mono">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-brand-cream border border-brand-beige pl-10 pr-4 py-3 text-xs text-brand-espresso focus:outline-none focus:border-brand-espresso focus:bg-white transition-all font-sans"
            />
            <Lock className="w-4 h-4 text-brand-grey absolute left-3.5 top-3.5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-xs font-extrabold tracking-widest flex items-center justify-center gap-2"
        >
          {loading ? 'Logging in...' : 'Sign In To Account'} <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-4 border-t border-brand-beige text-center text-xs text-brand-grey">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-espresso hover:underline">
            Register Here
          </Link>
        </div>
      </form>
    </div>
  );
}

