
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;
  
  const renderPageNumbers = () => {
    const pages = [];
    
    // Previous button
    pages.push(
      <Button 
        key="prev" 
        variant="outline" 
        className="mx-1"
        disabled={currentPage === 1} 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        Anterior
      </Button>
    );
    
    // Page numbers
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button 
          key={i} 
          className="mx-1"
          variant={i === currentPage ? "default" : "outline"}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }
    
    // Next button
    pages.push(
      <Button 
        key="next" 
        variant="outline" 
        className="mx-1"
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        Siguiente
      </Button>
    );
    
    return pages;
  };

  return (
    <div className="mt-8 flex justify-center">
      {renderPageNumbers()}
    </div>
  );
};

export default Pagination;
