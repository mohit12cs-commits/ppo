import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
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
  Building2
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

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
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

  // Save student updates
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setSaving(true);
    setActionMsg(null);

    try {
      const userRef = doc(db, 'users', editingStudent.uid);
      await updateDoc(userRef, {
        fullName: editingStudent.fullName,
        email: editingStudent.email,
        contactNumber: editingStudent.contactNumber,
        universityRoll: editingStudent.universityRoll,
        college: editingStudent.college,
        degree: editingStudent.degree,
        internshipDomain: editingStudent.internshipDomain,
        batchId: editingStudent.batchId || '',
        isPaid: editingStudent.isPaid,
        paymentStatus: editingStudent.isPaid ? 'success' : 'pending',
        updatedAt: new Date().toISOString()
      });

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
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Student Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            View, search, filter, allocate batches, and export registered students
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV ({filteredStudents.length})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll no, email, or phone..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* College Filter */}
        <div className="w-full md:w-64">
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
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
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Payment Status</option>
            <option value="PAID">Verified Paid</option>
            <option value="PENDING">Pending Payment</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll / Reg No</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4">Batch Cohort</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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

                  return (
                    <tr key={st.uid} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {st.fullName || 'Student'}
                        </p>
                        <p className="text-[11px] text-slate-400">{st.email} • {st.contactNumber}</p>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                        {st.universityRoll || st.universityRollNo || '—'}
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {st.college || '—'}
                      </td>

                      <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-medium">
                        {st.internshipDomain || '—'}
                      </td>

                      <td className="py-3 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Paid (₹{st.paymentAmount || 1000})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          {assignedBatch ? assignedBatch.batchName : 'Standard / Auto'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingStudent(st)}
                            title="Edit Student"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(st.uid, st.fullName)}
                            title="Delete Student"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
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

      {/* EDIT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Edit Student Record
                </h3>
                <p className="text-[11px] text-slate-400">UID: {editingStudent.uid}</p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingStudent.fullName || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingStudent.email || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editingStudent.contactNumber || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">University Roll No</label>
                  <input
                    type="text"
                    value={editingStudent.universityRoll || editingStudent.universityRollNo || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, universityRoll: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">College</label>
                  <select
                    value={editingStudent.college || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, college: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    {INITIAL_COLLEGES.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Batch Cohort</label>
                  <select
                    value={editingStudent.batchId || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, batchId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="">Default / Auto Allocation</option>
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>{b.batchName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(editingStudent.isPaid)}
                    onChange={(e) => setEditingStudent({ ...editingStudent, isPaid: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>Mark as Paid (Manually verify payment)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2"
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
