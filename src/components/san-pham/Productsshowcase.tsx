/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * ProductsShowcase — "Nông sản Unifarm"
 * -----------------------------------------------------------------
 * - Card kiểu ảnh PNG cắt nền (không khung màu sau ảnh) — viền mỏng xám,
 *   hover viền chuyển xanh lá đậm sáng rõ, ảnh phóng to nhẹ. Đúng vị trí
 *   giá tiền, hover sẽ đổi thành 3 icon tròn: xem nhanh / giỏ hàng / yêu
 *   thích.
 * - Chuyển mục (tab danh mục hoặc ảnh gợi ý nhanh): card của mục cũ văng
 *   ra ngẫu nhiên theo từng hướng riêng (xoay + thu nhỏ + mờ dần, ~360ms),
 *   sau đó card của mục mới bay vào từ hướng ngẫu nhiên của chính nó và
 *   "nảy" nhẹ về đúng vị trí (easing overshoot) — so le từng thẻ để cảm
 *   giác sống động, cao cấp hơn kiểu fade-up đơn thuần. Hướng bay của mỗi
 *   card được tính cố định theo id sản phẩm (không dùng Math.random) nên
 *   không lệch giữa server/client. Bấm nhanh nhiều tab liên tiếp vẫn luôn
 *   hội tụ đúng về mục cuối cùng được chọn nhờ dọn timer cũ mỗi lần đổi.
 * -----------------------------------------------------------------
 * ẢNH: thay bằng ảnh PNG nền trong suốt thật của sản phẩm trong mảng
 * PRODUCTS/QUICK_PICKS trước khi lên production (ảnh demo dùng
 * placeholder từ picsum.photos chỉ để đảm bảo luôn hiển thị được).
 */

type Category = { id: string; label: string };
type QuickPick = { id: string; label: string; image: string };
type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  type: string;
  image: string;
  description: string;
  /** Ảnh thật (nếu có) dùng cho gallery ở bảng chi tiết; các sản phẩm chưa có ảnh thật vẫn dùng placeholder demo. */
  gallery?: string[];
  /** Tiêu đề phụ (VD: "Giòn xốp tự nhiên, Hương vị đậm đà") — hiện dưới tên sản phẩm nếu có. */
  subtitle?: string;
  /** Ghi đè nhãn chứng nhận mặc định theo danh mục (VD: "Đạt tiêu chuẩn xuất khẩu"). */
  standard?: string;
  /** Ghi đè bảng thông số mặc định theo danh mục bằng dữ liệu thật của sản phẩm. */
  specs?: { label: string; value: string }[];
  /** Ghi đè 3 dòng "Cam kết chất lượng" mặc định (vẫn dùng chung 3 icon theo thứ tự). */
  commitments?: string[];
};

const CATEGORIES: Category[] = [
  { id: 'all', label: 'Tất cả sản phẩm' },
  { id: 'fresh', label: 'Trái cây tươi' },
  { id: 'seedling', label: 'Cây giống nuôi cấy mô' },
  { id: 'processed', label: 'Sản phẩm chế biến' },
];

const QUICK_PICKS: QuickPick[] = [
  { id: 'banana', label: 'Chuối', image: 'https://picsum.photos/seed/uf-banana/160/160' },
  { id: 'pineapple', label: 'Dứa', image: 'https://picsum.photos/seed/uf-pineapple/160/160' },
  { id: 'melon', label: 'Dưa lưới', image: 'https://picsum.photos/seed/uf-melon/160/160' },
];

const PRODUCTS: Product[] = [
  // Trái cây tươi
  {
    id: 'p1',
    name: 'Chuối Cavendish (Giống VIP 126)',
    price: 21,
    category: 'fresh',
    type: 'banana',
    image: '/images/products/chuoi-chin-1.png',
    gallery: ['/images/products/chuoi-chin-1.png', '/images/products/chuoi-chin-2.png', '/images/products/chuoi-chin-3.png'],
    standard: 'Đạt tiêu chuẩn xuất khẩu',
    description: 'Được trồng trên diện tích 1.000 hecta theo mô hình tích hợp từ nông trại đến nhà máy. Chuối Cavendish của Unifarm là sự kết hợp hoàn hảo giữa công nghệ canh tác hiện đại và điều kiện thổ nhưỡng tối ưu, đảm bảo nguồn cung ổn định và chất lượng vượt trội.',
    specs: [
      { label: 'Giống', value: 'VIP 126 (Kháng Panama, Grand Naine, Williams)' },
      { label: 'Độ ngọt (Brix)', value: '16 – 21' },
      { label: 'Mùa vụ', value: 'Quanh năm' },
      { label: 'Năng suất', value: '40 tấn/hecta/mùa vụ (02 vụ/năm)' },
    ],
  },
  {
    id: 'p2',
    name: 'Dứa (Giống MD2)',
    price: 23,
    category: 'fresh',
    type: 'pineapple',
    image: '/images/products/dua-1.png',
    gallery: ['/images/products/dua-1.png', '/images/products/dua-2.png', '/images/products/dua-3.png'],
    standard: 'Đạt tiêu chuẩn xuất khẩu',
    description: 'Được trồng trên diện tích 50 hecta theo mô hình tích hợp từ nông trại đến nhà máy. Dứa MD2 của Unifarm nổi bật với vị ngọt đậm đà, hương thơm nồng, màu vàng ươm đẹp mắt và tỷ lệ xơ thấp, đảm bảo nguồn cung ổn định và chất lượng vượt trội.',
    specs: [
      { label: 'Giống', value: 'MD2' },
      { label: 'Độ ngọt (Brix)', value: '13 – 16' },
      { label: 'Mùa vụ', value: 'Quanh năm' },
      { label: 'Năng suất', value: '65 tấn/hecta/năm' },
    ],
  },
  {
    id: 'p3',
    name: 'Dưa lưới cao cấp Unifarm',
    price: 19,
    category: 'fresh',
    type: 'melon',
    image: '/images/products/dualuoi-1.png',
    gallery: ['/images/products/dualuoi-1.png', '/images/products/dualuoi-2.png'],
    standard: 'Đạt tiêu chuẩn xuất khẩu',
    description: 'Được trồng tại các nông trại đạt chuẩn VietGAP của Unifarm, Dưa lưới cao cấp được chăm sóc đặc biệt để đảm bảo hương vị thơm ngon, ngọt mát và độ giòn hoàn hảo. Sản phẩm an toàn, không dư lượng thuốc BVTV, là lựa chọn tuyệt vời cho sức khỏe gia đình.',
    specs: [
      { label: 'Các giống', value: 'Inthanon, Fuji, TL3, Golden, Unisweet' },
      { label: 'Độ ngọt (Brix)', value: '10 – 14' },
      { label: 'Mùa vụ', value: 'Quanh năm' },
      { label: 'Năng suất', value: '30 tấn/hecta/mùa vụ' },
    ],
    commitments: ['Truy xuất nguồn gốc minh bạch', 'Kiểm soát chất lượng quốc tế', 'Sản xuất trên dây chuyền hiện đại'],
  },
  {
    id: 'p25',
    name: 'Ổi (Giống Đài Loan)',
    price: 14,
    category: 'fresh',
    type: 'other',
    image: '/images/products/oi-1.png',
    gallery: ['/images/products/oi-1.png', '/images/products/oi-2.png', '/images/products/oi-3.png'],
    standard: 'Đạt tiêu chuẩn xuất khẩu',
    description: 'Được trồng trên diện tích 10 hecta theo mô hình tích hợp từ nông trại đến nhà máy. Ổi Đài Loan của Unifarm nổi bật với vị ngọt thanh, giòn xốp tự nhiên, hương thơm dịu nhẹ, cơm dày và tỷ lệ hạt thấp, đảm bảo nguồn cung ổn định và chất lượng vượt trội.',
    specs: [
      { label: 'Giống', value: 'Đài Loan' },
      { label: 'Độ ngọt (Brix)', value: '7 – 10' },
      { label: 'Mùa vụ', value: 'Quanh năm' },
      { label: 'Năng suất', value: '25 tấn/hecta/năm' },
    ],
  },
  {
    id: 'p26',
    name: 'Chanh Dây (Giống Đài Nông 1, Hoàng Kim)',
    price: 26,
    category: 'fresh',
    type: 'other',
    image: '/images/products/chanhday-1.png',
    gallery: ['/images/products/chanhday-1.png', '/images/products/chanhday-2.png', '/images/products/chanhday-3.png'],
    standard: 'Đạt tiêu chuẩn xuất khẩu',
    description: 'Được trồng trên diện tích 50 hecta theo mô hình tích hợp từ nông trại đến nhà máy. Chanh dây của Unifarm bao gồm hai giống nổi bật: Đài Nông 1 với vị chua thanh đặc trưng và Hoàng Kim với vị ngọt thanh, cả hai đều có cuống thơm nồng, đảm bảo nguồn cung ổn định và chất lượng vượt trội.',
    specs: [
      { label: 'Giống', value: 'Đài Nông 1, Hoàng Kim' },
      { label: 'Độ ngọt (Brix)', value: '16 – 21' },
      { label: 'Mùa vụ', value: 'Quanh năm' },
      { label: 'Năng suất', value: '40 tấn/hecta/mùa vụ, 01 vụ/năm' },
    ],
  },

  // Cây giống nuôi cấy mô
  {
    id: 'p7',
    name: 'Giống chuối già VIP 126 (Kháng Panama, Grand Naine, Williams)',
    price: 12,
    category: 'seedling',
    type: 'banana',
    image: '/images/products/chuoi-chin-3.png',
    description: 'Cây giống chuối già VIP 126 nuôi cấy mô sạch bệnh 100%, mang gen kháng bệnh Panama vượt trội, sinh trưởng đồng đều và khỏe mạnh ngay từ vườn ươm. Đây là dòng giống được Unifarm chọn lọc và nhân giống trên quy mô công nghiệp, sẵn sàng đáp ứng các vùng trồng chuối xuất khẩu quy mô lớn.',
    specs: [
      { label: 'Giống', value: 'VIP 126 (Kháng Panama, Grand Naine, Williams)' },
      { label: 'Tỷ lệ sống', value: '≥ 98%' },
      { label: 'Thời gian xuất vườn', value: '60 - 75 ngày' },
      { label: 'Quy mô cung ứng', value: 'Hàng triệu cây giống/năm' },
    ],
  },
  { id: 'p12', name: 'Giống ổi Đài Loan', price: 10, category: 'seedling', type: 'other', image: '/images/products/oi-1.png', gallery: ['/images/products/oi-1.png', '/images/products/oi-2.png', '/images/products/oi-3.png'], description: 'Giống ổi Đài Loan ít hạt, giòn ngọt, cho trái sớm và sai quả.' },

  // Sản phẩm chế biến
  {
    id: 'p13',
    name: 'Chuối Sấy Giòn',
    price: 8,
    category: 'processed',
    type: 'banana',
    image: '/images/products/chuoi-gion-1.png',
    gallery: ['/images/products/chuoi-gion-1.png', '/images/products/chuoi-gion-2.png', '/images/products/chuoi-gion-3.png'],
    subtitle: 'Giòn xốp tự nhiên, Hương vị đậm đà',
    description: 'Chuối sấy giòn của Unifarm được sản xuất trên dây chuyền hiện đại tại nhà máy Tropitaste. Sử dụng nguồn nguyên liệu chuối tươi chọn lọc, sấy giòn với công nghệ sấy chân không tiên tiến, giữ trọn hương vị tự nhiên và độ giòn xốp hoàn hảo. Sản phẩm không sử dụng chất bảo quản.',
    specs: [
      { label: 'Giống', value: 'Chuối Cavendish' },
      { label: 'Độ ngọt (Brix)', value: '25 – 28' },
      { label: 'Năng suất', value: '50 tấn/tháng' },
      { label: 'Hạn sử dụng', value: '12 tháng' },
      { label: 'Quy cách', value: '100g/túi (24 túi/thùng) hoặc 200g/túi (12 túi/thùng)' },
      { label: 'Khả năng xếp hàng', value: '2.500 thùng/20 feet' },
    ],
    commitments: ['Cam kết chất lượng minh bạch', 'Kiểm soát dư lượng nghiêm ngặt (MRL)', 'Sản xuất trên dây chuyền hiện đại'],
  },
  {
    id: 'p27',
    name: 'Tinh Bột Kháng Chuối Xanh (Hàm lượng chất kháng tiêu 10g/100g)',
    price: 35,
    category: 'processed',
    type: 'banana',
    image: '/images/products/chuoi-chin-1.png',
    gallery: ['/images/products/chuoi-chin-1.png', '/images/products/chuoi-chin-2.png', '/images/products/chuoi-chin-3.png'],
    subtitle: 'Nguồn gốc tự nhiên, tốt cho tiêu hóa',
    description: 'Tinh bột kháng chuối xanh của Unifarm được sản xuất trên dây chuyền hiện đại tại nhà máy Tropitaste. Sử dụng nguồn nguyên liệu chuối xanh chọn lọc từ nông trại, chế biến với công nghệ tiên tiến, giữ trọn hàm lượng tinh bột kháng cao và hương vị tự nhiên. Sản phẩm hoàn toàn tự nhiên, an toàn cho sức khỏe.',
    specs: [
      { label: 'Giống', value: 'Chuối xanh chế biến (Chuối Cavendish)' },
      { label: 'Năng suất', value: 'TB kháng: 50 tấn/tháng' },
      { label: 'Hạn sử dụng', value: '12 tháng' },
      { label: 'Quy cách', value: '5kg, 10kg, 15kg, 20kg (túi PE bên trong thùng carton 5 lớp)' },
    ],
    commitments: ['Cam kết chất lượng minh bạch', 'Kiểm soát dư lượng nghiêm ngặt (MRL)', 'Sản xuất trên dây chuyền hiện đại'],
  },
  {
    id: 'p28',
    name: 'Chuối Sấy Dẻo Năng Lượng Mặt Trời (Công nghệ sấy độc quyền Tropitaste)',
    price: 16,
    category: 'processed',
    type: 'banana',
    image: '/images/products/chuoi-gion-2.png',
    gallery: ['/images/products/chuoi-gion-2.png', '/images/products/chuoi-gion-3.png', '/images/products/chuoi-gion-1.png'],
    subtitle: 'Nguồn gốc tự nhiên, Dinh dưỡng vẹn nguyên',
    description: 'Chuối sấy dẻo Unifarm được sản xuất tại nhà máy Tropitaste trên dây chuyền hiện đại, sử dụng công nghệ sấy năng lượng mặt trời tiên tiến. Nguồn nguyên liệu chuối tươi được chọn lọc kiểm soát chặt chẽ từ nông trại đến thành phẩm, đảm bảo giữ trọn hương vị tự nhiên và giá trị dinh dưỡng cao nhất.',
    specs: [
      { label: 'Giống', value: 'Chuối chè (Cavendish, v.v.)' },
      { label: 'Năng suất', value: 'Sấy dẻo: 30 tấn/tháng' },
      { label: 'Hạn sử dụng', value: '24 tháng (Bảo quản -18°C hoặc cấp đông IQF)' },
      { label: 'Quy cách', value: '200g, 500g, 1kg, 2.5kg, 5kg, 10kg, 15kg (Khối lượng tịnh)' },
      { label: 'Độ Brix tối thiểu', value: '16–21 (Thanh long, Dứa), 28–30 (Sấy dẻo)' },
    ],
    commitments: ['Cam kết chất lượng minh bạch', 'Kiểm soát dư lượng thuốc sâu (MRL)', 'Sản xuất trên dây chuyền hiện đại'],
  },
  {
    id: 'p29',
    name: 'IQF Chuối',
    price: 19,
    category: 'processed',
    type: 'banana',
    image: '/images/products/chuoi-chin-2.png',
    gallery: ['/images/products/chuoi-chin-2.png', '/images/products/chuoi-chin-1.png', '/images/products/chuoi-chin-3.png'],
    description: 'Hệ thống tích hợp của Unifarm kết nối đồng bộ các hoạt động, từ nông trại đến nhà máy Tropitaste. Chuối tươi chất lượng cao được xử lý, kiểm soát chất lượng và cấp đông nhanh (IQF) trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt cho thị trường xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Độ Brix tối thiểu', value: '16 – 21 (Dưa lưới: 10–14, Ổi: 7–10, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm (nguồn cung ổn định)' },
      { label: 'Năng suất', value: 'Công suất chế biến 50 tấn/ngày' },
      { label: 'Quy cách bao bì', value: '200g, 500g, 1kg, 2.5kg, 5kg, 10kg, 15kg (Khối lượng tịnh)' },
      { label: 'Nhiệt độ bảo quản', value: '-18°C' },
    ],
  },
  {
    id: 'p30',
    name: 'IQF Dưa lưới',
    price: 21,
    category: 'processed',
    type: 'melon',
    image: '/images/products/dualuoi-1.png',
    gallery: ['/images/products/dualuoi-1.png', '/images/products/dualuoi-2.png'],
    description: 'Hệ thống tích hợp của Unifarm kết nối đồng bộ các hoạt động, từ nông trại đến nhà máy Tropitaste. Dưa lưới tươi chất lượng cao được xử lý, kiểm soát chất lượng và cấp đông nhanh (IQF) trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt cho thị trường xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Độ Brix tối thiểu', value: '16 – 21 (Dưa lưới: 10–14, Ổi: 7–10, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm (nguồn cung ổn định)' },
      { label: 'Năng suất', value: 'Công suất chế biến 50 tấn/ngày' },
      { label: 'Quy cách bao bì', value: '200g, 500g, 1kg, 2.5kg, 5kg, 10kg, 15kg (Khối lượng tịnh)' },
      { label: 'Nhiệt độ bảo quản', value: '-18°C' },
    ],
  },
  {
    id: 'p31',
    name: 'IQF Xoài',
    price: 22,
    category: 'processed',
    type: 'other',
    image: 'https://chuahoangphap.com.vn/Images/News/bizmac__full_27002.jpg',
    gallery: ['https://chuahoangphap.com.vn/Images/News/bizmac__full_27002.jpg'],
    description: 'Hệ thống tích hợp của Unifarm kết nối đồng bộ các hoạt động, từ nông trại đến nhà máy Tropitaste. Xoài tươi chất lượng cao được xử lý, kiểm soát chất lượng và cấp đông nhanh (IQF) trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt cho thị trường xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Độ Brix tối thiểu', value: '16 – 21 (Dưa lưới: 10–14, Ổi: 7–10, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm (nguồn cung ổn định)' },
      { label: 'Năng suất', value: 'Công suất chế biến 50 tấn/ngày' },
      { label: 'Quy cách bao bì', value: '200g, 500g, 1kg, 2.5kg, 5kg, 10kg, 15kg (Khối lượng tịnh)' },
      { label: 'Nhiệt độ bảo quản', value: '-18°C' },
    ],
  },
  {
    id: 'p32',
    name: 'IQF Chanh dây',
    price: 23,
    category: 'processed',
    type: 'other',
    image: '/images/products/chanhday-1.png',
    gallery: ['/images/products/chanhday-1.png', '/images/products/chanhday-2.png', '/images/products/chanhday-3.png'],
    description: 'Hệ thống tích hợp của Unifarm kết nối đồng bộ các hoạt động, từ nông trại đến nhà máy Tropitaste. Chanh dây tươi chất lượng cao được xử lý, kiểm soát chất lượng và cấp đông nhanh (IQF) trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt cho thị trường xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Độ Brix tối thiểu', value: '16 – 21 (Dưa lưới: 10–14, Ổi: 7–10, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm (nguồn cung ổn định)' },
      { label: 'Năng suất', value: 'Công suất chế biến 50 tấn/ngày' },
      { label: 'Quy cách bao bì', value: '200g, 500g, 1kg, 2.5kg, 5kg, 10kg, 15kg (Khối lượng tịnh)' },
      { label: 'Nhiệt độ bảo quản', value: '-18°C' },
    ],
  },
  {
    id: 'p33',
    name: 'IQF Dứa',
    price: 20,
    category: 'processed',
    type: 'pineapple',
    image: '/images/products/dua-1.png',
    gallery: ['/images/products/dua-1.png', '/images/products/dua-2.png', '/images/products/dua-3.png'],
    description: 'Hệ thống tích hợp của Unifarm kết nối đồng bộ các hoạt động, từ nông trại đến nhà máy Tropitaste. Dứa tươi chất lượng cao được xử lý, kiểm soát chất lượng và cấp đông nhanh (IQF) trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt cho thị trường xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Độ Brix tối thiểu', value: '16 – 21 (Dưa lưới: 10–14, Ổi: 7–10, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm (nguồn cung ổn định)' },
      { label: 'Năng suất', value: 'Công suất chế biến 50 tấn/ngày' },
      { label: 'Quy cách bao bì', value: '200g, 500g, 1kg, 2.5kg, 5kg, 10kg, 15kg (Khối lượng tịnh)' },
      { label: 'Nhiệt độ bảo quản', value: '-18°C' },
    ],
  },
  {
    id: 'p34',
    name: 'IQF Thanh long',
    price: 24,
    category: 'processed',
    type: 'other',
    image: '/images/products/thanhlong-1.png',
    gallery: ['/images/products/thanhlong-1.png', '/images/products/thanhlong-2.png'],
    description: 'Hệ thống tích hợp của Unifarm kết nối đồng bộ các hoạt động, từ nông trại đến nhà máy Tropitaste. Thanh long tươi chất lượng cao được xử lý, kiểm soát chất lượng và cấp đông nhanh (IQF) trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt cho thị trường xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Độ Brix tối thiểu', value: '16 – 21 (Dưa lưới: 10–14, Ổi: 7–10, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm (nguồn cung ổn định)' },
      { label: 'Năng suất', value: 'Công suất chế biến 50 tấn/ngày' },
      { label: 'Quy cách bao bì', value: '200g, 500g, 1kg, 2.5kg, 5kg, 10kg, 15kg (Khối lượng tịnh)' },
      { label: 'Nhiệt độ bảo quản', value: '-18°C' },
    ],
  },
  {
    id: 'p35',
    name: 'IQF Dưa hấu',
    price: 18,
    category: 'processed',
    type: 'other',
    image: 'https://product.hstatic.net/1000141988/product/dua_hau_do_d7a6bb707b8c4201b8e48884e82a93ab_master.png',
    gallery: ['https://product.hstatic.net/1000141988/product/dua_hau_do_d7a6bb707b8c4201b8e48884e82a93ab_master.png', '/images/products/duahau-2.png'],
    description: 'Hệ thống tích hợp của Unifarm kết nối đồng bộ các hoạt động, từ nông trại đến nhà máy Tropitaste. Dưa hấu tươi chất lượng cao được xử lý, kiểm soát chất lượng và cấp đông nhanh (IQF) trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt cho thị trường xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Độ Brix tối thiểu', value: '16 – 21 (Dưa lưới: 10–14, Ổi: 7–10, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm (nguồn cung ổn định)' },
      { label: 'Năng suất', value: 'Công suất chế biến 50 tấn/ngày' },
      { label: 'Quy cách bao bì', value: '200g, 500g, 1kg, 2.5kg, 5kg, 10kg, 15kg (Khối lượng tịnh)' },
      { label: 'Nhiệt độ bảo quản', value: '-18°C' },
    ],
  },
  {
    id: 'p36',
    name: 'Puree Chuối',
    price: 17,
    category: 'processed',
    type: 'banana',
    image: '/images/products/chuoi-chin-3.png',
    gallery: ['/images/products/chuoi-chin-3.png', '/images/products/chuoi-chin-1.png', '/images/products/chuoi-chin-2.png'],
    description: 'Hệ thống tích hợp của Unifarm kiểm soát chất lượng từ khâu canh tác đến thành phẩm. Chuối tươi chất lượng cao được xử lý, xay nhuyễn và thanh trùng tại nhà máy Tropitaste trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt về an toàn thực phẩm cho thị trường trong nước và xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Hàm lượng trái cây', value: '100% nguyên chất, không pha đường, không chất bảo quản' },
      { label: 'Độ Brix', value: 'Tùy loại (VD: Dưa lưới 10–14, Dứa 12–16, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm' },
      { label: 'Năng suất', value: 'Cung cấp theo đơn đặt hàng' },
      { label: 'Quy cách', value: '500g, 1kg, 5kg (thùng carton hoặc túi nhôm)' },
      { label: 'Điều kiện bảo quản', value: '-18°C (cấp đông) hoặc hút chân không, tiệt trùng (hạn lâu hơn)' },
    ],
    commitments: ['Truy xuất nguồn gốc minh bạch', 'Kiểm soát chất lượng nghiêm ngặt (MRL)', 'Sản xuất trên dây chuyền hiện đại (Tropitaste)'],
  },
  {
    id: 'p37',
    name: 'Puree Dưa lưới',
    price: 19,
    category: 'processed',
    type: 'melon',
    image: '/images/products/dualuoi-2.png',
    gallery: ['/images/products/dualuoi-2.png', '/images/products/dualuoi-1.png'],
    description: 'Hệ thống tích hợp của Unifarm kiểm soát chất lượng từ khâu canh tác đến thành phẩm. Dưa lưới tươi chất lượng cao được xử lý, xay nhuyễn và thanh trùng tại nhà máy Tropitaste trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt về an toàn thực phẩm cho thị trường trong nước và xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Hàm lượng trái cây', value: '100% nguyên chất, không pha đường, không chất bảo quản' },
      { label: 'Độ Brix', value: 'Tùy loại (VD: Dưa lưới 10–14, Dứa 12–16, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm' },
      { label: 'Năng suất', value: 'Cung cấp theo đơn đặt hàng' },
      { label: 'Quy cách', value: '500g, 1kg, 5kg (thùng carton hoặc túi nhôm)' },
      { label: 'Điều kiện bảo quản', value: '-18°C (cấp đông) hoặc hút chân không, tiệt trùng (hạn lâu hơn)' },
    ],
    commitments: ['Truy xuất nguồn gốc minh bạch', 'Kiểm soát chất lượng nghiêm ngặt (MRL)', 'Sản xuất trên dây chuyền hiện đại (Tropitaste)'],
  },
  {
    id: 'p38',
    name: 'Puree Xoài',
    price: 20,
    category: 'processed',
    type: 'other',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdIR0BkbvyemzhddEy9JaScT0HaAYL5ygHwMvm1dAdEg&s=10',
    gallery: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdIR0BkbvyemzhddEy9JaScT0HaAYL5ygHwMvm1dAdEg&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCrQtL1SO73WUA4TvzO6DfJSWcyeZeINDtFtv2UAlGpw&s=10'],
    description: 'Hệ thống tích hợp của Unifarm kiểm soát chất lượng từ khâu canh tác đến thành phẩm. Xoài tươi chất lượng cao được xử lý, xay nhuyễn và thanh trùng tại nhà máy Tropitaste trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt về an toàn thực phẩm cho thị trường trong nước và xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Hàm lượng trái cây', value: '100% nguyên chất, không pha đường, không chất bảo quản' },
      { label: 'Độ Brix', value: 'Tùy loại (VD: Dưa lưới 10–14, Dứa 12–16, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm' },
      { label: 'Năng suất', value: 'Cung cấp theo đơn đặt hàng' },
      { label: 'Quy cách', value: '500g, 1kg, 5kg (thùng carton hoặc túi nhôm)' },
      { label: 'Điều kiện bảo quản', value: '-18°C (cấp đông) hoặc hút chân không, tiệt trùng (hạn lâu hơn)' },
    ],
    commitments: ['Truy xuất nguồn gốc minh bạch', 'Kiểm soát chất lượng nghiêm ngặt (MRL)', 'Sản xuất trên dây chuyền hiện đại (Tropitaste)'],
  },
  {
    id: 'p39',
    name: 'Puree Chanh dây',
    price: 21,
    category: 'processed',
    type: 'other',
    image: '/images/products/chanhday-2.png',
    gallery: ['/images/products/chanhday-2.png', '/images/products/chanhday-1.png', '/images/products/chanhday-3.png'],
    description: 'Hệ thống tích hợp của Unifarm kiểm soát chất lượng từ khâu canh tác đến thành phẩm. Chanh dây tươi chất lượng cao được xử lý, xay nhuyễn và thanh trùng tại nhà máy Tropitaste trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt về an toàn thực phẩm cho thị trường trong nước và xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Hàm lượng trái cây', value: '100% nguyên chất, không pha đường, không chất bảo quản' },
      { label: 'Độ Brix', value: 'Tùy loại (VD: Dưa lưới 10–14, Dứa 12–16, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm' },
      { label: 'Năng suất', value: 'Cung cấp theo đơn đặt hàng' },
      { label: 'Quy cách', value: '500g, 1kg, 5kg (thùng carton hoặc túi nhôm)' },
      { label: 'Điều kiện bảo quản', value: '-18°C (cấp đông) hoặc hút chân không, tiệt trùng (hạn lâu hơn)' },
    ],
    commitments: ['Truy xuất nguồn gốc minh bạch', 'Kiểm soát chất lượng nghiêm ngặt (MRL)', 'Sản xuất trên dây chuyền hiện đại (Tropitaste)'],
  },
  {
    id: 'p40',
    name: 'Puree Dứa',
    price: 18,
    category: 'processed',
    type: 'pineapple',
    image: '/images/products/dua-2.png',
    gallery: ['/images/products/dua-2.png', '/images/products/dua-1.png', '/images/products/dua-3.png'],
    description: 'Hệ thống tích hợp của Unifarm kiểm soát chất lượng từ khâu canh tác đến thành phẩm. Dứa tươi chất lượng cao được xử lý, xay nhuyễn và thanh trùng tại nhà máy Tropitaste trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt về an toàn thực phẩm cho thị trường trong nước và xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Hàm lượng trái cây', value: '100% nguyên chất, không pha đường, không chất bảo quản' },
      { label: 'Độ Brix', value: 'Tùy loại (VD: Dưa lưới 10–14, Dứa 12–16, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm' },
      { label: 'Năng suất', value: 'Cung cấp theo đơn đặt hàng' },
      { label: 'Quy cách', value: '500g, 1kg, 5kg (thùng carton hoặc túi nhôm)' },
      { label: 'Điều kiện bảo quản', value: '-18°C (cấp đông) hoặc hút chân không, tiệt trùng (hạn lâu hơn)' },
    ],
    commitments: ['Truy xuất nguồn gốc minh bạch', 'Kiểm soát chất lượng nghiêm ngặt (MRL)', 'Sản xuất trên dây chuyền hiện đại (Tropitaste)'],
  },
  {
    id: 'p41',
    name: 'Puree Thanh long',
    price: 22,
    category: 'processed',
    type: 'other',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThofxfyM1VyBhac5kznsY2BLI9r-uKkW3NcJAHI4FkGA&s=10',
    gallery: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThofxfyM1VyBhac5kznsY2BLI9r-uKkW3NcJAHI4FkGA&s=10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFN1XB3cA6YWXe4ERIk-4sljdFWp57CnGBfTD8Nol73g&s=10'],
    description: 'Hệ thống tích hợp của Unifarm kiểm soát chất lượng từ khâu canh tác đến thành phẩm. Thanh long tươi chất lượng cao được xử lý, xay nhuyễn và thanh trùng tại nhà máy Tropitaste trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt về an toàn thực phẩm cho thị trường trong nước và xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Hàm lượng trái cây', value: '100% nguyên chất, không pha đường, không chất bảo quản' },
      { label: 'Độ Brix', value: 'Tùy loại (VD: Dưa lưới 10–14, Dứa 12–16, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm' },
      { label: 'Năng suất', value: 'Cung cấp theo đơn đặt hàng' },
      { label: 'Quy cách', value: '500g, 1kg, 5kg (thùng carton hoặc túi nhôm)' },
      { label: 'Điều kiện bảo quản', value: '-18°C (cấp đông) hoặc hút chân không, tiệt trùng (hạn lâu hơn)' },
    ],
    commitments: ['Truy xuất nguồn gốc minh bạch', 'Kiểm soát chất lượng nghiêm ngặt (MRL)', 'Sản xuất trên dây chuyền hiện đại (Tropitaste)'],
  },
  {
    id: 'p42',
    name: 'Puree Dưa hấu',
    price: 16,
    category: 'processed',
    type: 'other',
    image: 'https://tienthinh.vn/public/upload/images/hinhsanpham/-30831689906661.png',
    gallery: ['https://tienthinh.vn/public/upload/images/hinhsanpham/-30831689906661.png'],
    description: 'Hệ thống tích hợp của Unifarm kiểm soát chất lượng từ khâu canh tác đến thành phẩm. Dưa hấu tươi chất lượng cao được xử lý, xay nhuyễn và thanh trùng tại nhà máy Tropitaste trên dây chuyền hiện đại, đáp ứng các tiêu chuẩn nghiêm ngặt về an toàn thực phẩm cho thị trường trong nước và xuất khẩu.',
    specs: [
      { label: 'Giống', value: 'Đa dạng theo từng loại trái cây' },
      { label: 'Hàm lượng trái cây', value: '100% nguyên chất, không pha đường, không chất bảo quản' },
      { label: 'Độ Brix', value: 'Tùy loại (VD: Dưa lưới 10–14, Dứa 12–16, v.v.)' },
      { label: 'Mùa vụ', value: 'Quanh năm' },
      { label: 'Năng suất', value: 'Cung cấp theo đơn đặt hàng' },
      { label: 'Quy cách', value: '500g, 1kg, 5kg (thùng carton hoặc túi nhôm)' },
      { label: 'Điều kiện bảo quản', value: '-18°C (cấp đông) hoặc hút chân không, tiệt trùng (hạn lâu hơn)' },
    ],
    commitments: ['Truy xuất nguồn gốc minh bạch', 'Kiểm soát chất lượng nghiêm ngặt (MRL)', 'Sản xuất trên dây chuyền hiện đại (Tropitaste)'],
  },
];

function CartIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 4h2l2.2 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20.5" r="1.4" fill="currentColor" />
      <circle cx="17" cy="20.5" r="1.4" fill="currentColor" />
    </svg>
  );
}
function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function EyeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon({ className = 'h-4 w-4', filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} className={className}>
      <path
        d="M12 20.5s-7.5-4.6-10-9.3C.4 7.7 2 4 5.6 4c2 0 3.5 1.1 4.4 2.6C10.9 5.1 12.4 4 14.4 4 18 4 19.6 7.7 18 11.2c-2.5 4.7-10 9.3-10 9.3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CloseIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ShieldCheckIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FlaskIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 3h6M10 3v6.2L5.5 18a2 2 0 0 0 1.8 2.9h9.4a2 2 0 0 0 1.8-2.9L14 9.2V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 15h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function FactoryIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 21V11l6 4v-4l6 4V6l6 4v11H3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 21h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function DocumentIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.5 13h5M9.5 16.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function PhoneIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Nhãn chứng nhận ngắn theo từng danh mục — hiển thị dưới tên sản phẩm trong bảng chi tiết.
 * Dùng `p.standard` (dữ liệu thật) nếu có, ngược lại rơi về mặc định theo danh mục. */
function getCertBadge(p: Product) {
  if (p.standard) return p.standard;
  switch (p.category) {
    case 'fresh':
      return 'Đạt tiêu chuẩn xuất khẩu';
    case 'seedling':
      return 'Đạt chuẩn cây giống sạch bệnh';
    case 'processed':
      return 'Đạt chuẩn an toàn thực phẩm';
    default:
      return 'Đạt tiêu chuẩn chất lượng cao';
  }
}

/** Bảng thông số kỹ thuật — dùng `p.specs` (dữ liệu thật) nếu có, ngược lại rơi về
 * bảng mặc định ngắn gọn theo từng nhóm sản phẩm. */
function getProductSpecs(p: Product): { label: string; value: string }[] {
  if (p.specs && p.specs.length > 0) return p.specs;
  switch (p.category) {
    case 'fresh':
      return [
        { label: 'Giống', value: p.name },
        { label: 'Độ ngọt (Brix)', value: '13 - 16' },
        { label: 'Mùa vụ', value: 'Quanh năm' },
        { label: 'Năng suất', value: '60 - 70 tấn/hecta' },
      ];
    case 'seedling':
      return [
        { label: 'Giống', value: p.name },
        { label: 'Tỷ lệ sống', value: '≥ 95%' },
        { label: 'Thời gian xuất vườn', value: '45 - 60 ngày' },
        { label: 'Quy mô cung ứng', value: 'Số lượng lớn theo đơn hàng' },
      ];
    case 'processed':
      return [
        { label: 'Sản phẩm', value: p.name },
        { label: 'Hạn sử dụng', value: '12 tháng' },
        { label: 'Đóng gói', value: 'Túi/hộp tiêu chuẩn xuất khẩu' },
        { label: 'Chứng nhận', value: 'An toàn thực phẩm' },
      ];
    default:
      return [
        { label: 'Sản phẩm', value: p.name },
        { label: 'Xuất xứ', value: 'Sản xuất trong nước' },
        { label: 'Bảo hành', value: 'Theo chính sách nhà cung cấp' },
        { label: 'Đóng gói', value: 'Theo quy cách tiêu chuẩn' },
      ];
  }
}

const QUALITY_COMMITMENTS = [
  { icon: ShieldCheckIcon, label: 'Truy xuất nguồn gốc minh bạch' },
  { icon: FlaskIcon, label: 'Kiểm soát dư lượng nghiêm ngặt (MRL)' },
  { icon: FactoryIcon, label: 'Sản xuất trên dây chuyền hiện đại' },
];

/** 3 ảnh cho gallery ở bảng chi tiết — dùng `gallery` (ảnh thật) nếu có,
 * ngược lại rơi về ảnh chính + 2 góc chụp demo placeholder. */
function getGalleryImages(p: Product): string[] {
  if (p.gallery && p.gallery.length > 0) return p.gallery;
  return [p.image, `https://picsum.photos/seed/${p.id}-alt1/500/500`, `https://picsum.photos/seed/${p.id}-alt2/500/500`];
}

/** Ảnh lớn + dải thumbnail bên dưới, bấm để đổi ảnh xem chính — dùng `key={product.id}`
 * ở nơi gọi để state tự reset về ảnh đầu tiên mỗi khi đổi sản phẩm, không cần effect. */
function ProductGallery({ product }: { product: Product }) {
  const images = getGalleryImages(product);
  const [active, setActive] = useState(images[0]);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="aspect-[16/11] w-full overflow-hidden rounded-xl border border-neutral-100 bg-gradient-to-b from-[#fffacd]/30 to-[#87cefa]/10 p-5 shadow-inner sm:p-6">
        <img
          key={active}
          src={active}
          alt={product.name}
          className="h-full w-full object-contain"
          style={{ animation: 'ps-fadeUp 320ms ease-out both' }}
        />
      </div>
      <div className="flex items-center gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(src)}
            aria-label={`Xem ảnh ${i + 1}`}
            className={`h-14 w-14 overflow-hidden rounded-lg border-2 p-1 transition-all duration-300 sm:h-16 sm:w-16 ${
              active === src
                ? 'border-[#006400] shadow-[0_4px_14px_rgba(0,100,0,0.25)]'
                : 'border-neutral-200 opacity-70 hover:border-[#87cefa] hover:opacity-100'
            }`}
          >
            <img src={src} alt="" className="h-full w-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
}

// Deterministic pseudo-random offset per product id (same on server & client —
// avoids hydration mismatches that Math.random() would cause). Spreads each
// card out to its own direction/rotation for the scatter transition.
function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
function getScatter(id: string) {
  const h = hashString(id);
  const angle = (h % 360) * (Math.PI / 180);
  const distance = 90 + (h % 110); // 90–200px out
  const rotate = (h % 70) - 35; // -35..35deg
  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance),
    rotate,
  };
}

function IconButton({
  onClick,
  children,
  active,
  label,
}: {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 sm:h-9 sm:w-9 ${
        active ? 'bg-[#006400] text-[#fffacd]' : 'bg-[#87cefa]/25 text-[#006400] hover:bg-[#006400] hover:text-[#fffacd]'
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductsShowcase() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  // ---- Scroll reveal: toàn bộ khối (tiêu đề, tabs, quick-pick, lưới sản
  // phẩm) mờ dần + trồi lên trong ~4.5s, chạy đúng 1 lần khi cuộn tới.
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ---- Scatter transition state machine -------------------------------
  // displayCat/displayQuick = what's actually rendered right now.
  // isExiting = true while the OLD cards are flying out; once that
  // finishes, displayCat/displayQuick swap to the target and the NEW
  // cards fly in from their own scattered origin and settle into place.
  // A ref-tracked timer + "skip on first mount" guard means rapid clicks
  // always resolve to the last-clicked category — no leftover stale swap.
  const [displayCat, setDisplayCat] = useState(activeCat);
  const [displayQuick, setDisplayQuick] = useState(quickFilter);
  const [isExiting, setIsExiting] = useState(false);
  const isFirstRun = useRef(true);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setIsExiting(true);
    const t = setTimeout(() => {
      setDisplayCat(activeCat);
      setDisplayQuick(quickFilter);
      setIsExiting(false);
    }, 380);
    timersRef.current.push(t);

    return () => timersRef.current.forEach(clearTimeout);
  }, [activeCat, quickFilter]);

  const displayed = PRODUCTS.filter(
    (p) => (displayCat === 'all' || p.category === displayCat) && (!displayQuick || p.type === displayQuick)
  );

  function handleAddToCart(id: string) {
    setAddedId(id);
    setTimeout(() => setAddedId((cur) => (cur === id ? null : cur)), 1600);
  }

  function toggleLike(id: string) {
    setLiked((cur) => {
      const next = new Set(cur);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <section ref={sectionRef} className="w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat">
      <style>{`
        @keyframes ps-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ps-scatterIn {
          0%   { opacity: 0; transform: translate(var(--sx), var(--sy)) rotate(var(--sr)) scale(0.35); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
        }
      `}</style>

      <div
        className="mx-auto max-w-[1300px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
        style={{
          transition: 'opacity 4500ms cubic-bezier(0.16,1,0.3,1), transform 4500ms cubic-bezier(0.16,1,0.3,1)',
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(60px)',
        }}
      >
        {/* Heading */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#006400] sm:text-sm">
            Sản phẩm của chúng tôi
          </p>
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
            Nông sản Unifarm
          </h2>
        </div>

        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-x-6 gap-y-2 border-b border-neutral-200 pb-4 sm:mb-10 sm:gap-x-10">
          {CATEGORIES.map((c) => {
            const isActive = c.id === activeCat;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCat(c.id)}
                className={`whitespace-nowrap border-b-2 pb-1 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'border-[#006400] text-[#006400]'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Quick-pick tiles */}
        <div className="mb-10 flex flex-wrap justify-center gap-6 sm:mb-14 sm:gap-10">
          {QUICK_PICKS.map((q) => {
            const isActive = quickFilter === q.id;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setQuickFilter((cur) => (cur === q.id ? null : q.id))}
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-full ring-2 transition-all duration-300 sm:h-20 sm:w-20 ${
                    isActive
                      ? 'scale-110 ring-[#87cefa] shadow-[0_0_0_5px_rgba(135,206,250,0.25)]'
                      : 'ring-[#fffacd] group-hover:scale-105 group-hover:ring-[#87cefa]/70'
                  }`}
                >
                  <img src={q.image} alt={q.label} className="h-full w-full object-cover" />
                </span>
                <span
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    isActive ? 'text-[#006400]' : 'text-neutral-500 group-hover:text-[#006400]'
                  }`}
                >
                  {q.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product grid — card cũ văng ra ngẫu nhiên (xoay + thu nhỏ + mờ
            dần) khi đổi mục, sau đó card mới của mục đích bay vào từ
            hướng ngẫu nhiên riêng và "nảy" về đúng vị trí (overshoot ease)
            — so le theo thứ tự để tạo cảm giác chuyển cảnh sống động. */}
        {displayed.length === 0 ? (
          <p className="py-16 text-center text-sm text-neutral-400">
            Chưa có sản phẩm phù hợp trong mục này.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {displayed.map((p, i) => {
              const justAdded = addedId === p.id;
              const isLiked = liked.has(p.id);
              const scatter = getScatter(p.id);

              return (
                <div
                  key={p.id}
                  className={isExiting ? 'pointer-events-none' : ''}
                  style={
                    isExiting
                      ? {
                          transform: `translate(${scatter.x}px, ${scatter.y}px) rotate(${scatter.rotate}deg) scale(0.35)`,
                          opacity: 0,
                          transition: `transform 360ms cubic-bezier(0.55,0,0.85,0.35) ${i * 18}ms, opacity 300ms ease-in ${i * 18}ms`,
                        }
                      : ({
                          '--sx': `${scatter.x}px`,
                          '--sy': `${scatter.y}px`,
                          '--sr': `${scatter.rotate}deg`,
                          animation: 'ps-scatterIn 720ms cubic-bezier(0.34,1.56,0.64,1) both',
                          animationDelay: `${i * 45}ms`,
                        } as React.CSSProperties)
                  }
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(p)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelected(p)}
                    className="group cursor-pointer border border-neutral-200 bg-white p-5 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#006400] hover:shadow-[0_16px_30px_rgba(0,100,0,0.14)]"
                  >
                    {/* Ảnh PNG nền trong suốt — không còn khung màu phía sau */}
                    <div className="mx-auto flex h-32 items-center justify-center sm:h-40">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="max-h-full w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                    </div>

                    <h3 className="mt-4 text-[13px] font-bold text-neutral-800 sm:text-sm">{p.name}</h3>

                    {/* Icon liên hệ (bấm được) <-> 3 icon hành động, đổi chỗ cho nhau khi hover, không xô lệch layout */}
                    <div className="relative mt-2 flex h-9 items-center justify-center">
                      <Link
                        href="/#contact"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Liên hệ tư vấn giá ${p.name}`}
                        className="absolute inline-flex items-center gap-1.5 rounded-full bg-[#87cefa]/20 px-3 py-1 text-[12px] font-bold text-[#006400] transition-all duration-300 ease-out hover:bg-[#006400] hover:text-[#fffacd] group-hover:scale-0 group-hover:opacity-0 sm:text-[13px]"
                      >
                        <PhoneIcon className="h-3.5 w-3.5" />
                        Liên hệ
                      </Link>
                      <div className="absolute flex items-center gap-2 scale-75 opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100">
                        <IconButton
                          label="Xem nhanh"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(p);
                          }}
                        >
                          <EyeIcon />
                        </IconButton>
                        <IconButton
                          label="Thêm vào giỏ hàng"
                          active={justAdded}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(p.id);
                          }}
                        >
                          {justAdded ? <CheckIcon /> : <CartIcon />}
                        </IconButton>
                        <IconButton
                          label="Yêu thích"
                          active={isLiked}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(p.id);
                          }}
                        >
                          <HeartIcon filled={isLiked} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------------- PRODUCT DETAIL PANEL ---------------- */}
      {selected && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#001b0b]/80 px-4 py-8 backdrop-blur-sm sm:px-5"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative grid max-h-[92vh] w-full max-w-[1040px] grid-cols-1 gap-8 overflow-y-auto rounded-2xl bg-white p-6 pt-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:grid-cols-[1.15fr_1fr] sm:gap-10 sm:p-9 sm:pt-10"
            style={{ animation: 'ps-fadeUp 380ms cubic-bezier(0.19,1,0.22,1) both' }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-[#006400] via-[#87cefa] to-[#fffacd]" />

            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Đóng"
              className="absolute -top-4 -right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#006400] text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-all duration-200 hover:scale-110 hover:bg-[#00520a]"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            {/* Ảnh sản phẩm — ảnh lớn + dải thumbnail bấm để đổi ảnh xem */}
            <div className="flex min-w-0 items-center justify-center">
              <ProductGallery key={selected.id} product={selected} />
            </div>

            {/* Chi tiết */}
            <div className="flex min-w-0 flex-col">
              <span className="mb-2 inline-flex w-fit items-center rounded-full bg-[#87cefa]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#006400]">
                {CATEGORIES.find((c) => c.id === selected.category)?.label}
              </span>
              <h3 className="text-xl font-extrabold text-neutral-900 sm:text-2xl">{selected.name}</h3>
              {selected.subtitle && (
                <p className="mt-1 text-sm font-semibold text-neutral-500">{selected.subtitle}</p>
              )}
              <p className="mb-4 mt-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#006400] sm:text-sm">
                <ShieldCheckIcon className="h-4 w-4" /> {getCertBadge(selected)}
              </p>

              <p className="mb-5 text-sm leading-relaxed text-neutral-600">{selected.description}</p>

              <hr className="mb-5 border-neutral-100" />

              {/* Bảng thông số */}
              <p className="mb-2 text-sm font-bold text-neutral-900">Bảng thông số</p>
              <div className="mb-5 overflow-hidden rounded-lg border border-neutral-200">
                <table className="w-full table-fixed text-left text-xs sm:text-sm">
                  <tbody>
                    <tr className="bg-[#006400]/5">
                      <th className="w-1/2 px-3 py-2 font-semibold text-neutral-700">Đặc tính</th>
                      <th className="px-3 py-2 font-semibold text-neutral-700">Chi tiết sản phẩm</th>
                    </tr>
                    {getProductSpecs(selected).map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-[#87cefa]/5'}>
                        <td className="px-3 py-2 text-neutral-500">{row.label}</td>
                        <td className="px-3 py-2 font-medium text-neutral-800">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cam kết chất lượng */}
              <p className="mb-3 text-sm font-bold text-neutral-900">Cam kết chất lượng</p>
              <div className="mb-6 grid grid-cols-3 gap-3">
                {QUALITY_COMMITMENTS.map((c, i) => (
                  <div key={c.label} className="flex flex-col items-center gap-2 text-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006400]/10 text-[#006400]">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] leading-snug text-neutral-500">
                      {selected.commitments?.[i] ?? c.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Nút kêu gọi hành động */}
              <div className="mt-auto flex flex-col gap-2.5">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#006400] px-6 py-3 text-sm font-bold text-[#fffacd] shadow-md transition-colors duration-300 hover:bg-[#00520a]"
                >
                  <PhoneIcon /> Liên hệ báo giá sỉ
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-bold text-neutral-700 transition-colors duration-300 hover:border-[#006400] hover:text-[#006400]"
                >
                  <DocumentIcon /> Tải tài liệu sản phẩm (PDF)
                </Link>
                <p className="text-center text-[11px] text-neutral-400">Thời gian phản hồi nhanh trong 24h</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}