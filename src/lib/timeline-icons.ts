import {
  Sprout,
  Ship,
  Handshake,
  Network,
  Cpu,
  Leaf,
  Rocket,
  type LucideIcon,
} from "lucide-react";

/**
 * Danh sách icon hợp lệ cho mốc lịch sử — PHẢI khớp với ICON_MAP trong
 * `src/components/gioi-thieu/Timelinejourney.tsx` (trang Giới thiệu công khai).
 * Nếu thêm icon mới ở đây, nhớ thêm tương ứng bên đó.
 */
export type TimelineIconOption = {
  value: string;
  label: string;
  Icon: LucideIcon;
};

export const TIMELINE_ICON_OPTIONS: TimelineIconOption[] = [
  { value: "Sprout", label: "Khởi đầu", Icon: Sprout },
  { value: "Ship", label: "Xuất khẩu", Icon: Ship },
  { value: "Handshake", label: "Hợp tác", Icon: Handshake },
  { value: "Network", label: "Mạng lưới", Icon: Network },
  { value: "Cpu", label: "Công nghệ", Icon: Cpu },
  { value: "Leaf", label: "Nông nghiệp", Icon: Leaf },
  { value: "Rocket", label: "Tăng trưởng", Icon: Rocket },
];

export const TIMELINE_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  TIMELINE_ICON_OPTIONS.map((o) => [o.value, o.Icon])
);

export const DEFAULT_TIMELINE_ICON = "Sprout";
