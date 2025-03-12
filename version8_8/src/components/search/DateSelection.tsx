import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";

interface DateSelectionProps {
  activeTab: string;
  setActiveTab: (tab: "destination" | "dates" | "guests") => void;
  dateFrom: Date | undefined;
  setDateFrom: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  setDateTo: (date: Date | undefined) => void;
}

const DateSelection = ({ 
  activeTab, 
  setActiveTab, 
  dateFrom, 
  setDateFrom, 
  dateTo, 
  setDateTo 
}: DateSelectionProps) => {
  const isMobile = useIsMobile();
  const [date, setDate] = useState<DateRange | undefined>({
    from: dateFrom,
    to: dateTo
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
  };

  const handleConfirm = () => {
    setDateFrom(date?.from);
    setDateTo(date?.to);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex justify-between items-center w-full h-12 px-3 py-2 bg-white">
            <CalendarIcon size={18} className="text-gray-500 mr-2" />
            <span className="flex-1 text-left text-sm text-gray-500 truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd MMM")} - {format(date.to, "dd MMM")}
                  </>
                ) : (
                  format(date.from, "dd MMM")
                )
              ) : (
                "Fechas"
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <div className="flex flex-col">
            <Calendar
              mode="range"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              className="p-3 pointer-events-auto"
              numberOfMonths={1}
            />
            <div className="p-3 border-t">
              <Button 
                className="w-full" 
                onClick={handleConfirm}
                disabled={!date?.from || !date?.to}
              >
                Confirmar fechas
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div 
          className={cn(
            "p-3 md:p-4 flex-1 border-b md:border-b-0 md:border-r border-gray-200 cursor-pointer",
            isOpen ? "bg-white" : ""
          )}
          onClick={() => {
            setActiveTab("dates");
            setIsOpen(true);
          }}
        >
          <div className="px-2">
            <div className="text-xs font-bold">Fecha</div>
            <div className="flex items-center">
              <CalendarIcon size={16} className="text-gray-500 mr-2" />
              <div className="text-sm text-gray-500">
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd MMM")} - {format(date.to, "dd MMM")}
                    </>
                  ) : (
                    format(date.from, "dd MMM")
                  )
                ) : (
                  "Seleccionar fechas"
                )}
              </div>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            className="p-3 pointer-events-auto"
            numberOfMonths={2}
          />
          <div className="p-3 border-t">
            <Button 
              className="w-full" 
              onClick={handleConfirm}
              disabled={!date?.from || !date?.to}
            >
              Confirmar fechas
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateSelection;
