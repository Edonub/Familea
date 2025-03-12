
import { Plus, Minus } from "lucide-react";
import { Button } from "../../ui/button";

interface AdultCounterProps {
  adults: number;
  setAdults: (count: number) => void;
}

const AdultCounter = ({ adults, setAdults }: AdultCounterProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">Adultos</h3>
        <p className="text-sm text-gray-500">Mayores de 13 años</p>
      </div>
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            setAdults(Math.max(1, adults - 1));
          }}
          disabled={adults <= 1}
        >
          <Minus size={16} />
        </Button>
        <span className="w-5 text-center">{adults}</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            setAdults(adults + 1);
          }}
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};

export default AdultCounter;
