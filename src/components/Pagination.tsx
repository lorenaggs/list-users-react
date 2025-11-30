import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { PAGINATION_CONSTANTS } from "../constants";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= PAGINATION_CONSTANTS.MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(PAGINATION_CONSTANTS.ELLIPSIS);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(PAGINATION_CONSTANTS.ELLIPSIS);
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(PAGINATION_CONSTANTS.ELLIPSIS);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(PAGINATION_CONSTANTS.ELLIPSIS);
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
        style={{
          backgroundColor: currentPage === 1 ? 'var(--button-secondary)' : 'var(--button-primary)',
          color: currentPage === 1 ? 'var(--text-tertiary)' : 'white',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = 'var(--button-primary-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = 'var(--button-primary)';
          }
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {getPageNumbers().map((page, index) => (
        page === PAGINATION_CONSTANTS.ELLIPSIS ? (
          <span key={`ellipsis-${index}`} className="px-2" style={{ color: 'var(--text-tertiary)' }}>{PAGINATION_CONSTANTS.ELLIPSIS}</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className="px-4 py-2 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: currentPage === page ? 'var(--button-primary)' : 'var(--button-secondary)',
              color: currentPage === page ? 'white' : 'var(--text-secondary)',
              boxShadow: currentPage === page ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== page) {
                e.currentTarget.style.backgroundColor = 'var(--button-secondary-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== page) {
                e.currentTarget.style.backgroundColor = 'var(--button-secondary)';
              }
            }}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
        style={{
          backgroundColor: currentPage === totalPages ? 'var(--button-secondary)' : 'var(--button-primary)',
          color: currentPage === totalPages ? 'var(--text-tertiary)' : 'white',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = 'var(--button-primary-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = 'var(--button-primary)';
          }
        }}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

