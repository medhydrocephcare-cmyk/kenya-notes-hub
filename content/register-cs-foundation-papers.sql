-- Register 6 new CS Foundation Level papers into public.papers.
-- These complete the full, verified CS Foundation Level syllabus (CS11-CS16):
-- Management Principles and Practice, Communication Skills and Records Management,
-- Introduction to Law and Governance, Principles of Accounting and Taxation, Human
-- Resources Management, Information Communication Technology. Verified against
-- kasnebnotes.co.ke's CS syllabus breakdown (Business Law, already live, is not one
-- of the 6 real Foundation papers -- flagged, not changed).
-- Run this in the Supabase SQL Editor for this project.
-- Safe to re-run: each INSERT is guarded by a NOT EXISTS check on (course, level, full_pdf_key).

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cs', 'foundation', 'Management Principles and Practice — Notes + Revision Kit', 'notes', 'Management Principles and Practice — Notes + Revision Kit for CS Foundation Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cs/foundation/management-principles-and-practice-preview.pdf', 'content/cs/foundation/management-principles-and-practice.pdf', 224324, 'https://files.kasnebpapers.com/content/cs/foundation/management-principles-and-practice-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cs' AND level = 'foundation' AND full_pdf_key = 'content/cs/foundation/management-principles-and-practice.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cs', 'foundation', 'Communication Skills and Records Management — Notes + Revision Kit', 'notes', 'Communication Skills and Records Management — Notes + Revision Kit for CS Foundation Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cs/foundation/communication-skills-and-records-management-preview.pdf', 'content/cs/foundation/communication-skills-and-records-management.pdf', 214360, 'https://files.kasnebpapers.com/content/cs/foundation/communication-skills-and-records-management-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cs' AND level = 'foundation' AND full_pdf_key = 'content/cs/foundation/communication-skills-and-records-management.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cs', 'foundation', 'Introduction to Law and Governance — Notes + Revision Kit', 'notes', 'Introduction to Law and Governance — Notes + Revision Kit for CS Foundation Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cs/foundation/introduction-to-law-and-governance-preview.pdf', 'content/cs/foundation/introduction-to-law-and-governance.pdf', 214719, 'https://files.kasnebpapers.com/content/cs/foundation/introduction-to-law-and-governance-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cs' AND level = 'foundation' AND full_pdf_key = 'content/cs/foundation/introduction-to-law-and-governance.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cs', 'foundation', 'Principles of Accounting and Taxation — Notes + Revision Kit', 'notes', 'Principles of Accounting and Taxation — Notes + Revision Kit for CS Foundation Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cs/foundation/principles-of-accounting-and-taxation-preview.pdf', 'content/cs/foundation/principles-of-accounting-and-taxation.pdf', 207938, 'https://files.kasnebpapers.com/content/cs/foundation/principles-of-accounting-and-taxation-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cs' AND level = 'foundation' AND full_pdf_key = 'content/cs/foundation/principles-of-accounting-and-taxation.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cs', 'foundation', 'Human Resources Management — Notes + Revision Kit', 'notes', 'Human Resources Management — Notes + Revision Kit for CS Foundation Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cs/foundation/human-resources-management-preview.pdf', 'content/cs/foundation/human-resources-management.pdf', 203242, 'https://files.kasnebpapers.com/content/cs/foundation/human-resources-management-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cs' AND level = 'foundation' AND full_pdf_key = 'content/cs/foundation/human-resources-management.pdf'
);

INSERT INTO public.papers (course, level, title, category, description, price_kes, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, syllabus_version, tags, featured, published, sitting, year)
SELECT 'cs', 'foundation', 'Information Communication Technology — Notes + Revision Kit', 'notes', 'Information Communication Technology — Notes + Revision Kit for CS Foundation Level. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.', 150,
       'content/cs/foundation/information-communication-technology-preview.pdf', 'content/cs/foundation/information-communication-technology.pdf', 202066, 'https://files.kasnebpapers.com/content/cs/foundation/information-communication-technology-thumbnail.png', 'current',
       ARRAY['notes', 'revision-kit', 'auto-synced']::text[], false, true, '', 2026
WHERE NOT EXISTS (
  SELECT 1 FROM public.papers WHERE course = 'cs' AND level = 'foundation' AND full_pdf_key = 'content/cs/foundation/information-communication-technology.pdf'
);

