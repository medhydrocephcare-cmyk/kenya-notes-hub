-- Register 5 new CPA Foundation Level papers into public.papers.
-- These complete the full, verified CPA Foundation Level syllabus (CA11-CA16):
-- CA11 Financial Accounting (already live), CA12 Communication Skills, CA13 Introduction to
-- Law and Governance, CA14 Economics, CA15 Quantitative Analysis, CA16 Information
-- Communication Technology. Verified against the official syllabus at kasneb.or.ke/cpa.
-- Run this in the Supabase SQL Editor for this project.
-- Safe to re-run: each INSERT is guarded by a NOT EXISTS check on (course, level, full_pdf_key).
-- thumbnail_url is left NULL on purpose: the site's ProductCard already falls back to a
-- polished, category-matched stock illustration (src/lib/subject-image.ts) whenever
-- thumbnail_url is empty, which looks better and more consistent than a generated cover.

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cpa', 'foundation-1', 'Communication Skills — Notes + Revision Kit', 'notes', 'Communication Skills — Notes + Revision Kit for CPA Foundation Level (CA12). Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cpa/foundation-1/communication-skills-preview.pdf', 'content/cpa/foundation-1/communication-skills.pdf', 225098, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cpa' AND level = 'foundation-1' AND full_pdf_key = 'content/cpa/foundation-1/communication-skills.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cpa', 'foundation-1', 'Introduction to Law and Governance — Notes + Revision Kit', 'notes', 'Introduction to Law and Governance — Notes + Revision Kit for CPA Foundation Level (CA13). Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cpa/foundation-1/introduction-to-law-and-governance-preview.pdf', 'content/cpa/foundation-1/introduction-to-law-and-governance.pdf', 223190, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cpa' AND level = 'foundation-1' AND full_pdf_key = 'content/cpa/foundation-1/introduction-to-law-and-governance.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cpa', 'foundation-1', 'Economics — Notes + Revision Kit', 'notes', 'Economics — Notes + Revision Kit for CPA Foundation Level (CA14). Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cpa/foundation-1/economics-preview.pdf', 'content/cpa/foundation-1/economics.pdf', 221212, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cpa' AND level = 'foundation-1' AND full_pdf_key = 'content/cpa/foundation-1/economics.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cpa', 'foundation-1', 'Quantitative Analysis — Notes + Revision Kit', 'notes', 'Quantitative Analysis — Notes + Revision Kit for CPA Foundation Level (CA15). Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cpa/foundation-1/quantitative-analysis-preview.pdf', 'content/cpa/foundation-1/quantitative-analysis.pdf', 224062, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cpa' AND level = 'foundation-1' AND full_pdf_key = 'content/cpa/foundation-1/quantitative-analysis.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cpa', 'foundation-1', 'Information Communication Technology — Notes + Revision Kit', 'notes', 'Information Communication Technology — Notes + Revision Kit for CPA Foundation Level (CA16). Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cpa/foundation-1/information-communication-technology-preview.pdf', 'content/cpa/foundation-1/information-communication-technology.pdf', 232975, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cpa' AND level = 'foundation-1' AND full_pdf_key = 'content/cpa/foundation-1/information-communication-technology.pdf'
);

