
import { Users } from "lucide-react";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import AdultCounter from "./AdultCounter";
import ChildrenSection from "./ChildrenSection";
import ChildrenSummary from "./ChildrenSummary";

interface Child {
  id: number;
  age: number;
}

interface MobileGuestContentProps {
  adults: number;
  setAdults: (count: number) => void;
  children: number;
  childrenDetails: Child[];
  removeChild: (id: number) => void;
  addChild: (age: number) => void;
}

const MobileGuestContent = ({
  adults,
  setAdults,
  children,
  childrenDetails,
  removeChild,
  addChild
}: MobileGuestContentProps) => {
  const displayText = adults + children > 0 
    ? `${adults} ${adults === 1 ? 'adulto' : 'adultos'}${children > 0 ? `, ${children} ${children === 1 ? 'niño' : 'niños'}` : ''}`
    : "Viajeros";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex justify-between items-center w-full h-12 px-3 py-2 bg-transparent">
          <Users size={18} className="text-gray-500 mr-2" />
          <span className="flex-1 text-left text-sm text-gray-500 truncate">
            {displayText}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="center">
        <div className="space-y-4">
          {/* Adultos */}
          <AdultCounter adults={adults} setAdults={setAdults} />
          
          {/* Niños */}
          <ChildrenSection 
            children={children}
            childrenDetails={childrenDetails}
            removeChild={removeChild}
            addChild={addChild}
          />
          
          {/* Resumen de niños */}
          {children > 0 && <ChildrenSummary childrenDetails={childrenDetails} />}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MobileGuestContent;
