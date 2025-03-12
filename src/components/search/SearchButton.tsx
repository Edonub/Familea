
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchButtonProps {
  onClick: () => void;
}

const SearchButton = ({
  onClick
}: SearchButtonProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <Button 
        onClick={onClick} 
        size="icon" 
        className="h-10 w-10 rounded-full bg-familyxp-primary hover:bg-familyxp-secondary flex items-center justify-center text-white"
      >
        <Search size={18} />
      </Button>
    );
  }
  
  return (
    <div className="h-full flex items-center justify-center">
      <Button 
        onClick={onClick} 
        size="lg" 
        className="w-full h-12 text-white rounded-full bg-familyxp-primary hover:bg-familyxp-secondary flex items-center justify-center"
      >
        <Search size={20} className="mr-1" />
        <span>Buscar</span>
      </Button>
    </div>
  );
};

export default SearchButton;
