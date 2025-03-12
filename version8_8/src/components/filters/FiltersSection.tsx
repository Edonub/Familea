
import { useIsMobile } from "@/hooks/use-mobile";
import BookingTypeSelector from "./BookingTypeSelector";
import FiltersDropdown from "./FiltersDropdown";
import { Category } from "@/data/categories";

interface FiltersSectionProps {
  categories: Category[];
  selectedCategories: string[];
  toggleCategory: (categoryId: string) => void;
  bookingType: "all" | "free" | "paid";
  setBookingType: (type: "all" | "free" | "paid") => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  durationRange: number[];
  setDurationRange: (range: number[]) => void;
}

const FiltersSection = ({
  categories,
  selectedCategories,
  toggleCategory,
  bookingType,
  setBookingType,
  priceRange,
  setPriceRange,
  durationRange,
  setDurationRange
}: FiltersSectionProps) => {
  const isMobile = useIsMobile();
  
  const resetFilters = () => {
    setPriceRange([200]);
    setDurationRange([180]);
    setBookingType("all");
    // Reset selected categories
    selectedCategories.forEach(cat => toggleCategory(cat));
  };

  return (
    <div className={`flex flex-wrap gap-2 mt-1 sm:mt-0 items-center ${isMobile ? "" : "flex-grow"}`}>
      <BookingTypeSelector 
        bookingType={bookingType}
        setBookingType={setBookingType}
      />
      
      <FiltersDropdown
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        durationRange={durationRange}
        setDurationRange={setDurationRange}
        resetFilters={resetFilters}
        isMobile={isMobile}
      />
    </div>
  );
};

export default FiltersSection;
