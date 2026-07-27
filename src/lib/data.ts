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
  examSitting: string; // e.g. "August 2026"
  lastUpdated: string; // ISO date
  rating: number;
  reviews: Review[];
  bundleType?: "single" | "level" | "course" | "sitting";
};

export const courses: Course[] = [
  { slug: "cpa", code: "CPA", name: "Certified Public Accountant", description: "The premier accounting qualification in Kenya, six levels from Foundation to Advanced.", color: "from-emerald-500/20 to-emerald-500/5" },
  { slug: "atd", code: "ATD", name: "Accounting Technicians Diploma", description: "Practical accounting technician certification, three progressive levels.", color: "from-sky-500/20 to-sky-500/5" },
  { slug: "cs", code: "CS", name: "Certified Secretaries", description: "Governance, compliance and company secretarial practice.", color: "from-violet-500/20 to-violet-500/5" },
  { slug: "cifa", code: "CIFA", name: "Certified Investment & Financial Analysts", description: "Investment analysis, portfolio management and financial markets.", color: "from-amber-500/20 to-amber-500/5" },
  { slug: "ccp", code: "CCP", name: "Certified Credit Professionals", description: "Credit management, risk and debt recovery.", color: "from-rose-500/20 to-rose-500/5" },
  { slug: "cict", code: "CICT", name: "Certified Information Communication Technologists", description: "ICT project management, systems and cybersecurity fundamentals.", color: "from-cyan-500/20 to-cyan-500/5" },
];

export const levels: Level[] = [
  // CPA
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
];

const sampleReviews: Review[] = [
  { author: "Brian K., Nairobi", rating: 5, body: "Notes are updated and match the current syllabus. Passed my paper on first sitting.", date: "2026-05-14" },
  { author: "Faith W., Kisumu", rating: 5, body: "The preview convinced me — actual answers, not just questions. Worth every shilling.", date: "2026-06-02" },
  { author: "Peter M., Nakuru", rating: 4, body: "Very well organized. Would love more diagrams in the tax section.", date: "2026-04-21" },
];

export const papers: Paper[] = [
  {
    id: "cpa-f1-fa",
    courseSlug: "cpa", levelSlug: "foundation-1",
    title: "Financial Accounting — Notes + Revision Kit",
    description: "Full syllabus notes with worked examples, plus a revision kit of KASNEB past-paper questions with model answers.",
    price: 450, originalPrice: 800,
    fileUrl: "", previewUrl: "",
    examSitting: "August 2026", lastUpdated: "2026-06-10",
    rating: 4.8, reviews: sampleReviews,
    bundleType: "single",
  },
  {
    id: "cpa-f1-be",
    courseSlug: "cpa", levelSlug: "foundation-1",
    title: "Business Environment — Notes + Past Papers",
    description: "Concise notes covering the entire syllabus with the last 5 sittings of past papers and full answers.",
    price: 400, originalPrice: 700,
    fileUrl: "", previewUrl: "",
    examSitting: "August 2026", lastUpdated: "2026-06-08",
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
    examSitting: "August 2026", lastUpdated: "2026-06-10",
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
    examSitting: "August 2026", lastUpdated: "2026-06-10",
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
    examSitting: "August 2026", lastUpdated: "2026-05-30",
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
    examSitting: "August 2026", lastUpdated: "2026-06-01",
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
    examSitting: "August 2026", lastUpdated: "2026-06-05",
    rating: 4.8, reviews: sampleReviews,
    bundleType: "single",
  },
  {
    id: "sitting-aug-2026",
    courseSlug: "cpa", levelSlug: "foundation-1",
    title: "August 2026 Sitting — Predicted Questions + Answers",
    description: "Curated predicted questions and model answers for the upcoming August 2026 sitting across CPA papers.",
    price: 600, originalPrice: 1000,
    fileUrl: "", previewUrl: "",
    examSitting: "August 2026", lastUpdated: "2026-07-01",
    rating: 4.9, reviews: sampleReviews,
    bundleType: "sitting",
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
