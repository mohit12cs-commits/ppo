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
  ShieldAlert
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                {profile?.fullName?.charAt(0) || 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {profile?.fullName || 'Student Candidate'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Student
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  University Roll: <span className="font-semibold text-slate-900 dark:text-slate-200">{profile?.universityRoll || profile?.universityRollNo || 'N/A'}</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                    {profile?.college || 'Registered College'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-500" />
                    {profile?.degree || 'Degree'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Payment Pending Banner if applicable */}
        {!isPaid && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Internship Fee Payment Required
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                  Your registration is verified. Please complete your fee payment to unlock and download your official Offer Letter.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/payment')}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 shadow-md shadow-amber-600/20 transition cursor-pointer"
            >
              Pay Now
            </button>
          </motion.div>
        )}

        {/* 3 CORE STUDENT ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* FEATURE 1: Offer Letter Download */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 border border-indigo-200 dark:border-indigo-800">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Internship Offer Letter
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Official NEP-2020 aligned joining and acceptance document featuring your university roll number, allocated domain, and verification seal.
              </p>

              {/* Status Indicator */}
              <div className="mt-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                {!isPaid ? (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>Locked: Complete enrollment payment to unlock</span>
                  </div>
                ) : !isOfferLetterReleased ? (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>On Hold: Batch allocation currently being finalized by academic council</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Verified & Ready for immediate download</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              {isPaid && isOfferLetterReleased ? (
                <button
                  type="button"
                  onClick={handleDownloadOfferLetter}
                  disabled={downloadingOffer}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {downloadingOffer ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating PDF...</span>
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
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Offer Letter Unavailable</span>
                </button>
              )}
            </div>
          </div>

          {/* FEATURE 2: Payment Slip Download */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5 border border-cyan-200 dark:border-cyan-800">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Payment Slip & Receipt
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Legally valid computer-generated receipt with embedded verification QR code, Razorpay transaction ID, and full fee breakdown for college submission.
              </p>

              {/* Status Indicator */}
              <div className="mt-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                {isPaid ? (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Paid: ₹{(profile?.paymentAmount || 1000).toLocaleString('en-IN')}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ID: {(profile?.razorpayPaymentId || 'pay_verified').slice(0, 14)}...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>No successful payment record found</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              {isPaid ? (
                <button
                  type="button"
                  onClick={handleDownloadPaymentSlip}
                  disabled={downloadingSlip}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {downloadingSlip ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating Slip...</span>
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
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  <span>Complete Fee Payment First</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Student Academic & Profile Details Overview */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-500" />
              Registered Profile Overview
            </h3>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Update Information
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Full Legal Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {profile?.fullName || 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Father's / Guardian's Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {profile?.parentName || 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Contact Phone Number</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {profile?.contactNumber || 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Registered Email</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {profile?.email || 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">District</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {profile?.district || 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Internship Domain</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm">
                {profile?.internshipDomain || 'NEP-2020 Internship'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">College / Institution</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {profile?.college || 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Affiliated University</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {profile?.university || 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Academic Session & Semester</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {profile?.semester || 'Semester'} • {profile?.session || 'Session'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* FEATURE 3: EDIT OWN PROFILE MODAL */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Edit Profile Details
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Update your contact and academic particulars. Email and Roll Number are protected.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {profileMsg && (
                <div
                  className={`p-3.5 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
                    profileMsg.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200'
                  }`}
                >
                  {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.fullName}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Father's / Guardian's Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.parentName}
                      onChange={(e) => setEditFormData({ ...editFormData, parentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={editFormData.contactNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, contactNumber: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Gender
                    </label>
                    <select
                      value={editFormData.gender}
                      onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      value={editFormData.district}
                      onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Department / Specialization
                    </label>
                    <input
                      type="text"
                      value={editFormData.department}
                      onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={editFormData.subject}
                      onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Semester
                    </label>
                    <input
                      type="text"
                      value={editFormData.semester}
                      onChange={(e) => setEditFormData({ ...editFormData, semester: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition disabled:opacity-50 cursor-pointer"
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
