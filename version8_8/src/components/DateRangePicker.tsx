
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

interface DateRangePickerProps {
  date: DateRange;
  setDate: (date: DateRange) => void;
  className?: string;
}

export default function DateRangePicker({
  date,
  setDate,
  className,
}: DateRangePickerProps) {
  // Replaced buttonVariants with direct Button component usage
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              {date?.from ? (
                date.to ? (
                  <div>
                    {format(date.from, "dd/MM/yyyy")} -{" "}
                    {format(date.to, "dd/MM/yyyy")}
                  </div>
                ) : (
                  <div>{format(date.from, "dd/MM/yyyy")}</div>
                )
              ) : (
                <div>Elegir fechas</div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={{ from: date?.from, to: date?.to }}
            onSelect={(newDate: any) => setDate(newDate)}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
