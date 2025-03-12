
import { Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import AdultCounter from "./AdultCounter";
import ChildrenSection from "./ChildrenSection";
import ChildrenSummary from "./ChildrenSummary";

interface Child {
  id: number;
  age: number;
}

interface DesktopGuestContentProps {
  activeTab: string;
  setActiveTab: (tab: "destination" | "dates" | "guests") => void;
  adults: number;
  setAdults: (count: number) => void;
  children: number;
  childrenDetails: Child[];
  removeChild: (id: number) => void;
  addChild: (age: number) => void;
}

const DesktopGuestContent = ({
  activeTab,
  setActiveTab,
  adults,
  setAdults,
  children,
  childrenDetails,
  removeChild,
  addChild
}: DesktopGuestContentProps) => {
  const displayText = adults + children > 0 
    ? `${adults} ${adults === 1 ? 'adulto' : 'adultos'}${children > 0 ? `, ${children} ${children === 1 ? 'niño' : 'niños'}` : ''}`
    : "Añade viajeros";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div 
          className={`p-3 md:p-4 flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200 cursor-pointer ${activeTab === "guests" ? "" : ""}`}
          onClick={() => setActiveTab("guests")}
        >
          <div className="px-2 flex-1">
            <div className="text-xs font-bold">Viajeros</div>
            <div className="flex items-center">
              <Users size={16} className="text-gray-500 mr-2" />
              <div className="text-sm text-gray-500">
                {displayText}
              </div>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
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

export default DesktopGuestContent;
