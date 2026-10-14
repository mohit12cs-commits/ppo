export interface UserProfile {
  uid: string;
  fullName: string;
  gender: string;
  parentName: string;
  contactNumber: string;
  email: string;
  district: string;
  college: string;
  university: string;
  degree: string;
  department: string;
  subject: string;
  session: string;
  semester: string;
  universityRoll: string;
  universityRollNo?: string;
  industrialRegNo?: string;
  internshipDomain: string;
  internshipMode?: string;
  role?: 'student' | 'admin';
  isPaid: boolean;
  hasPaid?: boolean;
  paymentStatus?: 'pending' | 'success' | 'rejected';
  paymentAmount?: number;
  paymentVerifiedAt?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  offerLetterTemplateId?: string;
  offerLetterNumber?: string;
  batchId?: string;
  registrationDate: string;
  learningHours?: number;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProfile {
  uid: string;
  email: string;
  role: 'admin' | 'super_admin';
  fullName: string;
  createdAt: string;
  isActive: boolean;
}

export interface College {
  id: string;
  name: string;
  districtId?: string;
  districtName?: string;
  price: number; // Dynamic fee per college
  status?: 'active' | 'inactive';
  createdAt?: string;
}

export interface University {
  id: string;
  name: string;
  code?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
}

export interface District {
  id: string;
  name: string;
  state?: string;
}

export interface Degree {
  id: string;
  name: string;
  subjects?: string[];
}

export interface CourseDomain {
  id: string;
  name: string;
  badge?: string;
  category?: string;
  description?: string;
  duration?: string;
  skills?: string[];
  eligibility?: string;
  iconName?: string;
  price?: number;
}

export interface InquirySubmission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface OfferLetterTemplate {
  id: string;
  templateName: string;
  companyName: string;
  companyAddress?: string;
  logoUrl?: string;
  headerImageUrl?: string;
  footerImageUrl?: string;
  watermarkUrl?: string;
  signatoryName: string;
  signatoryRole: string;
  signatureImageUrl?: string;
  stampImageUrl?: string;
  bodyTemplate: string;
  version: number;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CohortBatch {
  id: string;
  batchName: string;
  templateId: string;
  companyName?: string;
  allocationRule: 'count_range' | 'college' | 'manual';
  minCount?: number;
  maxCount?: number;
  targetColleges?: string[];
  assignedCount: number;
  isReleased: boolean; // Students can only download when released
  status: 'active' | 'full' | 'paused';
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  studentName?: string;
  studentEmail?: string;
  college?: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  amountPaise: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  verifiedBy?: string;
}

export interface SiteSettings {
  contactPhone: string;
  contactEmail: string;
  officeAddress: string;
  supportHours: string;
  statsStudentsEnrolled: number;
  statsColleges: number;
  statsUniversities: number;
  statsCertificatesIssued: number;
  marqueeInstitutions: string[];
  faqs: { q: string; a: string; category?: string }[];
  testimonials: {
    name: string;
    role: string;
    college: string;
    comment: string;
    rating: number;
    avatarUrl?: string;
  }[];
}
