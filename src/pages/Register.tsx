import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  BookOpen,
  User,
  Phone,
  Mail,
  Lock,
  ChevronRight,
  Search,
  IndianRupee
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

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Master data states
  const [colleges, setColleges] = useState<College[]>(INITIAL_COLLEGES);
  const [universities, setUniversities] = useState<University[]>(INITIAL_UNIVERSITIES);
  const [districts, setDistricts] = useState<District[]>(INITIAL_DISTRICTS);

  // Form states
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
    terms: true
  });

  const [collegePrice, setCollegePrice] = useState<number>(1000);
  const [demoAutoPay, setDemoAutoPay] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Roll number pre-verification lookup
  const [rollInput, setRollInput] = useState('');
  const [verifyingRoll, setVerifyingRoll] = useState(false);
  const [verifiedNotice, setVerifiedNotice] = useState<string | null>(null);

  // 1. Load Master Data from Firestore (admin managed)
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [colSnap, uniSnap, distSnap] = await Promise.all([
          getDocs(collection(db, 'colleges')),
          getDocs(collection(db, 'universities')),
          getDocs(collection(db, 'districts'))
        ]);

        if (!colSnap.empty) {
          const list = colSnap.docs.map(d => ({ id: d.id, ...d.data() } as College));
          setColleges(list);
        }
        if (!uniSnap.empty) {
          const list = uniSnap.docs.map(d => ({ id: d.id, ...d.data() } as University));
          setUniversities(list);
        }
        if (!distSnap.empty) {
          const list = distSnap.docs.map(d => ({ id: d.id, ...d.data() } as District));
          setDistricts(list);
        }
      } catch (err) {
        console.warn('Master data load notice, using baseline:', err);
      }
    };
    loadMasterData();
  }, []);

  // 2. Handle College change & dynamic price determination
  const handleCollegeChange = (selectedName: string) => {
    const matched = colleges.find(c => c.name.toLowerCase() === selectedName.toLowerCase());
    const price = matched && Number(matched.price) > 0 ? Number(matched.price) : 1000;
    setCollegePrice(price);
    setFormData(prev => ({ ...prev, college: selectedName }));
  };

  // 3. Roll verification lookup
  const handleVerifyRoll = async () => {
    if (!rollInput.trim()) return;
    setVerifyingRoll(true);
    setVerifiedNotice(null);
    setError(null);

    try {
      const q = query(collection(db, 'importedStudents'), where('universityRoll', '==', rollInput.trim()));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const data = snap.docs[0].data();
        setFormData(prev => ({
          ...prev,
          fullName: data.fullName || prev.fullName,
          parentName: data.parentName || prev.parentName,
          email: data.email || prev.email,
          contactNumber: data.contactNumber || prev.contactNumber,
          college: data.college || prev.college,
          university: data.university || prev.university,
          degree: data.degree || prev.degree,
          department: data.department || prev.department,
          subject: data.subject || prev.subject,
          semester: data.semester || prev.semester,
          session: data.session || prev.session,
          universityRoll: data.universityRoll || rollInput.trim(),
          universityRollNo: data.universityRollNo || prev.universityRollNo
        }));
        if (data.college) {
          handleCollegeChange(data.college);
        }
        setVerifiedNotice('Student college record found! Details have been pre-filled.');
      } else {
        setFormData(prev => ({ ...prev, universityRoll: rollInput.trim() }));
        setVerifiedNotice('No pre-imported record found. You can proceed with manual entry.');
      }
    } catch (err) {
      setFormData(prev => ({ ...prev, universityRoll: rollInput.trim() }));
    } finally {
      setVerifyingRoll(false);
    }
  };

  // 4. Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.terms) {
      setError('Please accept the Terms & Conditions.');
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase Auth
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim().toLowerCase(),
        formData.password
      );

      // Create profile document in 'users' collection
      const userRef = doc(db, 'users', cred.user.uid);
      const newProfile = {
        uid: cred.user.uid,
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        parentName: formData.parentName.trim(),
        contactNumber: formData.contactNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        district: formData.district,
        college: formData.college,
        university: formData.university,
        degree: formData.degree,
        department: formData.department.trim(),
        subject: formData.subject.trim(),
        session: formData.session,
        semester: formData.semester,
        universityRoll: formData.universityRoll.trim(),
        universityRollNo: formData.universityRollNo.trim(),
        industrialRegNo: formData.industrialRegNo.trim(),
        internshipDomain: formData.internshipDomain,
        internshipMode: formData.internshipMode,
        isPaid: demoAutoPay,
        hasPaid: demoAutoPay,
        paymentStatus: demoAutoPay ? 'success' : 'pending',
        paymentAmount: collegePrice,
        paymentVerifiedAt: demoAutoPay ? new Date().toISOString() : undefined,
        razorpayPaymentId: demoAutoPay ? `pay_demo_${Date.now()}` : undefined,
        razorpayOrderId: demoAutoPay ? `order_demo_${Date.now()}` : undefined,
        registrationDate: new Date().toISOString(),
        role: 'student',
        learningHours: 0,
        progress: 0
      };

      await setDoc(userRef, newProfile);

      if (demoAutoPay && newProfile.razorpayPaymentId) {
        // Record demo payment transaction in 'payments'
        await setDoc(doc(db, 'payments', newProfile.razorpayPaymentId), {
          id: newProfile.razorpayPaymentId,
          userId: cred.user.uid,
          studentName: newProfile.fullName,
          studentEmail: newProfile.email,
          college: newProfile.college,
          razorpayOrderId: newProfile.razorpayOrderId,
          razorpayPaymentId: newProfile.razorpayPaymentId,
          amount: collegePrice,
          amountPaise: collegePrice * 100,
          currency: 'INR',
          status: 'success',
          timestamp: new Date().toISOString()
        });

        // Redirect directly to Student Dashboard
        navigate('/dashboard');
        return;
      }

      // Redirect directly to Payment page
      navigate('/payment');
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err?.code === 'auth/email-already-in-use') {
        setError('This email address is already registered. Please log in.');
      } else {
        setError(err?.message || 'Registration failed. Please check your inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-800 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-4">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span>Student Registration</span>
        </div>

        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Admissions Open 2026
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white light:text-slate-900 tracking-tight mt-2.5">
            Student Internship Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-1">
            Complete your enrollment to receive your official signed Offer Letter & course schedule.
          </p>
        </div>

        {/* Pre-fill Lookup Box */}
        <div className="p-5 rounded-2xl bg-slate-900/60 light:bg-white border border-slate-800/80 light:border-slate-200 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            <Search className="w-4 h-4" />
            Fast-Track College Record Search (Optional)
          </div>
          <p className="text-xs text-slate-400 light:text-slate-600 mb-3">
            If your college administration has pre-shared your list, enter your University Registration Number to auto-fill details.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={rollInput}
              onChange={e => setRollInput(e.target.value)}
              placeholder="Enter University Registration / Roll Number..."
              className="flex-1 px-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleVerifyRoll}
              disabled={verifyingRoll}
              className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-slate-800 light:bg-slate-900 hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {verifyingRoll ? 'Checking...' : 'Fetch Details'}
            </button>
          </div>
          {verifiedNotice && (
            <p className="text-xs text-emerald-400 light:text-emerald-700 font-medium mt-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {verifiedNotice}
            </p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Registration Form */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-slate-900/70 light:bg-white border border-slate-800/80 light:border-slate-200 shadow-xl space-y-6">
          {/* SECTION 1: PERSONAL DETAILS */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-slate-800 light:border-slate-200 flex items-center gap-2">
              <User className="w-4 h-4" />
              1. Personal & Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Student Full Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                >
                  {GENDERS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Father's / Guardian's Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.parentName}
                  onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="Parent / Guardian Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Contact Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.contactNumber}
                  onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Email Address * (Used for login & offer letter delivery)
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: ACADEMIC DETAILS */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-slate-800 light:border-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              2. Academic & College Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  District *
                </label>
                <select
                  required
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  College / Institution * (Determines fee tier)
                </label>
                <select
                  required
                  value={formData.college}
                  onChange={e => handleCollegeChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="">Select College</option>
                  {colleges.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name} {c.price ? `(Fee: ₹${c.price})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  University *
                </label>
                <select
                  required
                  value={formData.university}
                  onChange={e => setFormData({ ...formData, university: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select University</option>
                  {universities.map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Degree Course *
                </label>
                <select
                  value={formData.degree}
                  onChange={e => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                >
                  {DEGREES.map(deg => (
                    <option key={deg} value={deg}>{deg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Political Science / CS"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Subject / Major *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Artificial Intelligence / Pol Science"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Academic Session *
                </label>
                <select
                  value={formData.session}
                  onChange={e => setFormData({ ...formData, session: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                >
                  {REGISTRATION_SESSIONS.map(sess => (
                    <option key={sess} value={sess}>{sess}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Semester *
                </label>
                <select
                  value={formData.semester}
                  onChange={e => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                >
                  {SEMESTERS.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  University Registration Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.universityRoll}
                  onChange={e => setFormData({ ...formData, universityRoll: e.target.value })}
                  placeholder="University Registration No."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  College Roll Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.universityRollNo}
                  onChange={e => setFormData({ ...formData, universityRollNo: e.target.value })}
                  placeholder="Class / Exam Roll No."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: INTERNSHIP TRACK & SECURITY */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-slate-800 light:border-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              3. Track Selection & Account Security
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Internship Domain *
                </label>
                <select
                  required
                  value={formData.internshipDomain}
                  onChange={e => setFormData({ ...formData, internshipDomain: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                >
                  {INTERNSHIP_DOMAINS.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Internship Mode
                </label>
                <select
                  value={formData.internshipMode}
                  onChange={e => setFormData({ ...formData, internshipMode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Online">Online / Remote (As approved by College)</option>
                  <option value="Offline">Offline / Campus Lab</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Create Password * (Min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-white light:text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC FEE DISPLAY & TERMS */}
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Institutional Subsidized Fee
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically matched to {formData.college || 'selected institution'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white light:text-slate-900 font-heading">
                ₹{collegePrice}
              </span>
              <span className="text-xs text-slate-400 ml-1">one-time</span>
            </div>
          </div>

          {/* DEMO / TEST PAYMENT AUTO-APPROVE OPTION */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="demoPayCheckbox"
                checked={demoAutoPay}
                onChange={e => setDemoAutoPay(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 cursor-pointer"
              />
              <label htmlFor="demoPayCheckbox" className="text-xs font-semibold text-indigo-300 light:text-indigo-800 cursor-pointer">
                Auto-approve with Demo Payment (Instant Entry to Student Dashboard)
              </label>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold uppercase tracking-wider">
              Sandbox
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <input
              type="checkbox"
              id="termsCheckbox"
              required
              checked={formData.terms}
              onChange={e => setFormData({ ...formData, terms: e.target.checked })}
              className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700"
            />
            <label htmlFor="termsCheckbox" className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              I certify that all academic details entered are true and accurate to the best of my knowledge. I accept the{' '}
              <Link to="/terms" className="text-emerald-400 underline">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="text-emerald-400 underline">Privacy Policy</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration & Proceed to Fee Payment</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400 light:text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
              Log in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
