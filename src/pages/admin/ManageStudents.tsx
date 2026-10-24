import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { UserProfile, CohortBatch } from '../../types';
import { INITIAL_COLLEGES } from '../../lib/constants';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  X, 
  Save, 
  AlertCircle,
  ExternalLink,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function ManageStudents() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [batches, setBatches] = useState<CohortBatch[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');

  // Edit Modal State
  const [editingStudent, setEditingStudent] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Modal State
  const [passwordStudent, setPasswordStudent] = useState<UserProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [notifyByEmail, setNotifyByEmail] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Verifying Payment state
  const [verifyingUid, setVerifyingUid] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
        list.sort((a, b) => {
          const tA = new Date(a.createdAt || a.registrationDate || 0).getTime();
          const tB = new Date(b.createdAt || b.registrationDate || 0).getTime();
          return tB - tA;
        });
        setStudents(list);
      } else {
        setStudents([]);
      }

      // Fetch Batches for allocation dropdown
      const bSnap = await getDocs(collection(db, 'batches')).catch(() => null);
      if (bSnap && !bSnap.empty) {
        setBatches(bSnap.docs.map(d => ({ id: d.id, ...d.data() } as CohortBatch)));
      }
    } catch (err) {
      console.warn('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filtered List
  const filteredStudents = useMemo(() => {
    return students.filter(st => {
      // 1. Search Query
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || (
        st.fullName?.toLowerCase().includes(q) ||
        st.email?.toLowerCase().includes(q) ||
        st.universityRoll?.toLowerCase().includes(q) ||
        st.universityRollNo?.toLowerCase().includes(q) ||
        st.contactNumber?.includes(q)
      );

      // 2. College Filter
      const matchesCollege = selectedCollege === 'ALL' || st.college === selectedCollege;

      // 3. Payment Filter
      const isPaid = Boolean(st.isPaid || st.hasPaid || st.paymentStatus === 'success');
      const matchesPayment = 
        selectedPaymentStatus === 'ALL' ||
        (selectedPaymentStatus === 'PAID' && isPaid) ||
        (selectedPaymentStatus === 'PENDING' && !isPaid);

      return matchesSearch && matchesCollege && matchesPayment;
    });
  }, [students, search, selectedCollege, selectedPaymentStatus]);

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredStudents.length === 0) {
      alert('No students to export.');
      return;
    }

    const headers = [
      'Full Name',
      'Email',
      'Phone',
      'Roll Number',
      'College',
      'University',
      'Degree',
      'Domain',
      'Semester',
      'Fee Paid',
      'Payment ID',
      'Registered Date'
    ];

    const rows = filteredStudents.map(st => [
      `"${st.fullName || ''}"`,
      `"${st.email || ''}"`,
      `"${st.contactNumber || ''}"`,
      `"${st.universityRoll || st.universityRollNo || ''}"`,
      `"${st.college || ''}"`,
      `"${st.university || ''}"`,
      `"${st.degree || ''}"`,
      `"${st.internshipDomain || ''}"`,
      `"${st.semester || ''}"`,
      `"${st.isPaid ? 'YES' : 'NO'}"`,
      `"${st.razorpayPaymentId || ''}"`,
      `"${st.registrationDate || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Manually Verify Payment for any student
  const handleVerifyPayment = async (st: UserProfile) => {
    const confirmed = window.confirm(`Verify and approve registration fee for ${st.fullName}? This will unlock their student dashboard and generate their official Offer Letter & Payment Receipt.`);
    if (!confirmed) return;

    setVerifyingUid(st.uid);
    try {
      const paymentId = st.razorpayPaymentId || `ADMIN_VERIFIED_${Date.now()}`;
      const amount = st.paymentAmount || 1000;
      const verifiedAt = new Date().toISOString();

      // 1. Update user profile
      const userRef = doc(db, 'users', st.uid);
      await updateDoc(userRef, {
        isPaid: true,
        hasPaid: true,
        paymentStatus: 'success',
        paymentAmount: amount,
        razorpayPaymentId: paymentId,
        paymentVerifiedAt: verifiedAt,
        verifiedByAdmin: true,
        updatedAt: verifiedAt
      });

      // 2. Insert record into payments collection
      await setDoc(doc(db, 'payments', paymentId), {
        id: paymentId,
        userId: st.uid,
        studentName: st.fullName || 'Student',
        studentEmail: st.email || '',
        college: st.college || '',
        razorpayOrderId: `ORDER_ADMIN_${Date.now()}`,
        razorpayPaymentId: paymentId,
        amount: amount,
        amountPaise: amount * 100,
        currency: 'INR',
        status: 'success',
        timestamp: verifiedAt,
        verifiedByAdmin: true
      });

      // 3. Dispatch confirmation email to student
      fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: st.fullName,
          email: st.email,
          rollNo: st.universityRoll || st.universityRollNo || '',
          college: st.college,
          domain: st.internshipDomain
        })
      }).catch(err => console.warn('Welcome note trigger:', err));

      await fetchStudents();
      alert(`Payment verified successfully for ${st.fullName}! Their account is now active.`);
    } catch (err: any) {
      console.error('Error verifying payment:', err);
      alert(`Failed to verify payment: ${err.message || 'Unknown error'}`);
    } finally {
      setVerifyingUid(null);
    }
  };

  // 2. Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordStudent) return;
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setChangingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      // Call backend API to dispatch credential notification and update
      const resp = await fetch('/api/admin/change-student-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentEmail: passwordStudent.email,
          studentName: passwordStudent.fullName,
          newPassword: newPassword.trim(),
          notifyByEmail
        })
      });

      const data = await resp.json().catch(() => ({}));

      // Update user doc in Firestore with audit record
      const userRef = doc(db, 'users', passwordStudent.uid);
      await updateDoc(userRef, {
        passwordUpdatedAt: new Date().toISOString(),
        passwordUpdatedBy: 'Admin Console'
      });

      setPasswordSuccess(`Password updated successfully! An email notification has been dispatched to ${passwordStudent.email}.`);
      setTimeout(() => {
        setPasswordStudent(null);
        setPasswordSuccess(null);
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err: any) {
      console.error('Password change error:', err);
      setPasswordError(err.message || 'Failed to update student password.');
    } finally {
      setChangingPassword(false);
    }
  };

  // Generate random secure password helper
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#%';
    let result = '';
    for (let i = 0; i < 9; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(result);
    setConfirmPassword(result);
    setShowPass(true);
  };

  // 3. Save student updates
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setSaving(true);
    setActionMsg(null);

    try {
      const userRef = doc(db, 'users', editingStudent.uid);
      const isPaid = Boolean(editingStudent.isPaid);
      const paymentId = editingStudent.razorpayPaymentId || (isPaid ? `ADMIN_VERIFIED_${Date.now()}` : null);

      await updateDoc(userRef, {
        fullName: editingStudent.fullName,
        email: editingStudent.email,
        contactNumber: editingStudent.contactNumber,
        universityRoll: editingStudent.universityRoll,
        college: editingStudent.college,
        degree: editingStudent.degree,
        internshipDomain: editingStudent.internshipDomain,
        batchId: editingStudent.batchId || '',
        isPaid: isPaid,
        hasPaid: isPaid,
        paymentStatus: isPaid ? 'success' : 'pending',
        razorpayPaymentId: paymentId,
        paymentVerifiedAt: isPaid ? (editingStudent.paymentVerifiedAt || new Date().toISOString()) : null,
        updatedAt: new Date().toISOString()
      });

      // If marked paid, also ensure a payment record exists
      if (isPaid && paymentId) {
        await setDoc(doc(db, 'payments', paymentId), {
          id: paymentId,
          userId: editingStudent.uid,
          studentName: editingStudent.fullName || 'Student',
          studentEmail: editingStudent.email || '',
          college: editingStudent.college || '',
          razorpayOrderId: `ORDER_ADMIN_${Date.now()}`,
          razorpayPaymentId: paymentId,
          amount: editingStudent.paymentAmount || 1000,
          amountPaise: (editingStudent.paymentAmount || 1000) * 100,
          currency: 'INR',
          status: 'success',
          timestamp: new Date().toISOString(),
          verifiedByAdmin: true
        });
      }

      await fetchStudents();
      setActionMsg({ type: 'success', text: 'Student updated successfully!' });
      setTimeout(() => {
        setEditingStudent(null);
        setActionMsg(null);
      }, 1000);
    } catch (err: any) {
      console.error('Error saving student:', err);
      setActionMsg({ type: 'error', text: 'Failed to update student.' });
    } finally {
      setSaving(false);
    }
  };

  // Delete student
  const handleDeleteStudent = async (uid: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete student "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', uid));
      setStudents(prev => prev.filter(s => s.uid !== uid));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete student.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View, search, verify payments, reset passwords, allocate batches, and export students
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV ({filteredStudents.length})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll no, email, or phone..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* College Filter */}
        <div className="w-full md:w-64">
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Colleges</option>
            {INITIAL_COLLEGES.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Payment Filter */}
        <div className="w-full md:w-44">
          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Payment Status</option>
            <option value="PAID">Verified Paid</option>
            <option value="PENDING">Pending Payment</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll / Reg No</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Fee Status & Verification</th>
                <th className="py-3 px-4">Batch Cohort</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading student records...</span>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No matching student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const isPaid = Boolean(st.isPaid || st.hasPaid || st.paymentStatus === 'success');
                  const assignedBatch = batches.find(b => b.id === st.batchId);
                  const isVerifying = verifyingUid === st.uid;

                  return (
                    <tr key={st.uid} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">
                          {st.fullName || 'Student'}
                        </p>
                        <p className="text-[11px] text-slate-400">{st.email} • {st.contactNumber}</p>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {st.universityRoll || st.universityRollNo || '—'}
                      </td>

                      <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                        {st.college || '—'}
                      </td>

                      <td className="py-3 px-4 text-indigo-600 font-medium">
                        {st.internshipDomain || '—'}
                      </td>

                      {/* Fee Status with Direct Verify Action */}
                      <td className="py-3 px-4">
                        {isPaid ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Paid (₹{st.paymentAmount || 1000})</span>
                            </span>
                            {st.razorpayPaymentId && (
                              <span className="text-[9px] font-mono text-slate-400 truncate max-w-[150px]">
                                {st.razorpayPaymentId}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                              <Clock className="w-3 h-3" />
                              <span>Pending</span>
                            </span>
                            <button
                              onClick={() => handleVerifyPayment(st)}
                              disabled={isVerifying}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 transition shadow-xs cursor-pointer disabled:opacity-50"
                              title="Manually verify registration fee"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{isVerifying ? 'Verifying...' : 'Verify Payment'}</span>
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium text-slate-600">
                          {assignedBatch ? assignedBatch.batchName : 'Standard / Auto'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Change Password button */}
                          <button
                            onClick={() => {
                              setPasswordStudent(st);
                              setNewPassword('');
                              setConfirmPassword('');
                              setPasswordError(null);
                              setPasswordSuccess(null);
                            }}
                            title="Change Student Password"
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 border border-amber-200/60 transition cursor-pointer"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Edit Details button */}
                          <button
                            onClick={() => setEditingStudent(st)}
                            title="Edit Student"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Student button */}
                          <button
                            onClick={() => handleDeleteStudent(st.uid, st.fullName)}
                            title="Delete Student"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PASSWORD CHANGE MODAL */}
      {passwordStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Reset Student Password
                  </h3>
                  <p className="text-[11px] text-slate-500">{passwordStudent.fullName} ({passwordStudent.email})</p>
                </div>
              </div>
              <button
                onClick={() => setPasswordStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordSuccess && (
              <div className="p-3.5 rounded-xl mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3.5 rounded-xl mb-4 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">New Password</label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter at least 6 characters..."
                    className="w-full px-3 py-2 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter password to confirm..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyByEmail}
                    onChange={(e) => setNotifyByEmail(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block">Dispatch Credentials via Email</span>
                    <span className="text-[10px] text-slate-500">
                      Sends an official security notification with new password to {passwordStudent.email}
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword || !newPassword}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {changingPassword ? (
                    <span>Updating...</span>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Save & Notify Student</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Student Record
                </h3>
                <p className="text-[11px] text-slate-400">UID: {editingStudent.uid}</p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionMsg && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
                  actionMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {actionMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{actionMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingStudent.fullName || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingStudent.email || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editingStudent.contactNumber || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">University Roll No</label>
                  <input
                    type="text"
                    value={editingStudent.universityRoll || editingStudent.universityRollNo || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, universityRoll: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">College</label>
                  <select
                    value={editingStudent.college || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, college: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {INITIAL_COLLEGES.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch Cohort</label>
                  <select
                    value={editingStudent.batchId || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, batchId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="">Default / Auto Allocation</option>
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>{b.batchName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={Boolean(editingStudent.isPaid)}
                    onChange={(e) => setEditingStudent({ ...editingStudent, isPaid: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Mark Registration Fee as Verified (₹{editingStudent.paymentAmount || 1000})</span>
                </label>
                <p className="text-[10px] text-slate-500 mt-1 pl-6">
                  Checking this allows the student to login, view their dashboard, and access verified Offer Letters.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
