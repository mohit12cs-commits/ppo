import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { College, University, District, Degree, CourseDomain } from '../../types';
import { 
  INITIAL_COLLEGES, 
  INITIAL_UNIVERSITIES, 
  INITIAL_DISTRICTS, 
  DEGREES, 
  INITIAL_DEGREES,
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
  BookOpen,
  Search,
  Check,
  RefreshCw,
  FolderPlus
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

  // Subject & Department Management state
  const [selectedDegreeName, setSelectedDegreeName] = useState('');
  const [newSubjectInput, setNewSubjectInput] = useState('');
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [creatingNewDept, setCreatingNewDept] = useState(false);
  const [editingDegreeId, setEditingDegreeId] = useState<string | null>(null);
  const [editSubjects, setEditSubjects] = useState<string[]>([]);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [inlineNewSubjectMap, setInlineNewSubjectMap] = useState<Record<string, string>>({});

  // College Inline & Modal State (includes Price & District)
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeDistrictId, setNewCollegeDistrictId] = useState('');
  const [newCollegePrice, setNewCollegePrice] = useState<number | string>(1000);
  const [addingCollegeLoading, setAddingCollegeLoading] = useState(false);

  const [collegeModalOpen, setCollegeModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [collegeForm, setCollegeForm] = useState<{ name: string; districtName: string; districtId: string; price: number | string }>({
    name: '',
    districtName: '',
    districtId: '',
    price: 1000
  });

  // Generic Item Modal (for District, University, Degree, Domain)
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemModalType, setItemModalType] = useState<'district' | 'university' | 'degree' | 'domain'>('district');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemFormName, setItemFormName] = useState('');
  const [itemFormCategory, setItemFormCategory] = useState('');
  const [itemFormDesc, setItemFormDesc] = useState('');
  const [itemFormSubjects, setItemFormSubjects] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Colleges
      const colSnap = await getDocs(collection(db, 'colleges')).catch(() => null);
      if (colSnap && !colSnap.empty) {
        const loaded = colSnap.docs.map(d => ({ id: d.id, ...d.data() } as College));
        loaded.sort((a, b) => {
          const tA = new Date((a as any).createdAt || 0).getTime();
          const tB = new Date((b as any).createdAt || 0).getTime();
          if (tA && tB && tA !== tB) return tB - tA;
          return (b.id || '').localeCompare(a.id || '');
        });
        setColleges(loaded);
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

      // 4. Degrees (Departments & Subjects)
      const degSnap = await getDocs(collection(db, 'degrees')).catch(() => null);
      if (degSnap && !degSnap.empty) {
        const loaded = degSnap.docs.map(d => {
          const data = d.data();
          const fallback = INITIAL_DEGREES.find(id => id.name.toLowerCase() === (data.name || '').toLowerCase());
          const subjects = (Array.isArray(data.subjects) && data.subjects.length > 0)
            ? data.subjects
            : (fallback?.subjects || []);
          return {
            id: d.id,
            name: data.name || '',
            subjects
          } as Degree;
        });
        const missingInitial = (INITIAL_DEGREES as Degree[]).filter(
          init => !loaded.some(l => l.name.toLowerCase() === init.name.toLowerCase())
        );
        setDegrees([...loaded, ...missingInitial]);
      } else {
        setDegrees(INITIAL_DEGREES as Degree[]);
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
  const handleInlineAddCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName.trim() || !newCollegeDistrictId) {
      alert('Please enter college name and select a district.');
      return;
    }

    setAddingCollegeLoading(true);
    try {
      const id = `col_${Date.now()}`;
      const matchedDist = districts.find(d => d.id === newCollegeDistrictId);
      const districtName = matchedDist?.name || '';
      const numPrice = Number(newCollegePrice);
      const price = !isNaN(numPrice) && numPrice >= 0 ? numPrice : 1000;

      const payload: College = {
        id,
        name: newCollegeName.trim(),
        districtId: newCollegeDistrictId,
        districtName,
        price,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'colleges', id), payload, { merge: true });
      setColleges(prev => [payload, ...prev]);
      setNewCollegeName('');
      setNewCollegeDistrictId('');
      setNewCollegePrice(1000);
    } catch (err) {
      console.error('Error adding college:', err);
      alert('Failed to add college.');
    } finally {
      setAddingCollegeLoading(false);
    }
  };

  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeForm.name.trim()) return;

    try {
      const id = editingCollege?.id || `col_${Date.now()}`;
      const matchedDist = districts.find(d => 
        (collegeForm.districtId && d.id === collegeForm.districtId) || 
        (collegeForm.districtName && d.name.toLowerCase() === collegeForm.districtName.toLowerCase())
      );
      const districtName = matchedDist?.name || collegeForm.districtName.trim();
      const districtId = matchedDist?.id || collegeForm.districtId || '';
      const numPrice = Number(collegeForm.price);
      const price = !isNaN(numPrice) && numPrice >= 0 ? numPrice : 1000;

      const payload: College = {
        id,
        name: collegeForm.name.trim(),
        districtId,
        districtName,
        price,
        status: 'active',
        createdAt: (editingCollege as any)?.createdAt || new Date().toISOString()
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
    setItemFormSubjects('');
    setItemModalOpen(true);
  };

  const handleOpenEditItem = (type: 'district' | 'university' | 'degree' | 'domain', item: any) => {
    setItemModalType(type);
    setEditingItemId(item.id);
    setItemFormName(item.name || '');
    setItemFormCategory(item.category || '');
    setItemFormDesc(item.description || '');
    setItemFormSubjects(Array.isArray(item.subjects) ? item.subjects.join(', ') : '');
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

    if (itemModalType === 'degree') {
      const subjectsList = itemFormSubjects
        ? itemFormSubjects.split(',').map(s => s.trim()).filter(Boolean)
        : (editingItemId ? (degrees.find(d => d.id === editingItemId)?.subjects || []) : []);
      payload.subjects = subjectsList;
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

  // --- Department & Subjects Actions ---
  const handleAddSubjectToDegree = async (e: React.FormEvent) => {
    e.preventDefault();
    const deptName = creatingNewDept ? newDepartmentName.trim() : selectedDegreeName.trim();
    const subjectName = newSubjectInput.trim();
    if (!deptName || !subjectName) return;

    try {
      const existing = degrees.find(d => d.name.toLowerCase() === deptName.toLowerCase());
      if (existing) {
        const currentSubjects = Array.isArray(existing.subjects) ? existing.subjects : [];
        if (!currentSubjects.includes(subjectName)) {
          const updatedSubjects = [...currentSubjects, subjectName];
          await setDoc(doc(db, 'degrees', existing.id), { ...existing, subjects: updatedSubjects }, { merge: true });
          setDegrees(prev => prev.map(d => d.id === existing.id ? { ...d, subjects: updatedSubjects } : d));
        }
      } else {
        const id = `deg_${Date.now()}`;
        const newPayload: Degree = {
          id,
          name: deptName,
          subjects: [subjectName]
        };
        await setDoc(doc(db, 'degrees', id), newPayload);
        setDegrees(prev => [newPayload, ...prev]);
      }
      setNewSubjectInput('');
      setNewDepartmentName('');
      setCreatingNewDept(false);
    } catch (err) {
      console.error('Error adding subject:', err);
      alert('Failed to add subject.');
    }
  };

  const handleDeleteSubjectFromDegree = async (degree: Degree, index: number) => {
    const subjectToDelete = degree.subjects?.[index];
    if (!subjectToDelete) return;
    if (!window.confirm(`Delete subject "${subjectToDelete}" from ${degree.name}?`)) return;

    try {
      const updated = (degree.subjects || []).filter((_, i) => i !== index);
      await setDoc(doc(db, 'degrees', degree.id), { ...degree, subjects: updated }, { merge: true });
      setDegrees(prev => prev.map(d => d.id === degree.id ? { ...d, subjects: updated } : d));
    } catch (err) {
      console.error('Error deleting subject:', err);
      alert('Failed to delete subject.');
    }
  };

  const handleStartEditSubjects = (degree: Degree) => {
    setEditingDegreeId(degree.id);
    setEditSubjects([...(degree.subjects || [])]);
  };

  const handleSaveEditSubjects = async (degreeId: string) => {
    try {
      const cleaned = editSubjects.map(s => s.trim()).filter(Boolean);
      const degree = degrees.find(d => d.id === degreeId);
      if (!degree) return;
      await setDoc(doc(db, 'degrees', degreeId), { ...degree, subjects: cleaned }, { merge: true });
      setDegrees(prev => prev.map(d => d.id === degreeId ? { ...d, subjects: cleaned } : d));
      setEditingDegreeId(null);
      setEditSubjects([]);
    } catch (err) {
      console.error('Error saving subjects:', err);
      alert('Failed to save subjects.');
    }
  };

  const handleCancelEditSubjects = () => {
    setEditingDegreeId(null);
    setEditSubjects([]);
  };

  const handleAddInlineSubject = () => {
    setEditSubjects(prev => [...prev, '']);
  };

  const handleRemoveInlineSubject = (index: number) => {
    setEditSubjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleInlineSubjectChange = (index: number, val: string) => {
    setEditSubjects(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleQuickAddSubjectInline = async (degree: Degree) => {
    const text = (inlineNewSubjectMap[degree.id] || '').trim();
    if (!text) return;

    try {
      const current = Array.isArray(degree.subjects) ? degree.subjects : [];
      if (!current.includes(text)) {
        const updated = [...current, text];
        await setDoc(doc(db, 'degrees', degree.id), { ...degree, subjects: updated }, { merge: true });
        setDegrees(prev => prev.map(d => d.id === degree.id ? { ...d, subjects: updated } : d));
      }
      setInlineNewSubjectMap(prev => ({ ...prev, [degree.id]: '' }));
    } catch (err) {
      console.error('Error quick adding subject:', err);
      alert('Failed to quick add subject.');
    }
  };

  const handleSeedDefaultDegrees = async () => {
    if (!window.confirm('Populate / restore standard curriculum Departments & Subjects in Firestore?')) return;
    setSeedingLoading(true);
    try {
      for (const item of INITIAL_DEGREES) {
        await setDoc(doc(db, 'degrees', item.id), item, { merge: true });
      }
      await loadData();
      alert('Standard departments and subjects successfully seeded!');
    } catch (err) {
      console.error('Error seeding degrees:', err);
      alert('Failed to seed defaults.');
    } finally {
      setSeedingLoading(false);
    }
  };

  // Filtered degrees based on search query
  const filteredDegrees = degrees.filter(deg => {
    if (!subjectSearch.trim()) return true;
    const q = subjectSearch.toLowerCase();
    const deptMatches = deg.name.toLowerCase().includes(q);
    const subjectMatches = (deg.subjects || []).some(s => s.toLowerCase().includes(q));
    return deptMatches || subjectMatches;
  });

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
                setCollegeForm({
                  name: '',
                  districtName: districts[0]?.name || '',
                  districtId: districts[0]?.id || '',
                  price: 1000
                });
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSeedDefaultDegrees}
                disabled={seedingLoading}
                className="px-3.5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                title="Populate standard curriculum departments & subjects"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${seedingLoading ? 'animate-spin' : ''}`} />
                <span>Restore Standard Data</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenAddItem('degree')}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Department</span>
              </button>
            </div>
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
          <span>Degrees & Subjects</span>
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
        <div className="space-y-6">
          {/* Dedicated Add New College Form with District Select Option */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  <span>Add New Affiliated College</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select the governing district, enter the college name, and set the dynamic student fee (supports custom amounts like ₹1 or ₹1,000).
                </p>
              </div>
            </div>

            <form onSubmit={handleInlineAddCollege} noValidate className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end text-xs">
              <div className="sm:col-span-5">
                <label className="block font-semibold text-slate-700 mb-1">
                  College / Institution Name *
                </label>
                <input
                  type="text"
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                  placeholder="e.g. TPS College, Patna"
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block font-semibold text-slate-700 mb-1">
                  Select District *
                </label>
                <select
                  value={newCollegeDistrictId}
                  onChange={(e) => setNewCollegeDistrictId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="">-- Choose District --</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Fee (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={newCollegePrice}
                    onChange={(e) => setNewCollegePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    placeholder="1000"
                    className="w-full pl-7 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-700 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <button
                  type="submit"
                  disabled={addingCollegeLoading}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-1 shadow-md shadow-indigo-600/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </form>
          </div>

          {/* Colleges Directory Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Affiliated Colleges & Dynamic Student Fee Directory ({colleges.length})
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Students selecting each college are billed its configured institutional fee at checkout
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
                        {col.districtName || districts.find(d => d.id === col.districtId)?.name || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                          <IndianRupee className="w-3.5 h-3.5" />
                          <span>
                            {col.price !== undefined && col.price !== null && Number(col.price) >= 1
                              ? Number(col.price).toLocaleString('en-IN')
                              : 1000}
                          </span>
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
                              const matchedDist = districts.find(d => 
                                (col.districtId && d.id === col.districtId) || 
                                (col.districtName && d.name.toLowerCase() === col.districtName.toLowerCase())
                              );
                              setCollegeForm({
                                name: col.name,
                                districtName: col.districtName || matchedDist?.name || '',
                                districtId: col.districtId || matchedDist?.id || '',
                                price: col.price !== undefined && col.price !== null && Number(col.price) >= 0
                                  ? Number(col.price)
                                  : 1000
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

      {/* TAB 4: DEPARTMENTS & SUBJECTS */}
      {activeTab === 'degrees' && (
        <div className="space-y-6">
          {/* Quick Add Subject / Degree Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  <span>Add Option Subject to Degree</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Configure degrees and their respective option subjects. These option subjects directly populate the student registration subject dropdown when this degree is selected.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreatingNewDept(!creatingNewDept)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer self-start sm:self-center"
              >
                {creatingNewDept ? '← Choose Existing Degree' : '+ Create New Degree'}
              </button>
            </div>

            <form onSubmit={handleAddSubjectToDegree} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end text-xs">
              {creatingNewDept ? (
                <div className="sm:col-span-4">
                  <label className="block font-semibold text-slate-700 mb-1">
                    New Degree Name *
                  </label>
                  <input
                    type="text"
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    placeholder="e.g. B.Tech / B.E., B.Sc., or BCA"
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ) : (
                <div className="sm:col-span-4">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Degree *
                  </label>
                  <select
                    value={selectedDegreeName}
                    onChange={(e) => setSelectedDegreeName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">-- Choose Degree --</option>
                    {degrees.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.subjects?.length || 0} subjects)</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="sm:col-span-5">
                <label className="block font-semibold text-slate-700 mb-1">
                  Option Subject / Specialization Name *
                </label>
                <input
                  type="text"
                  value={newSubjectInput}
                  onChange={(e) => setNewSubjectInput(e.target.value)}
                  placeholder="e.g. Computer Science, Botany, Mathematics"
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subject</span>
                </button>
              </div>
            </form>
          </div>

          {/* Search & Overview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                All Degrees ({filteredDegrees.length})
              </span>
              <span className="text-[11px] text-slate-500">
                • {filteredDegrees.reduce((acc, d) => acc + (d.subjects?.length || 0), 0)} Total Option Subjects
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                placeholder="Filter degree or option subject..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
              />
              {subjectSearch && (
                <button onClick={() => setSubjectSearch('')} className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Departments & Subjects Cards */}
          {filteredDegrees.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No departments or subjects match your search.</p>
              <button
                type="button"
                onClick={handleSeedDefaultDegrees}
                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
              >
                Populate Standard Master Data
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDegrees.map(deg => {
                const isEditing = editingDegreeId === deg.id;
                const subjects = Array.isArray(deg.subjects) ? deg.subjects : [];

                return (
                  <div key={deg.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition hover:border-indigo-200">
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">{deg.name}</h4>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {subjects.length} {subjects.length === 1 ? 'Option Subject' : 'Option Subjects'} Configured
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {!isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartEditSubjects(deg)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit List</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem('degree', deg.id, deg.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Degree"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSaveEditSubjects(deg.id)}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEditSubjects}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Card Content: Editing Mode vs Display Mode */}
                    <div className="pt-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                            {editSubjects.map((subject, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                                <input
                                  type="text"
                                  value={subject}
                                  onChange={(e) => handleInlineSubjectChange(idx, e.target.value)}
                                  placeholder="Option subject name"
                                  className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-indigo-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveInlineSubject(idx)}
                                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                                  title="Remove subject"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={handleAddInlineSubject}
                            className="px-3 py-1.5 rounded-xl border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Another Option Subject</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex flex-wrap gap-2 items-center">
                            {subjects.length > 0 ? (
                              subjects.map((subj, idx) => (
                                <span
                                  key={`${subj}-${idx}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-800 rounded-xl text-xs font-bold border border-indigo-100 transition"
                                >
                                  <span>{subj}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubjectFromDegree(deg, idx)}
                                    className="w-4 h-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:text-rose-600 hover:bg-white transition cursor-pointer"
                                    title={`Delete ${subj}`}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">No option subjects added yet to this degree</span>
                            )}

                            {/* Quick Inline Add Badge */}
                            <div className="inline-flex items-center gap-1">
                              <input
                                type="text"
                                placeholder="+ Quick add subject..."
                                value={inlineNewSubjectMap[deg.id] || ''}
                                onChange={(e) => setInlineNewSubjectMap({ ...inlineNewSubjectMap, [deg.id]: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleQuickAddSubjectInline(deg);
                                  }
                                }}
                                className="h-7 px-2.5 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-36 font-semibold"
                              />
                              {(inlineNewSubjectMap[deg.id] || '').trim() && (
                                <button
                                  type="button"
                                  onClick={() => handleQuickAddSubjectInline(deg)}
                                  className="h-7 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold flex items-center gap-0.5 cursor-pointer shadow-xs"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

            <form onSubmit={handleSaveCollege} noValidate className="space-y-4 text-xs">
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
                  District / Region *
                </label>
                <select
                  value={collegeForm.districtName}
                  onChange={(e) => {
                    const selName = e.target.value;
                    const matched = districts.find(d => d.name === selName);
                    setCollegeForm({
                      ...collegeForm,
                      districtName: selName,
                      districtId: matched?.id || ''
                    });
                  }}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
                >
                  <option value="">Select District</option>
                  {collegeForm.districtName && !districts.some(d => d.name === collegeForm.districtName) && (
                    <option value={collegeForm.districtName}>{collegeForm.districtName}</option>
                  )}
                  {districts.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Students selecting this district during registration will see this college and its associated fee.
                </p>
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
                    onChange={(e) => setCollegeForm({ ...collegeForm, price: e.target.value === '' ? '' : Number(e.target.value) })}
                    required
                    min={0}
                    step="1"
                    placeholder="e.g. 1 or 1000"
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

              {itemModalType === 'degree' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subjects (Comma-separated)
                  </label>
                  <textarea
                    rows={3}
                    value={itemFormSubjects}
                    onChange={(e) => setItemFormSubjects(e.target.value)}
                    placeholder="e.g. Computer Science, Botany, Chemistry, Mathematics"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Separate subjects with commas.</p>
                </div>
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
