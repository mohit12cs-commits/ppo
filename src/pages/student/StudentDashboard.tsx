import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../components/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { CohortBatch } from '../../types';
import { createOfferLetterPdfForUser, offerLetterFileName } from '../../lib/offerLetterPdf';
import { generatePaymentSlipPdf, paymentSlipFileName } from '../../lib/paymentSlipPdf';
import { 
  FileText, 
  Receipt, 
  UserCheck, 
  Download, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  GraduationCap, 
  Mail, 
  Phone, 
  LogOut,
  Save,
  X,
  Sparkles,
  ShieldAlert,
  IndianRupee,
  Layers,
  MapPin,
  Calendar
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, profile, logout, refreshProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [downloadingOffer, setDownloadingOffer] = useState(false);
  const [downloadingSlip, setDownloadingSlip] = useState(false);
  const [batchInfo, setBatchInfo] = useState<CohortBatch | null>(null);
  const [loadingBatch, setLoadingBatch] = useState(true);

  // Edit Profile Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [editFormData, setEditFormData] = useState({
    fullName: '',
    parentName: '',
    contactNumber: '',
    gender: 'Male',
    district: '',
    department: '',
    subject: '',
    semester: 'Semester 5',
    session: '2023-27'
  });

  // Check Batch Release Status
  useEffect(() => {
    async function checkBatchStatus() {
      if (!profile?.batchId) {
        setLoadingBatch(false);
        return;
      }
      try {
        const bDoc = await getDoc(doc(db, 'batches', profile.batchId));
        if (bDoc.exists()) {
          setBatchInfo({ id: bDoc.id, ...bDoc.data() } as CohortBatch);
        }
      } catch (err) {
        console.warn('Error fetching batch status:', err);
      } finally {
        setLoadingBatch(false);
      }
    }
    checkBatchStatus();
  }, [profile?.batchId]);

  // Sync form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setEditFormData({
        fullName: profile.fullName || '',
        parentName: profile.parentName || '',
        contactNumber: profile.contactNumber || '',
        gender: profile.gender || 'Male',
        district: profile.district || '',
        department: profile.department || '',
        subject: profile.subject || '',
        semester: profile.semester || 'Semester 5',
        session: profile.session || '2023-27'
      });
    }
  }, [profile]);

  const isPaid = Boolean(profile?.isPaid || profile?.hasPaid || profile?.paymentStatus === 'success');
  // If batch is assigned, check its isReleased status. If no batch is explicitly assigned, default to released if paid.
  const isOfferLetterReleased = batchInfo ? batchInfo.isReleased : true;

  // 1. Download Offer Letter
  const handleDownloadOfferLetter = async () => {
    if (!user || !profile || !isPaid || !isOfferLetterReleased) return;
    setDownloadingOffer(true);
    try {
      const pdf = await createOfferLetterPdfForUser(user.uid, profile);
      pdf.save(offerLetterFileName(profile.fullName));
    } catch (err: any) {
      console.error('Error generating offer letter:', err);
      alert('Failed to generate offer letter. Please try again or contact support.');
    } finally {
      setDownloadingOffer(false);
    }
  };

  // 2. Download Payment Slip
  const handleDownloadPaymentSlip = async () => {
    if (!profile) return;
    setDownloadingSlip(true);
    try {
      const pdf = await generatePaymentSlipPdf(profile);
      pdf.save(paymentSlipFileName(profile.fullName));
    } catch (err: any) {
      console.error('Error generating payment slip:', err);
      alert('Failed to generate payment slip. Please try again.');
    } finally {
      setDownloadingSlip(false);
    }
  };

  // 3. Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fullName: editFormData.fullName,
        parentName: editFormData.parentName,
        contactNumber: editFormData.contactNumber,
        gender: editFormData.gender,
        district: editFormData.district,
        department: editFormData.department,
        subject: editFormData.subject,
        semester: editFormData.semester,
        session: editFormData.session,
        updatedAt: new Date().toISOString()
      });

      await refreshProfile();
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        setIsEditingProfile(false);
        setProfileMsg(null);
      }, 1200);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setProfileMsg({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Student Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans text-left">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                {profile?.fullName?.charAt(0) || 'S'}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {profile?.fullName || 'Student Candidate'}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Candidate Verified
                  </span>
                  {isPaid ? (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Enrolled & Paid
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <Clock size={13} /> Payment Pending
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600">
                  University Roll / Reg: <span className="font-extrabold text-slate-900">{profile?.universityRoll || profile?.universityRollNo || 'N/A'}</span>
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                    {profile?.college || 'Registered College'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-500" />
                    {profile?.degree || 'Degree'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold text-indigo-600">
                    <Layers className="w-3.5 h-3.5" />
                    {profile?.internshipDomain || 'Technical Internship Track'}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-3 w-full lg:w-auto self-end lg:self-center shrink-0">
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="flex-1 lg:flex-none px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-95"
              >
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Payment Pending Alert Banner */}
        {!isPaid && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 sm:p-6 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-amber-900">
                  Institutional Fee Payment Pending
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Your academic registration is verified. Complete your enrollment payment to instantly unlock and download your official joining Offer Letter.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/payment')}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider shrink-0 shadow-md shadow-amber-600/20 transition cursor-pointer active:scale-95"
            >
              Pay Fee (₹{profile?.paymentAmount || 1000})
            </button>
          </motion.div>
        )}

        {/* 3 CORE STUDENT FEATURES - FULL WIDTH RESPONSIVE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* FEATURE 1: Offer Letter Download Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition">
            <div>
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                  <FileText className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                  Core Document #1
                </span>
              </div>

              <div className="mt-4 space-y-1.5">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Official Internship Offer Letter
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  UGC & NEP-2020 aligned joining letter featuring institutional verification, university roll number, allocated domain track, and authorized digital stamp.
                </p>
              </div>

              {/* Status Badge */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                {!isPaid ? (
                  <div className="flex items-center gap-2 text-amber-700 font-bold">
                    <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Locked: Complete enrollment fee payment to generate letter</span>
                  </div>
                ) : !isOfferLetterReleased ? (
                  <div className="flex items-center gap-2 text-amber-700 font-bold">
                    <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Batch Finalization: Academic committee verifying batch release</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Verified & Ready for Immediate PDF Download</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {isPaid && isOfferLetterReleased ? (
                <button
                  type="button"
                  onClick={handleDownloadOfferLetter}
                  disabled={downloadingOffer}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {downloadingOffer ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating Verified PDF...</span>
                    </div>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Offer Letter (PDF)</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-4 px-6 rounded-2xl bg-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Offer Letter Locked</span>
                </button>
              )}
            </div>
          </div>

          {/* FEATURE 2: Payment Slip Download Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition">
            <div>
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center shadow-inner">
                  <Receipt className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                  Core Document #2
                </span>
              </div>

              <div className="mt-4 space-y-1.5">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Fee Payment Receipt & Slip
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Official fee transaction receipt with student enrollment details, payment transaction ID, verified breakdown, and digital verification seal for college submission.
                </p>
              </div>

              {/* Status Badge */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                {isPaid ? (
                  <div className="flex items-center justify-between text-emerald-700 font-bold">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>Paid: ₹{(profile?.paymentAmount || 1000).toLocaleString('en-IN')}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Ref: {(profile?.razorpayPaymentId || 'pay_demo_success').slice(0, 16)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-700 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>No successful payment record found</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {isPaid ? (
                <button
                  type="button"
                  onClick={handleDownloadPaymentSlip}
                  disabled={downloadingSlip}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {downloadingSlip ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating Receipt PDF...</span>
                    </div>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Payment Slip (PDF)</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/payment')}
                  className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
                >
                  <span>Complete Fee Payment First</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FULL-WIDTH DETAILED ACADEMIC PROFILE OVERVIEW */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Enrolled Candidate Profile Particulars
                </h3>
                <p className="text-xs text-slate-500">
                  Submitted data records stored for NEP-2020 academic audit.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/60 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Particulars
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-1">Full Legal Name</span>
              <span className="font-extrabold text-slate-900 text-sm block">
                {profile?.fullName || 'N/A'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-1">Father's / Guardian Name</span>
              <span className="font-extrabold text-slate-900 text-sm block">
                {profile?.parentName || 'N/A'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-1">Contact Phone</span>
              <span className="font-extrabold text-slate-900 text-sm block">
                {profile?.contactNumber || 'N/A'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-1">Registered Email</span>
              <span className="font-extrabold text-slate-900 text-sm block truncate" title={profile?.email}>
                {profile?.email || 'N/A'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-1">Affiliated University</span>
              <span className="font-extrabold text-slate-900 text-sm block">
                {profile?.university || 'N/A'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-1">College Institute</span>
              <span className="font-extrabold text-slate-900 text-sm block">
                {profile?.college || 'N/A'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-1">Degree & Branch</span>
              <span className="font-extrabold text-slate-900 text-sm block">
                {profile?.degree} ({profile?.department || 'General'})
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-1">Session & Semester</span>
              <span className="font-extrabold text-slate-900 text-sm block">
                {profile?.semester} • {profile?.session}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* FEATURE 3: EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-2xl my-auto relative text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Edit Student Profile
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your contact and academic particulars. Email and Roll No are immutable.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {profileMsg && (
                <div
                  className={`p-4 rounded-2xl mb-4 text-xs font-bold flex items-center gap-2 ${
                    profileMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.fullName}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Father's / Guardian Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.parentName}
                      onChange={(e) => setEditFormData({ ...editFormData, parentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={editFormData.contactNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, contactNumber: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={editFormData.gender}
                      onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      value={editFormData.district}
                      onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department / Specialization
                    </label>
                    <input
                      type="text"
                      value={editFormData.department}
                      onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={editFormData.subject}
                      onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Semester
                    </label>
                    <input
                      type="text"
                      value={editFormData.semester}
                      onChange={(e) => setEditFormData({ ...editFormData, semester: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-indigo-600/20 transition disabled:opacity-50 cursor-pointer"
                  >
                    {savingProfile ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
