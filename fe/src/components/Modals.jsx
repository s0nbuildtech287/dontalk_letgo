import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Trash2, 
  Image, 
  DollarSign, 
  Tag, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';
import { LoginModal } from './LoginModal';

export function Modals() {
  const { 
    isQuickAddOpen, 
    setIsQuickAddOpen,
    detailPlace, 
    setDetailPlace,
    editingPlace, 
    setEditingPlace,
    schedulingPlace, 
    setSchedulingPlace,
    addPlace,
    updatePlace,
    deletePlace,
    changeStatus,
    assignToPlan
  } = useAppStore();

  return (
    <>
      <LoginModal />
      {isQuickAddOpen && (
        <QuickAddModal onClose={() => setIsQuickAddOpen(false)} onAdd={addPlace} />
      )}
      {detailPlace && (
        <DetailModal 
          place={detailPlace} 
          onClose={() => setDetailPlace(null)} 
          onSchedule={() => {
            const p = detailPlace;
            setDetailPlace(null);
            setSchedulingPlace(p);
          }}
          onVisited={() => {
            changeStatus(detailPlace.id, 'visited');
            setDetailPlace(null);
          }}
          onDelete={() => {
            if (window.confirm(`Xoá địa điểm "${detailPlace.title}"?`)) {
              deletePlace(detailPlace.id);
              setDetailPlace(null);
            }
          }}
        />
      )}
      {editingPlace && (
        <EditModal 
          place={editingPlace} 
          onClose={() => setEditingPlace(null)} 
          onUpdate={updatePlace} 
        />
      )}
      {schedulingPlace && (
        <ScheduleModal 
          place={schedulingPlace} 
          onClose={() => setSchedulingPlace(null)} 
          onAssign={(day) => {
            assignToPlan(schedulingPlace.id, day);
            setSchedulingPlace(null);
          }}
        />
      )}
    </>
  );
}

// 1. QUICK ADD MODAL
function QuickAddModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('an');
  const [priceRange, setPriceRange] = useState('$$');
  const [imageUrl, setImageUrl] = useState('');
  const [reviewNote, setReviewNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const categoryLabels = {
      an: 'Ăn ngon',
      cafe: 'Cà phê',
      chill: 'Quán chill',
      dulich: 'Du lịch & Cắm trại',
      workshop: 'Workshop & Chơi'
    };

    onAdd({
      title,
      location: location || 'TP. Hồ Chí Minh',
      category,
      categoryLabel: categoryLabels[category] || 'Ăn uống',
      priceRange,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      reviewNote,
      tags: ['Mới thêm']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-2xl overflow-hidden select-none">
        <div className="p-5 pb-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFEBE6] dark:bg-[#3D221B] text-[#FF6B4A] flex items-center justify-center font-bold">
              +
            </div>
            <h3 className="font-extrabold text-base text-[var(--color-text-main)]">
              Thêm Quán Mới Vào Wishlist
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
              Tên quán / Địa điểm <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Bánh Mì Chảo Cô Lệ, Rang Rang Coffee..."
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
                Danh mục
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
              >
                <option value="an">🍜 Ăn ngon</option>
                <option value="cafe">☕ Cà phê</option>
                <option value="chill">🍹 Quán chill</option>
                <option value="dulich">🏕️ Du lịch & Cắm trại</option>
                <option value="workshop">🎨 Workshop & Chơi</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
                Khoảng giá
              </label>
              <select 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
              >
                <option value="$">$ (&lt; 50k)</option>
                <option value="$$">$$ (50k - 200k)</option>
                <option value="$$$">$$$ (&gt; 200k)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
              Địa chỉ / Quận
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ví dụ: 29 Huỳnh Thúc Kháng, Bến Nghé, Quận 1..."
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
              Link ảnh (Tuỳ chọn)
            </label>
            <input 
              type="url" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
              Ghi chú / Món ngon nên thử
            </label>
            <textarea 
              rows="2"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Ví dụ: Bắt buộc thử bánh mì chảo đặc biệt + phô mai, đi sớm tránh đông..."
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3.5 py-2 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/25 transition-all"
            >
              Lưu vào Wishlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. DETAIL MODAL
function DetailModal({ place, onClose, onSchedule, onVisited, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-2xl overflow-hidden select-none flex flex-col max-h-[90vh]">
        {/* Cover Image */}
        <div className="relative h-56 w-full overflow-hidden bg-stone-900 shrink-0">
          <img 
            src={place.imageUrl} 
            alt={place.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF6B4A] text-white">
              {place.categoryLabel}
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">
              {place.title}
            </h2>
            <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B4A]" /> {place.location}
            </p>
          </div>
        </div>

        {/* Content details */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)] text-xs">
            <div>
              <span className="text-[var(--color-text-muted)]">Khoảng giá: </span>
              <strong className="text-[var(--color-text-main)]">{place.priceText || place.priceRange}</strong>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{place.rating} / 5.0</span>
            </div>
          </div>

          {place.reviewNote && (
            <div>
              <h4 className="text-xs font-bold text-[var(--color-text-main)] mb-1">Ghi chú & Đánh giá:</h4>
              <p className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] p-3 rounded-xl leading-relaxed">
                {place.reviewNote}
              </p>
            </div>
          )}

          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {place.tags.map((t, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] font-medium">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-2">
          <button 
            onClick={onDelete}
            className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Xóa</span>
          </button>

          <div className="flex items-center gap-2">
            {place.status !== 'visited' && (
              <button 
                onClick={onVisited}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã đi rồi</span>
              </button>
            )}

            <button 
              onClick={onSchedule}
              className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/25 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Lên lịch tuần này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. SCHEDULE MODAL
function ScheduleModal({ place, onClose, onAssign }) {
  const days = [
    "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-2xl p-6 select-none">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF6B4A]" />
            <h3 className="font-extrabold text-sm text-[var(--color-text-main)]">
              Lên lịch: {place.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[var(--color-text-muted)] mb-3">
          Chọn thứ trong tuần bạn muốn ghé quán:
        </p>

        <div className="space-y-1.5">
          {days.map(day => (
            <button
              key={day}
              onClick={() => onAssign(day)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-[var(--color-bg-subtle)] hover:bg-[#FFEBE6] hover:text-[#FF6B4A] dark:hover:bg-[#3D221B] dark:hover:text-[#FF7B5C] text-xs font-bold text-[var(--color-text-main)] text-left transition-colors flex items-center justify-between"
            >
              <span>{day}</span>
              <span className="text-[10px] text-[var(--color-text-muted)]">Chọn &rarr;</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. EDIT MODAL
function EditModal({ place, onClose, onUpdate }) {
  const [title, setTitle] = useState(place.title || '');
  const [location, setLocation] = useState(place.location || '');
  const [reviewNote, setReviewNote] = useState(place.reviewNote || '');

  const handleSave = (e) => {
    e.preventDefault();
    onUpdate(place.id, {
      title,
      location,
      reviewNote
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-2xl p-5 select-none">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-subtle)]">
          <h3 className="font-extrabold text-sm text-[var(--color-text-main)]">
            Chỉnh sửa địa điểm
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">Tên quán</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">Địa chỉ</label>
            <input 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">Ghi chú</label>
            <textarea 
              rows="3"
              value={reviewNote} 
              onChange={(e) => setReviewNote(e.target.value)}
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-text-muted)]"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/25 transition-all"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
