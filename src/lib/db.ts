import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const sql = neon(process.env.DATABASE_URL);

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
  status: "active" | "closed";
  sort_order: number;
  created_at: string;
  updated_at: string;
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
  sort_order: number;
  created_at: string;
  updated_at: string;
};
