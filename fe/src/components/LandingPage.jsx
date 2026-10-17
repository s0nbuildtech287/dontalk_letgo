import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  MapPin, 
  Heart, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Star, 
  AlertTriangle,
  Clock,
  Sun,
  Moon,
  ChevronRight,
  Footprints,
  Coffee,
  Utensils,
  Camera,
  Layers,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';

export function LandingPage() {
  const { enterApp, theme, toggleTheme, stats } = useAppStore();
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  const featureTabs = [
    {
      title: "1. Wishlist Quán",
      tagline: "Lưu nhanh mọi quán hot",
      desc: "Lướt TikTok, Facebook hay Google Maps thấy quán đẹp? Lưu vào LetGoo trong 3 giây, phân loại ăn/uống/chill.",
      previewImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      badge: "Lưu trong 3s",
      badgeColor: "bg-amber-500"
    },
    {
      title: "2. Chốt Lịch Tuần",
      tagline: "Vẽ lộ trình hẹn hò",
      desc: "Chọn thứ Bảy hay Chủ Nhật, LetGoo tự nối đường di chuyển giữa các điểm hẹn trên Google Maps.",
      previewImg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
      badge: "Lộ trình tối ưu",
      badgeColor: "bg-blue-500"
    },
    {
      title: "3. Kho Kỷ Niệm",
      tagline: "Lưu trọn khoảnh khắc",
      desc: "Đánh giá, cảm nhận và lưu trữ toàn bộ ảnh chụp kỷ niệm của chuyến đi an toàn, chất lượng gốc trên Google Drive.",
      previewImg: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80",
      badge: "Nhật ký vi vu",
      badgeColor: "bg-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)] overflow-x-hidden selection:bg-[#FFEBE6] selection:text-[#FF6B4A] transition-colors relative">
      {/* BACKGROUND DECORATIVE GLOW ORBS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#FF6B4A]/15 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl"></div>
        <div className="absolute top-96 left-1/3 w-72 h-72 bg-rose-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--color-bg-base)]/85 border-b border-[var(--color-border)] select-none transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden drop-shadow-md shrink-0 border border-[#FF6B4A]/25">
              <img src="/logo.png" alt="LetGoo Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-[var(--color-text-main)] block leading-none">
                Let<span className="text-[#FF6B4A]">Goo</span><span className="text-amber-500">!</span>
              </span>
              <span className="text-[9px] font-bold text-[#FF6B4A] tracking-wider uppercase mt-1 block">
                Don't Talk • Let's Go
              </span>
            </div>
          </div>

          {/* Center Badge: Public community friendly */}
          <div className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[var(--color-text-muted)]">Nền tảng chốt kèo ăn chơi cho</span>
            <span className="text-[var(--color-text-main)] font-black">Cặp Đôi & Hội Bạn Thân ✨</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
              className="p-2.5 rounded-xl text-[var(--color-text-muted)] hover:text-[#FF6B4A] hover:bg-[var(--color-bg-subtle)] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={enterApp}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#FF8C69] hover:from-[#E85736] hover:to-[#FF6B4A] text-white font-bold text-xs shadow-md shadow-[#FF6B4A]/25 hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Vào ứng dụng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Animated Highlight Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEBE6] dark:bg-[#3D221B] border border-[#FF6B4A]/30 text-[#FF6B4A] text-xs font-bold shadow-sm animate-float-gentle">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
            <span>Biến câu "mai mốt đi" thành những chuyến đi thật</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--color-text-main)] leading-[1.15]">
            Bớt nói "bữa nào đi", <br className="hidden sm:inline" />
            Xách ba lô lên và <span className="bg-gradient-to-r from-[#FF6B4A] via-[#FF8C69] to-amber-500 bg-clip-text text-transparent">LetGoo!</span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            Không còn cảnh lưu hàng đống quán ngon trên TikTok rồi để quên. <strong>LetGoo</strong> là trợ lý thông minh giúp bạn cùng người thương hoặc hội bạn lên lịch hẹn cuối tuần, cùng nhau bình chọn và biến mọi lời hứa thành những chuyến vi vu thật!
          </p>

          {/* Action CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={enterApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#FF8C69] hover:from-[#E85736] hover:to-[#FF6B4A] text-white font-black text-sm shadow-xl shadow-[#FF6B4A]/35 hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 animate-pulse-ring active:scale-95"
            >
              <Footprints className="w-5 h-5 -rotate-12" />
              <span>Bắt đầu lên lịch vi vu ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#interactive-demo"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] font-bold text-xs border border-[var(--color-border)] shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Xem trước các tính năng</span>
              <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
            </a>
          </div>

          {/* Micro Stats Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>Streak 4 tuần hẹn hò liên tiếp</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Tự động nhắc quán ngâm &gt; 14 ngày</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>{stats.conversionRate}% biến nói thành đi thật</span>
            </div>
          </div>
        </div>

        {/* 3. DYNAMIC FLOATING SHOWCASE CANVAS */}
        <div className="mt-14 relative max-w-5xl mx-auto select-none">
          {/* Main App Preview Window Frame */}
          <div className="relative rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-2xl overflow-hidden p-4 sm:p-6 backdrop-blur-xl">
            {/* Fake Mac Window Controls */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-bold text-[var(--color-text-muted)] ml-2">
                  app.letgoo.vn • Không gian hẹn hò & vi vu cuối tuần
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                ● Live Demo
              </span>
            </div>

            {/* Mockup Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Sample Place Card */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] overflow-hidden shadow-sm group hover:scale-[1.02] transition-transform">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80" 
                    alt="Demo Place" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-black/60 text-white backdrop-blur-md">
                    🍜 Ăn ngon
                  </span>
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-stone-800 text-[10px] font-bold shadow">
                    <Heart className="w-3 h-3 text-[#FF6B4A] fill-[#FF6B4A]" />
                    <span>8 vote</span>
                  </div>
                </div>
                <div className="p-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    💙 Đã lên lịch Thứ 7
                  </span>
                  <h4 className="font-extrabold text-xs text-[var(--color-text-main)] mt-1.5">
                    Lẩu Gà Lá É Tao Ngộ
                  </h4>
                  <p className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#FF6B4A]" /> Đà Lạt, Lâm Đồng
                  </p>
                </div>
              </div>

              {/* Card 2: Sample Warning Card */}
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                    <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                    <span>Cảnh báo ngâm quán!</span>
                  </div>
                  <h4 className="font-black text-sm text-[var(--color-text-main)] mt-2">
                    Bánh Mì Chảo Cô Lệ
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    "Quán này lưu vào danh sách 18 ngày rồi mà chưa thấy chốt kèo nha!" 😤
                  </p>
                </div>
                <button 
                  onClick={enterApp}
                  className="mt-4 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors"
                >
                  Lên lịch ngay kẻo lỡ hẹn &rarr;
                </button>
              </div>

              {/* Card 3: Route Mini Map Preview */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                      🗺️ Lộ trình Chủ Nhật
                    </span>
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)]">3 điểm đến</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-main)]">
                      <span className="w-5 h-5 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center text-[10px]">1</span>
                      <span className="truncate">Cà phê Rang Rang (Q.1)</span>
                    </div>
                    <div className="h-3 w-px bg-dashed border-l border-[#FF6B4A] ml-2.5"></div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-main)]">
                      <span className="w-5 h-5 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center text-[10px]">2</span>
                      <span className="truncate">Cơm tấm Ba Ghiền (Q.3)</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-3">
                  Google Maps tự động vẽ đường nối liền giúp tiết kiệm thời gian đi lại!
                </p>
              </div>
            </div>
          </div>

          {/* FLOATING WIDGET 1: Top Left - Streak Badge */}
          <div className="hidden lg:flex absolute -top-6 -left-8 rounded-2xl bg-[var(--color-bg-surface)] border border-orange-500/30 p-3.5 shadow-xl backdrop-blur-md items-center gap-3 animate-float-slow">
            <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/30">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--color-text-main)]">Streak 4 Tuần Đi Chơi</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">Cuối tuần không nằm nhà</p>
            </div>
          </div>

          {/* FLOATING WIDGET 2: Bottom Right - Heart Rating */}
          <div className="hidden lg:flex absolute -bottom-6 -right-8 rounded-2xl bg-[var(--color-bg-surface)] border border-rose-500/30 p-3.5 shadow-xl backdrop-blur-md items-center gap-3 animate-float-reverse">
            <div className="p-2.5 rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/30">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--color-text-main)]">Bình Chọn Nhóm Đi Chung</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">Cả hội cùng ưng ý</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THREE STEPS LIFE CYCLE */}
      <section id="interactive-demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--color-border-subtle)]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase text-[#FF6B4A] tracking-wider">
            Vòng Đời Trọn Vẹn
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text-main)] mt-1">
            Từ "lướt thấy hay" đến "đi chơi thật"
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-2">
            LetGoo giải quyết dứt điểm căn bệnh đã lưu vào bookmark rồi lãng quên mãi mãi.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureTabs.map((item, idx) => (
            <div 
              key={idx}
              className="rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-6 shadow-sm hover:shadow-xl hover:border-[#FF6B4A]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-[var(--color-bg-subtle)]">
                  <img 
                    src={item.previewImg} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black text-white ${item.badgeColor} shadow`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-black text-base text-[var(--color-text-main)]">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-[#FF6B4A] mt-0.5">
                  {item.tagline}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs font-bold text-[#FF6B4A]">
                <span>Trải nghiệm ngay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. COUPLE & AI SPOTLIGHT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#FF6B4A]/10 via-amber-500/10 to-transparent border border-[#FF6B4A]/25 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3D221B] dark:text-[#FF7B5C] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Trợ Lý AI Lịch Trình Tức Thì</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text-main)]">
                "Cuối tuần này đi đâu?" <br />
                Để AI lên lịch trình chuẩn chỉnh trong 1 giây!
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                Chỉ cần nhập mong muốn của bạn: <span className="text-[#FF6B4A] font-bold">"1 ngày Đà Lạt 1 triệu"</span> hoặc <span className="text-[#FF6B4A] font-bold">"Tour cà phê quận 1 200k"</span>. AI sẽ tự động phân bổ quán ăn sáng, quán cafe sống ảo và địa điểm ngắm hoàng hôn cực chill.
              </p>
              <div className="pt-2">
                <button
                  onClick={enterApp}
                  className="px-6 py-3 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs shadow-md shadow-[#FF6B4A]/25 transition-all flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Thử Trợ Lý AI Ngay</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-[var(--color-bg-surface)] p-5 border border-[var(--color-border)] shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
                <span className="text-xs font-black text-[var(--color-text-main)]">Gợi ý AI cho cuối tuần</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Tiết kiệm & Chill
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--color-bg-subtle)]">
                  <Coffee className="w-4 h-4 text-[#FF6B4A]" />
                  <span className="font-bold text-[var(--color-text-main)] truncate">08:30: Cafe Túi Mơ To</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--color-bg-subtle)]">
                  <Utensils className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-[var(--color-text-main)] truncate">12:00: Bánh mì chảo Cô Lệ</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--color-bg-subtle)]">
                  <Camera className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-[var(--color-text-main)] truncate">16:30: Hoàng hôn Xóm Lèo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-xl shadow-[#FF6B4A]/30 mx-auto border border-[#FF6B4A]/30 animate-float-gentle">
          <img src="/logo.png" alt="LetGoo Logo" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-[var(--color-text-main)] tracking-tight">
          Sẵn sàng cho chuyến đi tiếp theo chưa?
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-lg mx-auto leading-relaxed">
          Đừng để tuổi trẻ trôi qua trong câu nói "để hôm nào rảnh". Mở LetGoo và chốt kèo vi vu cùng hội bạn ngay hôm nay!
        </p>
        <button
          onClick={enterApp}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#FF8C69] hover:from-[#E85736] hover:to-[#FF6B4A] text-white font-black text-sm shadow-xl shadow-[#FF6B4A]/30 hover:shadow-2xl transition-all inline-flex items-center gap-2.5 active:scale-95"
        >
          <span>Vào LetGoo ngay</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-8 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)] select-none">
        <p>Made with ❤️ by <strong>LetGoo Team</strong> • Don't Talk, Let's Go! © 2026</p>
      </footer>
    </div>
  );
}
