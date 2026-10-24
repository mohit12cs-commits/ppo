import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../components/AuthContext';
import { 
  GraduationCap, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function Login() {
  const { user, profile, isAdmin, login, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect when authenticated
  useEffect(() => {
    if (authLoading || !user) return;

    if (isAdmin) {
      navigate('/admin', { replace: true });
      return;
    }

    if (profile) {
      const isPaid = profile.isPaid || profile.hasPaid || profile.paymentStatus === 'success';
      if (isPaid) {
        navigate('/dashboard', { replace: true });
      } else {
        // Student payment pending: automatically navigate to institutional payment page
        const studentEmail = profile.email || user.email || identifier.trim();
        navigate(`/payment?email=${encodeURIComponent(studentEmail)}`, { replace: true });
      }
    }
  }, [user, profile, isAdmin, authLoading, navigate, identifier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setError('Please enter your Email, Mobile Number, or University Roll Number');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      await login(cleanId, password);
      // Navigation handled by useEffect on user/profile state update
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = 'Failed to sign in. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid credentials. Please verify your login ID and password.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please wait a few moments and try again.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center bg-slate-50 text-slate-900 relative overflow-hidden">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container: Two-column on lg+, stacked on mobile */}
      <div className="w-full max-w-5xl relative z-10 my-auto">
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* ========================================================= */}
          {/* LEFT SIDE: RELATED IMAGE & BRAND HIGHLIGHTS PANEL (Desktop)*/}
          {/* ========================================================= */}
          <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 lg:p-10 flex-col justify-between overflow-hidden">
            {/* Background Image with Dark Vignette Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/mentor_guidance_4k.jpg"
                alt="Engineering students and technical mentor collaborating"
                className="w-full h-full object-cover object-center opacity-40 filter saturate-125 transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-indigo-950/80" />
            </div>

            {/* Glowing orb in corner */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none z-0" />

            {/* Top Content: Brand Badge & Heading */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Link to="/" className="inline-flex items-center gap-2 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-lg font-black tracking-tight text-white font-heading">
                      PPU<span className="text-cyan-400">Intern</span>
                    </span>
                    <span className="ml-2 text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-white/15">
                      PPU • NEP 2020
                    </span>
                  </div>
                </Link>
              </div>

              <div className="pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Patliputra University (PPU) Internship Portal</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2.5 leading-tight">
                  Welcome to Your Student Gateway
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-medium">
                  Log in to access your assigned 120-hour curriculum, download official verified Offer Letters, track project milestones, and claim verifiable academic credits at Patliputra University.
                </p>
              </div>

              {/* Feature Points */}
              <div className="pt-3 space-y-2.5">
                {[
                  'Instant Official Offer Letter with Stamped Verification',
                  'NEP-2020 UGC 120-Hour Industrial Framework',
                  'Tamper-Proof QR Code Verifiable Credentials',
                  'MoU Subsidized Pricing for PPU Affiliated Colleges'
                ].map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <span className="font-semibold">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Testimonial / Social Proof Card */}
            <div className="relative z-10 mt-6 pt-5 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/40 shrink-0">
                    <img
                      src="/images/tech_student.jpg"
                      alt="Student Scholar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none">Priya Sharma</p>
                    <p className="text-[10px] text-cyan-300 font-medium">B.Tech CSE • Enrolled Intern</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-200 italic leading-snug">
                  "The acceptance letter generated instantly after enrollment was approved immediately by our College Internship Nodal Officer."
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ISO 9001:2015 Certified</span>
                </span>
                <span>•</span>
                <span>50,000+ Enrolled Interns</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: SIGN IN FORM                                  */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto">
              
              {/* Mobile Related Image Banner (Shown on < lg screens) */}
              <div className="lg:hidden relative rounded-2xl overflow-hidden mb-6 aspect-21/9 bg-slate-900 text-white p-4 flex flex-col justify-end text-left shadow-md">
                <img
                  src="/images/mentor_guidance_4k.jpg"
                  alt="Technical mentorship"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 filter saturate-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                <div className="relative z-10">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/80 text-white inline-block mb-1">
                    NEP-2020 Aligned
                  </span>
                  <h2 className="text-base font-extrabold text-white leading-tight">
                    Student Internship Portal
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    Sign in to access verified 120-hour training & offer letter
                  </p>
                </div>
              </div>

              {/* Form Heading */}
              <div className="text-left mb-6">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Secure Access Desk
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2.5">
                  Sign In to Your Account
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Enter your registered credentials to access your dashboard.
                </p>
              </div>

              {/* Error Box */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-5 p-4 rounded-2xl border text-xs font-medium space-y-2.5 ${
                    error.includes('Payment Pending')
                      ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${error.includes('Payment Pending') ? 'text-amber-600' : 'text-rose-600'}`} />
                    <span className="leading-relaxed font-semibold">{error}</span>
                  </div>
                  {error.includes('Payment Pending') && (
                    <div className="pt-1">
                      <Link
                        to={`/payment?email=${encodeURIComponent(identifier.trim())}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-xs transition cursor-pointer"
                      >
                        <span>Pay Registration Fee Online</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email, Mobile, or University Roll
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 21BCE1004, 9876543210 or email"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span>Students can log in with Email, Mobile No, or University Roll Number.</span>
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <a
                      href={`mailto:support@ppointern.com?subject=Password%20Reset%20Request%20(${identifier})`}
                      className="text-xs text-indigo-600 hover:underline font-semibold"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Registration Link */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-xs sm:text-sm text-slate-600">
                  Not registered yet?{' '}
                  <Link
                    to="/register"
                    className="font-bold text-indigo-600 hover:underline"
                  >
                    Register for Internship
                  </Link>
                </p>
              </div>

              {/* Security badges */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>NEP 2020 Compliant</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
