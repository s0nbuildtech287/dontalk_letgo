/**
 * MODALS COMPONENT
 * 1. Quick Add Modal (Dán link Maps/TikTok hoặc gõ tên)
 * 2. Schedule Modal (Lên lịch ngày giờ đi chơi)
 * 3. Review Modal (Viết nhật ký & đánh giá sao 1-5)
 * 4. Detail Modal (Xem chi tiết địa điểm)
 */

export function renderModals() {
  return `
    <!-- QUICK ADD MODAL -->
    <div id="modal-quick-add" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div class="w-full max-w-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl relative transition-all">
        <!-- Close button -->
        <button onclick="window.app.closeModal('modal-quick-add')" class="absolute top-4 right-4 p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-subtle)]">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3D221B] flex items-center justify-center">
            <i data-lucide="plus-circle" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-[var(--color-text-main)]">Thêm nhanh địa điểm</h3>
            <p class="text-xs text-[var(--color-text-muted)]">Dán link Google Maps / TikTok hoặc gõ tên quán</p>
          </div>
        </div>

        <form id="form-quick-add" onsubmit="window.app.handleQuickAddSubmit(event)" class="space-y-4">
          <!-- Smart Input / Link -->
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">Link chia sẻ hoặc Tên quán</label>
            <div class="relative">
              <input 
                id="qa-link-or-name"
                type="text" 
                required
                placeholder="https://maps.app.goo.gl/... hoặc Phở Thìn..."
                class="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-sm px-4 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none"
                oninput="window.app.handleSmartPaste(this.value)"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                Tự nhận diện
              </span>
            </div>
          </div>

          <!-- Tên địa điểm -->
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">Tên địa điểm hiển thị</label>
            <input 
              id="qa-title"
              type="text" 
              required
              placeholder="VD: Quán Cà Phê Yên Sài Gòn..."
              class="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-sm px-4 py-2 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>

          <!-- Khu vực & Khoảng giá -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">Khu vực</label>
              <input 
                id="qa-location"
                type="text" 
                required
                placeholder="VD: Quận 1, TP. Hồ Chí Minh"
                class="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-sm px-4 py-2 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">Khoảng giá</label>
              <select id="qa-price" class="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-sm px-3 py-2 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none">
                <option value="$">Dưới 50k ($)</option>
                <option value="$$" selected>50k - 200k ($$)</option>
                <option value="$$$">Trên 200k ($$$)</option>
              </select>
            </div>
          </div>

          <!-- Loại địa điểm -->
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">Danh mục</label>
            <div class="grid grid-cols-4 gap-2">
              <label class="flex flex-col items-center p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] cursor-pointer has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[#FFEBE6] dark:has-[:checked]:bg-[#3D221B]">
                <input type="radio" name="qa-category" value="an" class="hidden" checked />
                <span class="text-base">🍜</span>
                <span class="text-[11px] font-semibold mt-1">Ăn ngon</span>
              </label>
              <label class="flex flex-col items-center p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] cursor-pointer has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[#FFEBE6] dark:has-[:checked]:bg-[#3D221B]">
                <input type="radio" name="qa-category" value="uong" class="hidden" />
                <span class="text-base">☕</span>
                <span class="text-[11px] font-semibold mt-1">Cà phê</span>
              </label>
              <label class="flex flex-col items-center p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] cursor-pointer has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[#FFEBE6] dark:has-[:checked]:bg-[#3D221B]">
                <input type="radio" name="qa-category" value="choi" class="hidden" />
                <span class="text-base">🎯</span>
                <span class="text-[11px] font-semibold mt-1">Chơi vui</span>
              </label>
              <label class="flex flex-col items-center p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] cursor-pointer has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[#FFEBE6] dark:has-[:checked]:bg-[#3D221B]">
                <input type="radio" name="qa-category" value="dulich" class="hidden" />
                <span class="text-base">🌿</span>
                <span class="text-[11px] font-semibold mt-1">Du lịch</span>
              </label>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-end gap-2.5">
            <button type="button" onclick="window.app.closeModal('modal-quick-add')" class="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
              Hủy
            </button>
            <button type="submit" class="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/25">
              Lưu vào "Muốn đi"
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- SCHEDULE MODAL -->
    <div id="modal-schedule" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="w-full max-w-md bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl relative">
        <button onclick="window.app.closeModal('modal-schedule')" class="absolute top-4 right-4 p-2 rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center">
            <i data-lucide="calendar" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-[var(--color-text-main)]">Lên lịch trải nghiệm</h3>
            <p id="schedule-place-title" class="text-xs text-[var(--color-primary)] font-semibold truncate max-w-[240px]">Tên địa điểm</p>
          </div>
        </div>

        <form id="form-schedule" onsubmit="window.app.handleScheduleSubmit(event)" class="space-y-4">
          <input type="hidden" id="schedule-place-id" />
          
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">Chọn ngày trong tuần</label>
            <select id="schedule-day-select" class="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-sm px-3 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none">
              <option value="Thứ Hai">Thứ Hai</option>
              <option value="Thứ Ba">Thứ Ba</option>
              <option value="Thứ Tư">Thứ Tư</option>
              <option value="Thứ Năm">Thứ Năm</option>
              <option value="Thứ Sáu">Thứ Sáu</option>
              <option value="Thứ Bảy" selected>Thứ Bảy cuối tuần</option>
              <option value="Chủ Nhật">Chủ Nhật thảnh thơi</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">Khung giờ dự kiến</label>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" onclick="window.app.setScheduleTimeSlot('08:30 - Sáng')" class="time-slot-btn py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] font-medium hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:bg-[#FFEBE6] dark:focus:bg-[#3D221B]">
                Sáng (8:30)
              </button>
              <button type="button" onclick="window.app.setScheduleTimeSlot('12:00 - Trưa')" class="time-slot-btn py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] font-medium hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:bg-[#FFEBE6] dark:focus:bg-[#3D221B]">
                Trưa (12:00)
              </button>
              <button type="button" onclick="window.app.setScheduleTimeSlot('18:30 - Tối')" class="time-slot-btn active py-2 text-xs rounded-xl border border-[var(--color-primary)] bg-[#FFEBE6] dark:bg-[#3D221B] font-medium">
                Tối (18:30)
              </button>
            </div>
            <input type="hidden" id="schedule-time-val" value="18:30 - Tối" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">Ghi chú hẹn bạn bè</label>
            <input 
              id="schedule-note" 
              type="text" 
              placeholder="VD: Đi cùng nhóm bạn Đại học, nhớ đặt bàn trước..." 
              class="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-sm px-4 py-2 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>

          <div class="pt-3 flex items-center justify-end gap-2">
            <button type="button" onclick="window.app.closeModal('modal-schedule')" class="px-4 py-2 text-xs font-semibold text-[var(--color-text-muted)]">
              Đóng
            </button>
            <button type="submit" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20">
              Lưu vào Kế hoạch tuần
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- REVIEW & JOURNAL MODAL -->
    <div id="modal-review" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="w-full max-w-md bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl relative">
        <button onclick="window.app.closeModal('modal-review')" class="absolute top-4 right-4 p-2 rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-[var(--color-text-main)]">Ghi lại kỷ niệm đã đi</h3>
            <p id="review-place-title" class="text-xs text-[var(--color-primary)] font-semibold truncate max-w-[240px]">Tên địa điểm</p>
          </div>
        </div>

        <form id="form-review" onsubmit="window.app.handleReviewSubmit(event)" class="space-y-4">
          <input type="hidden" id="review-place-id" />
          
          <!-- Star Rating -->
          <div class="text-center py-2">
            <label class="block text-xs font-semibold text-[var(--color-text-muted)] mb-2">Đánh giá trải nghiệm</label>
            <div id="star-rating-container" class="flex items-center justify-center gap-2">
              ${[1, 2, 3, 4, 5].map(star => `
                <button 
                  type="button" 
                  onclick="window.app.setRatingStar(${star})"
                  class="star-btn p-1 text-amber-400 hover:scale-110 transition-transform"
                  data-star="${star}"
                >
                  <i data-lucide="star" class="w-7 h-7 ${star <= 5 ? 'fill-amber-400' : ''}"></i>
                </button>
              `).join('')}
            </div>
            <input type="hidden" id="review-rating-val" value="5" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">Cảm nhận thực tế (Món nào ngon, tip đi lại...)</label>
            <textarea 
              id="review-note-input"
              rows="3" 
              placeholder="VD: Quán rất đông nên đi sớm trước 19h, nước dùng đậm đà, nhân viên nhiệt tình..." 
              class="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-sm p-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none"
            ></textarea>
          </div>

          <div class="pt-2 flex items-center justify-end gap-2">
            <button type="button" onclick="window.app.closeModal('modal-review')" class="px-4 py-2 text-xs font-semibold text-[var(--color-text-muted)]">
              Để sau
            </button>
            <button type="submit" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20">
              Lưu vào Nhật ký
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
