import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { InquirySubmission } from '../../types';
import { 
  Mail, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Reply, 
  Building2, 
  Phone, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<InquirySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [search, setSearch] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'inquiries')).catch(() => null);
      if (snap && !snap.empty) {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as InquirySubmission));
        // Sort descending by date
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setInquiries(list);
      } else {
        setInquiries([]);
      }
    } catch (err) {
      console.warn('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleToggleStatus = async (item: InquirySubmission) => {
    try {
      const newStatus = item.status === 'unread' ? 'read' : 'unread';
      await updateDoc(doc(db, 'inquiries', item.id), { status: newStatus });
      setInquiries(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i));
    } catch (err) {
      console.error('Error toggling inquiry status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Error deleting inquiry:', err);
    }
  };

  const filteredInquiries = inquiries.filter(i => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || (
      i.fullName?.toLowerCase().includes(q) ||
      i.email?.toLowerCase().includes(q) ||
      i.subject?.toLowerCase().includes(q) ||
      i.college?.toLowerCase().includes(q) ||
      i.message?.toLowerCase().includes(q)
    );

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'UNREAD' && i.status === 'unread') ||
      (statusFilter === 'READ' && i.status === 'read');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Contact Inquiries & Helpdesk Inbox
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time messages submitted by students, colleges, and university coordinators
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
            {inquiries.filter(i => i.status === 'unread').length} Unread Messages
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages by name, email, subject, or keywords..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-1.5 self-start sm:self-auto">
          {(['ALL', 'UNREAD', 'READ'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab === 'UNREAD' ? 'Unread' : 'Archived'}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs">Loading inquiry submissions...</span>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
            No inquiries match your current filter criteria.
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className={`p-5 rounded-2xl border transition shadow-xs ${
                inq.status === 'unread'
                  ? 'bg-white border-indigo-200'
                  : 'bg-slate-50/70 border-slate-200 opacity-90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${inq.status === 'unread' ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-300'}`} />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {inq.fullName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {inq.email} • {inq.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(inq)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      inq.status === 'unread'
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {inq.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                  </button>

                  <a
                    href={`mailto:${inq.email}?subject=RE:%20${encodeURIComponent(inq.subject || 'Internship Inquiry')}`}
                    className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition cursor-pointer"
                    title="Reply via Email"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {inq.college && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="font-semibold">{inq.college}</span>
                </div>
              )}

              <div className="mt-2">
                {inq.subject && (
                  <p className="text-xs font-bold text-slate-800 mb-1">
                    Subject: {inq.subject}
                  </p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {inq.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
