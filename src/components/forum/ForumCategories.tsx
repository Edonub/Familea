
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

export type ForumCategory = "general" | "viajes" | "alojamientos" | "offtopic" | "humor";

interface ForumCategoriesProps {
  selectedCategory: ForumCategory;
  onCategoryChange: (category: ForumCategory) => void;
}

const ForumCategories = ({ selectedCategory, onCategoryChange }: ForumCategoriesProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Tabs 
      value={selectedCategory} 
      onValueChange={(value) => onCategoryChange(value as ForumCategory)}
    >
      <TabsList className="grid w-full grid-cols-5 h-auto bg-gray-50 p-1 gap-1">
        <TabsTrigger 
          value="general" 
          className={`
            ${isMobile ? 'text-xs py-1.5' : 'text-sm py-2'} 
            data-[state=active]:bg-familyxp-primary 
            data-[state=active]:text-white 
            font-medium
          `}
        >
          General
        </TabsTrigger>
        <TabsTrigger 
          value="viajes" 
          className={`
            ${isMobile ? 'text-xs py-1.5' : 'text-sm py-2'} 
            data-[state=active]:bg-familyxp-primary 
            data-[state=active]:text-white 
            font-medium
          `}
        >
          Viajes
        </TabsTrigger>
        <TabsTrigger 
          value="alojamientos" 
          className={`
            ${isMobile ? 'text-xs py-1.5' : 'text-sm py-2'} 
            data-[state=active]:bg-familyxp-primary 
            data-[state=active]:text-white 
            font-medium
          `}
        >
          Alojamientos
        </TabsTrigger>
        <TabsTrigger 
          value="offtopic" 
          className={`
            ${isMobile ? 'text-xs py-1.5' : 'text-sm py-2'} 
            data-[state=active]:bg-familyxp-primary 
            data-[state=active]:text-white 
            font-medium
          `}
        >
          Offtopic
        </TabsTrigger>
        <TabsTrigger 
          value="humor" 
          className={`
            ${isMobile ? 'text-xs py-1.5' : 'text-sm py-2'} 
            data-[state=active]:bg-familyxp-primary 
            data-[state=active]:text-white 
            font-medium
          `}
        >
          Humor
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ForumCategories;
