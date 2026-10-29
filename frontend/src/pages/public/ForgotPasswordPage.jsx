import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import SEO from '../../components/common/SEO';
import api from '../../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.message || 'If an account exists with this email address, password reset instructions have been sent.');
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Unable to process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 py-16 bg-[#F7F5F0]">
      <SEO title="Forgot Password | GT Clothing Hub" />

      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono font-bold text-[#6F7358] tracking-widest uppercase">
            Account Security
          </span>
          <h1 className="text-3xl font-extrabold text-[#111111] uppercase font-display tracking-tight">
            Forgot Password
          </h1>
          <p className="text-xs text-[#666666]">
            Enter your registered email address and we will send you a secure link to reset your password.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E2DC] shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Instructions Sent</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                {message}
              </p>
              <p className="text-[10px] text-emerald-600 font-mono">
                The link is single-use and expires in 1 hour. Be sure to check your spam or junk folder.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="fashion-input pl-10"
                />
                <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? (
                'Sending Link...'
              ) : cooldown > 0 ? (
                `Resend in ${cooldown}s`
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#E5E2DC] flex items-center justify-between text-xs text-[#666666]">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-bold text-[#111111] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>

            <Link
              to="/register"
              className="font-bold text-[#6F7358] hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Security Assurance Note */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#777777] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#6F7358]" />
          <span>Single-use cryptographic token security</span>
        </div>
      </div>
    </div>
  );
}
