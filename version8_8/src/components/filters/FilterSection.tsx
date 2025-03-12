
import { Filter, MapPin, Sliders, Tag, Users, CalendarDays, DollarSign } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterProps {
  filters: {
    categories: string[];
    locations: string[];
    ages: string[];
    maxPrice: number;
    freeOnly: boolean;
  };
  toggleCategory: (category: string) => void;
  toggleLocation: (location: string) => void;
  toggleAge: (age: string) => void;
  handlePriceChange: (value: number[]) => void;
  toggleFreeOnly: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  isMobile?: boolean;
}

const FilterSection = ({
  filters,
  toggleCategory,
  toggleLocation,
  toggleAge,
  handlePriceChange,
  toggleFreeOnly,
  showFilters,
  setShowFilters,
  isMobile = false
}: FilterProps) => {
  
  // Mobile filters overlay
  if (isMobile && showFilters) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden bg-white overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter size={18} /> Filtros
            </h3>
            <Button variant="ghost" onClick={() => setShowFilters(false)}>
              Cerrar
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="space-y-6 pr-4">
              <CategoryFilter 
                categories={["Aventura", "Gastronomía", "Cultural", "Educativo", "Naturaleza", "Arte", "Acuático"]}
                selectedCategories={filters.categories}
                toggleCategory={toggleCategory}
                prefix="m-"
              />
              
              <LocationFilter 
                locations={["Madrid", "Barcelona", "Valencia", "Sevilla"]}
                selectedLocations={filters.locations}
                toggleLocation={toggleLocation}
                prefix="m-"
              />
              
              <AgeFilter 
                ages={[
                  { id: "0-3", label: "Hasta 3 años" },
                  { id: "4-7", label: "4 a 7 años" },
                  { id: "8-12", label: "8 a 12 años" },
                  { id: "13+", label: "13+ años" },
                  { id: "todas", label: "Todas las edades" }
                ]}
                selectedAges={filters.ages}
                toggleAge={toggleAge}
                prefix="m-"
              />
              
              <PriceFilter 
                maxPrice={filters.maxPrice}
                freeOnly={filters.freeOnly}
                handlePriceChange={handlePriceChange}
                toggleFreeOnly={toggleFreeOnly}
                prefix="m-"
              />
            </div>
          </ScrollArea>
          
          <div className="sticky bottom-0 bg-white pt-4">
            <Button 
              onClick={() => setShowFilters(false)}
              className="w-full bg-familyxp-primary hover:bg-familyxp-secondary"
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop filters sidebar
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Filter size={18} /> Filtros
      </h3>
      
      <div className="space-y-6">
        <CategoryFilter 
          categories={["Aventura", "Gastronomía", "Cultural", "Educativo", "Naturaleza", "Arte", "Acuático"]}
          selectedCategories={filters.categories}
          toggleCategory={toggleCategory}
        />
        
        <LocationFilter 
          locations={["Madrid", "Barcelona", "Valencia", "Sevilla"]}
          selectedLocations={filters.locations}
          toggleLocation={toggleLocation}
        />
        
        <AgeFilter 
          ages={[
            { id: "0-3", label: "Hasta 3 años" },
            { id: "4-7", label: "4 a 7 años" },
            { id: "8-12", label: "8 a 12 años" },
            { id: "13+", label: "13+ años" },
            { id: "todas", label: "Todas las edades" }
          ]}
          selectedAges={filters.ages}
          toggleAge={toggleAge}
        />
        
        <PriceFilter 
          maxPrice={filters.maxPrice}
          freeOnly={filters.freeOnly}
          handlePriceChange={handlePriceChange}
          toggleFreeOnly={toggleFreeOnly}
        />
      </div>
    </div>
  );
};

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  prefix?: string;
}

const CategoryFilter = ({ categories, selectedCategories, toggleCategory, prefix = '' }: CategoryFilterProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
        <Tag size={16} /> Categorías
      </h4>
      <div className="space-y-2">
        {categories.map(category => (
          <div key={`${prefix}${category}`} className="flex items-center gap-2">
            <Checkbox 
              id={`${prefix}category-${category}`} 
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => toggleCategory(category)}
            />
            <Label htmlFor={`${prefix}category-${category}`}>{category}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

interface LocationFilterProps {
  locations: string[];
  selectedLocations: string[];
  toggleLocation: (location: string) => void;
  prefix?: string;
}

const LocationFilter = ({ locations, selectedLocations, toggleLocation, prefix = '' }: LocationFilterProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
        <MapPin size={16} /> Ubicación
      </h4>
      <div className="space-y-2">
        {locations.map(location => (
          <div key={`${prefix}${location}`} className="flex items-center gap-2">
            <Checkbox 
              id={`${prefix}location-${location}`} 
              checked={selectedLocations.includes(location)}
              onCheckedChange={() => toggleLocation(location)}
            />
            <Label htmlFor={`${prefix}location-${location}`}>{location}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

interface AgeFilterProps {
  ages: { id: string; label: string }[];
  selectedAges: string[];
  toggleAge: (age: string) => void;
  prefix?: string;
}

const AgeFilter = ({ ages, selectedAges, toggleAge, prefix = '' }: AgeFilterProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
        <Users size={16} /> Edad
      </h4>
      <div className="space-y-2">
        {ages.map(age => (
          <div key={`${prefix}${age.id}`} className="flex items-center gap-2">
            <Checkbox 
              id={`${prefix}age-${age.id}`} 
              checked={selectedAges.includes(age.id)}
              onCheckedChange={() => toggleAge(age.id)}
            />
            <Label htmlFor={`${prefix}age-${age.id}`}>{age.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

interface PriceFilterProps {
  maxPrice: number;
  freeOnly: boolean;
  handlePriceChange: (value: number[]) => void;
  toggleFreeOnly: () => void;
  prefix?: string;
}

const PriceFilter = ({ maxPrice, freeOnly, handlePriceChange, toggleFreeOnly, prefix = '' }: PriceFilterProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
        <DollarSign size={16} /> Precio (€)
      </h4>
      <div className="space-y-4">
        <Slider 
          defaultValue={[maxPrice]} 
          max={100} 
          step={1} 
          onValueChange={handlePriceChange}
        />
        <div className="flex justify-between">
          <span className="text-sm">0€</span>
          <span className="text-sm">{maxPrice}€</span>
          <span className="text-sm">100€</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox 
            id={`${prefix}gratis`} 
            checked={freeOnly}
            onCheckedChange={toggleFreeOnly}
          />
          <Label htmlFor={`${prefix}gratis`}>Solo gratis</Label>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
