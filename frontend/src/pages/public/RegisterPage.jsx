import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP Verification state
  const [step, setStep] = useState(1); // 1: Info, 2: Verification
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [demoEmailOtp, setDemoEmailOtp] = useState('');
  const [demoPhoneOtp, setDemoPhoneOtp] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, sendEmailOtp, sendPhoneOtp, verifyEmailOtp, verifyPhoneOtp } = useAuth();
  const navigate = useNavigate();

  const handleRegisterInitial = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create User
      const user = await register(name, email, password, phone);
      setSuccess('Account created! Verification codes sent.');

      // 2. Trigger Email & Phone OTPs in background
      try {
        const eRes = await sendEmailOtp(email);
        if (eRes.demoOtp) setDemoEmailOtp(eRes.demoOtp);
      } catch (err) {
        console.warn('Email OTP trigger note:', err);
      }

      if (phone) {
        try {
          const pRes = await sendPhoneOtp(phone);
          if (pRes.demoOtp) setDemoPhoneOtp(pRes.demoOtp);
        } catch (err) {
          console.warn('Phone OTP trigger note:', err);
        }
      }

      setStep(2);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyStep = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (emailOtp) {
        await verifyEmailOtp(email, emailOtp);
      }
      if (phone && phoneOtp) {
        await verifyPhoneOtp(phone, phoneOtp);
      }

      setSuccess('Account verified successfully! Redirecting...');
      setTimeout(() => {
        navigate('/account');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Invalid verification OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 py-16 bg-[#F7F5F0]">
      <SEO title="Create Account & Verify" />

      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono font-bold text-[#6F7358] tracking-widest uppercase">Join GT Clothing Hub</span>
          <h1 className="text-3xl font-extrabold text-[#111111] uppercase font-display tracking-tight">
            {step === 1 ? 'Create Account' : 'Verify Contact Details'}
          </h1>
          <p className="text-xs text-[#666666]">
            {step === 1 ? 'Register to track orders and enjoy streamlined checkout.' : 'Enter 6-digit OTP codes to verify email & phone number.'}
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E2DC] shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" /> {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> {success}
            </div>
          )}

          {/* Demo OTP Notifications */}
          {(demoEmailOtp || demoPhoneOtp) && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg space-y-1 font-mono">
              {demoEmailOtp && <div>Demo Email OTP: <strong className="text-[#111111]">{demoEmailOtp}</strong></div>}
              {demoPhoneOtp && <div>Demo Mobile OTP: <strong className="text-[#111111]">{demoPhoneOtp}</strong></div>}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRegisterInitial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="fashion-input pl-10"
                  />
                  <User className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="fashion-input pl-10"
                  />
                  <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">Mobile Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="fashion-input pl-10 font-mono"
                  />
                  <Phone className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">Password (Min. 6 chars)</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="fashion-input pl-10"
                  />
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Register Account'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Step 2: Verification Codes Input */
            <form onSubmit={handleVerifyStep} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">Email Verification OTP Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  placeholder="6-Digit Email OTP"
                  className="fashion-input text-center text-sm font-mono font-bold tracking-widest"
                />
                <p className="text-[10px] text-[#666666] mt-1 font-mono">Sent to {email}</p>
              </div>

              {phone && (
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">Mobile Phone OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    placeholder="6-Digit Mobile OTP"
                    className="fashion-input text-center text-sm font-mono font-bold tracking-widest"
                  />
                  <p className="text-[10px] text-[#666666] mt-1 font-mono">Sent to +91 {phone}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/account')}
                  className="btn-secondary flex-1 py-3 text-xs font-bold uppercase"
                >
                  Skip For Now
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-1"
                >
                  {loading ? 'Verifying...' : 'Verify Account'}
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-[#E5E2DC] text-center text-xs text-[#666666]">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-[#111111] hover:underline">
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



