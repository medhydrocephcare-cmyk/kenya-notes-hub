-- Register 4 new CPA Advanced Level papers into public.papers.
-- Completes CPA Advanced Level's compulsory papers: Leadership and Management (CA31),
-- Advanced Financial Management (CA33), Advanced Management Accounting (CA34S3), and
-- Business Data Analytics (CA35P, practical paper). Advanced Financial Reporting and
-- Advanced Public Finance and Taxation were already live; Advanced Taxation is covered
-- via existing sub-topic papers. Verified against the official CPA syllabus at
-- kasneb.or.ke/cpa.
-- Priced at KSh 1,000 per the user's instruction (new papers going forward).
-- thumbnail_url is left NULL on purpose: the site's ProductCard already falls back to a
-- polished, category-matched stock illustration (src/lib/subject-image.ts) whenever
-- thumbnail_url is empty, which looks better and more consistent than a generated cover.
-- Run this in the Supabase SQL Editor for this project.
-- Safe to re-run: each INSERT is guarded by a NOT EXISTS check on (course, level, full_pdf_key).

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cpa', 'advanced-2', 'Business Data Analytics — Notes + Revision Kit', 'notes', 'Business Data Analytics — Notes + Revision Kit for CPA Advanced Level (CA35P). Includes concise notes, a full unit overview (description, prerequisites and learning outcomes), revision practice and tutor-written model answers for exam preparation in Kenya.', 1000,
       'content/cpa/advanced-2/business-data-analytics-preview.pdf', 'content/cpa/advanced-2/business-data-analytics.pdf', 252743, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cpa' AND level = 'advanced-2' AND full_pdf_key = 'content/cpa/advanced-2/business-data-analytics.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cpa', 'advanced-2', 'Leadership and Management — Notes + Revision Kit', 'notes', 'Leadership and Management — Notes + Revision Kit for CPA Advanced Level (CA31). Includes concise notes, a full unit overview (description, prerequisites and learning outcomes), revision practice and tutor-written model answers for exam preparation in Kenya.', 1000,
       'content/cpa/advanced-2/leadership-and-management-preview.pdf', 'content/cpa/advanced-2/leadership-and-management.pdf', 224800, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cpa' AND level = 'advanced-2' AND full_pdf_key = 'content/cpa/advanced-2/leadership-and-management.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cpa', 'advanced-2', 'Advanced Financial Management — Notes + Revision Kit', 'notes', 'Advanced Financial Management — Notes + Revision Kit for CPA Advanced Level (CA33). Includes concise notes, a full unit overview (description, prerequisites and learning outcomes), revision practice and tutor-written model answers for exam preparation in Kenya.', 1000,
       'content/cpa/advanced-2/advanced-financial-management-preview.pdf', 'content/cpa/advanced-2/advanced-financial-management.pdf', 238666, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cpa' AND level = 'advanced-2' AND full_pdf_key = 'content/cpa/advanced-2/advanced-financial-management.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cpa', 'advanced-2', 'Advanced Management Accounting — Notes + Revision Kit', 'notes', 'Advanced Management Accounting — Notes + Revision Kit for CPA Advanced Level (CA34S3). Includes concise notes, a full unit overview (description, prerequisites and learning outcomes), revision practice and tutor-written model answers for exam preparation in Kenya.', 1000,
       'content/cpa/advanced-2/advanced-management-accounting-preview.pdf', 'content/cpa/advanced-2/advanced-management-accounting.pdf', 241213, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cpa' AND level = 'advanced-2' AND full_pdf_key = 'content/cpa/advanced-2/advanced-management-accounting.pdf'
);

