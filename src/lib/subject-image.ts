import accounting from "@/assets/subjects/accounting.jpg";
import law from "@/assets/subjects/law.jpg";
import economics from "@/assets/subjects/economics.jpg";
import ict from "@/assets/subjects/ict.jpg";
import finance from "@/assets/subjects/finance.jpg";
import management from "@/assets/subjects/management.jpg";

const IMAGES = { accounting, law, economics, ict, finance, management };

export function subjectImageFor(title: string, courseSlug?: string): string {
  const t = title.toLowerCase();
  if (/(law|governance|ethic|regulat)/.test(t)) return law;
  if (/(econ|macro|micro|market)/.test(t)) return economics;
  if (/(ict|comput|program|system|network|cyber|data|softw|inform)/.test(t)) return ict;
  if (/(finance|invest|portfolio|equit|deriv|analy|bank|credit|risk)/.test(t)) return finance;
  if (/(management|strateg|leadership|human|hr|governanc|secretar|admin)/.test(t)) return management;
  if (/(account|audit|tax|financ|cost|report|bookkeep)/.test(t)) return accounting;
  if (courseSlug === "cict" || courseSlug === "dict") return ict;
  if (courseSlug === "cifa") return finance;
  if (courseSlug === "cs") return management;
  if (courseSlug === "ccp" || courseSlug === "dcm") return finance;
  return accounting;
}

export { IMAGES as subjectImages };
