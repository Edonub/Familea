import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Solucionar problema de marcadores en Leaflet con Webpack/Vite
// Importamos las imágenes directamente
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  activities: ActivityProps[];
}

interface ActivityProps {
  id: string;
  title: string;
  price: number;
  image_url?: string;
  // ... otros campos existentes ...
}

const MapView = ({ activities }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapRef.current) {
      // Inicializar el mapa
      mapRef.current = L.map("map").setView([40.4168, -3.7038], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Limpiar marcadores existentes
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Añadir marcadores para cada actividad
    activities.forEach((activity) => {
      // Generar coordenadas aleatorias para demo
      const lat = 40.4168 + (Math.random() - 0.5) * 0.1;
      const lng = -3.7038 + (Math.random() - 0.5) * 0.1;

      const marker = L.marker([lat, lng])
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="p-2 min-w-[200px]">
            ${activity.image_url ? `
              <div class="w-full h-32 mb-2 overflow-hidden rounded-lg">
                <img src="${activity.image_url}" alt="${activity.title}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/200x128?text=No+Image'"/>
              </div>
            ` : `
              <div class="w-full h-32 mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                <span class="text-gray-400">No hay imagen</span>
              </div>
            `}
            <h3 class="font-semibold text-sm mb-1">${activity.title}</h3>
            <p class="text-sm text-gray-600 mb-2">${activity.price}€</p>
            <button class="w-full bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition-colors text-sm">
              Ver detalles
            </button>
          </div>
        `);

      marker.on("click", () => {
        navigate(`/actividad/${activity.id}`);
      });

      markersRef.current.push(marker);
    });

    // Ajustar el mapa para mostrar todos los marcadores
    if (markersRef.current.length > 0) {
      const bounds = L.latLngBounds(markersRef.current.map((m) => m.getLatLng()));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activities, navigate]);

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative">
      <div id="map" className="w-full h-full rounded-lg shadow-lg" />
    </div>
  );
};

export default MapView;
