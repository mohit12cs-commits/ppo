import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { PaymentRecord, UserProfile } from '../../types';
import { generatePaymentSlipPdf, paymentSlipFileName } from '../../lib/paymentSlipPdf';
import { 
  CreditCard, 
  Search, 
  Download, 
  CheckCircle2, 
  IndianRupee, 
  FileText, 
  Calendar,
  Building2,
  ExternalLink
} from 'lucide-react';

export default function ManagePayments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPayments() {
      setLoading(true);
      try {
        // 1. Fetch Users map
        const uSnap = await getDocs(collection(db, 'users')).catch(() => null);
        const uMap: Record<string, UserProfile> = {};
        if (uSnap && !uSnap.empty) {
          uSnap.docs.forEach(d => {
            uMap[d.id] = { uid: d.id, ...d.data() } as UserProfile;
          });
          setUsersMap(uMap);
        }

        // 2. Fetch Payments collection
        const pSnap = await getDocs(collection(db, 'payments')).catch(() => null);
        let list: PaymentRecord[] = [];
        if (pSnap && !pSnap.empty) {
          list = pSnap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentRecord));
        } else {
          // If payments collection empty, construct from paid users
          Object.values(uMap).forEach(u => {
            if (u.isPaid || u.hasPaid || u.paymentStatus === 'success') {
              list.push({
                id: u.razorpayPaymentId || `pay_${u.uid}`,
                userId: u.uid,
                studentName: u.fullName,
                studentEmail: u.email,
                college: u.college,
                razorpayOrderId: u.razorpayOrderId || 'order_auto',
                razorpayPaymentId: u.razorpayPaymentId || `pay_verified_${u.uid.slice(0, 6)}`,
                amount: u.paymentAmount || 1000,
                amountPaise: (u.paymentAmount || 1000) * 100,
                currency: 'INR',
                status: 'success',
                timestamp: u.paymentVerifiedAt || u.registrationDate || new Date().toISOString()
              });
            }
          });
        }

        setPayments(list);
      } catch (err) {
        console.warn('Error loading payments:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return payments;
    return payments.filter(p => 
      p.studentName?.toLowerCase().includes(q) ||
      p.studentEmail?.toLowerCase().includes(q) ||
      p.razorpayPaymentId?.toLowerCase().includes(q) ||
      p.college?.toLowerCase().includes(q)
    );
  }, [payments, search]);

  const totalCollected = useMemo(() => {
    return payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  }, [payments]);

  // Re-download official Payment Slip PDF
  const handleDownloadSlip = async (p: PaymentRecord) => {
    setDownloadingId(p.id);
    try {
      const studentProfile = usersMap[p.userId] || {
        fullName: p.studentName,
        email: p.studentEmail,
        college: p.college,
        paymentAmount: p.amount,
        razorpayPaymentId: p.razorpayPaymentId,
        razorpayOrderId: p.razorpayOrderId,
        paymentVerifiedAt: p.timestamp
      };

      const pdf = await generatePaymentSlipPdf(studentProfile, p);
      pdf.save(paymentSlipFileName(p.studentName));
    } catch (err) {
      console.error('Error generating PDF slip:', err);
      alert('Failed to generate payment slip.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Export Payments CSV
  const handleExportCsv = () => {
    if (filteredPayments.length === 0) return;
    const headers = ['Payment ID', 'Order ID', 'Student Name', 'Email', 'College', 'Amount (INR)', 'Status', 'Date'];
    const rows = filteredPayments.map(p => [
      `"${p.razorpayPaymentId}"`,
      `"${p.razorpayOrderId}"`,
      `"${p.studentName || ''}"`,
      `"${p.studentEmail || ''}"`,
      `"${p.college || ''}"`,
      `"${p.amount}"`,
      `"${p.status}"`,
      `"${p.timestamp}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Payments_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payments Ledger & Reconciliation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Razorpay transaction records, college collections, and downloadable verified slips
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Ledger ({filteredPayments.length})</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Net Collections</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{totalCollected.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400">All successful orders</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Transactions</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {payments.length}
          </p>
          <span className="text-[10px] text-slate-400">Recorded receipts</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Fee Rate</span>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            ₹{payments.length ? Math.round(totalCollected / payments.length).toLocaleString('en-IN') : 0}
          </p>
          <span className="text-[10px] text-slate-400">Across all institutions</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, payment ID, or college..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Payment ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading payment transactions...</span>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {p.razorpayPaymentId}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {p.studentName || 'Student'}
                      </p>
                      <p className="text-[11px] text-slate-400">{p.studentEmail}</p>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {p.college || '—'}
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {new Date(p.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>SUCCESS</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDownloadSlip(p)}
                        disabled={downloadingId === p.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] transition cursor-pointer disabled:opacity-50"
                      >
                        {downloadingId === p.id ? (
                          <span>Generating...</span>
                        ) : (
                          <>
                            <FileText className="w-3.5 h-3.5" />
                            <span>Slip (PDF)</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
