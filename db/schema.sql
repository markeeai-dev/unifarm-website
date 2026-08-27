-- ============================================================
-- Unifarm — Bản dịch nội dung admin (products/jobs/timeline/
-- distributors/blog_posts) — cột `translations` được thêm vào các bảng
-- đã tồn tại qua ALTER TABLE riêng (CREATE TABLE IF NOT EXISTS phía dưới
-- không tự thêm cột mới vào bảng cũ). Chạy an toàn nhiều lần.
-- ============================================================

ALTER TABLE IF EXISTS blog_posts        ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}';
ALTER TABLE IF EXISTS products          ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}';
ALTER TABLE IF EXISTS jobs              ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}';
ALTER TABLE IF EXISTS timeline_milestones ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}';
ALTER TABLE IF EXISTS distributors      ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}';

-- ============================================================
-- Unifarm — Blog Schema (Neon Postgres)
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT        UNIQUE NOT NULL,
  title         TEXT        NOT NULL,
  excerpt       TEXT        DEFAULT '',
  content       TEXT        DEFAULT '',
  tag           TEXT        DEFAULT 'Tin tức',
  cover_image   TEXT        DEFAULT '',
  author        TEXT        DEFAULT 'Unifarm',
  translations  JSONB       DEFAULT '{}',
  status        TEXT        DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured   BOOLEAN     DEFAULT false,
  view_count    INTEGER     DEFAULT 0,
  published_at  TIMESTAMPTZ DEFAULT NULL,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_tag ON blog_posts(tag);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published_at DESC);

CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- ============================================================
-- Unifarm — Products Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT        NOT NULL,
  price         NUMERIC     DEFAULT 0,
  category      TEXT        NOT NULL CHECK (category IN ('fresh', 'seedling', 'processed')),
  type          TEXT        DEFAULT 'other' CHECK (type IN ('banana', 'pineapple', 'melon', 'other')),
  image         TEXT        DEFAULT '',
  gallery       JSONB       DEFAULT '[]',
  subtitle      TEXT        DEFAULT '',
  standard      TEXT        DEFAULT '',
  description   TEXT        DEFAULT '',
  specs         JSONB       DEFAULT '[]',
  commitments   JSONB       DEFAULT '[]',
  translations  JSONB       DEFAULT '{}',
  sort_order    INTEGER     DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order);

CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- ============================================================
-- Unifarm — Jobs (Tuyển dụng) Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS jobs (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT        NOT NULL,
  level          TEXT        NOT NULL CHECK (level IN ('Intern', 'Fresher', 'Junior', 'Middle', 'Senior')),
  dept           TEXT        NOT NULL,
  color          TEXT        DEFAULT '#006400',
  income         TEXT        DEFAULT '',
  income_bucket  TEXT        NOT NULL CHECK (income_bucket IN ('Dưới 8 triệu', '8 - 12 triệu', 'Trên 12 triệu')),
  location       TEXT        NOT NULL,
  experience     TEXT        NOT NULL CHECK (experience IN ('Không yêu cầu', 'Có kinh nghiệm')),
  headcount      INTEGER     DEFAULT 1,
  benefit        TEXT        DEFAULT '',
  deadline_date  DATE,
  tags           JSONB       DEFAULT '[]',
  translations   JSONB       DEFAULT '{}',
  status         TEXT        DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  sort_order     INTEGER     DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_sort ON jobs(sort_order);

CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS jobs_updated_at ON jobs;
CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_jobs_updated_at();

-- ============================================================
-- Unifarm — Timeline Milestones (Hành trình kiến tạo) Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS timeline_milestones (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  year            TEXT        NOT NULL,
  caption         TEXT        NOT NULL,
  icon            TEXT        DEFAULT 'Sprout',
  stat            JSONB       DEFAULT '[]',
  partner_title   TEXT        DEFAULT '',
  partner_bullets JSONB       DEFAULT '[]',
  image           TEXT        DEFAULT '',
  media           JSONB       DEFAULT '[]',
  bottom          JSONB       DEFAULT '[]',
  translations    JSONB       DEFAULT '{}',
  sort_order      INTEGER     DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timeline_sort ON timeline_milestones(sort_order);

CREATE OR REPLACE FUNCTION update_timeline_milestones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS timeline_milestones_updated_at ON timeline_milestones;
CREATE TRIGGER timeline_milestones_updated_at
  BEFORE UPDATE ON timeline_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_timeline_milestones_updated_at();

-- ============================================================
-- Unifarm — Distributors (Hệ thống phân phối / cửa hàng) Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS distributors (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  province    TEXT        NOT NULL DEFAULT 'Hồ Chí Minh',
  district    TEXT        NOT NULL,
  address     TEXT        NOT NULL,
  hours       TEXT        DEFAULT '',
  phone       TEXT        DEFAULT '',
  translations JSONB      DEFAULT '{}',
  sort_order  INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_distributors_sort ON distributors(sort_order);
CREATE INDEX IF NOT EXISTS idx_distributors_district ON distributors(district);

CREATE OR REPLACE FUNCTION update_distributors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS distributors_updated_at ON distributors;
CREATE TRIGGER distributors_updated_at
  BEFORE UPDATE ON distributors
  FOR EACH ROW
  EXECUTE FUNCTION update_distributors_updated_at();

-- Seed 6 cửa hàng mẫu ban đầu — chỉ chèn 1 lần khi bảng còn trống,
-- an toàn khi chạy lại migrate.mjs nhiều lần.
INSERT INTO distributors (name, province, district, address, hours, phone, sort_order)
SELECT * FROM (VALUES
  ('Cửa hàng Thuận Giao', 'Hồ Chí Minh', 'Thuận An', '12 Đường ĐT743, P. Thuận Giao', '7:00 - 21:00', '0274 3 771 234', 1),
  ('Cửa hàng Thủ Dầu Một', 'Hồ Chí Minh', 'Thủ Dầu Một', '45 Đại lộ Bình Dương, P. Phú Cường', '7:00 - 21:00', '0274 3 822 456', 2),
  ('Cửa hàng Dĩ An', 'Hồ Chí Minh', 'Dĩ An', '8 Đường Nguyễn An Ninh, P. Dĩ An', '6:30 - 20:30', '0274 3 751 789', 3),
  ('Cửa hàng Bến Cát', 'Hồ Chí Minh', 'Bến Cát', '120 Quốc lộ 13, P. Mỹ Phước', '7:00 - 20:00', '0274 3 567 890', 4),
  ('Cửa hàng Tân Uyên', 'Hồ Chí Minh', 'Tân Uyên', '67 Đường ĐT747, P. Uyên Hưng', '7:00 - 20:30', '0274 3 645 123', 5),
  ('Cửa hàng An Phú', 'Hồ Chí Minh', 'Thuận An', '230 Đường Xuyên Á, P. An Phú', '7:00 - 21:30', '0274 3 778 321', 6)
) AS seed(name, province, district, address, hours, phone, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM distributors);

-- ============================================================
-- Unifarm — Media (ảnh/video upload trong admin, lưu trực tiếp
-- trong Postgres dưới dạng bytea vì dự án dùng Neon, không có
-- dịch vụ object storage riêng như Supabase Storage)
-- ============================================================

CREATE TABLE IF NOT EXISTS media (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  filename    TEXT        NOT NULL,
  mime_type   TEXT        NOT NULL,
  data        BYTEA       NOT NULL,
  size_bytes  INTEGER     NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);
