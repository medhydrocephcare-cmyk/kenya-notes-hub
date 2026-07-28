// Static site taxonomy (courses + levels).
// Papers themselves live in the `papers` table in the database and are
// fetched dynamically via `src/lib/papers.functions.ts`.

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

/** Front-end paper shape produced by `rowToPaper` in papers.functions.ts. */
export type Paper = {
  id: string;
  courseSlug: string;
  levelSlug: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  examSitting: string;
  lastUpdated: string;
  bundleType?: "single" | "level" | "course" | "sitting";
  category?: string;
  pages?: number;
  fileSize?: number;
  thumbnailUrl?: string;
  syllabusVersion?: string;
  tags?: string[];
  downloadCount?: number;
  previewAvailable?: boolean;
  downloadAvailable?: boolean;
  featured?: boolean;
  year?: number;
  previewText?: string;
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
  // DCM
  { slug: "level-1", courseSlug: "dcm", name: "Level I", order: 1 },
  { slug: "level-2", courseSlug: "dcm", name: "Level II", order: 2 },
  // DICT
  { slug: "level-1", courseSlug: "dict", name: "Level I", order: 1 },
  { slug: "level-2", courseSlug: "dict", name: "Level II", order: 2 },
  // FAB
  { slug: "foundation", courseSlug: "fab", name: "Foundation", order: 1 },
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
