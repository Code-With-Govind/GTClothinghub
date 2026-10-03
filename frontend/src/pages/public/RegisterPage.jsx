import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, AlertTriangle } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(name, email, password, phone);
      if (user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8 bg-brand-ivory min-h-[70vh] flex flex-col justify-center">
      <SEO title="Create Account" />

      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-brand-gold tracking-widest uppercase font-mono">Join GT Clothing Hub</span>
        <h1 className="text-3xl font-extrabold text-brand-espresso uppercase font-display tracking-tight">Create Account</h1>
        <p className="text-xs text-brand-grey">Register to track orders and enjoy streamlined checkout.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 border border-brand-beige shadow-fashion-sm space-y-5">
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" /> {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-brand-espresso uppercase mb-1.5 font-mono">Full Name</label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-brand-cream border border-brand-beige pl-10 pr-4 py-3 text-xs text-brand-espresso focus:outline-none focus:border-brand-espresso focus:bg-white transition-all font-sans"
            />
            <User className="w-4 h-4 text-brand-grey absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-espresso uppercase mb-1.5 font-mono">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-brand-cream border border-brand-beige pl-10 pr-4 py-3 text-xs text-brand-espresso focus:outline-none focus:border-brand-espresso focus:bg-white transition-all font-sans"
            />
            <Mail className="w-4 h-4 text-brand-grey absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-espresso uppercase mb-1.5 font-mono">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-brand-cream border border-brand-beige pl-10 pr-4 py-3 text-xs text-brand-espresso focus:outline-none focus:border-brand-espresso focus:bg-white transition-all font-sans"
            />
            <Phone className="w-4 h-4 text-brand-grey absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-espresso uppercase mb-1.5 font-mono">Password (Min. 6 chars)</label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={6}
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
          {loading ? 'Creating Account...' : 'Register Account'} <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-4 border-t border-brand-beige text-center text-xs text-brand-grey">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-espresso hover:underline">
            Login Here
          </Link>
        </div>
      </form>
    </div>
  );
}

