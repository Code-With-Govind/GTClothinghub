import React, { useState } from 'react';
import { User, Phone, Mail, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import SEO from '../../components/common/SEO';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';

export default function ProfileSettings() {
  const { user, updateProfile, resendVerification } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyNotice, setVerifyNotice] = useState('');
  const [verifyCooldown, setVerifyCooldown] = useState(0);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleSendVerification = async () => {
    if (!user?.email || verifyCooldown > 0) return;
    setVerifyLoading(true);
    setVerifyNotice('');
    try {
      const res = await resendVerification(user.email);
      setVerifyNotice(res.message || 'Verification link sent to your email.');
      setVerifyCooldown(60);
      const timer = setInterval(() => {
        setVerifyCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setVerifyNotice(err.message || 'Failed to send verification email.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await updateProfile({ name, phone });
      setMessage('Profile updated successfully');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <SEO title="Profile Settings | GT Clothing Hub" />
      <div className="space-y-6 max-w-2xl">
        {/* Section Header */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E2DC] shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#6F7358] tracking-widest uppercase block">
            PROFILE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] uppercase font-display tracking-tight mt-1">
            PROFILE SETTINGS
          </h1>
          <p className="text-xs text-[#666666] mt-1 font-medium">
            Manage your personal information and contact details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 sm:p-8 border border-[#E5E2DC] shadow-xs space-y-5">
          {message && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {message}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F7F5F0] border border-[#E5E2DC] rounded-lg pl-10 pr-4 py-3 text-xs text-[#111111] font-medium focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
                required
              />
              <User className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-[#F7F5F0] border border-[#E5E2DC] rounded-lg pl-10 pr-4 py-3 text-xs text-[#111111] font-mono focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
              />
              <Phone className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#666666] uppercase font-mono">
                Email Address (Read-only)
              </label>
              {user?.isEmailVerified ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold">
                  UNVERIFIED
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-[#E5E2DC]/40 border border-[#E5E2DC] rounded-lg pl-10 pr-4 py-3 text-xs text-[#666666] font-mono cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
            </div>

            {!user?.isEmailVerified && (
              <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] text-amber-800 font-medium">
                  Your email is not verified yet. Verify to enhance account recovery security.
                </span>
                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={verifyLoading || verifyCooldown > 0}
                  className="text-xs font-bold font-mono text-[#111111] underline hover:text-[#6F7358] shrink-0"
                >
                  {verifyLoading ? 'Sending...' : verifyCooldown > 0 ? `Resend (${verifyCooldown}s)` : 'Send Verification Link'}
                </button>
              </div>
            )}

            {verifyNotice && (
              <p className="text-[11px] text-[#6F7358] font-medium mt-1.5">
                {verifyNotice}
              </p>
            )}

            <p className="text-[10px] text-[#666666] mt-1 font-mono">Contact support if you need to update your registered email.</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-xs"
            >
              {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </div>
    </UserLayout>
  );
}


