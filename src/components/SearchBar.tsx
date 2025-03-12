
import { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import DateRangePicker, { DateRange } from "./DateRangePicker";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string, dateRange?: DateRange) => void;
  initialValue?: string;
  initialDateRange?: DateRange;
  variant?: string;
}

const SearchBar = ({ className = "", onSearch, initialValue = "", initialDateRange, variant }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange || { from: undefined, to: undefined });
  const [suggestions, setSuggestions] = useState<{name: string, country: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions as user types - improved to filter from start
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 0) {
        const { data, error } = await supabase
          .from('destinations')
          .select('name, country')
          .ilike('name', `${searchQuery}%`) // Changed to start with pattern
          .order('popularity', { ascending: false })
          .limit(5);
          
        if (!error && data) {
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [searchQuery]);

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, dateRange);
    }
    setShowSuggestions(false);
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Apply special styling for home variant
  const isHomeVariant = variant === 'home';
  
  return (
    <form onSubmit={handleSearch} className={`relative flex flex-col sm:flex-row items-center gap-2 sm:gap-0 bg-white rounded-full shadow-lg ${className}`}>
      <div className="relative w-full">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar experiencias, talleres, actividades..."
          className={`pr-10 bg-white py-6 w-full ${isHomeVariant ? 'sm:rounded-l-full sm:rounded-r-none sm:border-r-0 rounded-lg sm:rounded-lg mb-2 sm:mb-0' : 'rounded-full'}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(searchQuery.length > 0)}
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-md shadow-lg z-10 border">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => selectSuggestion(suggestion.name)}
              >
                <span className="mr-2">{suggestion.name}, </span>
                <span className="text-gray-500 text-sm">{suggestion.country}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex w-full sm:w-auto gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "justify-start text-left font-normal py-6 w-full",
                isHomeVariant && "sm:rounded-none sm:border-l-0 sm:border-r-0 rounded-lg sm:rounded-none",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold">Llegada</span>
                <span>{dateRange.from ? format(dateRange.from, "dd MMM") : "Fecha"}</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={(date) => setDateRange({ ...dateRange, from: date })}
              initialFocus
              className="p-2"
            />
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "justify-start text-left font-normal py-6 w-full",
                isHomeVariant && "sm:rounded-none sm:border-l-0 sm:border-r-0 rounded-lg sm:rounded-none",
                !dateRange.to && "text-muted-foreground"
              )}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold">Salida</span>
                <span>{dateRange.to ? format(dateRange.to, "dd MMM") : "Fecha"}</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.to}
              onSelect={(date) => setDateRange({ ...dateRange, to: date })}
              initialFocus
              className="p-2"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button 
        type="submit"
        className={cn(
          "w-full sm:w-auto rounded-full py-6",
          isHomeVariant && "sm:rounded-l-none rounded-lg sm:rounded-l-none"
        )}
      >
        <Search className="h-5 w-5" />
        <span className="ml-2 inline">Buscar</span>
      </Button>
    </form>
  );
};

export default SearchBar;
