import React, { useState, useEffect } from 'react';
import { useAppStore } from '../context/StoreContext';
import { FilterBar } from './FilterBar';
import { PlaceCard } from './PlaceCard';
import { KanbanBoard } from './KanbanBoard';
import { FullMapView } from './FullMapView';
import { Pagination } from './Pagination';
import { SearchX, Plus } from 'lucide-react';

const ITEMS_PER_PAGE = 9; // 3 dòng x 3 cột = 9 địa điểm / trang

export function WishlistView() {
  const { filteredPlaces, viewMode, setIsQuickAddOpen } = useAppStore();
  const [currentPage, setCurrentPage] = useState(1);

  // Tự động về trang 1 khi danh sách thay đổi (lọc, tìm kiếm)
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPlaces.length]);

  const totalPages = Math.ceil(filteredPlaces.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPlaces = filteredPlaces.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 pb-12">
      {/* FILTER BAR & VIEW MODE SWITCH */}
      <FilterBar showViewMode={true} />

      {/* RENDER BY VIEW MODE */}
      {viewMode === 'kanban' && <KanbanBoard />}

      {viewMode === 'map' && <FullMapView />}

      {viewMode === 'grid' && (
        <>
          {filteredPlaces.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[var(--color-bg-surface)] border-2 border-dashed border-[var(--color-border)] text-center my-6">
              <SearchX className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3 opacity-40" />
              <h3 className="font-extrabold text-sm text-[var(--color-text-main)]">
                Không tìm thấy địa điểm phù hợp
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">
                Thử thay đổi từ khóa tìm kiếm hoặc bấm nút bên dưới để thêm địa điểm mới.
              </p>
              <button 
                onClick={() => setIsQuickAddOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold shadow-md shadow-[#FF6B4A]/25"
              >
                Thêm địa điểm ngay
              </button>
            </div>
          ) : (
            <>
              {/* 3x3 Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {paginatedPlaces.map(place => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>

              {/* Pagination Controls */}
              <Pagination
                currentPage={validCurrentPage}
                totalPages={totalPages}
                totalItems={filteredPlaces.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
