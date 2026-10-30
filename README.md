# 🚀 Đi Thôi! (LetGoo) — Don't Talk, Let's Go!

"Bữa nào rảnh đi nha!" — Câu nói cửa miệng quen thuộc của bao nhóm bạn nhưng 99% đều trôi vào quên lãng.

Đi Thôi! (LetGoo) ra đời để biến những lời hẹn vu vơ thành hành trình thực tế, đồng hành cùng bạn và nhóm bạn từ lúc nhen nhóm ý định đến khi hoàn thành chuyến đi!

---

## 🌟 Hành Trình Trải Nghiệm (User Lifecycle)

Hệ thống quản lý địa điểm chặt chẽ theo 3 bước:

[ Muốn đi ] ────────► [ Đã lên lịch ] ────────► [ Đã đi & Kỷ niệm ]
(Lưu quán hot)        (Chọn tuần & giờ hẹn)      (Đánh giá & Lưu khoảnh khắc)

1. Muốn đi (Wishlist): Gom tất cả các quán ăn ngon, tiệm cà phê chill, workshop hay ho lưu từ TikTok, Facebook, Google Maps về một nơi duy nhất.
2. Đã lên lịch (Weekly Planner): Phân bổ địa điểm vào Tuần này hoặc Tuần sau, gắn khung giờ chi tiết và thứ tự di chuyển.
3. Đã đi & Kỷ niệm (Journal): Đánh dấu đã đi, chấm sao đánh giá, viết cảm nhận chân thật và lưu lại những bức ảnh kỷ niệm đáng nhớ.

---

## ✨ Những Tính Năng Nổi Bật

### 1. 🚨 Cảnh Báo "Ngâm Quán" > 14 Ngày
- Đã bao lần bạn lưu một quán cả tháng trời mà chưa đặt chân tới?
- Hệ thống tự động đếm ngày và gắn huy hiệu cảnh báo đỏ với các địa điểm bị ngâm quá 2 tuần, thôi thúc bạn lên lịch đi ngay cuối tuần này!

### 2. 📅 Lập Lịch Trình Tuần & Tự Vẽ Lộ Trình (Smart Polyline)
- Hỗ trợ xem linh hoạt giữa Tuần này, Tuần sau và các tuần kế tiếp hoàn toàn độc lập, không bị trùng lặp dữ liệu.
- Hai chế độ xem: Xem theo ngày (lịch trình chi tiết từng giờ) và Cả tuần (ma trận tổng quan 7 ngày).
- Tự động nối lộ trình di chuyển: Vẽ đường nối liên hoàn trên bản đồ vệ tinh theo thứ tự giờ hẹn các điểm trong ngày, giúp tối ưu quãng đường đi chơi.

### 3. 🤖 Trợ Lý Ảo LetGoo AI (Google Gemini 3.8 Flash)
- Trò chuyện tự nhiên, hóm hỉnh, am hiểu sâu sắc ẩm thực và du lịch các vùng miền (Hà Nội, Sài Gòn, Đà Lạt, Đà Nẵng, Phú Quốc...).
- Hỏi kinh nghiệm, tìm quán theo ngân sách hoặc yêu cầu lên trọn gói lịch trình 1-2 ngày theo mốc giờ.
- Thao tác 1-Click: Tự động bóc tách các địa điểm gợi ý để bạn bấm lưu thẳng vào Wishlist mà không cần gõ lại.

### 4. 🗺️ Bộ 3 Chế Độ Xem Wishlist Đa Dạng
- Dạng Lưới (Grid View): Thẻ thông tin trực quan, phân loại theo ẩm thực, cà phê, du lịch, chill out; phân trang gọn gàng 9 điểm/trang.
- Bảng Kanban kéo thả (Kanban Board): Kéo thả trực quan giữa 3 cột trạng thái (Muốn đi ➔ Đã lên lịch ➔ Đã đi).
- Bản Đồ Toàn Màn Hình (Interactive Full Map): Ghim trực tiếp toàn bộ tọa độ quán ăn trên bản đồ để dễ dàng tìm kiếm quán gần khu vực mình đang đứng.

### 5. 👥 Hội Báo Sài Gòn (Group Voting)
- Dành riêng cho hội bạn thân cùng bình chọn điểm hẹn cuối tuần.
- Minh bạch số vote, tìm ra quán có sự đồng thuận cao nhất của cả nhóm chỉ trong vài giây.

### 6. 🔥 Streak Đi Chơi Liên Tiếp & Thống Kê Hành Động
- Theo dõi chuỗi tuần liên tiếp bạn bước ra đường trải nghiệm cuộc sống thay vì nằm lướt điện thoại ở nhà.
- Thống kê tỷ lệ chuyển hóa từ lời nói "hôm nào đi" thành hành động đi thật.

---

## 🛠️ Công Nghệ & Điểm Nhấn Kỹ Thuật (Tech Stack)

### Frontend (Desktop-First UI/UX)
- React 18 & Vite 6: Tốc độ tải và render mượt mà.
- Tailwind CSS: Tone cam san hô ấm (#FF6B4A), nền kem ấm cúng (#FAF7F2), chuyển đổi Sáng / Tối (Light & Dark Mode).
- Leaflet & OpenStreetMap: Hiển thị bản đồ tương tác và vẽ polyline lộ trình di chuyển.
- Lucide Icons: Bộ icon tinh gọn, hiện đại.
- State Management: React Context quản lý state toàn cục chuẩn pub/sub, tự động đồng bộ thời gian thực.

### Backend & Cơ Sở Dữ Liệu
- Spring Boot 3.3 (Java 17): Xử lý RESTful API cho địa điểm, lịch trình tuần và tài khoản người dùng.
- Spring Data JPA & PostgreSQL: Quản lý cơ sở dữ liệu quan hệ, tự động map thực thể.
- Swagger / OpenAPI: Giao diện test và tài liệu API trực quan.
- High-Availability Architecture: Cơ chế dự phòng và đồng bộ dữ liệu đa tầng (Cloud Failover & Offline-First) — kết nối trực tiếp RESTful API Backend và tự động kích hoạt bộ nhớ đệm cục bộ (Client-Side Persistence) đảm bảo ứng dụng luôn phản hồi tức thì và hoạt động mượt mà ngay cả khi môi trường mạng gián đoạn.

### Trí Tuệ Nhân Tạo & Lưu Trữ Đám Mây
- Google Generative AI (Gemini 3.8 Flash / 2.5 Flash Lite): Phân tích ngữ cảnh tiếng Việt và gợi ý lịch trình thông minh.
- Cloudinary SDK: Tối ưu và lưu trữ hình ảnh tải lên.
- Google Drive API (Multi-Service-Accounts): Cơ chế tự động xoay vòng cụm 8 Service Accounts để lưu ảnh dung lượng lớn an toàn.

---

Đi Thôi! — Đừng để thanh xuân trôi qua trong những câu hẹn "bữa nào rảnh"! 🛵💨
