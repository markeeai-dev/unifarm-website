import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Driver PostgreSQL chuẩn (không phải riêng của Neon) — dùng được với bất kỳ
// PostgreSQL nào (tự host, Neon, RDS...). Giữ nguyên cú pháp gọi dạng tagged
// template (sql`SELECT ...`) giống hệt driver cũ, nên mọi chỗ gọi `sql` còn
// lại trong code không cần sửa gì thêm. `ssl: "prefer"` tự thương lượng SSL
// nếu server hỗ trợ, vẫn kết nối được bình thường nếu server tự host không
// bật SSL — không cần cấu hình riêng cho từng loại server.
//
// `types.json`: các route admin truyền `${JSON.stringify(x)}::jsonb`. Driver này
// mặc định JSON.stringify lại giá trị đó lần nữa (kể cả khi đã là chuỗi) →
// mảng bị lưu thành chuỗi JSON, `translations || ...` thành mảng. Giữ nguyên
// chuỗi đã stringify sẵn để cột jsonb nhận đúng mảng/object.
export const sql = postgres(process.env.DATABASE_URL, {
  ssl: "prefer",
  types: {
    json: {
      to: 114,
      from: [114, 3802],
      serialize: (x: unknown) => (typeof x === "string" ? x : JSON.stringify(x)),
      parse: (x: string) => JSON.parse(x),
    },
  },
});

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
  origin: string;
  season: string;
  packaging: string;
  storage: string;
  supply_status: string;
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
