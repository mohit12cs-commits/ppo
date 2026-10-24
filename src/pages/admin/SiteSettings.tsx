import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SiteSettings as SiteSettingsType, RazorpaySettings } from '../../types';
import { DEFAULT_SITE_SETTINGS, DEFAULT_RAZORPAY_SETTINGS } from '../../lib/constants';
import { 
  Settings, 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  BarChart3, 
  HelpCircle, 
  MessageSquareQuote, 
  Plus, 
  Trash2, 
  CheckCircle2,
  Sparkles,
  CreditCard,
  Key,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function SiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsType>(DEFAULT_SITE_SETTINGS as SiteSettingsType);
  const [razorpay, setRazorpay] = useState<RazorpaySettings>(DEFAULT_RAZORPAY_SETTINGS as RazorpaySettings);
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const [sDoc, rzpDoc] = await Promise.all([
          getDoc(doc(db, 'settings', 'general')),
          getDoc(doc(db, 'settings', 'razorpay'))
        ]);

        if (sDoc.exists()) {
          const sData = sDoc.data() as SiteSettingsType;
          setSettings({ ...DEFAULT_SITE_SETTINGS, ...sData } as SiteSettingsType);
          if (sData.razorpay) {
            setRazorpay({ ...DEFAULT_RAZORPAY_SETTINGS, ...sData.razorpay } as RazorpaySettings);
          }
        }

        if (rzpDoc.exists()) {
          const rzpData = rzpDoc.data() as RazorpaySettings;
          setRazorpay(prev => ({ ...prev, ...rzpData }));
        }
      } catch (err) {
        console.warn('Error fetching settings, using baseline:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const nowIso = new Date().toISOString();
      const updatedRazorpay: RazorpaySettings = {
        ...razorpay,
        updatedAt: nowIso,
        updatedBy: 'Admin Console'
      };

      const updatedSettings: SiteSettingsType = {
        ...settings,
        razorpay: updatedRazorpay
      };

      // 1. Save general settings document
      await setDoc(doc(db, 'settings', 'general'), updatedSettings, { merge: true });

      // 2. Save dedicated razorpay settings document
      await setDoc(doc(db, 'settings', 'razorpay'), updatedRazorpay, { merge: true });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Error saving site settings:', err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  // FAQ helpers
  const handleAddFaq = () => {
    setSettings(prev => ({
      ...prev,
      faqs: [...prev.faqs, { q: 'New Question', a: 'Detailed answer here...', category: 'General' }]
    }));
  };

  const handleRemoveFaq = (index: number) => {
    setSettings(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleFaqChange = (index: number, field: 'q' | 'a', value: string) => {
    setSettings(prev => {
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs">Loading site configuration & gateway keys...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Site Settings & Gateway Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Razorpay API keys, Patliputra University branding, support contacts, and public metrics
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings & Razorpay keys saved to database!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8 text-xs">

        {/* 1. RAZORPAY PAYMENT GATEWAY INTEGRATION */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Razorpay Payment Gateway API Keys
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    razorpay.keyId 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {razorpay.keyId ? 'Keys Configured in DB' : 'Sandbox Simulation'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure real Razorpay credentials directly in the Firestore database for student fees
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-700">
                {razorpay.enabled ? 'Live Gateway Active' : 'Gateway Disabled'}
              </span>
              <button
                type="button"
                onClick={() => setRazorpay(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  razorpay.enabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    razorpay.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Razorpay Key ID *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={razorpay.keyId}
                    onChange={(e) => setRazorpay(prev => ({ ...prev, keyId: e.target.value.trim() }))}
                    placeholder="rzp_live_... or rzp_test_..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Find your Key ID in Razorpay Dashboard → Settings → API Keys.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Razorpay Key Secret (Stored Securely in DB)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showSecret ? "text" : "password"}
                    value={razorpay.keySecret || ''}
                    onChange={(e) => setRazorpay(prev => ({ ...prev, keySecret: e.target.value.trim() }))}
                    placeholder="Enter Razorpay Secret Key"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Managed exclusively through database permissions without client local storage.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Gateway Mode
                </label>
                <select
                  value={razorpay.mode}
                  onChange={(e) => setRazorpay(prev => ({ ...prev, mode: e.target.value as 'live' | 'test' }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="live">Live Production Mode</option>
                  <option value="test">Test / Sandbox Mode</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Merchant Account Name on Checkout
                </label>
                <input
                  type="text"
                  value={razorpay.accountName}
                  onChange={(e) => setRazorpay(prev => ({ ...prev, accountName: e.target.value }))}
                  placeholder="e.g. Patliputra University (PPU)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Theme Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={razorpay.themeColor || '#4f46e5'}
                    onChange={(e) => setRazorpay(prev => ({ ...prev, themeColor: e.target.value }))}
                    className="w-9 h-9 p-0.5 rounded-xl border border-slate-200 cursor-pointer bg-white"
                  />
                  <input
                    type="text"
                    value={razorpay.themeColor || '#4f46e5'}
                    onChange={(e) => setRazorpay(prev => ({ ...prev, themeColor: e.target.value }))}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Landing Page Stats Strip Configuration */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-5">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Landing Page Stats Strip Metrics
              </h3>
              <p className="text-[11px] text-slate-400">
                These numbers display on the public homepage to establish trust and credibility
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Students Enrolled (Count)
              </label>
              <input
                type="number"
                value={settings.statsStudentsEnrolled}
                onChange={(e) => setSettings({ ...settings, statsStudentsEnrolled: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Partner Colleges (Count)
              </label>
              <input
                type="number"
                value={settings.statsColleges}
                onChange={(e) => setSettings({ ...settings, statsColleges: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Universities Affiliated
              </label>
              <input
                type="number"
                value={settings.statsUniversities}
                onChange={(e) => setSettings({ ...settings, statsUniversities: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Certificates Issued
              </label>
              <input
                type="number"
                value={settings.statsCertificatesIssued}
                onChange={(e) => setSettings({ ...settings, statsCertificatesIssued: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* 3. Official Contact Particulars */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-5">
            <Phone className="w-5 h-5 text-cyan-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Contact & Support Details (Patliputra University)
              </h3>
              <p className="text-[11px] text-slate-400">
                Shown on Contact Us page, footer, and offer letters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Support Helpline Phone
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Support Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Campus / Office Address
              </label>
              <input
                type="text"
                value={settings.officeAddress}
                onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Working Support Hours
              </label>
              <input
                type="text"
                value={settings.supportHours}
                onChange={(e) => setSettings({ ...settings, supportHours: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 4. FAQ Accordion Manager */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Frequently Asked Questions (FAQ) Manager
                </h3>
                <p className="text-[11px] text-slate-400">
                  Update answers rendered across Home and How-It-Works pages
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddFaq}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center gap-1 hover:bg-indigo-100 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {settings.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  className="absolute top-3 right-3 p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  title="Remove FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="space-y-2 pr-8">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">Question #{idx + 1}</label>
                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">Answer</label>
                    <textarea
                      rows={2}
                      value={faq.a}
                      onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save All Settings & Razorpay Keys</span>
          </button>
        </div>

      </form>
    </div>
  );
}
