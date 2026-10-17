import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 select-none animate-fadeIn">
      <div className="text-xs text-[var(--color-text-muted)] font-medium">
        Hiển thị <span className="font-bold text-[var(--color-text-main)]">{startIdx} - {endIdx}</span> trong tổng số <span className="font-bold text-[var(--color-text-main)]">{totalItems}</span> địa điểm (9 địa điểm / trang)
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-main)] hover:border-[#FF6B4A] hover:text-[#FF6B4A] disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 text-xs font-bold shadow-xs"
          title="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Trang trước</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map(p => (
            <button
              key={p}
              onClick={() => handlePageClick(p)}
              className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                currentPage === p
                  ? 'bg-gradient-to-r from-[#FF6B4A] to-amber-500 text-white shadow-md shadow-[#FF6B4A]/25 scale-105'
                  : 'border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:border-[#FF6B4A] hover:text-[#FF6B4A]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-main)] hover:border-[#FF6B4A] hover:text-[#FF6B4A] disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 text-xs font-bold shadow-xs"
          title="Trang sau"
        >
          <span className="hidden sm:inline">Trang sau</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
