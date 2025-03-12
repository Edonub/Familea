
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileGuestContent from "./guests/MobileGuestContent";
import DesktopGuestContent from "./guests/DesktopGuestContent";

interface Child {
  id: number;
  age: number;
}

interface GuestSelectorProps {
  activeTab: string;
  setActiveTab: (tab: "destination" | "dates" | "guests") => void;
  adults: number;
  setAdults: (count: number) => void;
  children: number;
  setChildren: (count: number) => void;
  childrenDetails?: Child[];
  setChildrenDetails?: (children: Child[]) => void;
}

const GuestSelector = ({ 
  activeTab, 
  setActiveTab, 
  adults, 
  setAdults, 
  children,
  setChildren,
  childrenDetails = [],
  setChildrenDetails = () => {}
}: GuestSelectorProps) => {
  const isMobile = useIsMobile();
  const [nextChildId, setNextChildId] = useState<number>(1);

  const addChild = (age: number) => {
    const newChild = { id: nextChildId, age };
    setChildrenDetails([...childrenDetails, newChild]);
    setChildren(childrenDetails.length + 1);
    setNextChildId(nextChildId + 1);
  };

  const removeChild = (id: number) => {
    const updatedChildren = childrenDetails.filter(child => child.id !== id);
    setChildrenDetails(updatedChildren);
    setChildren(updatedChildren.length);
  };

  if (isMobile) {
    return (
      <MobileGuestContent
        adults={adults}
        setAdults={setAdults}
        children={children}
        childrenDetails={childrenDetails}
        removeChild={removeChild}
        addChild={addChild}
      />
    );
  }

  return (
    <DesktopGuestContent
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      adults={adults}
      setAdults={setAdults}
      children={children}
      childrenDetails={childrenDetails}
      removeChild={removeChild}
      addChild={addChild}
    />
  );
};

export default GuestSelector;
