import React, { useState } from 'react';
import SEO from '../../components/common/SEO';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      <SEO title="Profile Settings" />
      <div className="max-w-xl space-y-6">
        <div className="border-b border-neutral-200 pb-4">
          <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Personal Info</span>
          <h1 className="text-2xl font-black text-[#171717] uppercase font-display tracking-tight">Profile Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm space-y-5">
          {message && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium">{message}</div>}

          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-500 cursor-not-allowed"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm">
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </UserLayout>
  );
}

