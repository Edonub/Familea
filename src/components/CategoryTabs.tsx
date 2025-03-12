
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

interface CategoryTabsProps {
  categories: CategoryItem[];
  activeCategory?: string;
}

const CategoryTabs = ({ categories, activeCategory }: CategoryTabsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="border-b border-gray-200 mb-3 w-full">
      <div className="relative w-full">
        <ScrollArea className="w-full pb-2">
          <div className={isMobile 
            ? "flex overflow-x-auto py-2 w-full gap-1" 
            : "flex justify-between py-2 w-full"
          }>
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/explorar?categoria=${category.slug}`}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-gray-600 hover:bg-gray-100'
                } ${isMobile ? 'flex-shrink-0' : ''}`}
                style={{ minWidth: isMobile ? '80px' : 'auto' }}
              >
                <div className={`rounded-full bg-gray-100 p-2 mb-1 ${
                  activeCategory === category.id ? 'bg-primary/20' : ''
                }`}>
                  <img 
                    src={category.icon} 
                    alt={category.name} 
                    className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} 
                  />
                </div>
                <span className="text-xs text-center w-full truncate">{category.name}</span>
              </Link>
            ))}
          </div>
          {isMobile && <ScrollBar orientation="horizontal" />}
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoryTabs;
