import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { College, University, District, Degree, CourseDomain } from '../../types';
import { 
  INITIAL_COLLEGES, 
  INITIAL_UNIVERSITIES, 
  INITIAL_DISTRICTS, 
  DEGREES, 
  INTERNSHIP_DOMAINS 
} from '../../lib/constants';
import { 
  Database, 
  Building2, 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  IndianRupee, 
  X, 
  Save,
  Sparkles
} from 'lucide-react';

export default function MasterData() {
  const [activeTab, setActiveTab] = useState<'colleges' | 'universities' | 'districts' | 'degrees' | 'domains'>('colleges');
  const [loading, setLoading] = useState(true);

  // States
  const [colleges, setColleges] = useState<College[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [domains, setDomains] = useState<CourseDomain[]>([]);

  // Modal State for College CRUD (with price)
  const [collegeModalOpen, setCollegeModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [collegeForm, setCollegeForm] = useState({ name: '', districtName: '', price: 1000 });

  // Modal State for Simple item
  const [simpleModalOpen, setSimpleModalOpen] = useState(false);
  const [simpleTitle, setSimpleTitle] = useState('');
  const [simpleName, setSimpleName] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Colleges
      const colSnap = await getDocs(collection(db, 'colleges')).catch(() => null);
      if (colSnap && !colSnap.empty) {
        setColleges(colSnap.docs.map(d => ({ id: d.id, ...d.data() } as College)));
      } else {
        setColleges(INITIAL_COLLEGES);
      }

      // 2. Universities
      const uniSnap = await getDocs(collection(db, 'universities')).catch(() => null);
      if (uniSnap && !uniSnap.empty) {
        setUniversities(uniSnap.docs.map(d => ({ id: d.id, ...d.data() } as University)));
      } else {
        setUniversities(INITIAL_UNIVERSITIES);
      }

      // 3. Districts
      const distSnap = await getDocs(collection(db, 'districts')).catch(() => null);
      if (distSnap && !distSnap.empty) {
        setDistricts(distSnap.docs.map(d => ({ id: d.id, ...d.data() } as District)));
      } else {
        setDistricts(INITIAL_DISTRICTS);
      }

      // 4. Degrees
      setDegrees(DEGREES.map((name, i) => ({ id: `deg_${i}`, name })));

      // 5. Domains
      setDomains(INTERNSHIP_DOMAINS);
    } catch (err) {
      console.warn('Error loading master data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save / Update College
  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingCollege?.id || `col_${Date.now()}`;
      const payload: College = {
        id,
        name: collegeForm.name.trim(),
        districtName: collegeForm.districtName.trim(),
        price: Number(collegeForm.price) || 1000,
        status: 'active'
      };

      await setDoc(doc(db, 'colleges', id), payload, { merge: true });
      
      setColleges(prev => {
        const idx = prev.findIndex(c => c.id === id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = payload;
          return updated;
        }
        return [payload, ...prev];
      });

      setCollegeModalOpen(false);
      setEditingCollege(null);
    } catch (err) {
      console.error('Error saving college:', err);
      alert('Failed to save college.');
    }
  };

  // Delete College
  const handleDeleteCollege = async (id: string, name: string) => {
    if (!window.confirm(`Delete college "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, 'colleges', id));
      setColleges(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Master Data & Dynamic Pricing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure dynamic fee amounts per college, universities, districts, and academic domains
          </p>
        </div>

        {activeTab === 'colleges' && (
          <button
            onClick={() => {
              setEditingCollege(null);
              setCollegeForm({ name: '', districtName: '', price: 1000 });
              setCollegeModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add College & Set Fee</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('colleges')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'colleges'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Colleges & Fee (₹)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{colleges.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('universities')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'universities'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Universities</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{universities.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('districts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'districts'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Districts</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{districts.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('domains')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'domains'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Internship Domains</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{domains.length}</span>
        </button>
      </div>

      {/* TAB 1: COLLEGES & DYNAMIC PRICING */}
      {activeTab === 'colleges' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Colleges Directory & Custom Pricing Engine
            </span>
            <span className="text-[11px] text-slate-400">
              Students from each college are charged their specific affiliated fee amount
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">College Name</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Dynamic Fee Rate</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {colleges.map((col) => (
                  <tr key={col.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {col.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {col.districtName || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>{col.price?.toLocaleString('en-IN') || 1000}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCollege(col);
                            setCollegeForm({
                              name: col.name,
                              districtName: col.districtName || '',
                              price: col.price || 1000
                            });
                            setCollegeModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCollege(col.id, col.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: UNIVERSITIES */}
      {activeTab === 'universities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {universities.map(u => (
            <div key={u.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{u.name}</h4>
                  <span className="text-[10px] text-slate-400">Affiliated University</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: DISTRICTS */}
      {activeTab === 'districts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {districts.map(d => (
            <div key={d.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-500 shrink-0" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{d.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: DOMAINS */}
      {activeTab === 'domains' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {domains.map(dom => (
            <div key={dom.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {dom.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {dom.duration}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {dom.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {dom.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* COLLEGE EDIT / ADD MODAL */}
      {collegeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingCollege ? 'Edit College & Pricing' : 'Add New College'}
              </h3>
              <button
                onClick={() => setCollegeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollege} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  value={collegeForm.name}
                  onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                  placeholder="e.g. Government Engineering College"
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  District
                </label>
                <input
                  type="text"
                  value={collegeForm.districtName}
                  onChange={(e) => setCollegeForm({ ...collegeForm, districtName: e.target.value })}
                  placeholder="e.g. Jaipur"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dynamic Program Fee (INR)
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    value={collegeForm.price}
                    onChange={(e) => setCollegeForm({ ...collegeForm, price: Number(e.target.value) })}
                    required
                    min={0}
                    step={50}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-indigo-600"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Students selecting this college at registration will be billed this exact amount.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCollegeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save College</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
