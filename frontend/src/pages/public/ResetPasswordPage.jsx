import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import SEO from '../../components/common/SEO';
import api from '../../services/api';

export default function ResetPasswordPage() {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);

  // Password criteria verification
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&#]/.test(password);
  const isStrong = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isStrong) {
      setError('Please ensure your password meets all the security requirements below.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(`/auth/reset-password/${resetToken}`, { password });
      setMessage(res.message || 'Password reset successful! You can now log in.');
    } catch (err) {
      const errMsg = err.message || 'Failed to reset password. The link may have expired.';
      setError(errMsg);
      if (errMsg.toLowerCase().includes('expired') || errMsg.toLowerCase().includes('invalid')) {
        setIsTokenInvalid(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 py-16 bg-[#F7F5F0]">
      <SEO title="Reset Password | GT Clothing Hub" />

      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono font-bold text-[#6F7358] tracking-widest uppercase">
            Account Security
          </span>
          <h1 className="text-3xl font-extrabold text-[#111111] uppercase font-display tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-[#666666]">
            Enter a strong new password to secure your account.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E2DC] shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p>{error}</p>
                {isTokenInvalid && (
                  <Link
                    to="/forgot-password"
                    className="inline-block text-[11px] font-bold text-red-800 underline uppercase font-mono mt-1"
                  >
                    Request a new reset link &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}

          {message ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm uppercase text-[#111111] font-display">
                  Password Updated
                </h3>
                <p className="text-xs text-emerald-700 mt-1">
                  {message}
                </p>
              </div>
              <Link
                to="/login"
                className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2"
              >
                <span>Sign In With New Password</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="fashion-input pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#666666] hover:text-[#111111]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="fashion-input pl-10"
                  />
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Password Requirement Badges */}
              <div className="p-3 bg-[#F7F5F0] rounded-xl border border-[#E5E2DC] space-y-1.5 text-[11px] font-mono">
                <span className="text-[10px] uppercase font-bold text-[#666666] block">Requirements:</span>
                <div className="grid grid-cols-2 gap-1">
                  <span className={hasMinLength ? 'text-emerald-700 font-bold' : 'text-[#888888]'}>
                    {hasMinLength ? '✓' : '•'} 8+ characters
                  </span>
                  <span className={hasUppercase ? 'text-emerald-700 font-bold' : 'text-[#888888]'}>
                    {hasUppercase ? '✓' : '•'} 1 Uppercase letter
                  </span>
                  <span className={hasLowercase ? 'text-emerald-700 font-bold' : 'text-[#888888]'}>
                    {hasLowercase ? '✓' : '•'} 1 Lowercase letter
                  </span>
                  <span className={hasNumber ? 'text-emerald-700 font-bold' : 'text-[#888888]'}>
                    {hasNumber ? '✓' : '•'} 1 Number
                  </span>
                  <span className={hasSpecial ? 'text-emerald-700 font-bold col-span-2' : 'text-[#888888] col-span-2'}>
                    {hasSpecial ? '✓' : '•'} 1 Special char (@, $, !, %, *, ?, &)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {loading ? 'Updating Password...' : 'Save New Password'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[#E5E2DC] text-center text-xs text-[#666666]">
            Remember your password?{' '}
            <Link to="/login" className="font-bold text-[#111111] hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-[#777777] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#6F7358]" />
          <span>Previous sessions automatically invalidated upon reset</span>
        </div>
      </div>
    </div>
  );
}
