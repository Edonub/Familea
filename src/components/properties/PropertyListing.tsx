
import React from "react";
import { Property } from "@/data/properties";
import { properties } from "@/data/properties";
import { MapPin, Clock, ArrowRight, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PropertyListingProps {
  bookingType: "all" | "free" | "paid";
  priceRange: number[];
  selectedCategories: string[];
  durationRange: number[];
}

const PropertyListing = ({ 
  bookingType, 
  priceRange,
  selectedCategories,
  durationRange
}: PropertyListingProps) => {
  
  // Filter properties
  const filteredProperties = properties
    .filter(property => {
      // Filter by booking type (free, paid, all)
      if (bookingType === 'free' && property.price > 0) return false;
      if (bookingType === 'paid' && property.price === 0) return false;
      
      // Filter by price range
      if (property.price > priceRange[0]) return false;
      
      // Filter by categories
      if (selectedCategories.length > 0 && !selectedCategories.includes(property.category)) {
        return false;
      }
      
      // Duration filtering - assume default duration if not specified
      // Note: This is a temporary fix - the Property type should be updated 
      // to include duration as a proper field
      const propertyDuration = 
        'duration' in property ? (property as any).duration : 120; // Default to 2h if not specified
      if (propertyDuration > durationRange[0]) return false;
      
      return true;
    });
  
  const formatDuration = (minutes: number | undefined) => {
    if (!minutes) return "Duración no especificada";
    if (minutes < 60) {
      return `${minutes} minutos`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours}h ${remainingMinutes}min` 
        : `${hours} horas`;
    }
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {filteredProperties.map(property => (
        <Card key={property.id} className="group overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
          <div className="relative">
            <img 
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" 
              src={property.image} 
              alt={property.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Badge className="absolute top-2 left-2 bg-white/90 text-familyxp-primary hover:bg-white">
              {property.category}
            </Badge>
            {property.price === 0 && (
              <Badge className="absolute top-2 right-2 bg-familyxp-success hover:bg-familyxp-success/90 text-white">
                Gratis
              </Badge>
            )}
            <button className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors">
              <Heart size={16} className="transition-transform hover:scale-110" />
            </button>
          </div>
          <CardContent className="p-3">
            <h3 className="text-base font-semibold text-gray-800 mb-0.5 line-clamp-1">{property.title}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin size={12} className="mr-1 text-familyxp-primary" />
              <p className="text-xs line-clamp-1">{property.location}</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                {property.price > 0 ? (
                  <span className="text-base font-bold text-familyxp-primary">{property.price}€</span>
                ) : (
                  <span className="text-familyxp-success text-xs font-medium">Experiencia gratuita</span>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <Clock size={12} className="mr-1 text-familyxp-primary" />
                {formatDuration('duration' in property ? (property as any).duration : undefined)}
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              {property.is_available ? (
                <Badge variant="outline" className="text-xs text-green-500 border-green-200 bg-green-50">Disponible</Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-red-500 border-red-200 bg-red-50">No Disponible</Badge>
              )}
              <button className="text-familyxp-primary hover:text-familyxp-secondary font-medium text-xs flex items-center group">
                Ver detalles 
                <ArrowRight size={12} className="ml-1 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {filteredProperties.length === 0 && (
        <div className="col-span-3 text-center py-8 px-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-base">No se encontraron experiencias que coincidan con tus criterios.</p>
          <p className="text-gray-500 mt-1 text-sm">Prueba a ajustar los filtros para ver más opciones.</p>
        </div>
      )}
    </div>
  );
};

export default PropertyListing;
