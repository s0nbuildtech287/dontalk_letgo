import React, { useState, useRef } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Trash2, 
  Image as ImageIcon, 
  DollarSign, 
  Tag, 
  Clock,
  Sparkles,
  Upload,
  Link as LinkIcon,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';
import { LoginModal } from './LoginModal';
import { api } from '../api/client';

export function getSourceInfo(url) {
  if (!url || !url.trim()) return null;
  const clean = url.toLowerCase().trim();
  if (clean.includes('tiktok.com')) return { label: 'TikTok', icon: '🎵', color: 'bg-black text-white' };
  if (clean.includes('facebook.com') || clean.includes('fb.watch') || clean.includes('fb.com')) return { label: 'Facebook', icon: '📘', color: 'bg-blue-600 text-white' };
  if (clean.includes('youtube.com') || clean.includes('youtu.be')) return { label: 'YouTube', icon: '▶️', color: 'bg-red-600 text-white' };
  if (clean.includes('instagram.com')) return { label: 'Instagram', icon: '📸', color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' };
  if (clean.includes('google.com/maps') || clean.includes('maps.app.goo.gl')) return { label: 'Google Maps', icon: '📍', color: 'bg-emerald-600 text-white' };
  return { label: 'Bài viết', icon: '🔗', color: 'bg-stone-700 text-white' };
}

export function inferPriceRange(priceStr) {
  if (!priceStr || typeof priceStr !== 'string') return '$$';
  const clean = priceStr.toLowerCase().replace(/[,.]/g, '');
  const matches = clean.match(/\d+/g);
  if (!matches || matches.length === 0) {
    if (priceStr.includes('$$$')) return '$$$';
    if (priceStr.includes('$$')) return '$$';
    if (priceStr.includes('$')) return '$';
    return '$$';
  }
  let maxVal = 0;
  for (const m of matches) {
    let val = parseInt(m, 10);
    if (val < 1000) val = val * 1000;
    if (val > maxVal) maxVal = val;
  }
  if (maxVal <= 50000) return '$';
  if (maxVal <= 200000) return '$$';
  return '$$$';
}

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
          onAssign={(days, details) => {
            assignToPlan(schedulingPlace.id, days, details);
            setSchedulingPlace(null);
          }}
        />
      )}
    </>
  );
}

// -------------------------------------------------------------
// REUSABLE IMAGE INPUT / UPLOADER (DRIVE UPLOAD + DIRECT URL)
// -------------------------------------------------------------
function ImageUploader({ imageUrl, setImageUrl }) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDriveUploaded, setIsDriveUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploading(true);

    // Instant local preview
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);

    try {
      const res = await api.upload.image(file);
      if (res && res.directUrl) {
        setImageUrl(res.directUrl);
        setIsDriveUploaded(true);
      } else {
        // Fallback: keep preview or inform
        setIsDriveUploaded(false);
      }
    } catch (err) {
      console.warn("Upload failed, using local preview:", err);
      setUploadError("Không thể tải lên Drive, đang dùng ảnh cục bộ.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[var(--color-text-main)] block">
          Hình ảnh địa điểm
        </label>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              mode === 'upload' 
                ? 'bg-[var(--color-bg-surface)] text-[#FF6B4A] shadow-xs font-bold' 
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Tải ảnh từ máy</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              mode === 'url' 
                ? 'bg-[var(--color-bg-surface)] text-[#FF6B4A] shadow-xs font-bold' 
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Dán link ảnh</span>
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[var(--color-border)] hover:border-[#FF6B4A] rounded-2xl p-4 text-center cursor-pointer bg-[var(--color-bg-subtle)]/60 hover:bg-[#FFEBE6]/20 transition-all group"
          >
            {uploading ? (
              <div className="flex flex-col items-center justify-center py-2 text-xs text-[#FF6B4A] font-bold">
                <Loader2 className="w-6 h-6 animate-spin mb-1.5" />
                <span>Đang tải ảnh lên Google Drive...</span>
              </div>
            ) : imageUrl ? (
              <div className="relative aspect-[16/9] max-h-36 mx-auto rounded-xl overflow-hidden bg-black/10">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                  Bấm để đổi ảnh khác
                </div>
                {isDriveUploaded && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                    <Check className="w-3 h-3" /> Google Drive
                  </span>
                )}
              </div>
            ) : (
              <div className="py-2 text-center">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEBE6] dark:bg-[#3D221B] text-[#FF6B4A] flex items-center justify-center mx-auto mb-1.5 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[var(--color-text-main)]">
                  Nhấn để chọn ảnh từ thư viện thiết bị
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                  Tự động tải và đồng bộ trực tiếp lên Google Drive
                </p>
              </div>
            )}
          </div>
          {uploadError && (
            <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {uploadError}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <ImageIcon className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="url" 
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setIsDriveUploaded(false);
              }}
              placeholder="Dán link ảnh (https://images.unsplash.com/...)"
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            />
          </div>
          {imageUrl && (
            <div className="relative aspect-[16/9] max-h-32 rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
              <img 
                src={imageUrl} 
                alt="URL Preview" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// REUSABLE STAR RATING PICKER (1.0 -> 5.0)
// -------------------------------------------------------------
function StarRatingPicker({ rating, setRating }) {
  const [hoverRating, setHoverRating] = useState(null);
  const current = hoverRating !== null ? hoverRating : rating;

  const getLabel = (val) => {
    if (val >= 4.8) return 'Tuyệt vời / Đỉnh nóc ⭐';
    if (val >= 4.5) return 'Rất ngon / Rất thích ✨';
    if (val >= 4.0) return 'Khá ngon / Tốt 👍';
    if (val >= 3.0) return 'Tạm ổn / Bình thường 👌';
    return 'Chưa ưng ý lắm ⚠️';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold text-[var(--color-text-main)] flex items-center gap-1.5">
          <span>Đánh giá sao:</span>
          <span className="text-amber-500 font-extrabold text-sm">{Number(rating).toFixed(1)} / 5.0</span>
        </label>
        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
          {getLabel(rating)}
        </span>
      </div>

      <div className="p-2.5 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2">
        {/* 5 Interactive Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(star)}
              className="p-1 hover:scale-125 active:scale-95 transition-transform"
              title={`${star} sao`}
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  star <= current
                    ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                    : 'text-stone-300 dark:text-stone-600'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Quick decimal presets */}
        <div className="flex items-center gap-1">
          {[3.5, 4.0, 4.5, 4.8, 5.0].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setRating(val)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                Math.abs(rating - val) < 0.05
                  ? 'bg-amber-500 text-white shadow-xs scale-105'
                  : 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:text-amber-500 border border-[var(--color-border-subtle)]'
              }`}
            >
              {val.toFixed(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. QUICK ADD MODAL
// -------------------------------------------------------------
function QuickAddModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('an');
  const [priceText, setPriceText] = useState('50k - 100k');
  const [rating, setRating] = useState(4.5);
  const [imageUrl, setImageUrl] = useState('');
  const [sourceLink, setSourceLink] = useState('');
  const [reviewNote, setReviewNote] = useState('');

  const sourceInfo = getSourceInfo(sourceLink);

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

    const finalPriceText = priceText.trim() || 'Tùy chọn';
    const computedPriceRange = inferPriceRange(finalPriceText);

    onAdd({
      title,
      location: location || 'TP. Hồ Chí Minh',
      category,
      categoryLabel: categoryLabels[category] || 'Ăn uống',
      priceRange: computedPriceRange,
      priceText: finalPriceText,
      rating: Number(rating) || 4.5,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      sourceLink: sourceLink.trim(),
      reviewNote,
      tags: ['Mới thêm']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-2xl overflow-hidden select-none flex flex-col max-h-[92vh]">
        <div className="p-5 pb-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFEBE6] dark:bg-[#3D221B] text-[#FF6B4A] flex items-center justify-center font-bold text-lg">
              +
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--color-text-main)]">
                Thêm Địa Điểm Mới Vào Wishlist
              </h3>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Lưu nhanh từ TikTok, Facebook hoặc đề xuất bạn bè
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Tên địa điểm */}
          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
              Tên địa điểm <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Rang Rang Coffee, Bảo Tàng Mỹ Thuật, Cắm trại Trị An..."
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            />
          </div>

          {/* Danh mục & Khoảng giá */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                Khoảng giá (tự điền)
              </label>
              <input 
                type="text" 
                value={priceText}
                onChange={(e) => setPriceText(e.target.value)}
                placeholder="VD: 35k - 60k, 150k/người..."
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {[
                  { label: '< 50k', val: '25k - 45k' },
                  { label: '50k - 100k', val: '50k - 100k' },
                  { label: '100k - 200k', val: '100k - 200k' },
                  { label: '> 200k', val: '250k - 450k/người' }
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setPriceText(chip.val)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-bg-subtle)] hover:bg-[#FFEBE6] hover:text-[#FF6B4A] dark:hover:bg-[#3D221B] text-[var(--color-text-muted)] transition-colors border border-[var(--color-border-subtle)]"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
              Địa chỉ / Khu vực
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ví dụ: 29 Huỳnh Thúc Kháng, Bến Nghé, Quận 1..."
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            />
          </div>

          {/* Đánh giá số sao */}
          <StarRatingPicker rating={rating} setRating={setRating} />

          {/* Link bài viết (TikTok, FB, YouTube, Maps...) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[var(--color-text-main)] block">
                Link bài viết review (TikTok, FB, YouTube, Maps...)
              </label>
              {sourceInfo && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${sourceInfo.color}`}>
                  <span>{sourceInfo.icon}</span>
                  <span>{sourceInfo.label}</span>
                </span>
              )}
            </div>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="url" 
                value={sourceLink}
                onChange={(e) => setSourceLink(e.target.value)}
                placeholder="Dán link clip TikTok, bài post Facebook, video YouTube, Google Maps..."
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
              Hỗ trợ tự động nhận diện TikTok, Facebook, YouTube, Instagram và Google Maps.
            </p>
          </div>

          {/* Tải ảnh hoặc Dán link ảnh */}
          <ImageUploader imageUrl={imageUrl} setImageUrl={setImageUrl} />

          {/* Ghi chú */}
          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
              Ghi chú / Món ngon, điểm nổi bật
            </label>
            <textarea 
              rows="2"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Ví dụ: Bắt buộc thử bánh mì chảo, view ngắm hoàng hôn cực đẹp, đi sớm..."
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3.5 py-2 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-2.5 shrink-0">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/25 transition-all"
            >
              Lưu vào Wishlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. DETAIL MODAL
// -------------------------------------------------------------
function DetailModal({ place, onClose, onSchedule, onVisited, onDelete }) {
  const sourceInfo = getSourceInfo(place.sourceLink);

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
            <div className="flex items-center gap-2 mb-1">
              {place.status !== 'visited' && place.stt ? (
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF6B4A] to-amber-500 text-white shadow-sm border border-white/20">
                  STT #{place.stt} • Ưu tiên
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                  ✨ Kỷ niệm đã đi
                </span>
              )}
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                {place.categoryLabel}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {place.status !== 'visited' && place.stt ? `#${place.stt}. ` : ''}{place.title}
            </h2>
            <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B4A]" /> {place.location}
            </p>
          </div>
        </div>

        {/* Content details */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)] text-xs">
            <div className="flex items-center gap-2">
              {place.status !== 'visited' && place.stt ? (
                <span className="px-2 py-0.5 rounded-md bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3B221D] dark:text-[#FF7B5C] font-extrabold text-[11px]">
                  STT #{place.stt}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-extrabold text-[11px]">
                  Đã đi {place.visitedDate ? `(${place.visitedDate})` : ''}
                </span>
              )}
              <div>
                <span className="text-[var(--color-text-muted)]">Khoảng giá: </span>
                <strong className="text-[var(--color-text-main)]">{place.priceText || place.priceRange}</strong>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{place.rating} / 5.0</span>
            </div>
          </div>

          {/* Source Link Section */}
          {place.sourceLink && sourceInfo && (
            <div className="p-3 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0">{sourceInfo.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--color-text-main)]">
                    Bài viết review gốc
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] truncate max-w-xs">
                    {place.sourceLink}
                  </p>
                </div>
              </div>
              <a 
                href={place.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#FF8C69] hover:from-[#E85736] hover:to-[#FF6B4A] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Xem trên {sourceInfo.label}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {place.reviewNote && (
            <div>
              <h4 className="text-xs font-bold text-[var(--color-text-main)] mb-1">Ghi chú & Đánh giá:</h4>
              <p className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] p-3 rounded-xl leading-relaxed">
                {place.reviewNote}
              </p>
            </div>
          )}

          {(() => {
            const tagsList = Array.isArray(place.tags)
              ? place.tags
              : (typeof place.tags === 'string'
                  ? place.tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
                  : []);
            if (tagsList.length === 0) return null;
            return (
              <div className="flex flex-wrap gap-1.5">
                {tagsList.map((t, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            );
          })()}
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

// -------------------------------------------------------------
// 3. SCHEDULE MODAL
// -------------------------------------------------------------
function ScheduleModal({ place, onClose, onAssign }) {
  const [weekOffset, setWeekOffset] = useState(0); // 0 = tuần này, 1 = tuần sau, 2 = 2 tuần tới
  const [selectedDays, setSelectedDays] = useState(['Thứ Bảy']);
  const [time, setTime] = useState('09:00');
  const [note, setNote] = useState('');

  // Calculate dates for selected week offset
  const now = new Date();
  const currentDay = now.getDay();
  const distToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distToMonday + weekOffset * 7);

  const daysData = [
    { name: 'Thứ Hai', short: 'T2' },
    { name: 'Thứ Ba', short: 'T3' },
    { name: 'Thứ Tư', short: 'T4' },
    { name: 'Thứ Năm', short: 'T5' },
    { name: 'Thứ Sáu', short: 'T6' },
    { name: 'Thứ Bảy', short: 'T7' },
    { name: 'Chủ Nhật', short: 'CN' }
  ].map((d, idx) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + idx);
    const dateFormatted = `${String(dayDate.getDate()).padStart(2, '0')}/${String(dayDate.getMonth() + 1).padStart(2, '0')}`;
    const fullDate = dayDate.toISOString().split('T')[0];
    const isToday = fullDate === new Date().toISOString().split('T')[0];
    return {
      ...d,
      dateFormatted,
      fullDate,
      isToday
    };
  });

  const toggleDay = (dayName) => {
    setSelectedDays(prev => 
      prev.includes(dayName) 
        ? (prev.length > 1 ? prev.filter(d => d !== dayName) : prev)
        : [...prev, dayName]
    );
  };

  const selectWeekend = () => {
    setSelectedDays(['Thứ Bảy', 'Chủ Nhật']);
  };

  const selectAll = () => {
    setSelectedDays(daysData.map(d => d.name));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDays.length === 0) return;
    onAssign(selectedDays, { time, note, weekOffset });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-2xl p-6 select-none flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-subtle)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFEBE6] dark:bg-[#3D221B] text-[#FF6B4A]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[var(--color-text-main)] truncate max-w-[240px]">
                Lên lịch: {place.title}
              </h3>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Chọn tuần, nhiều ngày và giờ hẹn cụ thể
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* 1. CHỌN TUẦN */}
          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1.5">
              1. Chọn tuần đi:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { offset: 0, label: 'Tuần này' },
                { offset: 1, label: 'Tuần sau' },
                { offset: 2, label: '2 tuần tới' }
              ].map(w => (
                <button
                  key={w.offset}
                  type="button"
                  onClick={() => setWeekOffset(w.offset)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    weekOffset === w.offset
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                      : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] border-[var(--color-border)] hover:border-[#FF6B4A]'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#FF6B4A] font-semibold mt-1.5">
              🗓️ Dải ngày: {daysData[0].dateFormatted} – {daysData[6].dateFormatted}/{now.getFullYear()}
            </p>
          </div>

          {/* 2. CHỌN NHIỀU HÔM (MULTI-SELECT DAYS) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[var(--color-text-main)] block">
                2. Chọn các hôm muốn đi (chọn được nhiều ngày):
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={selectWeekend}
                  className="text-[10px] font-bold text-[#FF6B4A] hover:underline"
                >
                  Cuối tuần
                </button>
                <span className="text-xs text-[var(--color-text-muted)]">•</span>
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-[10px] font-bold text-[var(--color-text-muted)] hover:underline"
                >
                  Cả tuần
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {daysData.map(d => {
                const isSelected = selectedDays.includes(d.name);
                return (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => toggleDay(d.name)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#FFEBE6] dark:bg-[#3D221B] border-[#FF6B4A] text-[#FF6B4A]'
                        : 'bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-main)] hover:border-[var(--color-border-subtle)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs">{d.short}</span>
                      {d.isToday && (
                        <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-500 text-white">
                          Nay
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      <span className="text-[var(--color-text-muted)]">{d.dateFormatted}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FF6B4A]" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">
              Đã chọn: <span className="font-bold text-[var(--color-text-main)]">{selectedDays.join(', ')}</span> ({selectedDays.length} ngày)
            </p>
          </div>

          {/* 3. RÕ GIỜ HẸN (TIME & PRESET CHIPS) */}
          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF6B4A]" />
              <span>3. Giờ hẹn cụ thể:</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-sm font-bold px-3 py-2 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
              />
              <span className="text-xs text-[var(--color-text-muted)]">hoặc chọn nhanh:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                { label: 'Sáng 08:30', val: '08:30' },
                { label: 'Trưa 11:30', val: '11:30' },
                { label: 'Chiều 15:00', val: '15:00' },
                { label: 'Tối 18:30', val: '18:30' },
                { label: 'Đêm 21:00', val: '21:00' }
              ].map(chip => (
                <button
                  key={chip.val}
                  type="button"
                  onClick={() => setTime(chip.val)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                    time === chip.val
                      ? 'bg-[#FF6B4A] text-white border-[#FF6B4A]'
                      : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[#FF6B4A]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. GHI CHÚ */}
          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">
              4. Ghi chú điểm hẹn:
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Đặt bàn trước, đi cùng nhóm bạn, gọi lẩu..."
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            />
          </div>

          {/* FOOTER BUTTONS */}
          <div className="pt-2 flex items-center justify-end gap-2 shrink-0 border-t border-[var(--color-border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/25 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Lên lịch ({selectedDays.length} ngày)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. EDIT MODAL
// -------------------------------------------------------------
function EditModal({ place, onClose, onUpdate }) {
  const [title, setTitle] = useState(place.title || '');
  const [location, setLocation] = useState(place.location || '');
  const [category, setCategory] = useState(place.category || 'an');
  const [priceText, setPriceText] = useState(place.priceText || place.priceRange || '50k - 100k');
  const [rating, setRating] = useState(place.rating || 4.5);
  const [imageUrl, setImageUrl] = useState(place.imageUrl || '');
  const [sourceLink, setSourceLink] = useState(place.sourceLink || '');
  const [reviewNote, setReviewNote] = useState(place.reviewNote || '');

  const sourceInfo = getSourceInfo(sourceLink);

  const handleSave = (e) => {
    e.preventDefault();
    const categoryLabels = {
      an: 'Ăn ngon',
      cafe: 'Cà phê',
      chill: 'Quán chill',
      dulich: 'Du lịch & Cắm trại',
      workshop: 'Workshop & Chơi'
    };
    const finalPriceText = priceText.trim() || 'Tùy chọn';
    const computedPriceRange = inferPriceRange(finalPriceText);

    onUpdate(place.id, {
      title,
      location,
      category,
      categoryLabel: categoryLabels[category] || place.categoryLabel,
      priceText: finalPriceText,
      priceRange: computedPriceRange,
      rating: Number(rating) || 4.5,
      imageUrl,
      sourceLink: sourceLink.trim(),
      reviewNote
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-2xl p-5 select-none flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-subtle)] shrink-0">
          <h3 className="font-extrabold text-sm text-[var(--color-text-main)]">
            Chỉnh sửa địa điểm
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5 overflow-y-auto flex-1 pr-1">
          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">Tên địa điểm</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">Địa chỉ</label>
            <input 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            />
          </div>

          {/* Danh mục & Khoảng giá */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                Khoảng giá (tự điền)
              </label>
              <input 
                type="text" 
                value={priceText}
                onChange={(e) => setPriceText(e.target.value)}
                placeholder="VD: 35k - 60k, 150k/người..."
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {[
                  { label: '< 50k', val: '25k - 45k' },
                  { label: '50k - 100k', val: '50k - 100k' },
                  { label: '100k - 200k', val: '100k - 200k' },
                  { label: '> 200k', val: '250k - 450k/người' }
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setPriceText(chip.val)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-bg-subtle)] hover:bg-[#FFEBE6] hover:text-[#FF6B4A] dark:hover:bg-[#3D221B] text-[var(--color-text-muted)] transition-colors border border-[var(--color-border-subtle)]"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Đánh giá số sao */}
          <StarRatingPicker rating={rating} setRating={setRating} />

          {/* Link bài viết */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[var(--color-text-main)] block">
                Link bài viết review
              </label>
              {sourceInfo && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${sourceInfo.color}`}>
                  <span>{sourceInfo.icon}</span>
                  <span>{sourceInfo.label}</span>
                </span>
              )}
            </div>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="url" 
                value={sourceLink}
                onChange={(e) => setSourceLink(e.target.value)}
                placeholder="https://tiktok.com/@... hoặc facebook.com/..."
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>
          </div>

          {/* Hình ảnh */}
          <ImageUploader imageUrl={imageUrl} setImageUrl={setImageUrl} />

          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1">Ghi chú</label>
            <textarea 
              rows="3"
              value={reviewNote} 
              onChange={(e) => setReviewNote(e.target.value)}
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs px-3 py-2 rounded-xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-2 shrink-0">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-text-muted)]"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/25 transition-all"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
