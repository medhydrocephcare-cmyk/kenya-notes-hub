-- Papers catalog table (dynamic, admin-managed, publicly listed when published)
CREATE TABLE public.papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course TEXT NOT NULL,
  level TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'notes',
  sitting TEXT,
  year INTEGER,
  description TEXT NOT NULL DEFAULT '',
  pages INTEGER,
  price_kes INTEGER NOT NULL,
  discount_price_kes INTEGER,
  preview_pdf_key TEXT,
  full_pdf_key TEXT,
  file_size_bytes BIGINT,
  thumbnail_url TEXT,
  syllabus_version TEXT,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Grants (public read for published rows via anon; full CRUD via authenticated + admin RLS)
GRANT SELECT ON public.papers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.papers TO authenticated;
GRANT ALL ON public.papers TO service_role;

ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;

-- Public can read published papers
CREATE POLICY "papers public read published"
  ON public.papers FOR SELECT
  TO anon, authenticated
  USING (published = true OR public.has_role(auth.uid(), 'admin'));

-- Only admins may write
CREATE POLICY "papers admin insert"
  ON public.papers FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "papers admin update"
  ON public.papers FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "papers admin delete"
  ON public.papers FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger (function public.tg_touch_updated_at already exists)
CREATE TRIGGER papers_touch_updated_at
  BEFORE UPDATE ON public.papers
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- Helpful indexes
CREATE INDEX papers_course_level_idx ON public.papers (course, level);
CREATE INDEX papers_featured_idx ON public.papers (featured) WHERE featured = true;
CREATE INDEX papers_updated_at_idx ON public.papers (updated_at DESC);
CREATE INDEX papers_tags_idx ON public.papers USING GIN (tags);