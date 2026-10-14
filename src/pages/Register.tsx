import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import {
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  User,
  Users,
  AlertCircle,
  Mail,
  Phone,
  Building2,
  Lock,
  FileText,
  CheckCircle2,
  Sparkles,
  Check,
  Award,
  Headset,
  IndianRupee,
  Clock
} from 'lucide-react';
import {
  DEGREES,
  GENDERS,
  SEMESTERS,
  REGISTRATION_SESSIONS,
  INTERNSHIP_DOMAINS,
  INITIAL_COLLEGES,
  INITIAL_UNIVERSITIES,
  INITIAL_DISTRICTS
} from '../lib/constants';
import { College, University, District } from '../types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefillNotice, setPrefillNotice] = useState<string | null>(null);

  // Master Data
  const [districts, setDistricts] = useState<District[]>(INITIAL_DISTRICTS);
  const [colleges, setColleges] = useState<College[]>(INITIAL_COLLEGES as unknown as College[]);
  const [universities, setUniversities] = useState<University[]>(INITIAL_UNIVERSITIES as unknown as University[]);
  const [collegePrice, setCollegePrice] = useState<number>(1000);

  // Roll verification state
  const [inputRoll, setInputRoll] = useState(searchParams.get('roll') || '');
  const [verifyingRoll, setVerifyingRoll] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male',
    parentName: '',
    contactNumber: '',
    email: '',
    district: '',
    college: '',
    university: '',
    degree: 'B.Tech / B.E.',
    department: 'Computer Science',
    subject: 'Computer Science & Engineering',
    session: '2023-27',
    semester: 'Semester 5',
    universityRoll: '',
    universityRollNo: '',
    industrialRegNo: '',
    internshipDomain: searchParams.get('domain') || 'Web Development & Full Stack',
    internshipMode: 'Online',
    password: '',
    confirmPassword: '',
    terms: false,
    demoAutoPay: true
  });

  // Load Master Data from Firestore
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [distSnap, colSnap, uniSnap] = await Promise.all([
          getDocs(query(collection(db, 'districts'), orderBy('name'))),
          getDocs(collection(db, 'colleges')),
          getDocs(query(collection(db, 'universities'), orderBy('name')))
        ]);

        if (!distSnap.empty) {
          setDistricts(distSnap.docs.map(d => ({ id: d.id, ...d.data() } as District)));
        }
        if (!colSnap.empty) {
          const list = colSnap.docs.map(d => ({ id: d.id, ...d.data() } as College));
          setColleges(list);
        }
        if (!uniSnap.empty) {
          setUniversities(uniSnap.docs.map(d => ({ id: d.id, ...d.data() } as University)));
        }
      } catch (err) {
        console.warn('Master data fetch note:', err);
      }
    };
    fetchMasterData();
  }, []);

  // Update dynamic price whenever selected college changes
  const handleCollegeSelect = (collegeName: string) => {
    const matched = colleges.find(c => c.name.toLowerCase() === collegeName.toLowerCase());
    const price = matched && Number(matched.price) > 0 ? Number(matched.price) : 1000;
    setCollegePrice(price);
    setFormData(prev => ({ ...prev, college: collegeName }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setError(null);

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === 'college') {
      handleCollegeSelect(value);
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Roll pre-verification
  const handleVerifyRoll = async (rollParam?: string) => {
    const roll = (rollParam || inputRoll).trim();
    if (!roll) {
      setError('Please enter a Registration Number to verify.');
      return;
    }

    setVerifyingRoll(true);
    setError(null);
    setPrefillNotice(null);

    try {
      const q = query(collection(db, 'importedStudents'), where('universityRoll', '==', roll));
      const snap = await getDocs(q);

      if (snap.empty) {
        setError('No institutional record found for this roll number. Please fill in your details manually.');
        setFormData(prev => ({ ...prev, universityRoll: roll }));
        return;
      }

      const data = snap.docs[0].data();
      setFormData(prev => ({
        ...prev,
        fullName: data.fullName || prev.fullName,
        parentName: data.parentName || prev.parentName,
        email: data.email || prev.email,
        contactNumber: data.contactNumber || prev.contactNumber,
        gender: data.gender || prev.gender,
        district: data.district || prev.district,
        college: data.college || prev.college,
        university: data.university || prev.university,
        degree: data.degree || prev.degree,
        department: data.department || prev.department,
        subject: data.subject || prev.subject,
        session: data.session || prev.session,
        semester: data.semester || prev.semester,
        universityRoll: data.universityRoll || roll,
        universityRollNo: data.universityRollNo || prev.universityRollNo,
        internshipDomain: data.internshipDomain || prev.internshipDomain
      }));

      if (data.college) {
        handleCollegeSelect(data.college);
      }

      setIsVerified(true);
      setPrefillNotice('Institutional record found! Your academic details have been auto-populated.');
    } catch (err: any) {
      console.warn('Roll check error:', err);
      setError('Unable to verify record at this time. Please proceed with manual registration.');
    } finally {
      setVerifyingRoll(false);
    }
  };

  // Filter colleges based on selected district
  const getCollegesForSelectedDistrict = () => {
    if (!formData.district) return colleges;
    const selectedDist = districts.find(d => d.name === formData.district);
    if (!selectedDist) return colleges;
    const filtered = colleges.filter(c => c.districtId === selectedDist.id || c.name.toLowerCase().includes(formData.district.toLowerCase()));
    return filtered.length > 0 ? filtered : colleges;
  };

  // Step validation
  const validateStep = (currentStep: number): boolean => {
    setError(null);

    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        setError('Full Name is required.');
        return false;
      }
      if (!formData.parentName.trim()) {
        setError("Parent / Guardian's Name is required.");
        return false;
      }
      if (!PHONE_PATTERN.test(formData.contactNumber.trim())) {
        setError('Please enter a valid 10-digit mobile number.');
        return false;
      }
      if (!EMAIL_PATTERN.test(formData.email.trim())) {
        setError('Please enter a valid email address.');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!formData.university) {
        setError('Please select your University.');
        return false;
      }
      if (!formData.college) {
        setError('Please select your College.');
        return false;
      }
      if (!formData.universityRoll.trim()) {
        setError('University Registration Number is required.');
        return false;
      }
      if (!formData.internshipDomain) {
        setError('Please choose your Internship Domain Track.');
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.terms) {
      setError('You must accept the Undertaking Declaration and Terms.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cleanEmail = formData.email.trim().toLowerCase();
      const cleanPhone = formData.contactNumber.trim();

      // 1. Create Firebase Auth user
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, formData.password);
      const user = userCred.user;

      const isPaid = formData.demoAutoPay;
      const paymentId = isPaid ? `pay_demo_${Date.now()}` : undefined;
      const orderId = isPaid ? `order_demo_${Date.now()}` : undefined;

      // 2. Write User profile in Firestore
      const userDocData = {
        uid: user.uid,
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        parentName: formData.parentName.trim(),
        contactNumber: cleanPhone,
        email: cleanEmail,
        district: formData.district,
        college: formData.college,
        university: formData.university,
        degree: formData.degree,
        department: formData.department,
        subject: formData.subject,
        session: formData.session,
        semester: formData.semester,
        universityRoll: formData.universityRoll.trim(),
        universityRollNo: formData.universityRollNo.trim() || formData.universityRoll.trim(),
        industrialRegNo: formData.industrialRegNo.trim(),
        internshipDomain: formData.internshipDomain,
        internshipMode: formData.internshipMode,
        isPaid: isPaid,
        hasPaid: isPaid,
        paymentStatus: isPaid ? 'success' : 'pending',
        paymentAmount: collegePrice,
        paymentVerifiedAt: isPaid ? new Date().toISOString() : null,
        razorpayPaymentId: paymentId || null,
        razorpayOrderId: orderId || null,
        registrationDate: new Date().toISOString(),
        role: 'student',
        learningHours: 0,
        progress: 0
      };

      await setDoc(doc(db, 'users', user.uid), userDocData);

      // 3. Record transaction if demo auto-paid
      if (isPaid && paymentId) {
        await setDoc(doc(db, 'payments', paymentId), {
          id: paymentId,
          userId: user.uid,
          studentName: formData.fullName.trim(),
          studentEmail: cleanEmail,
          college: formData.college,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          amount: collegePrice,
          amountPaise: collegePrice * 100,
          currency: 'INR',
          status: 'success',
          timestamp: new Date().toISOString()
        });
      }

      // 4. Trigger Welcome Email asynchronously via backend SMTP
      try {
        fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: formData.fullName.trim(),
            email: cleanEmail,
            rollNo: formData.universityRoll.trim(),
            college: formData.college,
            domain: formData.internshipDomain
          })
        }).catch(err => console.warn('Welcome email trigger note:', err));
      } catch (mailErr) {
        console.warn('Mail fetch call ignored:', mailErr);
      }

      // 5. Navigate based on payment status
      if (isPaid) {
        navigate('/dashboard');
      } else {
        navigate('/payment');
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already registered. Please log in instead.');
        setStep(1);
      } else {
        setError(err.message || 'Registration failed. Please check your inputs and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Personal', sub: 'Candidate Details', icon: User },
    { num: 2, title: 'Academic', sub: 'College & Degree', icon: GraduationCap },
    { num: 3, title: 'Security', sub: 'Password Setup', icon: Lock },
    { num: 4, title: 'Declaration', sub: 'Consent & Submit', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold tracking-wide">
            <Sparkles size={14} className="text-indigo-600" />
            <span>NEP-2020 UGC Compliant Internship</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Student <span className="text-indigo-600">Registration</span>
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-medium">
            Complete your step-by-step enrollment to access verified industrial training tracks, official offer letters, and verifiable credits.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between relative">
            {stepsList.map((s, idx) => {
              const isPassed = step > s.num;
              const isCurrent = step === s.num;

              return (
                <React.Fragment key={s.num}>
                  {idx > 0 && (
                    <div
                      className={`flex-1 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${
                        step >= s.num ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                  <div className="flex flex-col items-center text-center shrink-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md shadow-indigo-600/20'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {isPassed ? <Check size={16} className="stroke-[3]" /> : s.num}
                    </div>
                    <span
                      className={`text-xs font-bold mt-2 ${
                        isCurrent ? 'text-indigo-600' : 'text-slate-700'
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="text-[10px] text-slate-600 hidden sm:block">
                      {s.sub}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          
          {/* Form Step Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                {step === 1 && <User size={20} />}
                {step === 2 && <GraduationCap size={20} />}
                {step === 3 && <Lock size={20} />}
                {step === 4 && <FileText size={20} />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {step === 1 && 'Step 1: Personal Information'}
                  {step === 2 && 'Step 2: Academic & College Enrollment'}
                  {step === 3 && 'Step 3: Portal Account Security'}
                  {step === 4 && 'Step 4: Formal Undertaking & Declaration'}
                </h2>
                <p className="text-xs text-slate-600">
                  {step === 1 && 'Provide your legal identity and contact credentials.'}
                  {step === 2 && 'Select your university, affiliated college, and internship track.'}
                  {step === 3 && 'Choose a strong password for your student dashboard.'}
                  {step === 4 && 'Confirm the declaration and complete your registration.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-3 py-1 rounded-xl">
                Step {step} of 4
              </span>
            </div>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-xs font-bold">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Content by Step */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* STEP 1: PERSONAL INFORMATION */}
                {step === 1 && (
                  <div className="space-y-6">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Full Legal Name *
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-3.5 text-slate-600" />
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Gender *
                        </label>
                        <div className="relative">
                          <Users size={16} className="absolute left-3.5 top-3.5 text-slate-600" />
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          >
                            {GENDERS.map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Parent / Guardian Name *
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-3.5 text-slate-600" />
                          <input
                            type="text"
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleChange}
                            placeholder="e.g. Ramesh Sharma"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Mobile Phone Number *
                        </label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-600" />
                          <input
                            type="tel"
                            maxLength={10}
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-600" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. student@gmail.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Important: Registration confirmation and offer letter links will be dispatched directly to this email address.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: ACADEMIC DETAILS */}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* Dynamic Pricing Banner */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                          <IndianRupee size={18} />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                            Applicable Registration Fee
                          </span>
                          <span className="text-xl font-extrabold text-indigo-700">
                            ₹{collegePrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-white/80 rounded-full text-indigo-700 border border-indigo-200">
                        Institutional Subsidized Rate
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          University / Governing Body *
                        </label>
                        <select
                          name="university"
                          value={formData.university}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="">Select University</option>
                          {universities.map(u => (
                            <option key={u.id} value={u.name}>{u.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          District / Region *
                        </label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="">Select District</option>
                          {districts.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Affiliated College / Institute *
                        </label>
                        <select
                          name="college"
                          value={formData.college}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="">Select College</option>
                          {getCollegesForSelectedDistrict().map(c => (
                            <option key={c.id} value={c.name}>
                              {c.name} {c.price ? `(₹${c.price})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Degree Track *
                        </label>
                        <select
                          name="degree"
                          value={formData.degree}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          {DEGREES.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Department / Branch *
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          placeholder="e.g. Computer Science & Engineering"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Session *
                        </label>
                        <select
                          name="session"
                          value={formData.session}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          {REGISTRATION_SESSIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Current Semester *
                        </label>
                        <select
                          name="semester"
                          value={formData.semester}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          {SEMESTERS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          University Registration Number *
                        </label>
                        <input
                          type="text"
                          name="universityRoll"
                          value={formData.universityRoll}
                          onChange={handleChange}
                          placeholder="Official Registration No."
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          University Examination Roll No.
                        </label>
                        <input
                          type="text"
                          name="universityRollNo"
                          value={formData.universityRollNo}
                          onChange={handleChange}
                          placeholder="Roll No. (if issued)"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Internship Domain Track *
                        </label>
                        <select
                          name="internshipDomain"
                          value={formData.internshipDomain}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          {INTERNSHIP_DOMAINS.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Mode of Internship *
                        </label>
                        <select
                          name="internshipMode"
                          value={formData.internshipMode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="Online">Online Virtual Lab</option>
                          <option value="Offline">On-Campus / Center</option>
                          <option value="Hybrid">Hybrid (Classroom + Virtual)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: ACCOUNT SECURITY */}
                {step === 3 && (
                  <div className="max-w-md mx-auto space-y-5 text-left">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Create Secret Password *
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-600" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="At least 6 characters"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Confirm Secret Password *
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-600" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Re-type your password"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-slate-800">Password Tips:</p>
                      <p>• Minimum 6 characters</p>
                      <p>• Keep it secure — you will use this along with your email to log into the portal anytime</p>
                    </div>
                  </div>
                )}

                {/* STEP 4: CONSENT LETTER & FORM TICK */}
                {step === 4 && (
                  <div className="space-y-6 text-left">
                    {/* Formal Undertaking Box */}
                    <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-slate-800 space-y-4">
                      <div className="text-center border-b border-amber-200/60 pb-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-serif">
                          Student Undertaking & Formal Declaration
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Mandatory Compliance for 120-Hour UGC/AICTE Internship Program
                        </p>
                      </div>

                      <div className="font-serif text-xs leading-relaxed text-slate-700 space-y-3">
                        <p>
                          I, <strong className="text-slate-950">{formData.fullName || '[Full Name]'}</strong>, son/daughter of <strong className="text-slate-950">{formData.parentName || '[Parent/Guardian Name]'}</strong>, student of <strong className="text-slate-950">{formData.college || '[College Name]'}</strong> pursuing <strong className="text-slate-950">{formData.degree || '[Degree]'}</strong> (University Registration Number: <strong className="text-slate-950">{formData.universityRoll || '[Registration Number]'}</strong>), hereby declare that I will diligently undertake the UGC-mandated Internship Program in <strong className="text-indigo-700">{formData.internshipDomain || '[Internship Domain]'}</strong> starting from the registered academic session.
                        </p>
                        <p>
                          I agree to abide by the rules, code of conduct, assignment submissions, learning log schedules, and performance evaluations defined by PPO Intern. I understand that credentials and certifications will only be issued upon verified completion of training hours and compliance metrics.
                        </p>
                      </div>

                      <div className="border-t border-amber-200/60 pt-4 flex justify-between items-end text-xs font-sans text-slate-500">
                        <div className="space-y-1">
                          <p className="uppercase tracking-wider text-[9px] text-slate-400 font-bold">Verification Date</p>
                          <p className="font-semibold text-slate-700">{new Date().toLocaleDateString()}</p>
                          <p className="text-[9px] text-slate-400 font-mono">Digital Signature ID: {formData.universityRoll ? `SIG-${formData.universityRoll.substring(0, 8)}` : 'SIG-VERIFIED'}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="uppercase tracking-wider text-[9px] text-slate-400 font-bold">Digitally Signed By</p>
                          <p className="font-bold text-slate-800 italic font-serif text-sm border-b border-dashed border-slate-400 pb-0.5 px-3">
                            {formData.fullName || 'Student'}
                          </p>
                          <span className="block text-[9px] text-emerald-600 font-bold uppercase tracking-wider">✓ Verified Digital Signature</span>
                        </div>
                      </div>
                    </div>

                    {/* Form Tick Checkboxes */}
                    <div className="space-y-3 pt-2">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                          required
                        />
                        <span className="text-xs text-slate-700 font-semibold leading-relaxed">
                          I certify that all details submitted above are true to the best of my knowledge and I agree to the{' '}
                          <span className="text-indigo-600 font-bold hover:underline">Terms of Service</span> and{' '}
                          <span className="text-indigo-600 font-bold hover:underline">Code of Ethics</span>.
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer group p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                        <input
                          type="checkbox"
                          name="demoAutoPay"
                          checked={formData.demoAutoPay}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-indigo-300 cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-extrabold text-indigo-950 block">
                            Direct Enrollment Activation (Auto-Approve ₹{collegePrice})
                          </span>
                          <span className="text-indigo-700 font-medium">
                            Immediately marks fee as verified and generates Offer Letter & Payment Slip for instant download.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100 gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !formData.terms}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Registration & Payment...</span>
                  </div>
                ) : (
                  <>
                    <CreditCard size={16} />
                    <span>Pay ₹{collegePrice} & Complete Registration</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Support & Safety Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">100% Encrypted & Safe</h4>
              <p className="text-[11px] text-slate-600">FERPA and DPDP compliant security</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Institutional Recognition</h4>
              <p className="text-[11px] text-slate-600">Aligned with state university guidelines</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Headset size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Helpdesk Support</h4>
              <p className="text-[11px] text-slate-600">support@ppointern.com</p>
            </div>
          </div>
        </div>

        {/* Existing account prompt */}
        <div className="text-center">
          <p className="text-xs text-slate-600 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Sign in to your Student Dashboard
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
