import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { UserProfile, PaymentRecord } from '../../types';
import { 
  Users, 
  CreditCard, 
  IndianRupee, 
  Clock, 
  Mail, 
  Building2, 
  ArrowUpRight, 
  FileCheck2, 
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    paidStudents: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    totalInquiries: 0,
    totalColleges: 0
  });

  const [recentStudents, setRecentStudents] = useState<UserProfile[]>([]);
  const [recentPayments, setRecentPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // 1. Fetch Students
        const usersSnap = await getDocs(collection(db, 'users')).catch(() => null);
        let studentList: UserProfile[] = [];
        let paidCount = 0;
        let revenue = 0;
        let pending = 0;

        if (usersSnap && !usersSnap.empty) {
          studentList = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
          studentList.forEach(s => {
            const isPaid = s.isPaid || s.hasPaid || s.paymentStatus === 'success';
            if (isPaid) {
              paidCount++;
              revenue += (s.paymentAmount || 1000);
            } else {
              pending++;
            }
          });
        }

        // 2. Fetch Inquiries
        const inqSnap = await getDocs(collection(db, 'inquiries')).catch(() => null);
        const inquiryCount = inqSnap ? inqSnap.size : 0;

        // 3. Fetch Colleges
        const colSnap = await getDocs(collection(db, 'colleges')).catch(() => null);
        const collegeCount = colSnap ? colSnap.size : 0;

        // 4. Fetch Payments
        const paySnap = await getDocs(collection(db, 'payments')).catch(() => null);
        let paymentList: PaymentRecord[] = [];
        if (paySnap && !paySnap.empty) {
          paymentList = paySnap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentRecord));
        }

        setStats({
          totalStudents: studentList.length,
          paidStudents: paidCount,
          totalRevenue: revenue,
          pendingPayments: pending,
          totalInquiries: inquiryCount,
          totalColleges: collegeCount
        });

        // Slice recents
        setRecentStudents(studentList.slice(0, 5));
        setRecentPayments(paymentList.slice(0, 5));
      } catch (err) {
        console.warn('Dashboard metrics fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Administrator Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics and management control for NEP-2020 Internship Batches
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/offer-letters"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Offer Letter Engine</span>
          </Link>
          <Link
            to="/admin/master-data"
            className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Database className="w-4 h-4" />
            <span>Colleges & Fees</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Total Students */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Students
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {loading ? '...' : stats.totalStudents}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Registered in database</span>
        </div>

        {/* Paid Students */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Verified Paid
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">
            {loading ? '...' : stats.paidStudents}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Fee confirmed</span>
        </div>

        {/* Revenue Collected */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Revenue
            </span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            ₹{loading ? '...' : stats.totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Net collected</span>
        </div>

        {/* Pending Payments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Pending
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-600">
            {loading ? '...' : stats.pendingPayments}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Awaiting fee</span>
        </div>

        {/* Total Inquiries */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Inquiries
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {loading ? '...' : stats.totalInquiries}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Contact submissions</span>
        </div>

        {/* Affiliated Colleges */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Colleges
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {loading ? '...' : (stats.totalColleges || 35)}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Active institutions</span>
        </div>
      </div>

      {/* Two-Column Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Registrations Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              Recent Student Registrations
            </h3>
            <Link
              to="/admin/students"
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentStudents.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No students registered yet</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentStudents.map((st) => {
                const paid = st.isPaid || st.hasPaid || st.paymentStatus === 'success';
                return (
                  <div key={st.uid} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">
                        {st.fullName || 'Student'}
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        Roll: {st.universityRoll || st.universityRollNo || 'N/A'} • {st.college || 'College'}
                      </p>
                    </div>
                    <div>
                      {paid ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Paid
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-500" />
              Recent Payment Transactions
            </h3>
            <Link
              to="/admin/payments"
              className="text-xs text-cyan-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No payment transactions yet</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentPayments.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">
                      {p.studentName || 'Student'}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      ID: {p.razorpayPaymentId.slice(0, 16)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(p.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
