
import React from 'react';
import { MapPin } from 'lucide-react';
import { NominatimResult, formatDisplayName } from '@/utils/locationSearch';

interface LocationSuggestionsProps {
  suggestions: NominatimResult[];
  searchError: string | null;
  isLoading: boolean;
  onSelectSuggestion: (suggestion: NominatimResult) => void;
  suggestionsRef: React.RefObject<HTMLDivElement>;
}

const LocationSuggestions: React.FC<LocationSuggestionsProps> = ({
  suggestions,
  searchError,
  isLoading,
  onSelectSuggestion,
  suggestionsRef
}) => {
  if (isLoading) {
    return (
      <div 
        ref={suggestionsRef} 
        className="absolute left-0 right-0 top-full mt-1 px-4 py-3 text-sm text-gray-500 bg-white shadow-lg rounded-lg border border-gray-200 z-[100]"
      >
        Buscando...
      </div>
    );
  }

  if (searchError) {
    return (
      <div 
        ref={suggestionsRef} 
        className="absolute left-0 right-0 top-full mt-1 px-4 py-3 text-sm bg-white shadow-lg rounded-lg border border-gray-200 z-[100]"
      >
        <span className="text-red-500">{searchError}</span>
      </div>
    );
  }

  if (suggestions.length > 0) {
    return (
      <div 
        ref={suggestionsRef} 
        className="absolute left-0 right-0 top-full mt-1 bg-white shadow-lg rounded-lg max-h-[300px] overflow-y-auto border border-gray-200 z-[100] divide-y divide-gray-100"
      >
        {suggestions.map((suggestion) => {
          const { main, secondary } = formatDisplayName(suggestion.display_name);
          return (
            <button 
              key={suggestion.place_id}
              className="w-full px-4 py-3 hover:bg-gray-50 flex items-start text-left transition-colors"
              onClick={() => onSelectSuggestion(suggestion)}
              type="button"
            >
              <MapPin size={18} className="text-gray-400 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{main}</div>
                <div className="text-sm text-gray-500 truncate">{secondary}</div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }
  
  return null;
};

export default LocationSuggestions;
