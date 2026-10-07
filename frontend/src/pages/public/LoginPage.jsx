import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Phone, ArrowRight, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState('EMAIL'); // 'EMAIL' or 'PHONE'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtpCode, setDemoOtpCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { user: currentUser, login, sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state?.from?.pathname && location.state.from.pathname !== '/login' && location.state.from.pathname !== '/account') 
    ? location.state.from.pathname 
    : '/';

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [currentUser, navigate]);


  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await sendPhoneOtp(phone);
      setOtpSent(true);
      if (res.demoOtp) {
        setDemoOtpCode(res.demoOtp);
      }
      setSuccess(`OTP code sent to +91 ${phone}`);
    } catch (err) {
      setError(err.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyPhoneOtp(phone, otp);
      setSuccess('Mobile number verified! Logging in...');
      setTimeout(() => {
        if (res.user?.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate(from, { replace: true });
        }
      }, 1000);
    } catch (err) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 py-16 bg-[#F7F5F0]">
      <SEO title="Account Login" />

      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono font-bold text-[#6F7358] tracking-widest uppercase">Member Access</span>
          <h1 className="text-3xl font-extrabold text-[#111111] uppercase font-display tracking-tight">Welcome Back</h1>
          <p className="text-xs text-[#666666]">Sign in to track orders and manage account preferences.</p>
        </div>

        {/* Login Method Toggle Tabs */}
        <div className="flex bg-white p-1 rounded-xl border border-[#E5E2DC]">
          <button
            type="button"
            onClick={() => { setLoginMethod('EMAIL'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              loginMethod === 'EMAIL'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('PHONE'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              loginMethod === 'PHONE'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            Mobile OTP Login
          </button>
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

          {/* Demo OTP Banner if present */}
          {demoOtpCode && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg text-center font-mono font-bold">
              Demo Verification OTP Code: <span className="text-base text-[#111111] underline">{demoOtpCode}</span>
            </div>
          )}

          {/* Method 1: Email & Password Form */}
          {loginMethod === 'EMAIL' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">Email Address</label>
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

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[#111111] uppercase font-mono">Password</label>
                  <Link to="/forgot-password" className="text-[11px] font-semibold text-[#6F7358] hover:underline font-mono">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
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
                {loading ? 'Authenticating...' : 'Sign In To Account'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Method 2: Mobile Phone OTP Form */}
          {loginMethod === 'PHONE' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">Mobile Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="fashion-input pl-10 font-mono"
                      />
                      <Phone className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
                    </div>
                    <p className="text-[10px] text-[#666666] font-mono mt-1">We will send a 6-digit OTP code for instant login.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending OTP...' : 'Send Verification OTP'} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="fashion-input text-center text-lg font-mono font-bold tracking-widest"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtp(''); }}
                      className="btn-secondary flex-1 py-3 text-xs font-bold uppercase"
                    >
                      Change Phone
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-1"
                    >
                      {loading ? 'Verifying...' : 'Verify & Login'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-[#E5E2DC] text-center text-xs text-[#666666]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#111111] hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



