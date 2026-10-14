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
  AlertCircle,
  MessageSquare,
  Building2,
  ShieldCheck,
  Headphones
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans text-left pt-28 pb-20">
      {/* Hero Banner with Breadcrumbs */}
      <section className="relative py-14 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-4">
            <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Contact Us</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Support & Partnerships Desk
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              We’re Here to Help You Succeed
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
              Have questions regarding registration, college fee tiers, nodal approvals, or technical domains? Get in touch with our team today.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Info + Form */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Details (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  Institutional Contact Information
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Our official administrative desk coordinates student support, college nodal communications, and institutional verifications.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Student Helpline & WhatsApp
                    </h3>
                    <p className="text-sm font-black text-slate-900">
                      +91 96939 21517
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Direct WhatsApp & Calling Desk (Mon-Sat)</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Official Support Email
                    </h3>
                    <p className="text-sm font-black text-slate-900">
                      support@ppointern.com
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Average reply time under 2 hours</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Operating Hours
                    </h3>
                    <p className="text-sm font-black text-slate-900">
                      Mon – Sat: 10:00 AM – 7:00 PM IST
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Sunday closed for scheduled portal maintenance</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Registered Tech Center
                    </h3>
                    <p className="text-sm font-black text-slate-900">
                      Tech Hub Park, Sector 62, Noida, Uttar Pradesh 201309
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Card with Student Achievement */}
              <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm relative group bg-white">
                <img
                  src="/images/student_achievement_4k.jpg"
                  alt="Certified Intern Receiving Accreditation"
                  className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-4 bg-white text-left">
                  <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Nodal Verification Guarantee</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Every inquiry logged is assigned a tracking ticket and resolved by our academic support desk within 24 business hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm text-left">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-slate-900">
                    Send an Inquiry
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Online Desk Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 font-medium">
                  Fill the form below and our academic desk will get back to you promptly.
                </p>

                {success && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-6 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>
                      Thank you! Your inquiry has been logged in our registry. Our team will contact you shortly.
                    </span>
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Priya Kumari"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="priya@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        College / Institution
                      </label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={e => setFormData({ ...formData, college: e.target.value })}
                        placeholder="e.g. A.N. College, Patna"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="General Student Inquiry">General Student Inquiry</option>
                      <option value="College Partnership / MoU">College Partnership / MoU</option>
                      <option value="Payment Verification Assistance">Payment Verification Assistance</option>
                      <option value="Offer Letter Ref ID Issue">Offer Letter Ref ID Issue</option>
                      <option value="Certificate Verification Query">Certificate Verification Query</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your question or issue in detail..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
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
