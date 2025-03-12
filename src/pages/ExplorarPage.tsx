
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import MapView from "@/components/map/MapView";
import ViewToggle from "@/components/map/ViewToggle";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import FilterSection from "@/components/filters/FilterSection";
import ActivityList from "@/components/activities/ActivityList";
import Pagination from "@/components/activities/Pagination";
import SortingSelector from "@/components/activities/SortingSelector";
import { DateRange } from "@/components/DateRangePicker";
import { parse } from "date-fns";

const ExplorarPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: [],
    locations: [],
    ages: [],
    maxPrice: 100,
    freeOnly: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [sorting, setSorting] = useState("relevancia");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  
  const itemsPerPage = 9;
  
  useEffect(() => {
    // Extract query parameters
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const queryParam = params.get("query");
    const dateFromParam = params.get("dateFrom");
    const dateToParam = params.get("dateTo");
    
    // Set filters based on URL parameters
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        categories: [categoryParam]
      }));
    }
    
    if (queryParam) {
      setSearchQuery(queryParam);
    }
    
    // Parse date parameters if they exist
    let newDateRange: DateRange = { from: undefined, to: undefined };
    
    if (dateFromParam) {
      try {
        newDateRange.from = parse(dateFromParam, "yyyy-MM-dd", new Date());
        
        if (dateToParam) {
          newDateRange.to = parse(dateToParam, "yyyy-MM-dd", new Date());
        }
        
        setDateRange(newDateRange);
      } catch (error) {
        console.error("Error parsing dates:", error);
      }
    }
    
    fetchActivities();
  }, [location.search, page, sorting, filters, dateRange]);
  
  const fetchActivities = async () => {
    setLoading(true);
    try {
      console.log("Fetching activities with filters:", filters);
      console.log("Date range:", dateRange);
      
      let query = supabase
        .from("activities")
        .select("*", { count: "exact" });
      
      // Apply filters
      if (filters.categories.length > 0) {
        query = query.in("category", filters.categories);
      }
      
      if (filters.locations.length > 0) {
        query = query.in("location", filters.locations);
      }
      
      if (filters.freeOnly) {
        query = query.eq("price", 0);
      } else if (filters.maxPrice < 100) {
        query = query.lte("price", filters.maxPrice);
      }
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      // Apply date range filters if present
      if (dateRange.from) {
        // In a real application, you'd filter by an actual date field
        // This is a placeholder - implement according to your schema
        console.log("Would filter by start date:", dateRange.from);
        
        if (dateRange.to) {
          console.log("Would filter by end date:", dateRange.to);
        }
      }
      
      // Apply sorting
      switch (sorting) {
        case "precio-asc":
          query = query.order("price", { ascending: true });
          break;
        case "precio-desc":
          query = query.order("price", { ascending: false });
          break;
        case "valoracion":
          query = query.order("rating", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }
      
      // Pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query
        .range(from, to);
      
      if (error) {
        console.error("Error fetching activities:", error);
        throw error;
      }
      
      setActivities(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Error al cargar las actividades");
    } finally {
      setLoading(false);
    }
  };
  
  // Filter handlers
  const handleSearch = (query: string, newDateRange?: DateRange) => {
    setSearchQuery(query);
    
    if (newDateRange) {
      setDateRange(newDateRange);
    }
    
    setPage(1); // Reset to first page on new search
  };
  
  const toggleCategory = (category) => {
    setFilters(prev => {
      const updatedCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return {
        ...prev,
        categories: updatedCategories
      };
    });
    setPage(1); // Reset to first page on filter change
  };
  
  const toggleLocation = (location) => {
    setFilters(prev => {
      const updatedLocations = prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location];
      
      return {
        ...prev,
        locations: updatedLocations
      };
    });
    setPage(1);
  };
  
  const toggleAge = (age) => {
    setFilters(prev => {
      const updatedAges = prev.ages.includes(age)
        ? prev.ages.filter(a => a !== age)
        : [...prev.ages, age];
      
      return {
        ...prev,
        ages: updatedAges
      };
    });
    setPage(1);
  };
  
  const handlePriceChange = (value) => {
    setFilters(prev => ({
      ...prev,
      maxPrice: value[0]
    }));
  };
  
  const toggleFreeOnly = () => {
    setFilters(prev => ({
      ...prev,
      freeOnly: !prev.freeOnly
    }));
    setPage(1);
  };
  
  const handleSortChange = (e) => {
    setSorting(e.target.value);
    setPage(1);
  };
  
  const handleViewChange = (view: "list" | "map") => {
    setViewMode(view);
  };
  
  const handleActivitySelect = (id: string) => {
    navigate(`/actividad/${id}`);
  };
  
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="bg-gray-50 py-6">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              {loading ? 'Cargando actividades...' : `${totalCount} ${totalCount === 1 ? 'experiencia encontrada' : 'experiencias encontradas'}`}
            </h1>
            
            <ViewToggle view={viewMode} onViewChange={handleViewChange} />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4">
            <SearchBar 
              className="w-full lg:w-2/3" 
              onSearch={handleSearch}
              initialValue={searchQuery}
              initialDateRange={dateRange}
            />
            
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              variant="outline" 
              className="flex items-center gap-2 lg:hidden"
            >
              <Filter size={16} />
              Filtros
            </Button>
            
            <div className="flex-1 flex justify-end">
              <SortingSelector value={sorting} onChange={handleSortChange} />
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtros en escritorio */}
            <aside className="w-full lg:w-1/4 hidden lg:block">
              <FilterSection
                filters={filters}
                toggleCategory={toggleCategory}
                toggleLocation={toggleLocation}
                toggleAge={toggleAge}
                handlePriceChange={handlePriceChange}
                toggleFreeOnly={toggleFreeOnly}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
              />
            </aside>
            
            {/* Filtros en móvil */}
            <FilterSection
              filters={filters}
              toggleCategory={toggleCategory}
              toggleLocation={toggleLocation}
              toggleAge={toggleAge}
              handlePriceChange={handlePriceChange}
              toggleFreeOnly={toggleFreeOnly}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              isMobile={true}
            />
            
            {/* Lista o Mapa de actividades */}
            <div className="w-full lg:w-3/4">
              {viewMode === "list" ? (
                <>
                  <ActivityList activities={activities} loading={loading} />
                  {totalPages > 1 && (
                    <Pagination 
                      currentPage={page} 
                      totalPages={totalPages} 
                      onPageChange={setPage} 
                    />
                  )}
                </>
              ) : (
                <MapView activities={activities} onActivitySelect={handleActivitySelect} />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExplorarPage;
