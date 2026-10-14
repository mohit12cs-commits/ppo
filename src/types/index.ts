export interface InternshipTrack {
  id: string;
  title: string;
  badge: string;
  category: 'Full Stack' | 'AI & ML' | 'Cloud & DevOps' | 'Cyber Security' | 'Data Science' | 'Mobile Dev';
  shortDesc: string;
  durationOptions: ('4 Weeks' | '8 Weeks' | '12 Weeks')[];
  stipendType: string;
  prerequisites: string[];
  skillsGained: string[];
  curriculum: string[];
  projects: string[];
  rating: number;
  enrolledStudents: number;
  popular?: boolean;
}

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  collegeName: string;
  degreeBranch: string;
  graduationYear: string;
  trackId: string;
  duration: string;
  resumeUrl?: string;
}

export interface VerificationResult {
  valid: boolean;
  studentName?: string;
  certificateId?: string;
  domain?: string;
  duration?: string;
  issueDate?: string;
  college?: string;
  grade?: string;
  credentialUrl?: string;
}
