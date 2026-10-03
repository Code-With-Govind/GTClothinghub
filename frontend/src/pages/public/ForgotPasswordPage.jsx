import React, { useState } from 'react';
import { Mail, Check, AlertTriangle } from 'lucide-react';
import SEO from '../../components/common/SEO';
import api from '../../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <SEO title="Forgot Password" />

      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-accent tracking-widest uppercase font-mono">Account Security</span>
        <h1 className="text-3xl font-black text-white uppercase font-display">Forgot Password</h1>
        <p className="text-xs text-slate-400">Enter your registered email address to receive a password reset link.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /> {error}</div>}
        {message && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2"><Check className="w-4 h-4 shrink-0" /> {message}</div>}

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full bg-brand-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg"
        >
          {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}
