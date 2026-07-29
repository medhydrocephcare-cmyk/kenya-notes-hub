-- Register 10 new ATD papers into public.papers (completes the full ATD syllabus, Levels I-III).
-- Run this in the Supabase SQL Editor for this project.
-- Safe to re-run: each INSERT is guarded by a NOT EXISTS check on (course, level, full_pdf_key).

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'atd', 'level-1', 'Introduction to Law and Ethics — Notes + Revision Kit', 'notes', 'Introduction to Law and Ethics — Notes + Revision Kit for ATD Level I. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/atd/level-1/introduction-to-law-and-ethics-preview.pdf', 'content/atd/level-1/introduction-to-law-and-ethics.pdf', 242226, 'https://files.kasnebpapers.com/content/atd/level-1/introduction-to-law-and-ethics-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'atd' AND level = 'level-1' AND full_pdf_key = 'content/atd/level-1/introduction-to-law-and-ethics.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'atd', 'level-1', 'Entrepreneurship and Communication — Notes + Revision Kit', 'notes', 'Entrepreneurship and Communication — Notes + Revision Kit for ATD Level I. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/atd/level-1/entrepreneurship-and-communication-preview.pdf', 'content/atd/level-1/entrepreneurship-and-communication.pdf', 237198, 'https://files.kasnebpapers.com/content/atd/level-1/entrepreneurship-and-communication-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'atd' AND level = 'level-1' AND full_pdf_key = 'content/atd/level-1/entrepreneurship-and-communication.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'atd', 'level-1', 'Information Communication Technology — Notes + Revision Kit', 'notes', 'Information Communication Technology — Notes + Revision Kit for ATD Level I. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/atd/level-1/information-communication-technology-preview.pdf', 'content/atd/level-1/information-communication-technology.pdf', 241901, 'https://files.kasnebpapers.com/content/atd/level-1/information-communication-technology-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'atd' AND level = 'level-1' AND full_pdf_key = 'content/atd/level-1/information-communication-technology.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'atd', 'level-2', 'Financial Accounting — Notes + Revision Kit', 'notes', 'Financial Accounting — Notes + Revision Kit for ATD Level II. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/atd/level-2/financial-accounting-preview.pdf', 'content/atd/level-2/financial-accounting.pdf', 227289, 'https://files.kasnebpapers.com/content/atd/level-2/financial-accounting-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'atd' AND level = 'level-2' AND full_pdf_key = 'content/atd/level-2/financial-accounting.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'atd', 'level-2', 'Business Mathematics and Statistics — Notes + Revision Kit', 'notes', 'Business Mathematics and Statistics — Notes + Revision Kit for ATD Level II. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/atd/level-2/business-mathematics-and-statistics-preview.pdf', 'content/atd/level-2/business-mathematics-and-statistics.pdf', 222505, 'https://files.kasnebpapers.com/content/atd/level-2/business-mathematics-and-statistics-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'atd' AND level = 'level-2' AND full_pdf_key = 'content/atd/level-2/business-mathematics-and-statistics.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'atd', 'level-2', 'Principles of Taxation — Notes + Revision Kit', 'notes', 'Principles of Taxation — Notes + Revision Kit for ATD Level II. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/atd/level-2/principles-of-taxation-preview.pdf', 'content/atd/level-2/principles-of-taxation.pdf', 225562, 'https://files.kasnebpapers.com/content/atd/level-2/principles-of-taxation-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'atd' AND level = 'level-2' AND full_pdf_key = 'content/atd/level-2/principles-of-taxation.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'atd', 'level-3', 'Principles of Economics — Notes + Revision Kit', 'notes', 'Principles of Economics — Notes + Revision Kit for ATD Level III. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/atd/level-3/principles-of-economics-preview.pdf', 'content/atd/level-3/principles-of-economics.pdf', 230743, 'https://files.kasnebpapers.com/content/atd/level-3/principles-of-economics-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'atd' AND level = 'level-3' AND full_pdf_key = 'content/atd/level-3/principles-of-economics.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'atd', 'level-3', 'Fundamentals of Management Accounting — Notes + Revision Kit', 'notes', 'Fundamentals of Management Accounting — Notes + Revision Kit for ATD Level III. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/atd/level-3/fundamentals-of-management-accounting-preview.pdf', 'content/atd/level-3/fundamentals-of-management-accounting.pdf', 226891, 'https://files.kasnebpapers.com/content/atd/level-3/fundamentals-of-management-accounting-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'atd' AND level = 'level-3' AND full_pdf_key = 'content/atd/level-3/fundamentals-of-management-accounting.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'atd', 'level-3', 'Fundamentals of Finance — Notes + Revision Kit', 'notes', 'Fundamentals of Finance — Notes + Revision Kit for ATD Level III. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/atd/level-3/fundamentals-of-finance-preview.pdf', 'content/atd/level-3/fundamentals-of-finance.pdf', 233512, 'https://files.kasnebpapers.com/content/atd/level-3/fundamentals-of-finance-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'atd' AND level = 'level-3' AND full_pdf_key = 'content/atd/level-3/fundamentals-of-finance.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'atd', 'level-3', 'Principles of Auditing — Notes + Revision Kit', 'notes', 'Principles of Auditing — Notes + Revision Kit for ATD Level III. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/atd/level-3/principles-of-auditing-preview.pdf', 'content/atd/level-3/principles-of-auditing.pdf', 232963, 'https://files.kasnebpapers.com/content/atd/level-3/principles-of-auditing-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'atd' AND level = 'level-3' AND full_pdf_key = 'content/atd/level-3/principles-of-auditing.pdf'
);

