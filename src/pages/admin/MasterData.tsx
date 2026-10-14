import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { College, University, District, Degree, CourseDomain } from '../../types';
import { 
  INITIAL_COLLEGES, 
  INITIAL_UNIVERSITIES, 
  INITIAL_DISTRICTS, 
  DEGREES, 
  INTERNSHIP_DOMAINS 
} from '../../lib/constants';
import { 
  Building2, 
  GraduationCap, 
  MapPin, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  IndianRupee, 
  X, 
  Save,
  CheckCircle2,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function MasterData() {
  const [activeTab, setActiveTab] = useState<'colleges' | 'universities' | 'districts' | 'degrees' | 'domains'>('colleges');
  const [loading, setLoading] = useState(true);

  // Lists
  const [colleges, setColleges] = useState<College[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [domains, setDomains] = useState<CourseDomain[]>([]);

  // College Modal State (includes Price)
  const [collegeModalOpen, setCollegeModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [collegeForm, setCollegeForm] = useState({ name: '', districtName: '', price: 1000 });

  // Generic Item Modal (for District, University, Degree, Domain)
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemModalType, setItemModalType] = useState<'district' | 'university' | 'degree' | 'domain'>('district');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemFormName, setItemFormName] = useState('');
  const [itemFormCategory, setItemFormCategory] = useState('');
  const [itemFormDesc, setItemFormDesc] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Colleges
      const colSnap = await getDocs(collection(db, 'colleges')).catch(() => null);
      if (colSnap && !colSnap.empty) {
        setColleges(colSnap.docs.map(d => ({ id: d.id, ...d.data() } as College)));
      } else {
        setColleges(INITIAL_COLLEGES as unknown as College[]);
      }

      // 2. Universities
      const uniSnap = await getDocs(collection(db, 'universities')).catch(() => null);
      if (uniSnap && !uniSnap.empty) {
        setUniversities(uniSnap.docs.map(d => ({ id: d.id, ...d.data() } as University)));
      } else {
        setUniversities(INITIAL_UNIVERSITIES as unknown as University[]);
      }

      // 3. Districts
      const distSnap = await getDocs(collection(db, 'districts')).catch(() => null);
      if (distSnap && !distSnap.empty) {
        setDistricts(distSnap.docs.map(d => ({ id: d.id, ...d.data() } as District)));
      } else {
        setDistricts(INITIAL_DISTRICTS);
      }

      // 4. Degrees
      const degSnap = await getDocs(collection(db, 'degrees')).catch(() => null);
      if (degSnap && !degSnap.empty) {
        setDegrees(degSnap.docs.map(d => ({ id: d.id, ...d.data() } as Degree)));
      } else {
        setDegrees(DEGREES.map((name, i) => ({ id: `deg_${i}`, name })));
      }

      // 5. Domains
      const domSnap = await getDocs(collection(db, 'domains')).catch(() => null);
      if (domSnap && !domSnap.empty) {
        setDomains(domSnap.docs.map(d => ({ id: d.id, ...d.data() } as CourseDomain)));
      } else {
        setDomains(INTERNSHIP_DOMAINS as unknown as CourseDomain[]);
      }
    } catch (err) {
      console.warn('Error loading master data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- College Actions ---
  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeForm.name.trim()) return;

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

  const handleDeleteCollege = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, 'colleges', id));
      setColleges(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting college:', err);
    }
  };

  // --- Generic Item Actions (District, University, Degree, Domain) ---
  const handleOpenAddItem = (type: 'district' | 'university' | 'degree' | 'domain') => {
    setItemModalType(type);
    setEditingItemId(null);
    setItemFormName('');
    setItemFormCategory('');
    setItemFormDesc('');
    setItemModalOpen(true);
  };

  const handleOpenEditItem = (type: 'district' | 'university' | 'degree' | 'domain', item: any) => {
    setItemModalType(type);
    setEditingItemId(item.id);
    setItemFormName(item.name || '');
    setItemFormCategory(item.category || '');
    setItemFormDesc(item.description || '');
    setItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemFormName.trim()) return;

    const collectionName = 
      itemModalType === 'district' ? 'districts' :
      itemModalType === 'university' ? 'universities' :
      itemModalType === 'degree' ? 'degrees' : 'domains';

    const id = editingItemId || `${itemModalType}_${Date.now()}`;
    const payload: any = { id, name: itemFormName.trim() };

    if (itemModalType === 'domain') {
      payload.category = itemFormCategory.trim() || 'Engineering';
      payload.description = itemFormDesc.trim();
      payload.duration = '120 Hours (NEP-2020)';
    }

    try {
      await setDoc(doc(db, collectionName, id), payload, { merge: true });

      if (itemModalType === 'district') {
        setDistricts(prev => {
          const idx = prev.findIndex(d => d.id === id);
          if (idx >= 0) { const copy = [...prev]; copy[idx] = payload; return copy; }
          return [payload, ...prev];
        });
      } else if (itemModalType === 'university') {
        setUniversities(prev => {
          const idx = prev.findIndex(u => u.id === id);
          if (idx >= 0) { const copy = [...prev]; copy[idx] = payload; return copy; }
          return [payload, ...prev];
        });
      } else if (itemModalType === 'degree') {
        setDegrees(prev => {
          const idx = prev.findIndex(d => d.id === id);
          if (idx >= 0) { const copy = [...prev]; copy[idx] = payload; return copy; }
          return [payload, ...prev];
        });
      } else {
        setDomains(prev => {
          const idx = prev.findIndex(d => d.id === id);
          if (idx >= 0) { const copy = [...prev]; copy[idx] = payload; return copy; }
          return [payload, ...prev];
        });
      }

      setItemModalOpen(false);
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Failed to save item.');
    }
  };

  const handleDeleteItem = async (type: 'district' | 'university' | 'degree' | 'domain', id: string, name: string) => {
    if (!window.confirm(`Delete ${type} "${name}"?`)) return;

    const collectionName = 
      type === 'district' ? 'districts' :
      type === 'university' ? 'universities' :
      type === 'degree' ? 'degrees' : 'domains';

    try {
      await deleteDoc(doc(db, collectionName, id));
      if (type === 'district') setDistricts(prev => prev.filter(d => d.id !== id));
      if (type === 'university') setUniversities(prev => prev.filter(u => u.id !== id));
      if (type === 'degree') setDegrees(prev => prev.filter(d => d.id !== id));
      if (type === 'domain') setDomains(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Master Data & Dynamic College Pricing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage colleges with custom fee rates, affiliated universities, districts, and internship tracks
          </p>
        </div>

        {/* Dynamic Add Button depending on active tab */}
        <div>
          {activeTab === 'colleges' && (
            <button
              onClick={() => {
                setEditingCollege(null);
                setCollegeForm({ name: '', districtName: '', price: 1000 });
                setCollegeModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add College & Set Fee</span>
            </button>
          )}

          {activeTab === 'universities' && (
            <button
              onClick={() => handleOpenAddItem('university')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add University</span>
            </button>
          )}

          {activeTab === 'districts' && (
            <button
              onClick={() => handleOpenAddItem('district')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add District</span>
            </button>
          )}

          {activeTab === 'degrees' && (
            <button
              onClick={() => handleOpenAddItem('degree')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Degree</span>
            </button>
          )}

          {activeTab === 'domains' && (
            <button
              onClick={() => handleOpenAddItem('domain')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Domain</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('colleges')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'colleges'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
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
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
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
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Districts</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{districts.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('degrees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'degrees'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Degrees</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{degrees.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('domains')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'domains'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Domains</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{domains.length}</span>
        </button>
      </div>

      {/* TAB 1: COLLEGES & PRICING */}
      {activeTab === 'colleges' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Affiliated Colleges & Dynamic Student Fee Directory
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Students from each institution will pay this exact configured fee at registration
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">College Name</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Fee to Pay (INR)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {colleges.map((col) => (
                  <tr key={col.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {col.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {col.districtName || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>{col.price?.toLocaleString('en-IN') || 1000}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
                          title="Edit College & Fee"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCollege(col.id, col.name)}
                          title="Delete College"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
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
            <div key={u.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                  <span className="text-[10px] text-slate-400">Affiliated University</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditItem('university', u)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteItem('university', u.id, u.name)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: DISTRICTS */}
      {activeTab === 'districts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {districts.map(d => (
            <div key={d.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-900">{d.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditItem('district', d)}
                  className="p-1 text-slate-400 hover:text-indigo-600"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteItem('district', d.id, d.name)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: DEGREES */}
      {activeTab === 'degrees' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {degrees.map(d => (
            <div key={d.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-900">{d.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditItem('degree', d)}
                  className="p-1 text-slate-400 hover:text-indigo-600"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteItem('degree', d.id, d.name)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: DOMAINS */}
      {activeTab === 'domains' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {domains.map(dom => (
            <div key={dom.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {dom.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditItem('domain', dom)}
                      className="p-1 text-slate-400 hover:text-indigo-600"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('domain', dom.id, dom.name)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{dom.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{dom.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COLLEGE EDIT / ADD MODAL */}
      {collegeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingCollege ? 'Edit College & Pricing' : 'Add New College & Fee'}
              </h3>
              <button onClick={() => setCollegeModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollege} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  College / Institution Name *
                </label>
                <input
                  type="text"
                  value={collegeForm.name}
                  onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                  placeholder="e.g. Government Engineering College"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  District Name
                </label>
                <input
                  type="text"
                  value={collegeForm.districtName}
                  onChange={(e) => setCollegeForm({ ...collegeForm, districtName: e.target.value })}
                  placeholder="e.g. Gaya / Jaipur / Patna"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dynamic Program Fee (INR) *
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
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-indigo-700 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Students selecting this college during signup will be billed this exact amount.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCollegeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save College</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERIC ITEM MODAL (DISTRICT, UNIVERSITY, DEGREE, DOMAIN) */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 capitalize">
                {editingItemId ? `Edit ${itemModalType}` : `Add New ${itemModalType}`}
              </h3>
              <button onClick={() => setItemModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 capitalize">
                  {itemModalType} Name *
                </label>
                <input
                  type="text"
                  value={itemFormName}
                  onChange={(e) => setItemFormName(e.target.value)}
                  placeholder={`Enter ${itemModalType} name`}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {itemModalType === 'domain' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={itemFormCategory}
                      onChange={(e) => setItemFormCategory(e.target.value)}
                      placeholder="e.g. Software, Core Engineering, Management"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={itemFormDesc}
                      onChange={(e) => setItemFormDesc(e.target.value)}
                      placeholder="Brief overview of curriculum and skills covered"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save {itemModalType}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
