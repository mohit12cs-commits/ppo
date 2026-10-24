export const GENDERS = ['Male', 'Female', 'Other'] as const;

export const REGISTRATION_SESSIONS = [
  '2021-24',
  '2022-25',
  '2023-26',
  '2024-27',
  '2023-27',
  '2024-28',
  '2025-29',
  '2026-30'
] as const;

export const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8'
] as const;

export const DEGREES = [
  'UG',
  'PG',
  'Diploma',
  'Doctorate'
] as const;

export const INTERNSHIP_MODES = [
  'Online',
  'Offline',
  'Hybrid'
] as const;

export const DEPARTMENTS: Record<string, string[]> = {
  'B.Sc.': [
    'Botany',
    'Chemistry',
    'Mathematics',
    'Physics',
    'Zoology',
    'Computer Science',
    'Statistics',
    'Biotechnology',
    'Microbiology'
  ],
  'B.A.': [
    'History',
    'Political Science',
    'Economics',
    'Sociology',
    'Psychology',
    'English',
    'Hindi',
    'Geography',
    'Philosophy'
  ],
  'B.Com.': [
    'Accountancy',
    'Business Studies',
    'Corporate Finance',
    'Taxation',
    'Banking & Insurance'
  ],
  'B.Tech / B.E.': [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Artificial Intelligence & Data Science'
  ],
  'BCA': [
    'Computer Applications',
    'Web & Mobile Development',
    'Data Science & Analytics',
    'Cloud & Cyber Security'
  ],
  'BBA': [
    'Human Resource Management',
    'Marketing',
    'Finance',
    'International Business',
    'Operations Management'
  ],
  'M.Sc.': [
    'Botany',
    'Chemistry',
    'Mathematics',
    'Physics',
    'Zoology',
    'Computer Science',
    'Biotechnology',
    'Data Science'
  ],
  'M.A.': [
    'History',
    'Political Science',
    'Economics',
    'English',
    'Hindi',
    'Sociology',
    'Psychology'
  ],
  'M.Com.': [
    'Advanced Accountancy',
    'Business Administration',
    'Finance & Banking'
  ],
  'MCA': [
    'Software Engineering',
    'Cloud Computing',
    'Artificial Intelligence & ML',
    'Cyber Security'
  ],
  'MBA': [
    'Marketing Management',
    'Financial Management',
    'Human Resource Management',
    'Operations & Supply Chain',
    'Business Analytics'
  ],
  'Diploma / Polytechnic': [
    'Computer Science & Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electronics'
  ]
};

export const INITIAL_DEGREES = Object.entries(DEPARTMENTS).map(([name, subjects], index) => ({
  id: `deg-${index + 1}`,
  name,
  subjects
}));

export const INTERNSHIP_DOMAINS = [
  {
    id: 'full-stack',
    name: 'Web Development & Full Stack',
    badge: 'High Placement Rate',
    category: 'Software Engineering',
    duration: '120 Hours (4-8 Weeks)',
    description: 'Build modern production web applications with React, Node.js, Express, and cloud databases.',
    skills: ['React 19', 'TypeScript', 'Node.js', 'REST APIs', 'PostgreSQL', 'Tailwind CSS'],
    eligibility: 'Open to all UG/PG streams with basic computer fundamentals',
    iconName: 'Code2',
    price: 1000
  },
  {
    id: 'ai-ml',
    name: 'Artificial Intelligence & Machine Learning',
    badge: 'Fastest Growing',
    category: 'AI & Data',
    duration: '120 Hours (4-8 Weeks)',
    description: 'Master practical Python data workflows, supervised learning models, neural networks, and generative AI APIs.',
    skills: ['Python', 'Pandas & NumPy', 'Scikit-Learn', 'Deep Learning Basics', 'LLM Integrations'],
    eligibility: 'B.Sc., B.Tech, BCA or students with analytical aptitude',
    iconName: 'BrainCircuit',
    price: 1000
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security & Ethical Hacking',
    badge: 'High Security Demand',
    category: 'Security',
    duration: '120 Hours (4-8 Weeks)',
    description: 'Learn vulnerability assessment, penetration testing fundamentals, defensive protocols, and network architecture.',
    skills: ['Network Security', 'Wireshark', 'Burp Suite', 'OWASP Top 10', 'Risk Compliance'],
    eligibility: 'B.Tech, BCA, B.Sc. (CS/IT) or any interested tech enthusiast',
    iconName: 'ShieldAlert',
    price: 1000
  },
  {
    id: 'data-science',
    name: 'Data Science & Business Analytics',
    badge: 'Industry Essential',
    category: 'Data & Analytics',
    duration: '120 Hours (4-8 Weeks)',
    description: 'Transform raw datasets into actionable executive insights with SQL, Power BI, Python, and statistical modeling.',
    skills: ['SQL', 'Power BI & Tableau', 'Python for EDA', 'Hypothesis Testing', 'Dashboards'],
    eligibility: 'B.Com, BBA, B.Sc., B.Tech students',
    iconName: 'Database',
    price: 1000
  },
  {
    id: 'cloud-devops',
    name: 'Cloud Computing & DevOps',
    badge: 'Enterprise Demand',
    category: 'Infrastructure',
    duration: '120 Hours (4-8 Weeks)',
    description: 'Deploy resilient cloud infrastructure, configure CI/CD pipelines, containerize with Docker, and learn AWS fundamentals.',
    skills: ['Docker', 'AWS Core Services', 'Linux Automation', 'GitHub Actions', 'Kubernetes Basics'],
    eligibility: 'Engineering, BCA, or computer science students',
    iconName: 'Cloud',
    price: 1000
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing & Growth Analytics',
    badge: 'Popular for All Streams',
    category: 'Marketing & Commerce',
    duration: '120 Hours (4-8 Weeks)',
    description: 'Master SEO, performance ads (Meta & Google), content strategy, funnel conversion optimization, and analytics.',
    skills: ['SEO & SEM', 'Google Analytics 4', 'Ad Strategy', 'Email Marketing', 'Copywriting'],
    eligibility: 'Open to all students (B.A., B.Com, BBA, B.Sc., B.Tech)',
    iconName: 'Megaphone',
    price: 1000
  }
] as const;

export const DEFAULT_RAZORPAY_SETTINGS = {
  keyId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RAZORPAY_KEY_ID) || 'rzp_test_TlrmDtKPsYU9Oj',
  keySecret: 'mVxWgBlOvB4bPUWcjAHsjnBW',
  mode: 'test' as const,
  enabled: true,
  accountName: 'Patliputra University (PPU)',
  description: 'PPU Internship Enrollment Fee',
  themeColor: '#4f46e5'
};

export const DEFAULT_SITE_SETTINGS = {
  contactPhone: '+91 96939 21517',
  contactEmail: 'support@ppuintern.in',
  officeAddress: 'Patliputra University Campus, Kankarbagh Road, Old Bypass, Patna, Bihar 800020',
  supportHours: 'Monday – Saturday: 10:00 AM – 7:00 PM IST',
  statsStudentsEnrolled: 52400,
  statsColleges: 140,
  statsUniversities: 28,
  statsCertificatesIssued: 48900,
  marqueeInstitutions: [
    'Patliputra University (PPU)',
    'A.N. College, Patna',
    'College of Commerce, Arts & Science',
    'T.P.S. College, Patna',
    'B.D. College, Patna',
    'J.D. Women’s College, Patna',
    'R.P.M. College, Patna City',
    'Nalanda College, Biharsharif',
    'Kisan College, Sohsarai',
    'S.P.M. College, Udantpuri'
  ],
  faqs: [
    {
      q: 'Are the internship programs aligned with Patliputra University (PPU) & NEP-2020 guidelines?',
      a: 'Yes, absolutely. All our 120-hour internship tracks strictly comply with PPU academic curriculum and NEP-2020, UGC, and AICTE framework guidelines. You receive formal credit-eligible documents including Offer Letters, Logbooks, and verified Certificates.',
      category: 'Accreditation'
    },
    {
      q: 'How do I download my Offer Letter after registration?',
      a: 'Immediately after completing your online enrollment and payment verification, your assigned Offer Letter becomes accessible for one-click PDF download inside your Student Dashboard.',
      category: 'Enrollment'
    },
    {
      q: 'Why does the registration fee differ for different colleges?',
      a: 'Colleges and partner universities have institutional tie-ups and subsidized MoUs. The fee shown is automatically determined by your selected college in accordance with administrative guidelines.',
      category: 'Payment'
    },
    {
      q: 'Is Razorpay online payment secure?',
      a: 'Yes. All payments are processed via Razorpay with 256-bit bank-grade SSL encryption. Supported modes include UPI (Google Pay, PhonePe, Paytm), NetBanking, Debit/Credit cards, and Wallets.',
      category: 'Payment'
    },
    {
      q: 'Can employers and universities verify my certificate?',
      a: 'Every certificate and document comes with an authentic tamper-proof QR code that directly validates the student’s identity, college, duration, and grade against our official registry.',
      category: 'Verification'
    }
  ],
  testimonials: [
    {
      name: 'Priya Sharma',
      role: 'Full Stack Intern (2025 Batch)',
      college: 'College of Commerce, Arts & Science (PPU)',
      comment: 'The NEP-2020 compliance made credit transfer effortless at Patliputra University. The mentor code reviews and real projects gave me the confidence to crack campus placements!',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      name: 'Rohan Mehra',
      role: 'AI & Machine Learning Scholar',
      college: 'A.N. College, Patna (PPU)',
      comment: 'Having a real offer letter from day one and structured daily tasks helped me stay on schedule. The payment slip and certificate download worked flawlessly.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      name: 'Ananya Verma',
      role: 'Cyber Security Analyst Track',
      college: 'J.D. Women’s College, Patna',
      comment: 'Hands down the best internship initiative for PPU affiliated colleges. The team was always available on the helpdesk whenever I had a query.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    }
  ],
  razorpay: {
    keyId: 'rzp_test_TlrmDtKPsYU9Oj',
    keySecret: 'mVxWgBlOvB4bPUWcjAHsjnBW',
    mode: 'test' as const,
    enabled: true,
    accountName: 'Patliputra University (PPU)',
    description: 'PPU Internship Enrollment Fee',
    themeColor: '#4f46e5'
  }
};

export const INITIAL_COLLEGES = [
  { id: 'col-1', name: 'A.N. College, Patna', districtId: 'dist-1', price: 700, status: 'active' },
  { id: 'col-2', name: 'College of Commerce, Arts & Science, Patna', districtId: 'dist-1', price: 700, status: 'active' },
  { id: 'col-3', name: 'T.P.S. College, Patna', districtId: 'dist-1', price: 700, status: 'active' },
  { id: 'col-4', name: 'B.D. College, Patna', districtId: 'dist-1', price: 700, status: 'active' },
  { id: 'col-5', name: 'J.D. Women’s College, Patna', districtId: 'dist-1', price: 700, status: 'active' },
  { id: 'col-6', name: 'Nalanda College, Biharsharif', districtId: 'dist-2', price: 700, status: 'active' },
  { id: 'col-7', name: 'Patna Science College', districtId: 'dist-1', price: 1000, status: 'active' },
  { id: 'col-8', name: 'Gaya College, Gaya', districtId: 'dist-2', price: 700, status: 'active' },
  { id: 'col-9', name: 'Mahila College Tekari, Gaya', districtId: 'dist-2', price: 499, status: 'active' },
  { id: 'col-10', name: 'Other PPU Affiliated College', districtId: 'dist-1', price: 1000, status: 'active' }
];

export const INITIAL_UNIVERSITIES = [
  { id: 'uni-1', name: 'Patliputra University (PPU)', code: 'PPU', status: 'active' },
  { id: 'uni-2', name: 'Patna University', code: 'PU', status: 'active' },
  { id: 'uni-3', name: 'Magadh University, Bodh Gaya', code: 'MU', status: 'active' },
  { id: 'uni-4', name: 'B.R. Ambedkar Bihar University', code: 'BRABU', status: 'active' },
  { id: 'uni-5', name: 'Other State / Central University', code: 'OTHER', status: 'active' }
];

export const INITIAL_DISTRICTS = [
  { id: 'dist-1', name: 'Patna', state: 'Bihar' },
  { id: 'dist-2', name: 'Nalanda / Biharsharif', state: 'Bihar' },
  { id: 'dist-3', name: 'Gaya', state: 'Bihar' },
  { id: 'dist-4', name: 'Muzaffarpur', state: 'Bihar' },
  { id: 'dist-5', name: 'Other District', state: 'India' }
];
