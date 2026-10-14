import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  Building2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    subject: 'General Student Inquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, email address, and message.');
      return;
    }

    setLoading(true);

    try {
      // Save directly to Firestore 'inquiries' collection for Admin review
      await addDoc(collection(db, 'inquiries'), {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
        status: 'unread',
        createdAt: new Date().toISOString()
      });

      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        college: '',
        subject: 'General Student Inquiry',
        message: ''
      });
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      setError(err?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-800 pt-28 pb-20">
      {/* Hero Banner with Breadcrumbs */}
      <section className="relative py-16 border-b border-slate-800/80 light:border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-4">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span>Contact Us</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Support & Partnerships Desk
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white light:text-slate-900 tracking-tight mt-3 mb-5">
              We’re Here to Help You Succeed
            </h1>
            <p className="text-base sm:text-lg text-slate-300 light:text-slate-600 leading-relaxed">
              Have questions regarding registration, college fee tiers, nodal approvals, or technical domains? Get in touch with our team today.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Info + Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white light:text-slate-900 mb-2">
                  Institutional Contact Information
                </h2>
                <p className="text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                  Our official administrative desk coordinates student support and college partnerships.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 light:bg-white border border-slate-800/80 light:border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Student Helpline
                    </h3>
                    <p className="text-sm font-semibold text-white light:text-slate-900">
                      +91 96939 21517
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Direct WhatsApp & Calling Desk</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 light:bg-white border border-slate-800/80 light:border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Official Support Email
                    </h3>
                    <p className="text-sm font-semibold text-white light:text-slate-900">
                      support@ppointern.com
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Average reply time under 2 hours</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 light:bg-white border border-slate-800/80 light:border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Operating Hours
                    </h3>
                    <p className="text-sm font-semibold text-white light:text-slate-900">
                      Mon – Sat: 10:00 AM – 7:00 PM IST
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Sunday closed for maintenance</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 light:bg-white border border-slate-800/80 light:border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Registered Tech Center
                    </h3>
                    <p className="text-sm font-semibold text-white light:text-slate-900">
                      Tech Hub Park, Sector 62, Noida, Uttar Pradesh 201309
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="p-6 rounded-2xl bg-slate-900/40 light:bg-white border border-slate-800 light:border-slate-200 text-center">
                <MapPin className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-75" />
                <p className="text-xs font-semibold text-slate-300 light:text-slate-700">
                  National Operations & Server Center
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Institutional coordination across all state university zones
                </p>
              </div>
            </div>

            {/* Interactive Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/70 light:bg-white border border-slate-800/80 light:border-slate-200 shadow-xl">
                <h3 className="text-xl font-bold text-white light:text-slate-900 mb-2">
                  Send an Inquiry
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mb-6">
                  Fill the form below and our academic desk will get back to you promptly.
                </p>

                {success && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-6 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>
                      Thank you! Your inquiry has been logged in our registry. Our team will contact you shortly.
                    </span>
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Priya Kumari"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="priya@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        College / Institution
                      </label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={e => setFormData({ ...formData, college: e.target.value })}
                        placeholder="e.g. A.N. College, Patna"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="General Student Inquiry">General Student Inquiry</option>
                      <option value="College Partnership / MoU">College Partnership / MoU</option>
                      <option value="Payment Verification Assistance">Payment Verification Assistance</option>
                      <option value="Offer Letter Ref ID Issue">Offer Letter Ref ID Issue</option>
                      <option value="Certificate Verification Query">Certificate Verification Query</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your question or issue in detail..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
