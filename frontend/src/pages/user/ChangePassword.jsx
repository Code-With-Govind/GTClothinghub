import React, { useState } from 'react';
import { Lock, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import SEO from '../../components/common/SEO';
import UserLayout from '../../components/user/UserLayout';
import api from '../../services/api';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      setMessage(res.message || 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <SEO title="Account Security | GT Clothing Hub" />
      <div className="space-y-6 max-w-2xl">
        {/* Section Header */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E2DC] shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#6F7358] tracking-widest uppercase block">
            ACCOUNT SETTINGS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] uppercase font-display tracking-tight mt-1">
            SECURITY & PASSWORD
          </h1>
          <p className="text-xs text-[#666666] mt-1 font-medium">
            Manage your account password and security preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 sm:p-8 border border-[#E5E2DC] shadow-xs space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              {error}
            </div>
          )}
          {message && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {message}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">
              Current Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F7F5F0] border border-[#E5E2DC] rounded-lg pl-10 pr-4 py-3 text-xs text-[#111111] font-medium focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
              />
              <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">
              New Password (Min. 6 chars)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F7F5F0] border border-[#E5E2DC] rounded-lg pl-10 pr-4 py-3 text-xs text-[#111111] font-medium focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
              />
              <ShieldCheck className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-xs"
            >
              {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </div>
        </form>
      </div>
    </UserLayout>
  );
}


