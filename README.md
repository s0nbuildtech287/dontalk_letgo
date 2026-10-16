# 🚀 Đi Thôi (LetGoNow) — Web Desktop-First

> **Mục tiêu ứng dụng:** Biến câu *"mai mốt đi"* thành hành động thật, đồng hành cùng người dùng theo trọn vẹn vòng đời:  
> **Muốn đi** ➔ **Đã lên lịch** ➔ **Đã đi**.

---

## 📐 Kiến Trúc Layout (Desktop-First & Full-Width)

- **Không giới hạn max-width hẹp**: Tận dụng toàn bộ chiều ngang màn hình máy tính, các card địa điểm luôn lấp đầy không gian.
- **Bố cục 3 cột chuẩn Desktop**:
  1. **Sidebar trái (240px cố định)**: Thương hiệu, nút Thêm nhanh, Menu chính và chuyển đổi chế độ Sáng / Tối.
  2. **Nội dung chính (Fluid)**: Lưới card dùng `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))` tự co giãn số cột theo độ rộng màn hình.
  3. **Panel phải (340px)**: Xuất hiện ở màn hình $\ge$ 1280px (`xl`), chứa:
     - 🔥 **Streak đi chơi** duy trì tuần liên tiếp
     - 🗺️ **Bản đồ mini** ghim toàn bộ điểm hẹn
     - 🗓️ **Kế hoạch tuần này**
     - 📊 **Thống kê chuyển hóa**: Tỉ lệ biến "mai mốt" thành "đi thật".
- **Responsive**:
  - $\ge$ 1280px: Đầy đủ 3 cột
  - 768px – 1279px: 2 cột (ẩn panel phải)
  - < 768px: 1 cột + Mobile Bottom Navigation Tab Bar.

---

## 🎨 Design Tokens (`src/styles/tokens.css`)

| Token | Giá trị | Ý nghĩa |
| :--- | :--- | :--- |
| `--color-bg-base` | `#FAF7F2` / Dark: `#141210` | Nền kem ấm cúng |
| `--color-bg-surface`| `#FFFFFF` / Dark: `#1F1C19` | Nền card trắng sạch |
| `--color-primary` | `#FF6B4A` / Hover: `#E85736` | Cam san hô kích thích vị giác & hành động |
| `--color-text-main`| `#2B2B2B` / Dark: `#F3EFEA` | Chữ chính dễ đọc |
| `--radius-lg` | `16px` (`rounded-2xl`) | Chuẩn bo góc toàn bộ Card & Modal |
| Font chữ | `Be Vietnam Pro` (Google Fonts) | Tối ưu hiển thị tiếng Việt |
| Icon | Lucide Icons (Line style) | Thanh lịch, hiện đại |

---

## 📱 Sẵn Sàng Chuyển Đổi Sang Flutter (Widget Mapping)

Mã nguồn được phân tách module rõ ràng, tương thích 1-1 với kiến trúc Widget trong Flutter:

| Web Component (JS/HTML) | Flutter Widget Tương Đương | Vị trí / Ghi chú |
| :--- | :--- | :--- |
| `Sidebar.js` | `NavigationRail` (Desktop) / `NavigationBar` (Mobile) | `lib/widgets/app_sidebar.dart` |
| `PlaceCard.js` | `Card` + `AspectRatio(4/3)` + `InkWell` | `lib/widgets/place_card.dart` |
| `FilterBar.js` | `SingleChildScrollView(scrollDirection: Axis.horizontal)` + `ChoiceChip` | `lib/widgets/filter_bar.dart` |
| `KanbanColumn.js` | `Row` chứa 3 `DragTarget` & `Draggable<Place>` | `lib/views/kanban_view.dart` |
| `MapPanel.js` | `flutter_map` / `google_maps_flutter` + Mini Sidebar | `lib/widgets/right_panel.dart` |
| `WeekPlanCard.js` | `ListTile` trong `ReorderableListView` | `lib/widgets/week_plan_item.dart` |
| `AIPlanner.js` | Trợ lý sinh lịch trình kết nối LLM API | `lib/services/ai_planner_service.dart` |

---

## ⚡ Hướng Dẫn Mở & Trải Nghiệm

1. **Mở trực tiếp bằng trình duyệt**:
   Double click vào file [index.html](file:///c:/Users/SonBx/Desktop/XuanSon/LetGoNow/index.html) trong trình duyệt Chrome / Edge bất kỳ.

2. **Hoặc chạy qua máy chủ HTTP cục bộ** (để load ES Module mượt nhất):
   ```bash
   npx serve .
   # hoặc
   python -m http.server 3000
   ```
   Sau đó truy cập: `http://localhost:3000`
