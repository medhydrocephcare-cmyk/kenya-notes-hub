-- Blog posts
CREATE TABLE public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  cover_image_url text,
  content_md text not null default '',
  author text not null default 'Kasneb Pastpapers Team',
  tags text[] not null default array[]::text[],
  reading_minutes integer not null default 5,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog public read" ON public.blog_posts FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "blog admin insert" ON public.blog_posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "blog admin update" ON public.blog_posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "blog admin delete" ON public.blog_posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER blog_touch BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE INDEX blog_posts_published_at_idx ON public.blog_posts (published_at DESC) WHERE published = true;

-- Testimonials
CREATE TABLE public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  role text not null default 'KASNEB student',
  avatar_url text,
  rating smallint not null default 5 check (rating between 1 and 5),
  quote text not null,
  approved boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read approved" ON public.testimonials FOR SELECT
  USING (approved = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "testimonials anon submit" ON public.testimonials FOR INSERT TO anon
  WITH CHECK (approved = false);
CREATE POLICY "testimonials user submit" ON public.testimonials FOR INSERT TO authenticated
  WITH CHECK (approved = false OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "testimonials admin update" ON public.testimonials FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "testimonials admin delete" ON public.testimonials FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER testimonials_touch BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- Paper reviews
CREATE TABLE public.paper_reviews (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references public.papers(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text not null default '',
  approved boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.paper_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.paper_reviews TO authenticated;
GRANT ALL ON public.paper_reviews TO service_role;
ALTER TABLE public.paper_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read approved" ON public.paper_reviews FOR SELECT
  USING (approved = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "reviews user insert own" ON public.paper_reviews FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews admin update" ON public.paper_reviews FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "reviews owner or admin delete" ON public.paper_reviews FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER reviews_touch BEFORE UPDATE ON public.paper_reviews
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE INDEX paper_reviews_paper_idx ON public.paper_reviews (paper_id, created_at DESC);

-- Paper categories (admin-managed taxonomy shown on the site)
CREATE TABLE public.paper_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  icon text not null default '📚',
  color text not null default 'emerald',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.paper_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.paper_categories TO authenticated;
GRANT ALL ON public.paper_categories TO service_role;
ALTER TABLE public.paper_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.paper_categories FOR SELECT USING (true);
CREATE POLICY "categories admin insert" ON public.paper_categories FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "categories admin update" ON public.paper_categories FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "categories admin delete" ON public.paper_categories FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER categories_touch BEFORE UPDATE ON public.paper_categories
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- Seed categories
INSERT INTO public.paper_categories(slug, name, description, icon, color, sort_order) VALUES
  ('notes', 'Study Notes', 'Comprehensive topic-by-topic study notes for every KASNEB paper.', '📘', 'emerald', 1),
  ('past-papers', 'Past Papers', 'Actual KASNEB & KNEC past exam papers with model answers.', '📄', 'sky', 2),
  ('revision-kits', 'Revision Kits', 'Compact revision summaries and question banks.', '📝', 'amber', 3),
  ('bundles', 'Bundles', 'Full-level and full-course bundles at big discounts.', '📦', 'rose', 4);

-- Seed testimonials
INSERT INTO public.testimonials(author_name, role, rating, quote, approved, featured) VALUES
  ('Mercy Wanjiru', 'CPA Foundation candidate, Nairobi', 5, 'Passed my Financial Accounting on the first attempt thanks to the crisp notes and clean past papers. Worth every shilling.', true, true),
  ('Brian Otieno', 'ATD Level II, Kisumu', 5, 'The M-Pesa checkout took literally 20 seconds. Downloaded my kit and started revising the same night.', true, true),
  ('Faith Njeri', 'CS Foundation, Thika', 4, 'Very well-structured revision kits. The preview lets you see quality before paying — I appreciate that transparency.', true, false),
  ('Kevin Mutua', 'CIFA Advanced, Mombasa', 5, 'This site saved my retake. Clear answers, updated syllabus, mobile-friendly. Recommending to my whole WhatsApp group.', true, true);

-- Seed blog posts
INSERT INTO public.blog_posts(slug, title, excerpt, content_md, tags, reading_minutes, published, published_at) VALUES
  ('how-to-pass-kasneb-cpa-foundation', 'How to Pass KASNEB CPA Foundation on Your First Attempt', 'A practical 8-week revision blueprint that has helped hundreds of Kenyan students clear Foundation Level 1.', E'# The 8-Week CPA Foundation Blueprint\n\nPassing KASNEB CPA Foundation is a marathon, not a sprint. Below is the plan our top-performing students follow.\n\n## Week 1–2: Concept mastery\nRead each topic once from the study notes, highlight formulas, and attempt end-of-chapter questions.\n\n## Week 3–5: Past papers\nWork through the last **six sittings** under exam conditions. Time yourself strictly.\n\n## Week 6–7: Revision kits\nHit the compact revision kits — they mirror KASNEB question phrasing closely.\n\n## Week 8: Mock + rest\nSit two full mock exams, then rest 48 hours before the real paper.\n\n> Consistency beats intensity. Two focused hours daily beats eight-hour crash sessions.', array['cpa','study-tips','foundation'], 6, true, now()),
  ('kasneb-august-2026-sitting-what-to-expect', 'KASNEB August 2026 Sitting: What Changed and How to Prepare', 'Syllabus updates, new question formats, and the topics examiners are emphasising for August 2026.', E'# What''s new for August 2026\n\nKASNEB has refined several papers. Here''s what matters most:\n\n- **Advanced Taxation** — expanded VAT administration and dispute resolution.\n- **Auditing & Assurance** — heavier emphasis on data analytics.\n- **Financial Management** — sustainability and ESG reporting introduced.\n\n## How we''re helping\nEvery paper on Kasneb Pastpapers is refreshed to reflect the August 2026 syllabus. Look for the "Updated for August 2026" badge on each product.', array['kasneb','2026','syllabus'], 5, true, now());