import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  Wand2, 
  Plus, 
  Check, 
  MapPin, 
  Clock, 
  DollarSign,
  Coffee,
  Utensils,
  Camera,
  Sunset
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';
import { PlaceCard } from './PlaceCard';

export function AIPlanner() {
  const { places, addPlace, setActiveTab } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState(null);

  const sampleTrips = {
    dalat: {
      title: "1 Ngày Đà Lạt Săn Mây & Chill Hoàng Hôn",
      budget: "1.000.000đ / người",
      destination: "Đà Lạt, Lâm Đồng",
      schedule: [
        {
          time: "05:00 - 07:30",
          name: "Săn mây Cầu Đất & Đồi Chè",
          desc: "Đón bình minh tại thung lũng mây Cầu Đất, nhâm nhi cà phê nóng giữa làn sương sớm.",
          cost: "60.000đ",
          icon: Camera,
          category: "dulich"
        },
        {
          time: "08:00 - 09:30",
          name: "Bánh Mì Xíu Mại Bé Linh",
          desc: "Bữa sáng ấm bụng với chén xíu mại cay thơm lừng và sữa đậu nành nóng.",
          cost: "45.000đ",
          icon: Utensils,
          category: "an"
        },
        {
          time: "10:30 - 13:00",
          name: "Tiệm Cà Phê Túi Mơ To",
          desc: "Không gian vườn cúc hoạ mi kinh điển, ngắm trọn thung lũng thơ mộng.",
          cost: "85.000đ",
          icon: Coffee,
          category: "cafe"
        },
        {
          time: "16:30 - 18:30",
          name: "Hoàng Hôn Xóm Lèo",
          desc: "Ngắm chiều tà buông xuống và thung lũng đèn lồng lên đèn lung linh.",
          cost: "50.000đ",
          icon: Sunset,
          category: "chill"
        },
        {
          time: "19:00 - 21:30",
          name: "Lẩu Gà Lá É Tao Ngộ",
          desc: "Nồi lẩu nóng hổi xua tan cái lạnh Đà Lạt, kết thúc một ngày trọn vẹn.",
          cost: "250.000đ",
          icon: Utensils,
          category: "an"
        }
      ]
    },
    saigon: {
      title: "Tour Sài Gòn Cà Phê & Quán Ăn Tinh Tuyển",
      budget: "300.000đ / người",
      destination: "Quận 1, TP. Hồ Chí Minh",
      schedule: [
        {
          time: "08:30 - 10:30",
          name: "Cà phê vợt Ba Lù - Chợ Lớn",
          desc: "Cà phê rang bơ thủ công theo phong cách người Hoa truyền thống hơn 70 năm.",
          cost: "25.000đ",
          icon: Coffee,
          category: "cafe"
        },
        {
          time: "11:30 - 13:00",
          name: "Cơm Tấm Ba Ghiền",
          desc: "Dĩa cơm tấm sườn nướng siêu to khổng lồ trứ danh Sài Gòn.",
          cost: "110.000đ",
          icon: Utensils,
          category: "an"
        },
        {
          time: "15:00 - 17:30",
          name: "Bảo Tàng Mỹ Thuật TP.HCM",
          desc: "Kiến trúc Pháp hoài cổ, tha hồ chụp hình nghệ thuật và ngắm tranh triển lãm.",
          cost: "30.000đ",
          icon: Camera,
          category: "workshop"
        },
        {
          time: "18:00 - 20:00",
          name: "Bia Craft Bờ Kè Hoàng Sa",
          desc: "Ngắm hoàng hôn sông nước mát mẻ cùng bạn bè, giải toả stress.",
          cost: "135.000đ",
          icon: Sunset,
          category: "chill"
        }
      ]
    }
  };

  const handleGenerate = (customText) => {
    const text = customText || prompt;
    if (!text.trim()) return;

    setLoading(true);
    setTimeout(() => {
      if (text.toLowerCase().includes('đà lạt') || text.toLowerCase().includes('dalat')) {
        setGeneratedTrip(sampleTrips.dalat);
      } else {
        setGeneratedTrip(sampleTrips.saigon);
      }
      setLoading(false);
    }, 700);
  };

  const handleSaveToPlaces = (item) => {
    addPlace({
      title: item.name,
      location: generatedTrip?.destination || 'Việt Nam',
      category: item.category || 'an',
      categoryLabel: item.category === 'cafe' ? 'Cà phê' : item.category === 'an' ? 'Ăn ngon' : 'Du lịch & Chill',
      priceText: item.cost,
      reviewNote: item.desc,
      tags: ['AI Gợi ý', 'Lịch trình hay']
    });
    alert(`Đã lưu "${item.name}" vào danh sách Muốn đi của bạn!`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* AI HERO BOX */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#FF6B4A]/15 via-amber-500/10 to-transparent border border-[#FF6B4A]/30">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3D221B] dark:text-[#FF7B5C] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trợ Lý AI Lịch Trình Tức Thì</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">
            Đi đâu, ngân sách bao nhiêu? Để AI lo từ A đến Z!
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">
            Nhập nhanh mong muốn của bạn (ví dụ: <span className="text-[#FF6B4A] font-semibold">"1 ngày Đà Lạt 1 triệu"</span> hoặc <span className="text-[#FF6B4A] font-semibold">"Cuối tuần cà phê quận 1 300k"</span>).
          </p>

          {/* Input form */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Compass className="w-5 h-5 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Ví dụ: 1 ngày Đà Lạt săn mây và nướng BBQ, 1 triệu đồng..." 
                className="w-full bg-[var(--color-bg-surface)] text-[var(--color-text-main)] text-sm pl-11 pr-4 py-3 rounded-2xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none shadow-sm"
              />
            </div>
            <button 
              onClick={() => handleGenerate()}
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm shadow-md shadow-[#FF6B4A]/25 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span>{loading ? 'Đang tạo...' : 'Lên lịch ngay'}</span>
            </button>
          </div>

          {/* Prompt chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3.5">
            <span className="text-xs text-[var(--color-text-muted)] font-medium">Gợi ý nhanh:</span>
            <button 
              onClick={() => {
                setPrompt('1 ngày Đà Lạt săn mây và nướng BBQ, 1 triệu');
                handleGenerate('1 ngày Đà Lạt săn mây và nướng BBQ, 1 triệu');
              }}
              className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-main)] hover:border-[#FF6B4A] transition-colors"
            >
              🌲 1 ngày Đà Lạt, 1 triệu
            </button>
            <button 
              onClick={() => {
                setPrompt('Tour Sài Gòn cà phê sống ảo và ẩm thực 300k');
                handleGenerate('Tour Sài Gòn cà phê sống ảo và ẩm thực 300k');
              }}
              className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-main)] hover:border-[#FF6B4A] transition-colors"
            >
              ☕ Sài Gòn cà phê 300k
            </button>
          </div>
        </div>
      </div>

      {/* GENERATED TRIP RESULT */}
      {generatedTrip && (
        <div className="rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[var(--color-border-subtle)] gap-2">
            <div>
              <span className="text-xs font-black uppercase text-[#FF6B4A] tracking-wider">
                Lịch trình AI thiết kế riêng
              </span>
              <h3 className="text-xl font-black text-[var(--color-text-main)] mt-0.5">
                {generatedTrip.title}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                💰 {generatedTrip.budget}
              </span>
            </div>
          </div>

          {/* Timeline steps */}
          <div className="space-y-4">
            {generatedTrip.schedule.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] gap-3 hover:border-[#FF6B4A]/30 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[var(--color-bg-surface)] text-[#FF6B4A] shadow-sm shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[var(--color-text-muted)] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.time}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {item.cost}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-[var(--color-text-main)] mt-0.5">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleSaveToPlaces(item)}
                    className="self-end sm:self-auto px-3.5 py-1.5 rounded-xl bg-[var(--color-bg-surface)] hover:bg-[var(--color-primary)] hover:text-white text-xs font-bold text-[var(--color-text-main)] border border-[var(--color-border)] shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Lưu quán này</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GỢI Ý CỘNG ĐỒNG */}
      <div>
        <h3 className="text-lg font-black text-[var(--color-text-main)] mb-1">
          Địa điểm đang thịnh hành 🔥
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">
          Những quán được các nhóm bạn lên lịch đi nhiều nhất tuần này
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {places.slice(0, 3).map(p => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
