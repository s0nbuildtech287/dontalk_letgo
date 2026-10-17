# 🚀 Đi Thôi (LetGoNow) — React JS (Desktop-First)

> **Mục tiêu ứng dụng:** Biến câu *"mai mốt đi"* thành hành động thật, đồng hành cùng người dùng theo trọn vẹn vòng đời:  
> **Muốn đi** ➔ **Đã lên lịch** ➔ **Đã đi**.

---

## ⚡ Công Nghệ & Khởi Chạy Nhanh

- **Framework**: **React 18** + **Vite 6**
- **Styling**: **Tailwind CSS** + Custom Design Tokens (Tone cam san hô ấm `#FF6B4A`, nền kem `#FAF7F2`, Dark mode)
- **Icons**: `lucide-react`
- **Interactive Maps**: `leaflet` (hỗ trợ cả mini-map và full-map, tự động vẽ lộ trình polyline)
- **State Management**: React Context (`StoreContext`) tự động đồng bộ hóa `localStorage`

### Lệnh chạy môi trường phát triển:
```bash
npm install
npm run dev
```
Truy cập: `http://localhost:3000`

### Lệnh build sản phẩm:
```bash
npm run build
npm run preview
```

---

## 📐 Kiến Trúc Layout (Desktop-First & Full-Width)

- **Không giới hạn max-width hẹp**: Tận dụng toàn bộ chiều ngang màn hình máy tính, các card địa điểm luôn lấp đầy không gian.
- **Bố cục 3 cột chuẩn Desktop**:
  1. **Sidebar trái (`Sidebar.jsx` - 240px cố định)**: Thương hiệu, nút Thêm nhanh, Menu chính và chuyển đổi chế độ Sáng / Tối.
  2. **Nội dung chính (`App.jsx` - Fluid)**: Lưới card co giãn tự động theo độ rộng màn hình.
  3. **Panel phải (`RightPanel.jsx` - 340px)**: Xuất hiện ở màn hình $\ge$ 1280px (`xl`), chứa:
     - 🔥 **Streak đi chơi** duy trì tuần liên tiếp
     - 🗺️ **Bản đồ mini** ghim toàn bộ điểm hẹn
     - 🗓️ **Kế hoạch tuần này**
     - 📊 **Thống kê chuyển hóa**: Tỉ lệ biến "mai mốt" thành "đi thật".
- **Responsive**:
  - $\ge$ 1280px: Đầy đủ 3 cột
  - 768px – 1279px: 2 cột (ẩn panel phải)
  - < 768px: 1 cột + Mobile Bottom Navigation Tab Bar.

---

## 🧩 Cấu Trúc Mã Nguồn React

| React Component | Mô tả chức năng | File Path |
| :--- | :--- | :--- |
| `StoreContext.jsx` | Quản lý state toàn cục, filter, pub/sub, sync localStorage | [src/context/StoreContext.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/context/StoreContext.jsx) |
| `Sidebar.jsx` | Menu điều hướng, avatar, switch dark/light, nút thêm nhanh | [src/components/Sidebar.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/Sidebar.jsx) |
| `HomeView.jsx` | Trang chủ, cảnh báo ngâm quán > 14 ngày, thống kê nhanh | [src/components/HomeView.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/HomeView.jsx) |
| `WishlistView.jsx` | Danh sách Wishlist, hỗ trợ 3 chế độ xem (Lưới, Kanban, Bản đồ) | [src/components/WishlistView.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/WishlistView.jsx) |
| `PlaceCard.jsx` | Thẻ địa điểm, ảnh 4:3, tag giá, rating, đổi trạng thái, cảnh báo ngâm | [src/components/PlaceCard.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/PlaceCard.jsx) |
| `FilterBar.jsx` | Bộ lọc danh mục, mức giá, địa phương, search, switch view mode | [src/components/FilterBar.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/FilterBar.jsx) |
| `KanbanBoard.jsx` | Bảng Kanban 3 cột hỗ trợ kéo thả trạng thái | [src/components/KanbanBoard.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/KanbanBoard.jsx) |
| `FullMapView.jsx` | Bản đồ toàn màn hình hiển thị toàn bộ toạ độ điểm hẹn | [src/components/FullMapView.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/FullMapView.jsx) |
| `WeekPlanner.jsx` | Lập lịch từng ngày trong tuần + Vẽ lộ trình di chuyển Polyline | [src/components/WeekPlanner.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/WeekPlanner.jsx) |
| `AIPlanner.jsx` | Trợ lý AI sinh lịch trình theo ngân sách & địa điểm | [src/components/AIPlanner.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/AIPlanner.jsx) |
| `GroupView.jsx` | Hội Báo Sài Gòn, bình chọn (vote) điểm đến cho nhóm | [src/components/GroupView.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/GroupView.jsx) |
| `JournalView.jsx` | Nhật ký lưu giữ kỷ niệm và cảm nhận những chuyến đi đã qua | [src/components/JournalView.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/JournalView.jsx) |
| `RightPanel.jsx` | Streak tuần, Leaflet Mini-map, Tuần này đi đâu, conversion rate | [src/components/RightPanel.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/RightPanel.jsx) |
| `Modals.jsx` | Popup Thêm nhanh, Xem chi tiết, Chỉnh sửa, và Lên lịch ngày | [src/components/Modals.jsx](file:///C:/Users/XUAN%20SON/Desktop/Xuan%20Son%20Version/DontTalk_LetGoo/dontalk_letgo/src/components/Modals.jsx) |

*(Lưu ý: Mã nguồn phiên bản Vanilla JS cũ đã được lưu trữ an toàn tại thư mục `src_vanilla/`)*
