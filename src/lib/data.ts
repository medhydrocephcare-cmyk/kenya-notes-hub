// In-memory data store for the site skeleton.
// Replace with Lovable Cloud (Postgres) tables when backend is enabled.

export type Course = {
  slug: string;
  code: string;
  name: string;
  description: string;
  color: string;
};

export type Level = {
  slug: string;
  courseSlug: string;
  name: string;
  order: number;
};

export type Review = {
  author: string;
  rating: number;
  body: string;
  date: string;
};

export type Paper = {
  id: string;
  courseSlug: string;
  levelSlug: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  fileUrl: string;
  previewUrl: string;
  thumbnailUrl?: string;
  examSitting: string; // "Updated to latest available sitting" | "Prediction Paper" | an actually-published sitting once confirmed
  lastUpdated: string; // ISO date
  rating: number;
  reviews: Review[];
  bundleType?: "single" | "level" | "course" | "sitting";
};

export const courses: Course[] = [
  { slug: "cpa", code: "CPA", name: "Certified Public Accountant", description: "The premier accounting qualification in Kenya — Foundation, Intermediate and Advanced levels.", color: "from-emerald-500/20 to-emerald-500/5" },
  { slug: "atd", code: "ATD", name: "Accounting Technicians Diploma", description: "Practical accounting technician certification, three progressive levels.", color: "from-sky-500/20 to-sky-500/5" },
  { slug: "cs", code: "CS", name: "Certified Secretaries", description: "Governance, compliance and company secretarial practice.", color: "from-violet-500/20 to-violet-500/5" },
  { slug: "cifa", code: "CIFA", name: "Certified Investment & Financial Analysts", description: "Investment analysis, portfolio management and financial markets.", color: "from-amber-500/20 to-amber-500/5" },
  { slug: "ccp", code: "CCP", name: "Certified Credit Professionals", description: "Credit management, risk assessment and debt recovery.", color: "from-rose-500/20 to-rose-500/5" },
  { slug: "cict", code: "CICT", name: "Certified Information Communication Technologists", description: "ICT project management, systems, networks and cybersecurity.", color: "from-cyan-500/20 to-cyan-500/5" },
  { slug: "dcm", code: "DCM", name: "Diploma in Credit Management", description: "Credit control, collections and portfolio management fundamentals.", color: "from-pink-500/20 to-pink-500/5" },
  { slug: "dict", code: "DICT", name: "Diploma in ICT", description: "Foundational ICT diploma covering programming, hardware and networks.", color: "from-teal-500/20 to-teal-500/5" },
  { slug: "fab", code: "FAB", name: "Foundation in Accountancy & Business", description: "Entry-level accounting and business foundation programme.", color: "from-lime-500/20 to-lime-500/5" },
];

export const levels: Level[] = [
  // CPA (new syllabus — Foundation, Intermediate, Advanced with 2 levels each)
  { slug: "foundation-1", courseSlug: "cpa", name: "Foundation Level 1", order: 1 },
  { slug: "foundation-2", courseSlug: "cpa", name: "Foundation Level 2", order: 2 },
  { slug: "intermediate-1", courseSlug: "cpa", name: "Intermediate Level 1", order: 3 },
  { slug: "intermediate-2", courseSlug: "cpa", name: "Intermediate Level 2", order: 4 },
  { slug: "advanced-1", courseSlug: "cpa", name: "Advanced Level 1", order: 5 },
  { slug: "advanced-2", courseSlug: "cpa", name: "Advanced Level 2", order: 6 },
  // ATD
  { slug: "level-1", courseSlug: "atd", name: "Level I", order: 1 },
  { slug: "level-2", courseSlug: "atd", name: "Level II", order: 2 },
  { slug: "level-3", courseSlug: "atd", name: "Level III", order: 3 },
  // CS
  { slug: "foundation", courseSlug: "cs", name: "Foundation Level", order: 1 },
  { slug: "intermediate", courseSlug: "cs", name: "Intermediate Level", order: 2 },
  { slug: "advanced", courseSlug: "cs", name: "Advanced Level", order: 3 },
  // CIFA
  { slug: "foundation", courseSlug: "cifa", name: "Foundation Level", order: 1 },
  { slug: "intermediate", courseSlug: "cifa", name: "Intermediate Level", order: 2 },
  { slug: "advanced", courseSlug: "cifa", name: "Advanced Level", order: 3 },
  // CCP
  { slug: "level-1", courseSlug: "ccp", name: "Level I", order: 1 },
  { slug: "level-2", courseSlug: "ccp", name: "Level II", order: 2 },
  { slug: "level-3", courseSlug: "ccp", name: "Level III", order: 3 },
  // CICT
  { slug: "foundation", courseSlug: "cict", name: "Foundation Level", order: 1 },
  { slug: "intermediate", courseSlug: "cict", name: "Intermediate Level", order: 2 },
  { slug: "advanced", courseSlug: "cict", name: "Advanced Level", order: 3 },
  // DCM
  { slug: "level-1", courseSlug: "dcm", name: "Level I", order: 1 },
  { slug: "level-2", courseSlug: "dcm", name: "Level II", order: 2 },
  // DICT
  { slug: "level-1", courseSlug: "dict", name: "Level I", order: 1 },
  { slug: "level-2", courseSlug: "dict", name: "Level II", order: 2 },
  // FAB
  { slug: "foundation", courseSlug: "fab", name: "Foundation", order: 1 },
];

const sampleReviews: Review[] = [
  { author: "Brian K., Nairobi", rating: 5, body: "Notes are updated and match the current syllabus. Passed my paper on first sitting.", date: "2026-05-14" },
  { author: "Faith W., Kisumu", rating: 5, body: "The preview convinced me — actual answers, not just questions. Worth every shilling.", date: "2026-06-02" },
  { author: "Peter M., Nakuru", rating: 4, body: "Very well organized. Would love more diagrams in the tax section.", date: "2026-04-21" },
];

export const papers: Paper[] = [
  {
    id: "test-1ksh",
    courseSlug: "cpa", levelSlug: "foundation-1",
    title: "TEST PRODUCT — KSh 1 (Palpluss checkout test)",
    description: "Temporary test product for verifying the Palpluss M-Pesa STK Push and webhook confirmation flow.",
    price: 1,
    fileUrl: "", previewUrl: "",
    examSitting: "TEST", lastUpdated: "2026-07-27",
    rating: 5, reviews: [],
    bundleType: "single",
  },
  {
    id: "cpa-f1-fa",
    courseSlug: "cpa", levelSlug: "foundation-1",
    title: "Financial Accounting — Notes + Revision Kit",
    description: "Original study notes covering the full Financial Accounting syllabus — double entry, VAT, depreciation, inventory valuation, accruals/prepayments, bank reconciliations, control accounts, and sole trader/not-for-profit/company financial statements — with worked examples and a 10-question self-assessment kit with model answers.",
    price: 150, originalPrice: 300,
    fileUrl: "https://files.kasnebpapers.com/content/cpa/foundation-1/financial-accounting.pdf",
    previewUrl: "https://files.kasnebpapers.com/content/cpa/foundation-1/financial-accounting-preview.pdf",
    thumbnailUrl: "https://files.kasnebpapers.com/content/cpa/foundation-1/financial-accounting-thumbnail.png",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-07-28",
    rating: 4.8, reviews: sampleReviews,
    bundleType: "single",
  },
  {
    id: "cpa-f1-be",
    courseSlug: "cpa", levelSlug: "foundation-1",
    title: "Business Environment — Notes + Revision Kit",
    description: "Original study notes covering the full Business Environment syllabus — business forms, PESTEL analysis, stakeholder mapping, entrepreneurship, corporate governance, CSR, government/law, and the international business environment — with a worked case study and a 10-question self-assessment kit with model answers.",
    price: 150, originalPrice: 300,
    fileUrl: "https://files.kasnebpapers.com/content/cpa/foundation-1/business-environment.pdf",
    previewUrl: "https://files.kasnebpapers.com/content/cpa/foundation-1/business-environment-preview.pdf",
    thumbnailUrl: "https://files.kasnebpapers.com/content/cpa/foundation-1/business-environment-thumbnail.png",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-07-28",
    rating: 4.7, reviews: sampleReviews.slice(0, 2),
    bundleType: "single",
  },
  {
    id: "cpa-f1-bundle",
    courseSlug: "cpa", levelSlug: "foundation-1",
    title: "Foundation Level 1 — Complete Bundle (All Papers)",
    description: "Every subject in Foundation Level 1: Financial Accounting, Business Environment, Business Law, and Business Mathematics. Save 40%.",
    price: 1200, originalPrice: 2000,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-10",
    rating: 4.9, reviews: sampleReviews,
    bundleType: "level",
  },
  {
    id: "cpa-full-course",
    courseSlug: "cpa", levelSlug: "foundation-1",
    title: "CPA Full Course Bundle — All 6 Levels",
    description: "Every level, every paper, every past-paper answer. The complete CPA journey in one download.",
    price: 4500, originalPrice: 9000,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-10",
    rating: 5.0, reviews: sampleReviews,
    bundleType: "course",
  },
  {
    id: "atd-1-intro-acc",
    courseSlug: "atd", levelSlug: "level-1",
    title: "Introduction to Accounting — Notes + Answers",
    description: "Fundamentals of accounting for ATD Level I with past-paper answers.",
    price: 350, originalPrice: 600,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-05-30",
    rating: 4.6, reviews: sampleReviews.slice(1),
    bundleType: "single",
  },
  {
    id: "cs-foundation-law",
    courseSlug: "cs", levelSlug: "foundation",
    title: "Business Law — Foundation Notes",
    description: "Business law essentials for CS Foundation with case-based answers.",
    price: 400, originalPrice: 750,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-01",
    rating: 4.7, reviews: sampleReviews.slice(0, 2),
    bundleType: "single",
  },
  {
    id: "cifa-foundation-econ",
    courseSlug: "cifa", levelSlug: "foundation",
    title: "Economics — CIFA Foundation Notes + Kit",
    description: "Microeconomics and macroeconomics theory with KASNEB past-paper answers.",
    price: 420, originalPrice: 780,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-05",
    rating: 4.8, reviews: sampleReviews,
    bundleType: "single",
  },
  {
    id: "sitting-aug-2026",
    courseSlug: "cpa", levelSlug: "foundation-1",
    title: "Prediction Paper — August 2026 Sitting Predicted Questions",
    description: "ORIGINAL prediction paper: curated predicted questions and model answers for the upcoming August 2026 sitting across CPA papers. This is a prediction product, not an official KASNEB past paper.",
    price: 600, originalPrice: 1000,
    fileUrl: "", previewUrl: "",
    examSitting: "Prediction Paper", lastUpdated: "2026-07-01",
    rating: 4.9, reviews: sampleReviews,
    bundleType: "sitting",
  },
  {
    id: "cpa-f2-fin-mgmt",

    courseSlug: "cpa", levelSlug: "foundation-2",
    title: "Financial Management — Notes + Kit",
    description: "Time value of money, capital budgeting, working capital and financing decisions with full past-paper answers.",
    price: 450, originalPrice: 800,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-14",
    rating: 4.8, reviews: sampleReviews,
    bundleType: "single",
  },
  {
    id: "cpa-int-audit",
    courseSlug: "cpa", levelSlug: "intermediate-1",
    title: "Auditing & Assurance — Intermediate Notes",
    description: "ISA-aligned audit planning, evidence, reporting and professional ethics with model answers.",
    price: 480, originalPrice: 850,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-12",
    rating: 4.7, reviews: sampleReviews.slice(0, 2),
    bundleType: "single",
  },
  {
    id: "cict-found-comp",
    courseSlug: "cict", levelSlug: "foundation",
    title: "Introduction to Computing — CICT Foundation",
    description: "Hardware, software and information systems fundamentals with past-paper answers.",
    price: 400, originalPrice: 700,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-09",
    rating: 4.6, reviews: sampleReviews.slice(1),
    bundleType: "single",
  },
  {
    id: "ccp-l1-credit",
    courseSlug: "ccp", levelSlug: "level-1",
    title: "Credit Management I — Notes + Answers",
    description: "Principles of credit, appraisal, monitoring and collections for CCP Level I.",
    price: 400, originalPrice: 750,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-11",
    rating: 4.7, reviews: sampleReviews.slice(0, 2),
    bundleType: "single",
  },
  {
    id: "dcm-l1-intro",
    courseSlug: "dcm", levelSlug: "level-1",
    title: "Introduction to Credit Management — DCM Level I",
    description: "Diploma-level credit management foundations with worked past-paper answers.",
    price: 380, originalPrice: 700,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-10",
    rating: 4.6, reviews: sampleReviews.slice(1),
    bundleType: "single",
  },
  {
    id: "dict-l1-prog",
    courseSlug: "dict", levelSlug: "level-1",
    title: "Introduction to Programming — DICT Level I",
    description: "Structured programming, algorithms and pseudocode with practical past-paper answers.",
    price: 380, originalPrice: 700,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-09",
    rating: 4.7, reviews: sampleReviews,
    bundleType: "single",
  },
  {
    id: "fab-foundation",
    courseSlug: "fab", levelSlug: "foundation",
    title: "Foundation in Accountancy & Business — Full Notes",
    description: "Complete FAB syllabus notes covering accounting, business and communication with sample questions.",
    price: 350, originalPrice: 650,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-08",
    rating: 4.7, reviews: sampleReviews.slice(0, 2),
    bundleType: "single",
  },
  {
    id: "cs-int-governance",
    courseSlug: "cs", levelSlug: "intermediate",
    title: "Corporate Governance — CS Intermediate",
    description: "Board structures, ethics, stakeholder governance and Kenyan Code of Governance for state corporations.",
    price: 430, originalPrice: 780,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-07",
    rating: 4.8, reviews: sampleReviews,
    bundleType: "single",
  },
  {
    id: "cifa-int-equity",
    courseSlug: "cifa", levelSlug: "intermediate",
    title: "Equity Investments Analysis — CIFA Intermediate",
    description: "Equity valuation models, market efficiency and portfolio construction with model answers.",
    price: 460, originalPrice: 820,
    fileUrl: "", previewUrl: "",
    examSitting: "Updated to latest available sitting", lastUpdated: "2026-06-06",
    rating: 4.8, reviews: sampleReviews,
    bundleType: "single",
  },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}
export function getLevelsForCourse(courseSlug: string) {
  return levels.filter((l) => l.courseSlug === courseSlug).sort((a, b) => a.order - b.order);
}
export function getLevel(courseSlug: string, levelSlug: string) {
  return levels.find((l) => l.courseSlug === courseSlug && l.slug === levelSlug);
}
export function getPapersForLevel(courseSlug: string, levelSlug: string) {
  return papers.filter((p) => p.courseSlug === courseSlug && p.levelSlug === levelSlug);
}
export function getPaper(id: string) {
  return papers.find((p) => p.id === id);
}
export function countPapersInCourse(courseSlug: string) {
  return papers.filter((p) => p.courseSlug === courseSlug).length;
}
