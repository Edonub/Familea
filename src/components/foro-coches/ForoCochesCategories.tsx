
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface ForoCochesCategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const ForoCochesCategories = ({ activeCategory, setActiveCategory }: ForoCochesCategoriesProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Tabs defaultValue="General" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
      <TabsList className="grid w-full bg-[#444] grid-cols-5 gap-1">
        <TabsTrigger 
          value="General" 
          className="data-[state=active]:bg-[#ff4d4d] data-[state=active]:text-white w-full"
        >
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} w-full text-center`}>General</span>
        </TabsTrigger>
        <TabsTrigger 
          value="Viajes" 
          className="data-[state=active]:bg-[#ff4d4d] data-[state=active]:text-white w-full"
        >
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} w-full text-center`}>Viajes</span>
        </TabsTrigger>
        <TabsTrigger 
          value="Alojamientos" 
          className="data-[state=active]:bg-[#ff4d4d] data-[state=active]:text-white w-full"
        >
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} w-full text-center`}>Alojamientos</span>
        </TabsTrigger>
        <TabsTrigger 
          value="Offtopic" 
          className="data-[state=active]:bg-[#ff4d4d] data-[state=active]:text-white w-full"
        >
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} w-full text-center`}>Offtopic</span>
        </TabsTrigger>
        <TabsTrigger 
          value="Humor" 
          className="data-[state=active]:bg-[#ff4d4d] data-[state=active]:text-white w-full"
        >
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} w-full text-center`}>Humor</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ForoCochesCategories;
