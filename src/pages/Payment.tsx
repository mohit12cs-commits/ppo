import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../components/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { openRazorpayCheckout } from '../lib/razorpay';
import { INITIAL_COLLEGES } from '../lib/constants';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  User, 
  GraduationCap, 
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function Payment() {
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [fee, setFee] = useState<number>(1000);
  const [loadingFee, setLoadingFee] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // If already paid, redirect straight to student dashboard
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (profile?.isPaid || profile?.hasPaid || profile?.paymentStatus === 'success') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, profile, authLoading, navigate]);

  // Fetch college-specific dynamic fee
  useEffect(() => {
    async function fetchCollegeFee() {
      if (!profile?.college) {
        setFee(1000);
        setLoadingFee(false);
        return;
      }

      try {
        const collegesRef = collection(db, 'colleges');
        const q = query(collegesRef, where('name', '==', profile.college));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const colData = snap.docs[0].data();
          if (typeof colData.price === 'number' && colData.price > 0) {
            setFee(colData.price);
            setLoadingFee(false);
            return;
          }
        }

        // Fallback to static list
        const found = INITIAL_COLLEGES.find(c => c.name.toLowerCase() === profile.college?.toLowerCase());
        setFee(found?.price || 1000);
      } catch (err) {
        console.warn('Error fetching dynamic college fee:', err);
        setFee(1000);
      } finally {
        setLoadingFee(false);
      }
    }

    fetchCollegeFee();
  }, [profile?.college]);

  const handlePayment = () => {
    if (!user || !profile) return;
    setError(null);
    setProcessing(true);

    const amountInPaise = fee * 100;

    openRazorpayCheckout({
      amount: amountInPaise,
      name: 'Internship Portal',
      description: `NEP-2020 Internship Fee - ${profile.college || 'College'}`,
      prefill: {
        name: profile.fullName || '',
        email: profile.email || '',
        contact: profile.contactNumber || ''
      },
      notes: {
        userId: user.uid,
        college: profile.college || '',
        rollNo: profile.universityRoll || '',
        domain: profile.internshipDomain || ''
      },
      onSuccess: async (response) => {
        try {
          const paymentId = response.razorpay_payment_id;
          const orderId = response.razorpay_order_id || `order_${Date.now()}`;
          const nowIso = new Date().toISOString();

          // 1. Update user profile
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            isPaid: true,
            hasPaid: true,
            paymentStatus: 'success',
            paymentAmount: fee,
            paymentVerifiedAt: nowIso,
            razorpayPaymentId: paymentId,
            razorpayOrderId: orderId,
            updatedAt: nowIso
          });

          // 2. Create payment record in 'payments'
          const payDocRef = doc(db, 'payments', paymentId);
          await setDoc(payDocRef, {
            id: paymentId,
            userId: user.uid,
            studentName: profile.fullName || '',
            studentEmail: profile.email || '',
            college: profile.college || '',
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            amount: fee,
            amountPaise: amountInPaise,
            currency: 'INR',
            status: 'success',
            timestamp: nowIso
          });

          // 3. Refresh context and navigate to student dashboard
          await refreshProfile();
          navigate('/dashboard', { replace: true });
        } catch (updateErr: any) {
          console.error('Error saving payment record:', updateErr);
          setError('Payment succeeded but profile update encountered a hiccup. Please refresh.');
          setProcessing(false);
        }
      },
      onFailure: (err) => {
        console.warn('Payment failed or cancelled:', err);
        setProcessing(false);
        setError(err.description || 'Payment was not completed. Please try again.');
      }
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Step 2 of 2: Finalize Enrollment
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Program Fee Payment
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Complete your college-specific fee payment to unlock your official Offer Letter.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Payment Notification</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Student Academic Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/60 mb-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {profile?.fullName || 'Student Candidate'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {profile?.email} • {profile?.contactNumber}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">College / Institution</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  {profile?.college || 'Registered College'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">University Roll / Reg No</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {profile?.universityRoll || profile?.universityRollNo || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Course & Semester</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  {profile?.degree || 'Degree'} ({profile?.semester || 'Semester'})
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Enrolled Track</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {profile?.internshipDomain || 'NEP-2020 Internship'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Fee Structure (College Affiliated Rate)
            </h4>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>120-Hour Industrial Mentorship & NEP Curriculum</span>
                <span>₹{fee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST & Academic Portal Access</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Included</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline font-bold">
                <span className="text-base text-slate-900 dark:text-white">Total Amount Due</span>
                <div className="text-right">
                  <span className="text-2xl text-indigo-600 dark:text-indigo-400">
                    ₹{loadingFee ? '...' : fee.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-normal text-slate-400 block">INR (One-time fee)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handlePayment}
            disabled={processing || loadingFee}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-3 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </div>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay ₹{fee.toLocaleString('en-IN')} via Razorpay</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Razorpay 256-Bit SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              <span>UPI, Cards & NetBanking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>Instant Offer Letter Access</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Need help with your payment?{' '}
            <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
