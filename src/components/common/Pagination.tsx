import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="px-4 py-3 bg-white dark:bg-navy-900 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <div>
        Showing <span className="font-bold text-slate-800 dark:text-slate-200">{startItem}</span> to{' '}
        <span className="font-bold text-slate-800 dark:text-slate-200">{endItem}</span> of{' '}
        <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems}</span> results
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-navy-700 hover:bg-slate-100 dark:hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
              currentPage === p
                ? 'bg-brand-600 text-white shadow-xs'
                : 'hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-navy-700 hover:bg-slate-100 dark:hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
