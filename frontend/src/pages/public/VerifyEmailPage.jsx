import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import SEO from '../../components/common/SEO';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, verifyEmailToken } = useAuth();

  const [verifying, setVerifying] = useState(Boolean(token));
  const [success, setSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState('');
  
  // Resend state
  const [resendEmail, setResendEmail] = useState(user?.email || '');
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const verify = async () => {
      setVerifying(true);
      setError('');
      try {
        await verifyEmailToken(token);
        if (isMounted) {
          setSuccess(true);
        }
      } catch (err) {
        if (isMounted) {
          const msg = err.message || 'Invalid or expired verification link.';
          setError(msg);
          if (err.expired || msg.toLowerCase().includes('expired')) {
            setIsExpired(true);
          }
        }
      } finally {
        if (isMounted) {
          setVerifying(false);
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, verifyEmailToken]);

  const handleResend = async (e) => {
    e.preventDefault();
    setResendError('');
    setResendMessage('');

    if (!resendEmail) {
      setResendError('Please enter your email address.');
      return;
    }

    setResending(true);

    try {
      const res = await api.post('/auth/resend-verification', { email: resendEmail });
      setResendMessage(res.message || 'A new verification link has been sent to your email.');
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
      setResendError(err.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 py-16 bg-[#F7F5F0]">
      <SEO title="Verify Email | GT Clothing Hub" />

      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono font-bold text-[#6F7358] tracking-widest uppercase">
            Account Verification
          </span>
          <h1 className="text-3xl font-extrabold text-[#111111] uppercase font-display tracking-tight">
            Email Verification
          </h1>
          <p className="text-xs text-[#666666]">
            Confirm your email address to secure your GT Clothing Hub account.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E2DC] shadow-sm space-y-6">
          
          {/* STATE 1: VERIFYING IN PROGRESS */}
          {verifying && (
            <div className="py-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F7F5F0] border border-[#E5E2DC] text-[#111111] flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm uppercase text-[#111111] font-display">
                  Verifying Token...
                </h3>
                <p className="text-xs text-[#666666] mt-1">
                  Validating your secure email verification link.
                </p>
              </div>
            </div>
          )}

          {/* STATE 2: VERIFIED SUCCESSFULLY */}
          {!verifying && success && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-[#111111] uppercase font-display">
                  Email Verified!
                </h2>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  Your email address has been successfully verified. Your account is fully active.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to={user ? '/account' : '/login'}
                  className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2"
                >
                  <span>{user ? 'Go to My Account' : 'Sign In Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* STATE 3: ERROR OR EXPIRED LINK */}
          {!verifying && !success && (
            <div className="space-y-5">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold uppercase tracking-tight">
                      {isExpired ? 'Link Expired' : 'Verification Issue'}
                    </p>
                    <p className="text-[11px] leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              {resendMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{resendMessage}</span>
                </div>
              )}

              {resendError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{resendError}</span>
                </div>
              )}

              <div className="border-t border-[#E5E2DC] pt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase text-[#111111] font-mono">
                  Request New Verification Link
                </h3>
                <p className="text-xs text-[#666666]">
                  Enter your registered email address below to receive a fresh verification link.
                </p>

                <form onSubmit={handleResend} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="fashion-input pl-10"
                    />
                    <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
                  </div>

                  <button
                    type="submit"
                    disabled={resending || cooldown > 0}
                    className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {resending ? (
                      'Sending...'
                    ) : cooldown > 0 ? (
                      `Wait ${cooldown}s to Resend`
                    ) : (
                      <>
                        <span>Resend Verification Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="pt-2 text-center text-xs text-[#666666]">
                <Link to="/login" className="font-bold text-[#111111] hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-[#777777] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#6F7358]" />
          <span>Single-use cryptographic token security</span>
        </div>
      </div>
    </div>
  );
}

