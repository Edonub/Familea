
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Property } from '@/data/properties';
import { properties } from '@/data/properties';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from "react-router-dom";

// Define map marker icon
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapSearchProps {
  filteredProperties: Property[];
  onPropertySelect?: (property: Property) => void;
}

const MapSearch: React.FC<MapSearchProps> = ({ 
  filteredProperties,
  onPropertySelect 
}) => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Initialize map
  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        center: [40.4168, -3.7038], // Center of Spain
        zoom: 6,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          })
        ]
      });
    }
    
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);
  
  // Add property markers
  useEffect(() => {
    if (!leafletMap.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Create random coordinates for properties as example
    // In a real app, you would use actual coordinates from your data
    const getRandomCoord = (base: number, range: number) => base + (Math.random() - 0.5) * range;
    
    // Add markers for filtered properties
    filteredProperties.forEach(property => {
      // Randomly distribute properties around Spain for demo
      const lat = getRandomCoord(40.4168, 3);
      const lng = getRandomCoord(-3.7038, 4);
      
      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(leafletMap.current!)
        .bindPopup(`
          <div>
            <strong>${property.title}</strong><br>
            ${property.location}<br>
            ${property.price === 0 ? 'Gratis' : `${property.price}€/noche`}
          </div>
        `);
        
      marker.on('click', () => {
        setSelectedProperty(property);
        if (onPropertySelect) {
          onPropertySelect(property);
        }
      });
      
      markersRef.current.push(marker);
    });
    
    // Adjust map view to include all markers if we have any
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      leafletMap.current.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }, [filteredProperties, onPropertySelect]);

  // Handle navigation to property detail
  const handlePropertyClick = () => {
    if (selectedProperty) {
      // Navigate to the property detail page
      navigate(`/actividad/${selectedProperty.id}`);
    }
  };
  
  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapRef} className="w-full h-full z-10"></div>
      
      {selectedProperty && (
        <Card className="absolute bottom-4 left-4 w-64 z-20 bg-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow" onClick={handlePropertyClick}>
          <CardContent className="p-3">
            <div className="w-full h-32 mb-2 overflow-hidden rounded">
              <img 
                src={selectedProperty.image} 
                alt={selectedProperty.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-medium text-sm">{selectedProperty.title}</h3>
            <p className="text-xs text-gray-500">{selectedProperty.location}</p>
            <p className="font-bold mt-1">
              {selectedProperty.price === 0 ? "Gratis" : `${selectedProperty.price}€/noche`}
            </p>
            <Button variant="link" className="p-0 h-auto mt-1 text-xs text-blue-600">
              Ver detalles
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapSearch;
