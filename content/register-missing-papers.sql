-- Register 9 already-uploaded papers into public.papers, and fix 2 mislabeled rows.
-- Run this in the Supabase SQL Editor for this project.
-- Safe to re-run: each INSERT is guarded by a NOT EXISTS check on (course, level, full_pdf_key).

-- === Fix: rows still pointing at the old, wrong R2 path (foundation-2) ===
-- These two papers were moved to their correct KASNEB level (Intermediate) and
-- re-uploaded to R2 at the new path earlier, but the DB rows were never updated.

UPDATE public.papers
SET level = 'intermediate-1',
    full_pdf_key = 'content/cpa/intermediate-1/financial-management.pdf',
    preview_pdf_key = 'content/cpa/intermediate-1/financial-management-preview.pdf',
    thumbnail_url = 'https://files.kasnebpapers.com/content/cpa/intermediate-1/financial-management-thumbnail.png',
    updated_at = now()
WHERE course = 'cpa' AND level = 'foundation-2' AND title ILIKE 'Financial Management%';

UPDATE public.papers
SET level = 'intermediate-2',
    full_pdf_key = 'content/cpa/intermediate-2/management-accounting.pdf',
    preview_pdf_key = 'content/cpa/intermediate-2/management-accounting-preview.pdf',
    thumbnail_url = 'https://files.kasnebpapers.com/content/cpa/intermediate-2/management-accounting-thumbnail.png',
    updated_at = now()
WHERE course = 'cpa' AND level = 'foundation-2' AND title ILIKE 'Management Accounting%';

-- === Register the 9 papers that are fully uploaded to R2 but missing from the catalog ===

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'atd', 'level-2', 'Principles of Management — Notes + Revision Kit', 'notes', 'Principles of Management — Notes + Revision Kit for ATD Level II. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/atd/level-2/principles-of-management-preview.pdf', 'content/atd/level-2/principles-of-management.pdf', 242055, 'https://files.kasnebpapers.com/content/atd/level-2/principles-of-management-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'atd' AND level = 'level-2' AND full_pdf_key = 'content/atd/level-2/principles-of-management.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'ccp', 'level-1', 'Credit Management — Notes + Revision Kit', 'notes', 'Credit Management — Notes + Revision Kit for CCP Level I. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/ccp/level-1/credit-management-preview.pdf', 'content/ccp/level-1/credit-management.pdf', 246551, 'https://files.kasnebpapers.com/content/ccp/level-1/credit-management-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'ccp' AND level = 'level-1' AND full_pdf_key = 'content/ccp/level-1/credit-management.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'ccp', 'level-2', 'Law Governing Credit Practice — Notes + Revision Kit', 'notes', 'Law Governing Credit Practice — Notes + Revision Kit for CCP Level II. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/ccp/level-2/law-governing-credit-practice-preview.pdf', 'content/ccp/level-2/law-governing-credit-practice.pdf', 235364, 'https://files.kasnebpapers.com/content/ccp/level-2/law-governing-credit-practice-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'ccp' AND level = 'level-2' AND full_pdf_key = 'content/ccp/level-2/law-governing-credit-practice.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cict', 'foundation', 'Introduction to Computing — Notes + Revision Kit', 'notes', 'Introduction to Computing — Notes + Revision Kit for CICT Foundation Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cict/foundation/introduction-to-computing-preview.pdf', 'content/cict/foundation/introduction-to-computing.pdf', 249963, 'https://files.kasnebpapers.com/content/cict/foundation/introduction-to-computing-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cict' AND level = 'foundation' AND full_pdf_key = 'content/cict/foundation/introduction-to-computing.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cifa', 'intermediate', 'Portfolio Management — Notes + Revision Kit', 'notes', 'Portfolio Management — Notes + Revision Kit for CIFA Intermediate Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cifa/intermediate/portfolio-management-preview.pdf', 'content/cifa/intermediate/portfolio-management.pdf', 231650, 'https://files.kasnebpapers.com/content/cifa/intermediate/portfolio-management-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cifa' AND level = 'intermediate' AND full_pdf_key = 'content/cifa/intermediate/portfolio-management.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cpa', 'intermediate-1', 'Company Law — Notes + Revision Kit', 'notes', 'Company Law — Notes + Revision Kit for CPA Intermediate Level 1. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cpa/intermediate-1/company-law-preview.pdf', 'content/cpa/intermediate-1/company-law.pdf', 250358, 'https://files.kasnebpapers.com/content/cpa/intermediate-1/company-law-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cpa' AND level = 'intermediate-1' AND full_pdf_key = 'content/cpa/intermediate-1/company-law.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'dcm', 'level-1', 'Fundamentals of Credit Management — Notes + Revision Kit', 'notes', 'Fundamentals of Credit Management — Notes + Revision Kit for DCM Level I. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/dcm/level-1/fundamentals-of-credit-management-preview.pdf', 'content/dcm/level-1/fundamentals-of-credit-management.pdf', 231666, 'https://files.kasnebpapers.com/content/dcm/level-1/fundamentals-of-credit-management-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'dcm' AND level = 'level-1' AND full_pdf_key = 'content/dcm/level-1/fundamentals-of-credit-management.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'dict', 'level-1', 'Introduction to Computing — Notes + Revision Kit', 'notes', 'Introduction to Computing — Notes + Revision Kit for DICT Level I. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/dict/level-1/introduction-to-computing-preview.pdf', 'content/dict/level-1/introduction-to-computing.pdf', 247676, 'https://files.kasnebpapers.com/content/dict/level-1/introduction-to-computing-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'dict' AND level = 'level-1' AND full_pdf_key = 'content/dict/level-1/introduction-to-computing.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cs', 'intermediate', 'Corporate Governance and Ethics — Notes + Revision Kit', 'notes', 'Corporate Governance and Ethics — Notes + Revision Kit for CS Intermediate Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cs/intermediate/corporate-governance-and-ethics-preview.pdf', 'content/cs/intermediate/corporate-governance-and-ethics.pdf', 230191, 'https://files.kasnebpapers.com/content/cs/intermediate/corporate-governance-and-ethics-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cs' AND level = 'intermediate' AND full_pdf_key = 'content/cs/intermediate/corporate-governance-and-ethics.pdf'
);

