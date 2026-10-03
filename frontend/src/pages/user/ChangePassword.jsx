import React, { useState } from 'react';
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
      setMessage(res.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <SEO title="Change Password" />
      <div className="max-w-xl space-y-6">
        <div className="border-b border-neutral-200 pb-4">
          <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Security Center</span>
          <h1 className="text-2xl font-black text-[#171717] uppercase font-display tracking-tight">Change Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm space-y-5">
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">{error}</div>}
          {message && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl">{message}</div>}

          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">New Password (Min. 6 chars)</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm">
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </UserLayout>
  );
}

