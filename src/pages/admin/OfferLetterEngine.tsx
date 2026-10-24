import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { OfferLetterTemplate, CohortBatch } from '../../types';
import { 
  FileCheck2, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Sparkles, 
  Save, 
  X, 
  Building2, 
  ShieldAlert, 
  Copy,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const DEFAULT_TEMPLATE_BODY = `We are pleased to accept your application and formally offer you an internship under the Patliputra University (PPU) Technical Internship Council. Our internship programmes are designed in full alignment with NEP-2020, AICTE and UGC Internship Guidelines, and Patliputra University's specific academic framework.`;

const PLACEHOLDERS = [
  { tag: '{{student_name}}', label: 'Student Name' },
  { tag: '{{registration_number}}', label: 'Reg Number' },
  { tag: '{{roll_number}}', label: 'Roll Number' },
  { tag: '{{college}}', label: 'College Name' },
  { tag: '{{department}}', label: 'Department' },
  { tag: '{{semester}}', label: 'Semester' },
  { tag: '{{domain}}', label: 'Internship Domain' },
  { tag: '{{company_name}}', label: 'Company / Organization' },
];

export default function OfferLetterEngine() {
  const [activeTab, setActiveTab] = useState<'templates' | 'batches'>('templates');
  const [templates, setTemplates] = useState<OfferLetterTemplate[]>([]);
  const [batches, setBatches] = useState<CohortBatch[]>([]);
  const [loading, setLoading] = useState(true);

  // Template Form State
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<OfferLetterTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState<OfferLetterTemplate>({
    id: '',
    templateName: 'Standard PPU NEP-2020 Template',
    companyName: 'Patliputra University (PPU) Technical Internship Council',
    signatoryName: 'Authorized Signatory',
    signatoryRole: 'Head of Academic Partnerships',
    headerImageUrl: '/images/offer_letter_header.png',
    footerImageUrl: '/images/document_footer.png',
    watermarkUrl: '',
    bodyTemplate: DEFAULT_TEMPLATE_BODY,
    version: 1,
    isDefault: true
  });

  // Batch Form State
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<CohortBatch | null>(null);
  const [batchForm, setBatchForm] = useState<CohortBatch>({
    id: '',
    batchName: 'Cohort Batch 1 (Count 1 - 2200)',
    templateId: '',
    allocationRule: 'count_range',
    minCount: 1,
    maxCount: 2200,
    targetColleges: [],
    assignedCount: 0,
    isReleased: true,
    status: 'active'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Templates
      const tSnap = await getDocs(collection(db, 'offer_templates')).catch(() => null);
      if (tSnap && !tSnap.empty) {
        setTemplates(tSnap.docs.map(d => ({ id: d.id, ...d.data() } as OfferLetterTemplate)));
      } else {
        // Initial Template baseline
        const baseTemplate: OfferLetterTemplate = {
          id: 'template_default',
          templateName: 'PPU NEP-2020 Standard Template (Default)',
          companyName: 'Patliputra University (PPU) Technical Internship Council',
          signatoryName: 'Authorized Signatory',
          signatoryRole: 'Head of Academic Partnerships',
          headerImageUrl: '/images/offer_letter_header.png',
          footerImageUrl: '/images/document_footer.png',
          bodyTemplate: DEFAULT_TEMPLATE_BODY,
          version: 1,
          isDefault: true
        };
        setTemplates([baseTemplate]);
      }

      // 2. Batches
      const bSnap = await getDocs(collection(db, 'batches')).catch(() => null);
      if (bSnap && !bSnap.empty) {
        setBatches(bSnap.docs.map(d => ({ id: d.id, ...d.data() } as CohortBatch)));
      } else {
        // Initial Cohort Batch baseline
        const baseBatch: CohortBatch = {
          id: 'batch_1',
          batchName: 'Batch 1 (Students 1 to 2200)',
          templateId: 'template_default',
          allocationRule: 'count_range',
          minCount: 1,
          maxCount: 2200,
          assignedCount: 0,
          isReleased: true,
          status: 'active'
        };
        setBatches([baseBatch]);
      }
    } catch (err) {
      console.warn('Error loading templates/batches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Template
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingTemplate?.id || `tpl_${Date.now()}`;
      const payload: OfferLetterTemplate = {
        ...templateForm,
        id,
        version: (editingTemplate?.version || 0) + 1,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'offer_templates', id), payload, { merge: true });
      
      setTemplates(prev => {
        const idx = prev.findIndex(t => t.id === id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = payload;
          return updated;
        }
        return [payload, ...prev];
      });

      setTemplateModalOpen(false);
      setEditingTemplate(null);
    } catch (err) {
      console.error('Error saving template:', err);
      alert('Failed to save template.');
    }
  };

  // Toggle Batch Release (Hold / Release)
  const handleToggleBatchRelease = async (batch: CohortBatch) => {
    try {
      const updatedStatus = !batch.isReleased;
      const bRef = doc(db, 'batches', batch.id);
      await setDoc(bRef, { isReleased: updatedStatus }, { merge: true });

      setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, isReleased: updatedStatus } : b));
    } catch (err) {
      console.error('Error toggling batch release:', err);
      alert('Failed to update release status.');
    }
  };

  // Save Batch
  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingBatch?.id || `batch_${Date.now()}`;
      const payload: CohortBatch = {
        ...batchForm,
        id,
        templateId: batchForm.templateId || templates[0]?.id || 'template_default',
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'batches', id), payload, { merge: true });

      setBatches(prev => {
        const idx = prev.findIndex(b => b.id === id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = payload;
          return updated;
        }
        return [payload, ...prev];
      });

      setBatchModalOpen(false);
      setEditingBatch(null);
    } catch (err) {
      console.error('Error saving batch:', err);
      alert('Failed to save batch.');
    }
  };

  // Delete Batch
  const handleDeleteBatch = async (id: string) => {
    if (!window.confirm('Delete this batch cohort rule?')) return;
    try {
      await deleteDoc(doc(db, 'batches', id));
      setBatches(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error deleting batch:', err);
    }
  };

  // Insert placeholder helper
  const insertPlaceholder = (tag: string) => {
    setTemplateForm(prev => ({
      ...prev,
      bodyTemplate: prev.bodyTemplate + ' ' + tag + ' '
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dynamic Offer Letter Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-template builder, variable placeholders, batch cohort rules (1-2200, 2201-4400), and release/hold controls
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeTab === 'templates' ? (
            <button
              onClick={() => {
                setEditingTemplate(null);
                setTemplateForm({
                  id: '',
                  templateName: `Template v${templates.length + 1}`,
                  companyName: 'Academic Internship Council',
                  signatoryName: 'Authorized Signatory',
                  signatoryRole: 'Director of Academic Affairs',
                  headerImageUrl: '/images/offer_letter_header.png',
                  footerImageUrl: '/images/offer_letter_footer.png',
                  watermarkUrl: '',
                  bodyTemplate: DEFAULT_TEMPLATE_BODY,
                  version: templates.length + 1,
                  isDefault: false
                });
                setTemplateModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Template</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingBatch(null);
                setBatchForm({
                  id: '',
                  batchName: `Batch ${batches.length + 1}`,
                  templateId: templates[0]?.id || '',
                  allocationRule: 'count_range',
                  minCount: 2201,
                  maxCount: 4400,
                  assignedCount: 0,
                  isReleased: false,
                  status: 'active'
                });
                setBatchModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Batch Cohort Rule</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'templates'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Letter Templates ({templates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('batches')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'batches'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Batch Cohort Rules & Holds ({batches.length})</span>
        </button>
      </div>

      {/* TAB 1: TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map(tpl => (
            <div key={tpl.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">
                      Version {tpl.version}
                    </span>
                    {tpl.isDefault && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTemplate(tpl);
                        setTemplateForm(tpl);
                        setTemplateModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {tpl.templateName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Issued By: <span className="font-semibold text-slate-700">{tpl.companyName}</span>
                </p>

                {/* Body Snippet */}
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 font-serif leading-relaxed line-clamp-4">
                  {tpl.bodyTemplate}
                </div>

                {/* Signatory */}
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs flex justify-between items-center text-slate-500">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Signatory</span>
                    <span className="font-semibold text-slate-800">{tpl.signatoryName}</span>
                    <span className="text-[11px] block">{tpl.signatoryRole}</span>
                  </div>
                  <div className="text-right text-[11px]">
                    <span className="text-slate-400">Header/Footer:</span>
                    <span className="font-medium text-emerald-600 ml-1">Configured</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BATCH COHORT ALLOCATION RULES */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Automated Batch Allocation & Download Protection Engine</p>
              <p className="mt-0.5">
                Students are partitioned into batches (e.g. 1–2200 get Template A, 2201–4400 get Template B).
                Toggle <strong>"Released / Hold"</strong> to control whether students in that cohort can currently download their Offer Letter PDF.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Batch Name</th>
                  <th className="py-3 px-4">Allocation Rule</th>
                  <th className="py-3 px-4">Linked Template</th>
                  <th className="py-3 px-4">Release Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map((b) => {
                  const linkedTpl = templates.find(t => t.id === b.templateId) || templates[0];
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{b.batchName}</p>
                        <p className="text-[11px] text-slate-400">ID: {b.id}</p>
                      </td>

                      <td className="py-3 px-4">
                        {b.allocationRule === 'count_range' ? (
                          <span className="font-semibold text-slate-700">
                            Student Range #{b.minCount} to #{b.maxCount}
                          </span>
                        ) : b.allocationRule === 'college' ? (
                          <span className="font-semibold text-slate-700">
                            College-Specific Rule
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-700">
                            Manual Student Assignment
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-indigo-600 font-semibold">
                        {linkedTpl?.templateName || 'Default Template'}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleBatchRelease(b)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                            b.isReleased
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}
                        >
                          {b.isReleased ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>RELEASED (Students Can Download)</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>ON HOLD (Download Disabled)</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingBatch(b);
                              setBatchForm(b);
                              setBatchModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBatch(b.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* TEMPLATE EDITOR MODAL WITH LIVE PREVIEW */}
      {templateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl my-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingTemplate ? 'Edit Offer Letter Template' : 'Create Offer Letter Template'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Customizable document template with live placeholder interpolation
                </p>
              </div>
              <button onClick={() => setTemplateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Controls */}
              <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={templateForm.templateName}
                      onChange={(e) => setTemplateForm({ ...templateForm, templateName: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Issuing Company / Authority
                    </label>
                    <input
                      type="text"
                      value={templateForm.companyName}
                      onChange={(e) => setTemplateForm({ ...templateForm, companyName: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Signatory Name
                    </label>
                    <input
                      type="text"
                      value={templateForm.signatoryName}
                      onChange={(e) => setTemplateForm({ ...templateForm, signatoryName: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Signatory Designation
                    </label>
                    <input
                      type="text"
                      value={templateForm.signatoryRole}
                      onChange={(e) => setTemplateForm({ ...templateForm, signatoryRole: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* Header and Footer Image Uploaders like prakriti */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                      Header Banner Image
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="w-full py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-center font-bold text-[10px] rounded-lg border border-indigo-200 transition">
                          Upload Header Image
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onload = ev => setTemplateForm(p => ({ ...p, headerImageUrl: ev.target?.result as string }));
                              r.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setTemplateForm(p => ({ ...p, headerImageUrl: '/images/offer_letter_header.png' }))}
                        className="text-[10px] text-slate-500 hover:text-slate-800"
                      >
                        Default
                      </button>
                    </div>
                    {templateForm.headerImageUrl && (
                      <img src={templateForm.headerImageUrl} alt="Header" className="mt-2 h-9 w-full object-contain border border-slate-200 rounded-md bg-white" />
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                      Footer Banner Image
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="w-full py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-center font-bold text-[10px] rounded-lg border border-indigo-200 transition">
                          Upload Footer Image
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onload = ev => setTemplateForm(p => ({ ...p, footerImageUrl: ev.target?.result as string }));
                              r.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setTemplateForm(p => ({ ...p, footerImageUrl: '/images/document_footer.png' }))}
                        className="text-[10px] text-slate-500 hover:text-slate-800"
                      >
                        Default
                      </button>
                    </div>
                    {templateForm.footerImageUrl && (
                      <img src={templateForm.footerImageUrl} alt="Footer" className="mt-2 h-9 w-full object-contain border border-slate-200 rounded-md bg-white" />
                    )}
                  </div>
                </div>

                {/* Standard Legal Body Notice */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Standardized Legal Body (NEP-2020 Compliant):</span>
                    <p className="mt-0.5 text-amber-800">
                      As mandated, the official offer letter body content remains strictly standardized for all students. You only need to configure the <strong>Header Banner</strong> and <strong>Footer Banner</strong> above.
                    </p>
                  </div>
                </div>

                {/* Body Textarea */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Standard Acceptance Paragraph (Fixed)
                  </label>
                  <textarea
                    rows={4}
                    readOnly
                    value={templateForm.bodyTemplate}
                    className="w-full p-3 bg-slate-100/70 border border-slate-200 rounded-xl font-mono text-[11px] leading-relaxed text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTemplateModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Template</span>
                  </button>
                </div>
              </form>

              {/* Real-time Live Letter Preview */}
              <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      Live Letter Preview
                    </span>
                    <span className="text-[10px] text-slate-400">Sample Candidate View</span>
                  </div>

                  <div className="bg-white text-slate-900 rounded-xl shadow-xs text-[11px] font-serif leading-relaxed border border-slate-200 overflow-hidden">
                    {templateForm.headerImageUrl ? (
                      <img src={templateForm.headerImageUrl} alt="Letter Header" className="w-full h-auto object-cover" />
                    ) : (
                      <div className="text-center py-3 px-6 bg-slate-50 border-b border-slate-200">
                        <p className="font-sans font-bold text-xs uppercase tracking-wider text-indigo-900">
                          {templateForm.companyName || 'COMPANY NAME'}
                        </p>
                        <p className="text-[9px] text-slate-500 font-sans">
                          NEP-2020 Aligned Academic Framework
                        </p>
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      <div className="flex justify-between text-[10px] text-slate-600 font-sans">
                        <span>Ref: INT/2026/OFFER/10482</span>
                        <span>Date: 14/10/2026</span>
                      </div>

                      <div className="text-[10px] font-sans">
                        <p className="font-bold">To: Aditi Sharma</p>
                        <p>Roll No: 21BCE1004 • GEC Jaipur</p>
                      </div>

                      <p className="font-sans font-bold text-[10px] text-slate-800">
                        SUBJECT: OFFER OF INTERNSHIP ENGAGEMENT
                      </p>

                      <p className="text-[10px] text-slate-700 whitespace-pre-wrap">
                        {templateForm.bodyTemplate
                          .replace(/{{student_name}}/g, 'Aditi Sharma')
                          .replace(/{{college}}/g, 'Government Engineering College')
                          .replace(/{{domain}}/g, 'Web Development & Full Stack')
                          .replace(/{{registration_number}}/g, '21BCE1004')
                          .replace(/{{roll_number}}/g, '21BCE1004')
                          .replace(/{{company_name}}/g, templateForm.companyName || 'Academic Internship Council')}
                      </p>

                      <div className="pt-4 border-t border-slate-200 flex justify-end font-sans">
                        <div className="text-right text-[10px]">
                          <p className="font-bold">{templateForm.signatoryName || 'Authorized Signatory'}</p>
                          <p className="text-slate-500">{templateForm.signatoryRole || 'Head of Affairs'}</p>
                        </div>
                      </div>
                    </div>

                    {templateForm.footerImageUrl && (
                      <img src={templateForm.footerImageUrl} alt="Letter Footer" className="w-full h-auto object-cover border-t border-slate-100" />
                    )}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mt-3 text-center">
                  This preview renders using the official PDF formatting dimensions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BATCH MODAL */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingBatch ? 'Edit Cohort Batch Rule' : 'New Cohort Batch Rule'}
              </h3>
              <button onClick={() => setBatchModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Batch Name
                </label>
                <input
                  type="text"
                  value={batchForm.batchName}
                  onChange={(e) => setBatchForm({ ...batchForm, batchName: e.target.value })}
                  placeholder="e.g. Batch 2: Roll Count 2201 - 4400"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Linked Offer Letter Template
                </label>
                <select
                  value={batchForm.templateId}
                  onChange={(e) => setBatchForm({ ...batchForm, templateId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.templateName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Allocation Rule Type
                </label>
                <select
                  value={batchForm.allocationRule}
                  onChange={(e) => setBatchForm({ ...batchForm, allocationRule: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="count_range">Candidate Count Range (e.g. 1 to 2200)</option>
                  <option value="college">College Affiliation Rule</option>
                  <option value="manual">Manual Admin Assignment</option>
                </select>
              </div>

              {batchForm.allocationRule === 'count_range' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Min Count</label>
                    <input
                      type="number"
                      value={batchForm.minCount || 1}
                      onChange={(e) => setBatchForm({ ...batchForm, minCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Count</label>
                    <input
                      type="number"
                      value={batchForm.maxCount || 2200}
                      onChange={(e) => setBatchForm({ ...batchForm, maxCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={batchForm.isReleased}
                    onChange={(e) => setBatchForm({ ...batchForm, isReleased: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Release Offer Letters to Students</span>
                </label>
                <p className="text-[10px] text-slate-400 mt-1 pl-6">
                  If unchecked, students in this cohort will see an "On Hold" banner instead of the download button.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Batch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
