// src/components/watchlist/Pagination.tsx
import React from 'react';
import type { PaginationConfig } from '../../types';
import styles from './Pagination.module.css';

interface PaginationProps {
  config: PaginationConfig;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ config, onPageChange }) => {
  const { currentPage, itemsPerPage, totalItems } = config;
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        <span className={styles.infoText}>
          {startItem} — {endItem} of {totalItems} results
        </span>
        <span className={styles.infoText}>
          {currentPage} of {totalPages} pages
        </span>
      </div>
      
      <div className={styles.pageControls}>
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className={`${styles.pageButton} ${!canGoPrevious ? styles.disabled : ''}`}
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`${styles.pageButton} ${!canGoNext ? styles.disabled : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;