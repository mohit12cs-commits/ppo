import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
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
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email');
  const [unauthedStudent, setUnauthedStudent] = useState<any>(null);

  const student = profile || unauthedStudent;

  // If already paid, redirect straight to student dashboard
  useEffect(() => {
    if (authLoading) return;
    if (!user && !emailParam) {
      navigate('/login', { replace: true });
      return;
    }
    if (student?.isPaid || student?.hasPaid || student?.paymentStatus === 'success') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, student, emailParam, authLoading, navigate]);

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

  // Fetch college-specific dynamic fee (supports custom amounts like ₹1 or ₹1,000)
  useEffect(() => {
    async function fetchCollegeFee() {
      try {
        const cleanCollege = (student?.college || '').trim().toLowerCase();
        let collegeFee: number | null = null;

        // 1. Check dynamic college fee from Firestore colleges collection
        if (cleanCollege) {
          const collegesRef = collection(db, 'colleges');
          const snap = await getDocs(collegesRef);

          if (!snap.empty) {
            const match = snap.docs.find(d => {
              const data = d.data();
              return (data.name || '').trim().toLowerCase() === cleanCollege;
            });

            if (match) {
              const p = Number(match.data().price);
              if (!isNaN(p) && p >= 1) {
                collegeFee = p;
              }
            }
          }
        }

        if (collegeFee !== null) {
          setFee(collegeFee);
          setLoadingFee(false);
          return;
        }

        // 2. If college not found in Firestore or has no price, use student.paymentAmount
        if (student?.paymentAmount && Number(student.paymentAmount) >= 1) {
          setFee(Number(student.paymentAmount));
          setLoadingFee(false);
          return;
        }

        // 3. Fallback to initial constants list
        const found = INITIAL_COLLEGES.find(c => c.name.toLowerCase() === cleanCollege);
        const p = found?.price !== undefined ? Number(found.price) : 1000;
        setFee(!isNaN(p) && p >= 1 ? p : 1000);
      } catch (err) {
        console.warn('Error fetching dynamic college fee:', err);
        setFee(1000);
      } finally {
        setLoadingFee(false);
      }
    }

    if (student) {
      fetchCollegeFee();
    }
  }, [student?.college, student?.paymentAmount]);

  const handlePayment = () => {
    if (!student) return;
    setError(null);
    setProcessing(true);

    const targetUid = user?.uid || student.uid;
    const amountInPaise = fee * 100;

    openRazorpayCheckout({
      amount: amountInPaise,
      name: 'Patliputra University (PPU)',
      description: `PPU NEP-2020 Internship Fee - ${student.college || 'Patliputra University'}`,
      prefill: {
        name: student.fullName || '',
        email: student.email || '',
        contact: student.contactNumber || ''
      },
      notes: {
        userId: targetUid,
        college: student.college || '',
        rollNo: student.universityRoll || '',
        domain: student.internshipDomain || ''
      },
      theme: {
        color: '#4f46e5'
      },
      onSuccess: async (response) => {
        try {
          const userRef = doc(db, 'users', targetUid);
          const nowIso = new Date().toISOString();

          // 1. Update user payment status in Firestore (clean merge)
          await setDoc(userRef, {
            isPaid: true,
            hasPaid: true,
            paymentStatus: 'success',
            paymentAmount: fee,
            paymentVerifiedAt: nowIso,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            updatedAt: nowIso
          }, { merge: true });

          // 2. Record payment in 'payments' collection
          const paymentDocRef = doc(db, 'payments', response.razorpay_payment_id);
          await setDoc(paymentDocRef, {
            id: response.razorpay_payment_id,
            userId: targetUid,
            studentName: student.fullName || '',
            studentEmail: student.email || '',
            college: student.college || '',
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            amount: fee,
            amountPaise: amountInPaise,
            currency: 'INR',
            status: 'success',
            timestamp: nowIso
          }, { merge: true });

          // 3. Refresh context and redirect to dashboard or login
          if (user) {
            await refreshProfile();
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/login?paid=true', { replace: true });
          }
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
                  {student?.fullName || 'Student Candidate'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {student?.email} • {student?.contactNumber}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Affiliated College</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  {student?.college || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">University Reg No.</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  {student?.universityRoll || student?.universityRollNo || 'N/A'}
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
