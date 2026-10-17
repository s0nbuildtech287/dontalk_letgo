/**
 * DỮ LIỆU ĐỊA ĐIỂM FALLBACK (VIỆT NAM)
 * Gồm đúng 5 MÓN ĂN & 5 ĐỊA ĐIỂM CHILL / DU LỊCH để khách trải nghiệm UI trước khi đăng nhập.
 * Khi user đăng nhập thì toàn bộ dữ liệu sẽ do chính user thêm (trống nếu chưa thêm).
 */

export const FALLBACK_PLACES = [
  // --- 5 MÓN ĂN (Category: "an") ---
  {
    id: "place-1",
    title: "Phở Thìn Lò Đúc - Bò Tái Lăn",
    location: "Hai Bà Trưng, Hà Nội",
    category: "an",
    categoryLabel: "Ăn ngon",
    priceRange: "$$",
    priceText: "75k - 95k",
    status: "scheduled",
    scheduledDate: "2026-10-18T08:00:00",
    scheduledDayName: "Chủ Nhật tuần này",
    savedDaysAgo: 21,
    rating: 4.8,
    reviewNote: "Nước dùng béo ngậy nhiều hành hoa, thơm nức mùi tỏi phi giòn tan.",
    imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80",
    mapCoords: [21.0185, 105.8567],
    votes: 9,
    sourceLink: "https://maps.google.com/?q=Pho+Thin+Lo+Duc",
    tags: ["Món nước", "Đặc sản Hà Nội", "Ăn sáng"],
    suggestedWeek: true
  },
  {
    id: "place-4",
    title: "Bún Chả Hương Liên (Bún Chả Obama)",
    location: "Hai Bà Trưng, Hà Nội",
    category: "an",
    categoryLabel: "Ăn ngon",
    priceRange: "$$",
    priceText: "60k - 90k",
    status: "want",
    savedDaysAgo: 16,
    rating: 5.0,
    reviewNote: "Chả miếng nướng than hoa thơm lừng cháy cạnh, nem cua bể giòn rụm chấm nước mắm chua ngọt ấm bụng.",
    imageUrl: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&auto=format&fit=crop&q=80",
    mapCoords: [21.0177, 105.8541],
    votes: 17,
    sourceLink: "https://maps.google.com/?q=Bun+Cha+Huong+Lien",
    tags: ["Đặc sản", "Ăn trưa", "Truyền thống"],
    suggestedWeek: false
  },
  {
    id: "place-6",
    title: "Bánh Mì Huỳnh Hoa - Ổ Bánh Mì 'Ô Môi' Nức Tiếng",
    location: "Quận 1, TP. Hồ Chí Minh",
    category: "an",
    categoryLabel: "Ăn ngon",
    priceRange: "$$",
    priceText: "68k - 75k",
    status: "visited",
    visitedDate: "2026-10-08",
    savedDaysAgo: 24,
    rating: 4.9,
    reviewNote: "Pate thơm béo ngập tràn, giò chả thịt nguội dày cộp, vỏ bánh giòn tan rụm.",
    imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80",
    mapCoords: [10.7709, 106.6924],
    votes: 11,
    sourceLink: "https://maps.google.com/?q=Banh+Mi+Huynh+Hoa",
    tags: ["Street Food", "Bánh Mì", "No nê"],
    suggestedWeek: false
  },
  {
    id: "place-9",
    title: "Ốc Oanh - Ốc Hương Rang Muối Ớt Cay Nồng",
    location: "Quận 4, TP. Hồ Chí Minh",
    category: "an",
    categoryLabel: "Ăn ngon",
    priceRange: "$$",
    priceText: "100k - 200k/người",
    status: "want",
    savedDaysAgo: 5,
    rating: 4.7,
    reviewNote: "Đường Vĩnh Khánh nhộn nhịp, ốc tươi giòn rụm phủ lớp muối ớt đỏ au cay nồng hít hà.",
    imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
    mapCoords: [10.7602, 106.7011],
    votes: 25,
    sourceLink: "https://maps.google.com/?q=Oc+Oanh+Vinh+Khanh",
    tags: ["Nhậu nhẹt", "Ốc Sài Gòn", "Ăn đêm"],
    suggestedWeek: true
  },
  {
    id: "place-13",
    title: "Pizza 4P's Bến Thành - Phô Mai Burrata & Pizza Cua",
    location: "Quận 1, TP. Hồ Chí Minh",
    category: "an",
    categoryLabel: "Ăn ngon",
    priceRange: "$$$",
    priceText: "250k - 500k/người",
    status: "want",
    savedDaysAgo: 15,
    rating: 4.9,
    reviewNote: "Phô mai tươi nhà làm béo ngậy tan chảy, mỳ ý sốt cua thơm lừng ăn kèm vang trắng tuyệt phẩm.",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    mapCoords: [10.7725, 106.6975],
    votes: 27,
    sourceLink: "https://maps.google.com/?q=Pizza+4Ps+Ben+Thanh",
    tags: ["Hẹn hò", "Pizza nướng củi", "Fine casual"],
    suggestedWeek: true
  },

  // --- 5 ĐỊA ĐIỂM (Category: "uong" | "dulich" | "choi") ---
  {
    id: "place-2",
    title: "The Workshop Coffee - Specialty Brew",
    location: "Quận 1, TP. Hồ Chí Minh",
    category: "uong",
    categoryLabel: "Cà phê & Chill",
    priceRange: "$$",
    priceText: "65k - 120k",
    status: "scheduled",
    scheduledDate: "2026-10-17T09:00:00",
    scheduledDayName: "Thứ Bảy tuần này",
    savedDaysAgo: 5,
    rating: 4.7,
    reviewNote: "Không gian tầng 2 phong cách công nghiệp cực chill, pour-over hạt Ethiopia đỉnh cao.",
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
    mapCoords: [10.7735, 106.7038],
    votes: 14,
    sourceLink: "https://maps.google.com/?q=The+Workshop+Coffee+Saigon",
    tags: ["Specialty Coffee", "Làm việc", "View phố"],
    suggestedWeek: true
  },
  {
    id: "place-5",
    title: "Phê La - Cà Phê Cốt Dừa & Ô Long Sữa Chảo",
    location: "Quận 1, TP. Hồ Chí Minh",
    category: "uong",
    categoryLabel: "Cà phê & Chill",
    priceRange: "$",
    priceText: "55k - 65k",
    status: "want",
    savedDaysAgo: 4,
    rating: 4.6,
    reviewNote: "Trà sữa đậm vị trà mộc Bảo Lộc, trân châu dẻo thơm nhai cực đã miệng.",
    imageUrl: "https://images.unsplash.com/photo-1558857563-b37cf5a8a1b1?w=800&auto=format&fit=crop&q=80",
    mapCoords: [10.7720, 106.7050],
    votes: 18,
    sourceLink: "https://maps.google.com/?q=Phe+La+Saigon",
    tags: ["Trà ô long", "Hot trend", "Tụ tập bạn bè"],
    suggestedWeek: true
  },
  {
    id: "place-3",
    title: "Gió Chiều Quán - BBQ Bên Hồ Tuyền Lâm",
    location: "Hồ Tuyền Lâm, Đà Lạt",
    category: "dulich",
    categoryLabel: "Du lịch & Trốn phố",
    priceRange: "$$$",
    priceText: "250k - 450k/người",
    status: "want",
    savedDaysAgo: 19,
    rating: 4.9,
    reviewNote: "Ngắm hoàng hôn buông xuống mặt hồ lộng gió, nướng gà đồi lá é thơm lừng.",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
    mapCoords: [11.9015, 108.4328],
    votes: 22,
    sourceLink: "https://maps.google.com/?q=Ho+Tuyen+Lam+Da+Lat",
    tags: ["Hoàng hôn", "Camping", "Lẩu nướng"],
    suggestedWeek: true
  },
  {
    id: "place-11",
    title: "Chèo SUP Ngắm Hoàng Hôn Bán Đảo Thanh Đa",
    location: "Bình Quới, TP. Hồ Chí Minh",
    category: "choi",
    categoryLabel: "Chơi vui & Xả stress",
    priceRange: "$$",
    priceText: "250k - 350k/suất",
    status: "scheduled",
    scheduledDate: "2026-10-17T16:30:00",
    scheduledDayName: "Thứ Bảy tuần này",
    savedDaysAgo: 8,
    rating: 4.9,
    reviewNote: "Lướt nhẹ trên dòng sông Sài Gòn khi mặt trời lặn dát vàng mặt nước, có hướng dẫn viên chụp ảnh cực có tâm.",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
    mapCoords: [10.8250, 106.7320],
    votes: 20,
    sourceLink: "https://maps.google.com/?q=SUP+Thanh+Da",
    tags: ["Dưới nước", "Hoàng hôn", "Chill cuối tuần"],
    suggestedWeek: true
  },
  {
    id: "place-10",
    title: "Làng Cổ Đường Lâm & Nhà Cổ Trăm Tuổi",
    location: "Sơn Tây, Hà Nội",
    category: "dulich",
    categoryLabel: "Du lịch & Trốn phố",
    priceRange: "$",
    priceText: "30k - 50k",
    status: "visited",
    visitedDate: "2026-09-22",
    savedDaysAgo: 45,
    rating: 4.9,
    reviewNote: "Tường đá ong nhuốm màu thời gian, uống chè xanh ăn kẹo lạc giòn tan ở sân đình.",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80",
    mapCoords: [21.1444, 105.4741],
    votes: 12,
    sourceLink: "https://maps.google.com/?q=Duong+Lam+Ancient+Village",
    tags: ["Lịch sử", "Đá ong", "Văn hóa"],
    suggestedWeek: false
  }
];

// Alias for backwards compatibility if needed
export const INITIAL_PLACES = FALLBACK_PLACES;

export const FALLBACK_WEEK_PLANS = {
  "Thứ Hai": [],
  "Thứ Ba": [],
  "Thứ Tư": [],
  "Thứ Năm": [],
  "Thứ Sáu": [],
  "Thứ Bảy": ["place-2", "place-11"],
  "Chủ Nhật": ["place-1"]
};

export const FALLBACK_PLAN_DETAILS = {
  "place-2": { time: "09:00", note: "Thử pour-over hạt Ethiopia và ngắm phố Sài Gòn" },
  "place-11": { time: "16:30", note: "Chèo SUP ngắm hoàng hôn bán đảo Thanh Đa" },
  "place-1": { time: "08:00", note: "Thưởng thức phở tái lăn Lò Đúc nóng hổi" }
};

export const INITIAL_GROUP_MEMBERS = [
  { id: "u1", name: "Xuân Sơn", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", role: "Trưởng nhóm" },
  { id: "u2", name: "Minh Trí", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", role: "Thành viên" },
  { id: "u3", name: "Thu Hà", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", role: "Thành viên" },
  { id: "u4", name: "Bảo Ngọc", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", role: "Thành viên" }
];
