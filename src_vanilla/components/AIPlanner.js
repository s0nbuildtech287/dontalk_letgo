/**
 * AI PLANNER & EXPLORE COMPONENT
 * Gợi ý quán gần đây & Lập lịch trình thông minh theo yêu cầu (vd: "1 ngày Đà Lạt, 1 triệu")
 */

export function renderAIPlanner(store) {
  const suggestedSpots = store.places.slice(0, 6);

  return `
    <div class="space-y-8">
      <!-- AI Itinerary Hero Box -->
      <div class="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#FF6B4A]/15 via-amber-500/10 to-transparent border border-[#FF6B4A]/30">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBE6] text-[#FF6B4A] dark:bg-[#3D221B] dark:text-[#FF7B5C] text-xs font-bold mb-3">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
            <span>AI Lịch Trình Tức Thì</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">
            Đi đâu, ngân sách bao nhiêu? Để AI lo từ A đến Z!
          </h2>
          <p class="text-sm text-[var(--color-text-muted)] mt-2">
            Nhập nhanh mong muốn của bạn (ví dụ: <span class="text-[#FF6B4A] font-semibold">"1 ngày Đà Lạt 1 triệu"</span> hoặc <span class="text-[#FF6B4A] font-semibold">"Cuối tuần cà phê quận 1 200k"</span>).
          </p>

          <!-- Input bar -->
          <div class="mt-5 flex flex-col sm:flex-row gap-2.5">
            <div class="relative flex-1">
              <i data-lucide="compass" class="w-5 h-5 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2"></i>
              <input 
                id="ai-prompt-input"
                type="text" 
                placeholder="Ví dụ: 1 ngày Đà Lạt ngắm hoàng hôn, 1 triệu đồng..." 
                class="w-full bg-[var(--color-bg-surface)] text-[var(--color-text-main)] text-sm pl-11 pr-4 py-3 rounded-2xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none shadow-sm"
                onkeydown="if(event.key === 'Enter') window.app.generateAITrip()"
              />
            </div>
            <button 
              onclick="window.app.generateAITrip()"
              class="px-6 py-3 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm shadow-md shadow-[#FF6B4A]/25 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <i data-lucide="wand-2" class="w-4 h-4"></i>
              <span>Lên lịch ngay</span>
            </button>
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="flex flex-wrap items-center gap-2 mt-3.5">
            <span class="text-xs text-[var(--color-text-muted)] font-medium">Gợi ý nhanh:</span>
            <button onclick="window.app.setAIPrompt('1 ngày Đà Lạt săn mây và nướng BBQ, 1 triệu')" class="px-2.5 py-1 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-main)] hover:border-[#FF6B4A] transition-colors">
              🌲 1 ngày Đà Lạt, 1 triệu
            </button>
            <button onclick="window.app.setAIPrompt('Tour cà phê sống ảo Quận 1 Sài Gòn 300k')" class="px-2.5 py-1 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-main)] hover:border-[#FF6B4A] transition-colors">
              ☕ Sài Gòn cà phê 300k
            </button>
            <button onclick="window.app.setAIPrompt('Ăn sập Phố cổ Hà Nội trong 24 giờ 500k')" class="px-2.5 py-1 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-main)] hover:border-[#FF6B4A] transition-colors">
              🍜 Hà Nội phố cổ 500k
            </button>
          </div>
        </div>
      </div>

      <!-- Generated AI Result Container -->
      <div id="ai-result-container" class="hidden"></div>

      <!-- Trending Nearby Spots -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-xl font-bold text-[var(--color-text-main)]">Gợi ý địa điểm xu hướng gần bạn</h3>
            <p class="text-xs text-[var(--color-text-muted)]">Được cộng đồng "Đi Thôi" lưu nhiều nhất tuần này</p>
          </div>
        </div>

        <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
          ${suggestedSpots.map(place => `
            <div class="group relative rounded-2xl overflow-hidden bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-3 flex flex-col justify-between hover:shadow-lg transition-all">
              <div class="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                <img src="${place.imageUrl}" alt="${place.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/50 text-white backdrop-blur-sm">
                  ${place.categoryLabel}
                </span>
                <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] font-bold">
                  ${place.priceText}
                </span>
              </div>
              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-sm text-[var(--color-text-main)] truncate">${place.title}</h4>
                  <p class="text-xs text-[var(--color-text-muted)] truncate flex items-center gap-1 mt-1">
                    <i data-lucide="map-pin" class="w-3 h-3 text-[#FF6B4A]"></i>
                    ${place.location}
                  </p>
                </div>
                <div class="mt-3 pt-2.5 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                  <span class="text-xs font-semibold text-amber-500 flex items-center gap-1">
                    <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
                    ${place.rating}
                  </span>
                  <button 
                    onclick="window.app.addPlaceToWishlistQuick('${place.id}')"
                    class="px-2.5 py-1 rounded-lg bg-[var(--color-primary)] text-white text-xs font-semibold hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-1"
                  >
                    <i data-lucide="plus" class="w-3 h-3"></i>
                    Lưu nhanh
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
