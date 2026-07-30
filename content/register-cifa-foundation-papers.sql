-- Register 5 new CIFA Foundation Level papers into public.papers.
-- These complete the full, verified CIFA Foundation Level syllabus:
-- Financial Accounting, Professional Ethics and Governance, Regulation of Financial
-- Markets, Economics (already live), Quantitative Analysis, Introduction to Finance
-- and Investments. Verified against the official syllabus at icifa.co.ke/syllabus/.
-- Run this in the Supabase SQL Editor for this project.
-- Safe to re-run: each INSERT is guarded by a NOT EXISTS check on (course, level, full_pdf_key).
-- thumbnail_url is left NULL on purpose: the site's ProductCard already falls back to a
-- polished, category-matched stock illustration (src/lib/subject-image.ts) whenever
-- thumbnail_url is empty, which looks better and more consistent than a generated cover.

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cifa', 'foundation', 'Financial Accounting — Notes + Revision Kit', 'notes', 'Financial Accounting — Notes + Revision Kit for CIFA Foundation Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cifa/foundation/financial-accounting-preview.pdf', 'content/cifa/foundation/financial-accounting.pdf', 214617, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cifa' AND level = 'foundation' AND full_pdf_key = 'content/cifa/foundation/financial-accounting.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cifa', 'foundation', 'Professional Ethics and Governance — Notes + Revision Kit', 'notes', 'Professional Ethics and Governance — Notes + Revision Kit for CIFA Foundation Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cifa/foundation/professional-ethics-and-governance-preview.pdf', 'content/cifa/foundation/professional-ethics-and-governance.pdf', 220338, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cifa' AND level = 'foundation' AND full_pdf_key = 'content/cifa/foundation/professional-ethics-and-governance.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cifa', 'foundation', 'Regulation of Financial Markets — Notes + Revision Kit', 'notes', 'Regulation of Financial Markets — Notes + Revision Kit for CIFA Foundation Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cifa/foundation/regulation-of-financial-markets-preview.pdf', 'content/cifa/foundation/regulation-of-financial-markets.pdf', 202911, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cifa' AND level = 'foundation' AND full_pdf_key = 'content/cifa/foundation/regulation-of-financial-markets.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cifa', 'foundation', 'Quantitative Analysis — Notes + Revision Kit', 'notes', 'Quantitative Analysis — Notes + Revision Kit for CIFA Foundation Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cifa/foundation/quantitative-analysis-preview.pdf', 'content/cifa/foundation/quantitative-analysis.pdf', 218352, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cifa' AND level = 'foundation' AND full_pdf_key = 'content/cifa/foundation/quantitative-analysis.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cifa', 'foundation', 'Introduction to Finance and Investments — Notes + Revision Kit', 'notes', 'Introduction to Finance and Investments — Notes + Revision Kit for CIFA Foundation Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cifa/foundation/introduction-to-finance-and-investments-preview.pdf', 'content/cifa/foundation/introduction-to-finance-and-investments.pdf', 207198, NULL, 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cifa' AND level = 'foundation' AND full_pdf_key = 'content/cifa/foundation/introduction-to-finance-and-investments.pdf'
);

