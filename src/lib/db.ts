import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const sql = neon(process.env.DATABASE_URL);

/** Bản dịch nội dung admin — khoá ngoài là mã ngôn ngữ đích ("en"|"ja"|"ko"|"zh-TW"),
 * giá trị là các field đã dịch cùng tên với field gốc trên bản ghi (vd.
 * translations.en.name). Field nào chưa dịch được (chưa cấu hình API key,
 * lỗi mạng...) thì không có mặt trong object — phía hiển thị luôn fallback
 * về tiếng Việt gốc khi thiếu. */
export type ContentTranslations = Record<string, Record<string, unknown>>;

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  cover_image: string;
  author: string;
  status: "draft" | "published";
  is_featured: boolean;
  view_count: number;
  published_at: string | null;
  translations: ContentTranslations | null;
  created_at: string;
  updated_at: string;
};

export type SpecField = { label: string; value: string };

export type Product = {
  id: string;
  name: string;
  price: number;
  category: "fresh" | "seedling" | "processed";
  type: "banana" | "pineapple" | "melon" | "other";
  image: string;
  gallery: string[];
  subtitle: string;
  standard: string;
  description: string;
  specs: SpecField[];
  commitments: string[];
  translations: ContentTranslations | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Job = {
  id: string;
  title: string;
  level: "Intern" | "Fresher" | "Junior" | "Middle" | "Senior";
  dept: string;
  color: string;
  income: string;
  income_bucket: "Dưới 8 triệu" | "8 - 12 triệu" | "Trên 12 triệu";
  location: string;
  experience: "Không yêu cầu" | "Có kinh nghiệm";
  headcount: number;
  benefit: string;
  deadline_date: string | null;
  tags: string[];
  translations: ContentTranslations | null;
  status: "active" | "closed";
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Distributor = {
  id: string;
  name: string;
  province: string;
  district: string;
  address: string;
  hours: string;
  phone: string;
  translations: ContentTranslations | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ContactMessageSource = "contact" | "du_an" | "feedback";

export type ContactMessage = {
  id: string;
  source: ContactMessageSource;
  name: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type TimelineMilestone = {
  id: string;
  year: string;
  caption: string;
  icon: string;
  stat: SpecField[];
  partner_title: string;
  partner_bullets: string[];
  image: string;
  media: { label: string; video: string }[];
  bottom: string[];
  translations: ContentTranslations | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
