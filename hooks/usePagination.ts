import { useState, useMemo } from 'react';

interface PaginationOptions<T> {
  items: T[];
  itemsPerPage: number;
  filterFn?: (item: T) => boolean;
  initialPage?: number;
}

interface PaginationResult<T> {
  currentItems: T[];
  totalPages: number;
  totalItems: number;
}

export function usePagination<T>({ 
  items, 
  itemsPerPage, 
  filterFn = () => true,
  initialPage = 1 
}: PaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginatedData = useMemo((): PaginationResult<T> => {
    const filteredItems = items.filter(filterFn);
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Ensure current page is valid
    const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
    }

    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      currentItems: filteredItems.slice(startIndex, endIndex),
      totalPages,
      totalItems
    };
  }, [items, itemsPerPage, currentPage, filterFn]);

  return {
    currentPage,
    setCurrentPage,
    paginatedData
  };
}