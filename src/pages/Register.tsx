import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../components/AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
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
  Clock,
  CreditCard,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  DEGREES,
  GENDERS,
  SEMESTERS,
  REGISTRATION_SESSIONS,
  INTERNSHIP_DOMAINS,
  INTERNSHIP_MODES,
  INITIAL_DEGREES,
  INITIAL_COLLEGES,
  INITIAL_UNIVERSITIES,
  INITIAL_DISTRICTS
} from '../lib/constants';
import { College, University, District, Degree } from '../types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefillNotice, setPrefillNotice] = useState<string | null>(null);

  // Master Data
  const [districts, setDistricts] = useState<District[]>(INITIAL_DISTRICTS);
  const [colleges, setColleges] = useState<College[]>(INITIAL_COLLEGES as unknown as College[]);
  const [universities, setUniversities] = useState<University[]>(INITIAL_UNIVERSITIES as unknown as University[]);
  const [degrees, setDegrees] = useState<Degree[]>(INITIAL_DEGREES as Degree[]);
  const [collegePrice, setCollegePrice] = useState<number>(1000);

  // Duplicate Check & Password Visibility States
  const [phoneCheckLoading, setPhoneCheckLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneAvailable, setPhoneAvailable] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    degree: 'UG',
    department: '',
    subject: '',
    session: '2023-27',
    semester: 'Semester 5',
    universityRoll: '',
    universityRollNo: '',
    internshipDomain: searchParams.get('domain') || 'Web Development & Full Stack',
    internshipMode: 'Online',
    password: '',
    confirmPassword: '',
    terms: false
  });

  // Load Master Data from Firestore
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [distSnap, colSnap, uniSnap, degSnap] = await Promise.all([
          getDocs(query(collection(db, 'districts'), orderBy('name'))).catch(() => null),
          getDocs(collection(db, 'colleges')).catch(() => null),
          getDocs(query(collection(db, 'universities'), orderBy('name'))).catch(() => null),
          getDocs(query(collection(db, 'degrees'), orderBy('name'))).catch(() => null)
        ]);

        if (distSnap && !distSnap.empty) {
          setDistricts(distSnap.docs.map(d => ({ id: d.id, ...d.data() } as District)));
        }
        if (colSnap && !colSnap.empty) {
          const list = colSnap.docs.map(d => ({ id: d.id, ...d.data() } as College));
          setColleges(list);
        }
        if (uniSnap && !uniSnap.empty) {
          setUniversities(uniSnap.docs.map(d => ({ id: d.id, ...d.data() } as University)));
        }
        if (degSnap && !degSnap.empty) {
          const loadedDegrees = degSnap.docs.map(d => {
            const data = d.data();
            const fallback = INITIAL_DEGREES.find(id => id.name.toLowerCase() === (data.name || '').toLowerCase());
            const subjects = Array.isArray(data.subjects)
              ? data.subjects
              : (fallback?.subjects || []);
            return {
              id: d.id,
              name: data.name || '',
              subjects
            } as Degree;
          });
          const missingInitial = (INITIAL_DEGREES as Degree[]).filter(
            init => !loadedDegrees.some(l => l.name.toLowerCase() === init.name.toLowerCase())
          );
          setDegrees([...loadedDegrees, ...missingInitial]);
        } else {
          setDegrees(INITIAL_DEGREES as Degree[]);
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
    const p = matched ? Number(matched.price) : 1000;
    const price = !isNaN(p) && p >= 1 ? p : 1000;
    setCollegePrice(price);
    setFormData(prev => ({ ...prev, college: collegeName }));
  };

  // Helper to fetch subjects for selected department
  const getSubjectsForDepartment = (deptName: string): string[] => {
    if (!deptName) return [];
    const matched = degrees.find(d => d.name.toLowerCase() === deptName.toLowerCase());
    return matched?.subjects || [];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setError(null);

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === 'contactNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setPhoneError(null);
      setPhoneAvailable(false);
      setFormData(prev => ({ ...prev, contactNumber: digitsOnly }));
      return;
    }

    if (name === 'email') {
      setEmailError(null);
      setEmailAvailable(false);
      setFormData(prev => ({ ...prev, email: value }));
      return;
    }

    if (name === 'district') {
      setFormData(prev => ({
        ...prev,
        district: value,
        college: prev.district === value ? prev.college : ''
      }));
      return;
    }

    if (name === 'college') {
      handleCollegeSelect(value);
      return;
    }

    if (name === 'department') {
      setFormData(prev => ({
        ...prev,
        department: value,
        subject: '' // Reset subject when department changes!
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Helper to check if a phone number is already registered in Firestore
  const checkPhoneExists = async (phone: string): Promise<boolean> => {
    const cleanPhone = phone.trim();
    if (!PHONE_PATTERN.test(cleanPhone)) return false;
    try {
      const q = query(collection(db, 'users'), where('contactNumber', '==', cleanPhone), limit(1));
      const snap = await getDocs(q);
      return !snap.empty;
    } catch (err) {
      console.warn('Real-time phone check error:', err);
      return false;
    }
  };

  // Helper to check if an email is already registered in Firestore
  const checkEmailExists = async (email: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(cleanEmail)) return false;
    try {
      const q = query(collection(db, 'users'), where('email', '==', cleanEmail), limit(1));
      const snap = await getDocs(q);
      return !snap.empty;
    } catch (err) {
      console.warn('Real-time email check error:', err);
      return false;
    }
  };

  // Real-time phone check (debounced 250ms when 10 digits entered)
  useEffect(() => {
    const cleanPhone = formData.contactNumber.trim();
    if (!cleanPhone) {
      setPhoneError(null);
      setPhoneAvailable(false);
      return;
    }

    if (cleanPhone.length < 10) {
      setPhoneAvailable(false);
      setPhoneError(null);
      return;
    }

    if (!PHONE_PATTERN.test(cleanPhone)) {
      setPhoneError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      setPhoneAvailable(false);
      return;
    }

    const timer = setTimeout(async () => {
      setPhoneCheckLoading(true);
      const exists = await checkPhoneExists(cleanPhone);
      setPhoneCheckLoading(false);
      if (exists) {
        setPhoneError('This mobile number is already registered.');
        setPhoneAvailable(false);
      } else {
        setPhoneError(null);
        setPhoneAvailable(true);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [formData.contactNumber]);

  // Real-time email check (debounced 350ms when valid email format)
  useEffect(() => {
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail) {
      setEmailError(null);
      setEmailAvailable(false);
      return;
    }

    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setEmailAvailable(false);
      return;
    }

    const timer = setTimeout(async () => {
      setEmailCheckLoading(true);
      const exists = await checkEmailExists(cleanEmail);
      setEmailCheckLoading(false);
      if (exists) {
        setEmailError('This email is already registered. Please log in instead.');
        setEmailAvailable(false);
      } else {
        setEmailError(null);
        setEmailAvailable(true);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [formData.email]);

  const handlePhoneBlur = async () => {
    const cleanPhone = formData.contactNumber.trim();
    if (!cleanPhone || cleanPhone.length < 10) return;
    if (!PHONE_PATTERN.test(cleanPhone)) {
      setPhoneError('Please enter a valid 10-digit mobile number starting with 6-9.');
      setPhoneAvailable(false);
      return;
    }
    setPhoneCheckLoading(true);
    const exists = await checkPhoneExists(cleanPhone);
    setPhoneCheckLoading(false);
    if (exists) {
      setPhoneError('This mobile number is already registered.');
      setPhoneAvailable(false);
    } else {
      setPhoneError(null);
      setPhoneAvailable(true);
    }
  };

  const handleEmailBlur = async () => {
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail) return;
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setEmailError('Please enter a valid email address.');
      setEmailAvailable(false);
      return;
    }
    setEmailCheckLoading(true);
    const exists = await checkEmailExists(cleanEmail);
    setEmailCheckLoading(false);
    if (exists) {
      setEmailError('This email is already registered. Please log in instead.');
      setEmailAvailable(false);
    } else {
      setEmailError(null);
      setEmailAvailable(true);
    }
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
      if (phoneError) {
        setError(phoneError);
        return false;
      }
      if (!EMAIL_PATTERN.test(formData.email.trim())) {
        setError('Please enter a valid email address.');
        return false;
      }
      if (emailError) {
        setError(emailError);
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!formData.university) {
        setError('Please select your University.');
        return false;
      }
      if (!formData.district) {
        setError('Please select your District.');
        return false;
      }
      if (!formData.college) {
        setError('Please select your College.');
        return false;
      }
      if (!formData.degree) {
        setError('Please select your Degree Track.');
        return false;
      }
      if (!formData.department) {
        setError('Please select your Department.');
        return false;
      }
      if (!formData.subject) {
        setError('Please select your Subject / Specialization.');
        return false;
      }
      if (!formData.session) {
        setError('Please select your Academic Session.');
        return false;
      }
      if (!formData.semester) {
        setError('Please select your Current Semester.');
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
      if (!formData.internshipMode) {
        setError('Please select your Mode of Internship.');
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

  const handleNext = async () => {
    setError(null);

    // If on Step 1, perform async validation & duplicate verification before advancing
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setError('Full Legal Name is required.');
        return;
      }
      if (!formData.parentName.trim()) {
        setError("Parent / Guardian's Name is required.");
        return;
      }
      const cleanPhone = formData.contactNumber.trim();
      if (!PHONE_PATTERN.test(cleanPhone)) {
        setPhoneError('Please enter a valid 10-digit mobile number.');
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
      const cleanEmail = formData.email.trim().toLowerCase();
      if (!EMAIL_PATTERN.test(cleanEmail)) {
        setEmailError('Please enter a valid email address.');
        setError('Please enter a valid email address.');
        return;
      }

      if (phoneError) {
        setError(phoneError);
        return;
      }
      if (emailError) {
        setError(emailError);
        return;
      }

      setPhoneCheckLoading(true);
      setEmailCheckLoading(true);
      try {
        const [phoneExists, emailExists] = await Promise.all([
          checkPhoneExists(cleanPhone),
          checkEmailExists(cleanEmail)
        ]);

        if (phoneExists) {
          setPhoneError('This mobile number is already registered.');
          setError('This mobile number is already registered. Please use another number or log in.');
          return;
        }
        if (emailExists) {
          setEmailError('This email is already registered. Please log in instead.');
          setError('This email is already registered. Please log in to your existing account.');
          return;
        }
      } catch (chkErr) {
        console.warn('Step 1 pre-check note:', chkErr);
      } finally {
        setPhoneCheckLoading(false);
        setEmailCheckLoading(false);
      }

      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

      // 2. Write User profile in Firestore (Registration is pending payment)
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
        internshipDomain: formData.internshipDomain,
        internshipMode: formData.internshipMode,
        isPaid: false,
        hasPaid: false,
        paymentStatus: 'pending',
        paymentAmount: collegePrice,
        paymentVerifiedAt: null,
        razorpayPaymentId: null,
        razorpayOrderId: null,
        registrationDate: new Date().toISOString(),
        role: 'student',
        learningHours: 0,
        progress: 0
      };

      await setDoc(doc(db, 'users', user.uid), userDocData);

      // Refresh auth profile in context
      try {
        await refreshProfile();
      } catch (profErr) {
        console.warn('Profile refresh note:', profErr);
      }

      // 3. Dispatch Welcome Email asynchronously via backend SMTP
      try {
        await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: formData.fullName.trim(),
            email: cleanEmail,
            rollNo: formData.universityRoll.trim(),
            college: formData.college,
            domain: formData.internshipDomain
          })
        });
      } catch (mailErr) {
        console.warn('Welcome email trigger note:', mailErr);
      }

      // 4. Navigate to Payment page where amount is shown and payment is completed
      navigate('/payment');
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.code === 'auth/email-already-in-use') {
        setEmailError('This email address is already registered. Please log in instead.');
        setError('This email address is already registered. Please log in to your existing account.');
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
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold tracking-wide">
            <Sparkles size={14} className="text-indigo-600" />
            <span>Patliputra University (PPU) • NEP-2020 Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            PPU Student <span className="text-indigo-600">Registration</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Complete your enrollment to access verified industrial training tracks, official offer letters, and NEP-2020 course credits for Patliputra University.
          </p>
        </div>

        {/* Two-Column Grid: Left Images & Trust Showcase, Right Stepper & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* LEFT SIDE: RELATED IMAGES & PROGRAM BENEFITS PANEL         */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
            
            {/* Primary Visual Showcase Card */}
            <div className="rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-md relative group">
              <div className="relative aspect-16/9 sm:aspect-4/3 bg-slate-900 overflow-hidden">
                <img
                  src="/images/student_achievement_4k.jpg"
                  alt="Certified students in industrial internship program"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Floating pill badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black uppercase text-indigo-700 shadow-sm border border-white/50">
                  NEP 2020 Aligned
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/90 text-white inline-block mb-1">
                    Accredited Track
                  </span>
                  <h3 className="text-sm font-extrabold text-white leading-snug">
                    Verifiable Industrial Credentialing
                  </h3>
                  <p className="text-[11px] text-slate-200 mt-0.5 line-clamp-2">
                    Accepted by 150+ colleges for mandatory semester course credits.
                  </p>
                </div>
              </div>

              {/* Quick highlights underneath the image */}
              <div className="p-4 space-y-2.5 text-left text-xs bg-white">
                {[
                  'Instant Stamped Letter of Acceptance (PDF)',
                  '120-Hour Cadence (30 Days × 4 Hours/Day)',
                  'NEP-2020 Aligned Course Credits',
                  'Tamper-Proof QR Code Digital Verification'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700 font-semibold text-[11px] sm:text-xs">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Progress Guide syncing with current step (Desktop) */}
            <div className="hidden lg:block bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Enrollment Journey
              </span>
              <h4 className="text-xs font-black text-slate-900 mt-2 mb-3">
                Current Stage: Step {step} of 4
              </h4>

              <div className="space-y-3">
                {[
                  { n: 1, title: 'Candidate Profile', desc: 'Personal identity & phone verification' },
                  { n: 2, title: 'College & Domain', desc: 'Affiliated institute & domain track' },
                  { n: 3, title: 'Account Security', desc: 'Secure student portal login password' },
                  { n: 4, title: 'Consent & Submit', desc: 'NEP undertaking & registration' }
                ].map((item) => (
                  <div
                    key={item.n}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl transition ${
                      step === item.n
                        ? 'bg-indigo-50/80 border border-indigo-200 text-indigo-900'
                        : step > item.n
                        ? 'bg-emerald-50/60 text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        step === item.n
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : step > item.n
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {step > item.n ? <Check size={12} className="stroke-[3]" /> : item.n}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{item.title}</p>
                      <p className="text-[10px] mt-0.5 opacity-80">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor Guidance Secondary Card (Desktop) */}
            <div className="hidden lg:flex bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs items-center gap-3 text-left">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                <img
                  src="/images/mentor_guidance_4k.jpg"
                  alt="Mentor guidance"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Hands-on Code Reviews</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Weekly milestone vivas with experienced senior developers.
                </p>
              </div>
            </div>

            {/* Already registered prompt (Desktop) */}
            <div className="hidden lg:block p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
              <p className="text-xs text-slate-600 font-medium">
                Already registered?{' '}
                <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: STEPPER & 4-STEP FORM                         */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Stepper Progress Bar */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between relative">
                {stepsList.map((s, idx) => {
                  const isPassed = step > s.num;
                  const isCurrent = step === s.num;

                  return (
                    <React.Fragment key={s.num}>
                      {idx > 0 && (
                        <div
                          className={`flex-1 h-1 mx-1.5 sm:mx-3 rounded-full transition-all duration-300 ${
                            step >= s.num ? 'bg-indigo-600' : 'bg-slate-200'
                          }`}
                        />
                      )}
                      <div className="flex flex-col items-center text-center shrink-0">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                            isPassed
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                              : isCurrent
                              ? 'bg-indigo-600 text-white ring-2 sm:ring-4 ring-indigo-100 shadow-md shadow-indigo-600/20'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {isPassed ? <Check size={14} className="stroke-[3]" /> : s.num}
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs font-bold mt-1.5 ${
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
            <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200/80 shadow-sm">
              
              {/* Form Step Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    {step === 1 && <User size={20} />}
                    {step === 2 && <GraduationCap size={20} />}
                    {step === 3 && <Lock size={20} />}
                    {step === 4 && <FileText size={20} />}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 text-left">
                      {step === 1 && 'Step 1: Personal Information'}
                      {step === 2 && 'Step 2: Academic & College Enrollment'}
                      {step === 3 && 'Step 3: Portal Account Security'}
                      {step === 4 && 'Step 4: Formal Undertaking & Declaration'}
                    </h2>
                    <p className="text-xs text-slate-600 text-left">
                      {step === 1 && 'Provide your legal identity and contact credentials.'}
                      {step === 2 && 'Select your university, affiliated college, and internship track.'}
                      {step === 3 && 'Choose a strong password for your student dashboard.'}
                      {step === 4 && 'Confirm the declaration and complete your registration.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
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
                            onBlur={handlePhoneBlur}
                            placeholder="10-digit mobile number"
                            className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 transition ${
                              phoneError
                                ? 'bg-rose-50 border border-rose-300 focus:ring-rose-400'
                                : phoneAvailable
                                ? 'bg-emerald-50/50 border border-emerald-300 focus:ring-emerald-400'
                                : 'bg-slate-50 border border-slate-200 focus:bg-white focus:ring-indigo-500'
                            }`}
                            required
                          />
                          {phoneCheckLoading && (
                            <div className="absolute right-3.5 top-3.5 w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          )}
                          {!phoneCheckLoading && phoneAvailable && (
                            <CheckCircle2 size={18} className="absolute right-3.5 top-3.5 text-emerald-600" />
                          )}
                          {!phoneCheckLoading && phoneError && (
                            <AlertCircle size={18} className="absolute right-3.5 top-3.5 text-rose-500" />
                          )}
                        </div>
                        {phoneError ? (
                          <div className="text-[11px] font-bold text-rose-600 mt-1.5 pl-1 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <AlertCircle size={12} className="shrink-0" />
                              {phoneError}
                            </span>
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 underline font-semibold ml-2 shrink-0">
                              Log in instead →
                            </Link>
                          </div>
                        ) : phoneAvailable ? (
                          <p className="text-[11px] font-bold text-emerald-600 mt-1.5 pl-1 flex items-center gap-1">
                            <CheckCircle2 size={12} className="shrink-0" />
                            <span>Mobile number is available for registration</span>
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-500 mt-1 pl-1">
                            10-digit primary mobile number
                          </p>
                        )}
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
                            onBlur={handleEmailBlur}
                            placeholder="e.g. student@gmail.com"
                            className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 transition ${
                              emailError
                                ? 'bg-rose-50 border border-rose-300 focus:ring-rose-400'
                                : emailAvailable
                                ? 'bg-emerald-50/50 border border-emerald-300 focus:ring-emerald-400'
                                : 'bg-slate-50 border border-slate-200 focus:bg-white focus:ring-indigo-500'
                            }`}
                            required
                          />
                          {emailCheckLoading && (
                            <div className="absolute right-3.5 top-3.5 w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          )}
                          {!emailCheckLoading && emailAvailable && (
                            <CheckCircle2 size={18} className="absolute right-3.5 top-3.5 text-emerald-600" />
                          )}
                          {!emailCheckLoading && emailError && (
                            <AlertCircle size={18} className="absolute right-3.5 top-3.5 text-rose-500" />
                          )}
                        </div>
                        {emailError ? (
                          <div className="text-[11px] font-bold text-rose-600 mt-1.5 pl-1 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <AlertCircle size={12} className="shrink-0" />
                              {emailError}
                            </span>
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 underline font-semibold ml-2 shrink-0">
                              Log in instead →
                            </Link>
                          </div>
                        ) : emailAvailable ? (
                          <p className="text-[11px] font-bold text-emerald-600 mt-1.5 pl-1 flex items-center gap-1">
                            <CheckCircle2 size={12} className="shrink-0" />
                            <span>Email address is available for registration</span>
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-600 mt-1 pl-1">
                            Important: Registration confirmation and offer letter links will be dispatched directly to this email address.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: ACADEMIC DETAILS */}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* Academic Affiliation Header Banner */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                            Academic Affiliation & Domain
                          </span>
                          <span className="text-sm font-extrabold text-indigo-900">
                            NEP-2020 Aligned 120-Hour Industrial Internship
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-white/80 rounded-full text-indigo-700 border border-indigo-200">
                        Patliputra University
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
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Degree Level *
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
                          Degree / Course *
                        </label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          required
                        >
                          <option value="">Select Degree / Course</option>
                          {formData.department && !degrees.some(d => d.name === formData.department) && (
                            <option value={formData.department}>{formData.department}</option>
                          )}
                          {degrees.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Option Subject / Specialization *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          disabled={!formData.department}
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                            !formData.department
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                          }`}
                          required
                        >
                          <option value="">{formData.department ? 'Select Option Subject' : 'Select Degree First'}</option>
                          {formData.subject && !getSubjectsForDepartment(formData.department).includes(formData.subject) && (
                            <option value={formData.subject}>{formData.subject}</option>
                          )}
                          {formData.department && getSubjectsForDepartment(formData.department).map((s, idx) => (
                            <option key={`${s}-${idx}`} value={s}>{s}</option>
                          ))}
                        </select>
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
                          {INTERNSHIP_MODES.map(mode => (
                            <option key={mode} value={mode}>{mode}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: ACCOUNT SECURITY */}
                {step === 3 && (
                  <div className="max-w-md mx-auto space-y-5 text-left">
                    {/* Quick suggestion helpers */}
                    <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 block">
                        Quick Password Helpers
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {formData.contactNumber && formData.contactNumber.trim().length >= 10 && (
                          <button
                            type="button"
                            onClick={() => {
                              const phone = formData.contactNumber.trim().slice(-10);
                              setFormData(prev => ({ ...prev, password: phone, confirmPassword: phone }));
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                          >
                            Set to Mobile: {formData.contactNumber.trim().slice(-10)}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, password: 'Student@123', confirmPassword: 'Student@123' }));
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                        >
                          Set to Student@123
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Create Secret Password *
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-600" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="At least 6 characters"
                          className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Confirm Secret Password *
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-600" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Re-type your password"
                          className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
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
                          I, <strong className="text-slate-950">{formData.fullName || '[Full Name]'}</strong>, son/daughter of <strong className="text-slate-950">{formData.parentName || '[Parent/Guardian Name]'}</strong>, student of <strong className="text-slate-950">{formData.college || '[College Name]'}</strong> pursuing <strong className="text-slate-950">{formData.degree || '[Degree]'}</strong> in <strong className="text-slate-950">{formData.department || '[Department]'}</strong> ({formData.subject || '[Subject]'}) (University Registration Number: <strong className="text-slate-950">{formData.universityRoll || '[Registration Number]'}</strong>), hereby declare that I will diligently undertake the UGC-mandated Internship Program in <strong className="text-indigo-700">{formData.internshipDomain || '[Internship Domain]'}</strong> ({formData.internshipMode} Mode) for session <strong className="text-slate-950">{formData.session}</strong>.
                        </p>
                        <p>
                          I agree to abide by the rules, code of conduct, assignment submissions, learning log schedules, and performance evaluations defined by Patliputra University (PPU) Internship Portal. I understand that credentials and certifications will only be issued upon verified completion of training hours and compliance metrics.
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
                    <span>Completing Registration...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Complete Registration</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Support & Safety Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">100% Encrypted & Safe</h4>
              <p className="text-[11px] text-slate-600">FERPA & DPDP compliant security</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Institutional Recognition</h4>
              <p className="text-[11px] text-slate-600">Aligned with state university guidelines</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3 text-left">
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
        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Sign in to your Student Dashboard
            </Link>
          </p>
        </div>

          </div>
          {/* End of Right Column */}

        </div>
        {/* End of Two-Column Grid */}

      </div>
    </div>
  );
};

export default Register;
