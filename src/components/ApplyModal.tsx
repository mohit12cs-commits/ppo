import React, { useState, useEffect } from 'react';
import { InternshipTrack, ApplicationFormData } from '../types';
import { INTERNSHIP_TRACKS } from '../data/internships';
import { openRazorpayCheckout } from '../lib/razorpay';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Download, GraduationCap, Lock, ShieldCheck, Sparkles, X } from 'lucide-react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrack?: InternshipTrack | null;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, onClose, initialTrack }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    degreeBranch: '',
    graduationYear: '2026',
    trackId: initialTrack?.id || INTERNSHIP_TRACKS[0].id,
    duration: '4 Weeks',
  });

  useEffect(() => {
    if (initialTrack) {
      setFormData(prev => ({ ...prev, trackId: initialTrack.id }));
    }
  }, [initialTrack]);

  if (!isOpen) return null;

  const currentTrack = INTERNSHIP_TRACKS.find(t => t.id === formData.trackId) || INTERNSHIP_TRACKS[0];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.collegeName) {
        alert("Please fill in all candidate profile fields.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleFinalSubmit = async (withPayment: boolean = false) => {
    setIsSubmitting(true);
    const generatedId = `INT-${Date.now().toString().slice(-6)}`;

    const finalizeEnrollment = async (paymentRefId?: string) => {
      try {
        // Attempt to save to Firestore if configured
        try {
          await addDoc(collection(db, 'applications'), {
            ...formData,
            applicationId: generatedId,
            paymentStatus: paymentRefId ? 'PAID' : 'PENDING_CONFIRMATION',
            paymentRefId: paymentRefId || null,
            trackTitle: currentTrack.title,
            createdAt: serverTimestamp(),
          });
        } catch (fbErr) {
          console.warn("Firebase record creation skipped or using local mock:", fbErr);
        }

        setApplicationId(generatedId);
        setApplicationSuccess(true);
      } catch (err) {
        console.error("Submission error:", err);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (withPayment) {
      openRazorpayCheckout({
        amount: 49900, // ₹499 assessment & kit registration fee
        name: "Internship Portal",
        description: `${currentTrack.title} Enrollment Fee`,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        onSuccess: (res) => {
          setPaymentDone(true);
          finalizeEnrollment(res.razorpay_payment_id);
        },
        onFailure: (err) => {
          setIsSubmitting(false);
          alert(err.description || "Payment was not completed.");
        }
      });
    } else {
      await finalizeEnrollment();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-8 my-auto text-white">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {applicationSuccess ? (
          /* Success Confirmation Screen */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-heading mb-2">Application Submitted Successfully!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
              Welcome aboard! Your application for <span className="font-semibold text-white">{currentTrack.title}</span> has been logged.
            </p>

            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 max-w-md mx-auto mb-6 text-left text-sm space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Application Reference ID:</span>
                <span className="font-mono text-indigo-400 font-bold text-sm">{applicationId}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Candidate Name:</span>
                <span className="text-slate-200">{formData.fullName}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Track & Duration:</span>
                <span className="text-slate-200">{currentTrack.title} ({formData.duration})</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Offer Letter Status:</span>
                <span className="text-emerald-400 font-medium">Ready For Generation</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  alert(`Sample Offer Letter generated for Application ID: ${applicationId}`);
                }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                Download Offer Letter Preview
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Multi-step Form */
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
                <GraduationCap className="w-4 h-4" />
                Internship Application Portal • Step {step} of 3
              </div>
              <h3 className="text-2xl font-bold font-heading text-white">
                {step === 1 && "Personal & Academic Credentials"}
                {step === 2 && "Configure Your Internship Track"}
                {step === 3 && "Review & Confirmation"}
              </h3>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-indigo-500' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Candidate Profile */}
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Graduation Passing Year</label>
                    <select
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none bg-slate-900"
                    >
                      <option value="2025">2025 (Completed / Final)</option>
                      <option value="2026">2026 (Upcoming)</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">College / University Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IIT Delhi / Rajasthan Technical University"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Degree & Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech Computer Science / BCA / MCA"
                      value={formData.degreeBranch}
                      onChange={(e) => setFormData({ ...formData, degreeBranch: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg transition-all"
                  >
                    Next: Track Selection
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Track & Duration */}
            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Selected Track</label>
                  <select
                    value={formData.trackId}
                    onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none bg-slate-900"
                  >
                    {INTERNSHIP_TRACKS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Internship Duration</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['4 Weeks', '8 Weeks', '12 Weeks'].map((duration) => (
                      <button
                        type="button"
                        key={duration}
                        onClick={() => setFormData({ ...formData, duration })}
                        className={`py-3 px-2 rounded-xl text-xs font-semibold text-center border transition-all ${
                          formData.duration === duration
                            ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Track Brief Preview */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
                  <div className="font-semibold text-slate-200">Track Inclusions:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Live Mentor Guidance & Reviews
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Verifiable Certificate with QR
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Official Letter of Recommendation
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Production Project Portfolio
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg"
                  >
                    Next: Review & Confirm
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Candidate Name:</span>
                    <span className="font-semibold text-white">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Email & Contact:</span>
                    <span className="text-slate-200">{formData.email} | {formData.phone}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">College / Institution:</span>
                    <span className="text-slate-200">{formData.collegeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Enrolling Program:</span>
                    <span className="font-semibold text-indigo-400">{currentTrack.title} ({formData.duration})</span>
                  </div>
                </div>

                {/* Razorpay Integration Notice */}
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3 text-xs text-indigo-200">
                  <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block mb-0.5">Instant Verification & Batch Guarantee</span>
                    You can finalize with instant enrollment or submit your application for standard review. Secure payment processing is powered by Razorpay.
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleFinalSubmit(false)}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Without Fee (Free Review)'}
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleFinalSubmit(true)}
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isSubmitting ? 'Processing...' : 'Enroll & Pay via Razorpay (₹499)'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
