export function generatePagination(currentPage: number, totalPages: number) {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // If total pages are less than or equal to 7, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show the first page
      pages.push(1);
  
      // Show ellipsis if the current page is far from the first page
      if (currentPage > 4) pages.push('...');
  
      // Show pages around the current page
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
  
      // Show ellipsis if the current page is far from the last page
      if (currentPage < totalPages - 3) pages.push('...');
  
      // Always show the last page
      pages.push(totalPages);
    }
  
    return pages;
  }