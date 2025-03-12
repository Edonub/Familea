
import { Tag, Calendar, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingTypeSelectorProps {
  bookingType: "all" | "free" | "paid";
  setBookingType: (type: "all" | "free" | "paid") => void;
}

const BookingTypeSelector = ({
  bookingType,
  setBookingType
}: BookingTypeSelectorProps) => {
  return (
    <div className="bg-gray-100 rounded-full py-0.5 px-0.5 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full h-7 px-2 transition-all ${bookingType === "all" ? "bg-white text-familyxp-primary shadow-sm" : "text-gray-600 hover:text-familyxp-primary"}`}
          onClick={() => setBookingType("all")}
        >
          <ListFilter className="w-3.5 h-3.5 mr-1" />
          <span className="text-xs font-medium">Todos</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full h-7 px-2 transition-all ${bookingType === "free" ? "bg-white text-familyxp-primary shadow-sm" : "text-gray-600 hover:text-familyxp-primary"}`}
          onClick={() => setBookingType("free")}
        >
          <Tag className="w-3.5 h-3.5 mr-1" />
          <span className="text-xs font-medium">Gratis</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full h-7 px-2 transition-all ${bookingType === "paid" ? "bg-white text-familyxp-primary shadow-sm" : "text-gray-600 hover:text-familyxp-primary"}`}
          onClick={() => setBookingType("paid")}
        >
          <Calendar className="w-3.5 h-3.5 mr-1" />
          <span className="text-xs font-medium">Reservar</span>
        </Button>
      </div>
    </div>
  );
};

export default BookingTypeSelector;
