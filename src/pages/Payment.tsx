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
  Sparkles,
  IndianRupee
} from 'lucide-react';

export default function Payment() {
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [fee, setFee] = useState<number>(1000);
  const [loadingFee, setLoadingFee] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email');
  const [unauthedStudent, setUnauthedStudent] = useState<any>(null);

  // If already paid, redirect straight to student dashboard
  useEffect(() => {
    if (authLoading) return;
    if (!user && !emailParam) {
      navigate('/login', { replace: true });
      return;
    }
    if (profile?.isPaid || profile?.hasPaid || profile?.paymentStatus === 'success') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, profile, emailParam, authLoading, navigate]);

  // Load unauthenticated student profile if emailParam provided
  useEffect(() => {
    if (user || !emailParam) return;

    async function loadStudentByEmail() {
      try {
        const clean = emailParam!.trim().toLowerCase();
        const q = query(collection(db, 'users'), where('email', '==', clean));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = { uid: snap.docs[0].id, ...snap.docs[0].data() };
          setUnauthedStudent(docData);
        } else {
          setError('No registration record found for this email address. Please register first.');
        }
      } catch (e) {
        console.warn('Error loading student by email:', e);
      }
    }

    loadStudentByEmail();
  }, [user, emailParam]);

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
      name: 'PPO Intern',
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
      theme: {
        color: '#4f46e5'
      },
      onSuccess: async (response) => {
        try {
          const userRef = doc(db, 'users', user.uid);
          const nowIso = new Date().toISOString();

          // 1. Update user payment status in Firestore
          await updateDoc(userRef, {
            isPaid: true,
            hasPaid: true,
            paymentStatus: 'success',
            paymentAmount: fee,
            paymentVerifiedAt: nowIso,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            updatedAt: nowIso
          });

          // 2. Record payment in 'payments' collection
          const paymentDocRef = doc(db, 'payments', response.razorpay_payment_id);
          await setDoc(paymentDocRef, {
            id: response.razorpay_payment_id,
            userId: user.uid,
            studentName: profile.fullName || '',
            studentEmail: profile.email || '',
            college: profile.college || '',
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            amount: fee,
            amountPaise: amountInPaise,
            currency: 'INR',
            status: 'success',
            timestamp: nowIso
          });

          // 3. Refresh context and redirect to dashboard
          await refreshProfile();
          navigate('/dashboard', { replace: true });
        } catch (err: any) {
          console.error('Error saving payment record:', err);
          setError('Payment succeeded but profile update failed. Please refresh or contact support.');
          setProcessing(false);
        }
      },
      onError: (err) => {
        console.warn('Payment failed or dismissed:', err);
        setError(err.description || 'Payment was cancelled or could not be completed.');
        setProcessing(false);
      }
    });
  };

  // Instant demo payment approval for testing
  const handleInstantApprove = async () => {
    if (!user || !profile) return;
    setError(null);
    setProcessing(true);

    try {
      const nowIso = new Date().toISOString();
      const paymentId = `pay_demo_${Date.now()}`;
      const orderId = `order_demo_${Date.now()}`;
      const amountInPaise = fee * 100;

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
    } catch (err: any) {
      console.error('Instant payment error:', err);
      setError('Error approving demo payment: ' + (err.message || 'Unknown error'));
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-slate-50 font-sans text-left flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Finalize Enrollment</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Institutional Fee Payment
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Complete your college-subsidized fee payment to immediately unlock your official Offer Letter.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-extrabold uppercase">Payment Notice</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Student Academic Summary */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {profile?.fullName || 'Student Candidate'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {profile?.email} • {profile?.contactNumber}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Affiliated College</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  {profile?.college || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">University Reg No.</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  {profile?.universityRoll || profile?.universityRollNo || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Standard Internship Curriculum Fee</span>
              <span className="line-through text-slate-400">₹3,500</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>Institutional MoU Subsidy Discount</span>
              <span>-₹{(3500 - fee).toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-sm font-extrabold text-slate-900 block">Total Payable Amount</span>
                <span className="text-[11px] text-slate-500 font-medium">Inclusive of GST, Certificate QR, & Portal Access</span>
              </div>
              <span className="text-2xl font-black text-indigo-600">
                ₹{loadingFee ? '...' : fee.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Payment Actions */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handlePayment}
              disabled={processing || loadingFee}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Opening Secure Gateway...</span>
                </div>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{fee.toLocaleString('en-IN')} Via Razorpay</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Demo / Sandbox bypass button */}
            <button
              onClick={handleInstantApprove}
              disabled={processing || loadingFee}
              className="w-full py-3 px-4 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instant Test Activation (Auto-Approve Demo)</span>
            </button>
          </div>

          {/* Trust Footnote */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              256-Bit Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Instant Offer Letter
            </span>
            <span>•</span>
            <span>UGC & NEP-2020 Validated</span>
          </div>
        </div>

      </div>
    </div>
  );
}
