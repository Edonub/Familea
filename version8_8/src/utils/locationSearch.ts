
export interface NominatimResult {
  display_name: string;
  place_id: number;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    country?: string;
  };
}

// Lista completa de provincias y ciudades importantes españolas
const allSpanishLocations = [
  { place_id: 1, display_name: "Madrid, Comunidad de Madrid, España", lat: "40.4168", lon: "-3.7038" },
  { place_id: 2, display_name: "Barcelona, Cataluña, España", lat: "41.3851", lon: "2.1734" },
  { place_id: 3, display_name: "Valencia, Comunidad Valenciana, España", lat: "39.4699", lon: "-0.3763" },
  { place_id: 4, display_name: "Sevilla, Andalucía, España", lat: "37.3891", lon: "-5.9845" },
  { place_id: 5, display_name: "Zaragoza, Aragón, España", lat: "41.6488", lon: "-0.8891" },
  { place_id: 6, display_name: "Málaga, Andalucía, España", lat: "36.7213", lon: "-4.4213" },
  { place_id: 7, display_name: "Murcia, Región de Murcia, España", lat: "37.9922", lon: "-1.1307" },
  { place_id: 8, display_name: "Palma de Mallorca, Islas Baleares, España", lat: "39.5696", lon: "2.6502" },
  { place_id: 9, display_name: "Las Palmas de Gran Canaria, Canarias, España", lat: "28.1235", lon: "-15.4366" },
  { place_id: 10, display_name: "Bilbao, País Vasco, España", lat: "43.2630", lon: "-2.9350" },
  { place_id: 11, display_name: "Alicante, Comunidad Valenciana, España", lat: "38.3452", lon: "-0.4815" },
  { place_id: 12, display_name: "Córdoba, Andalucía, España", lat: "37.8882", lon: "-4.7794" },
  { place_id: 13, display_name: "Granada, Andalucía, España", lat: "37.1773", lon: "-3.5986" },
  { place_id: 14, display_name: "Vigo, Galicia, España", lat: "42.2328", lon: "-8.7226" },
  { place_id: 15, display_name: "Gijón, Asturias, España", lat: "43.5452", lon: "-5.6635" },
  { place_id: 16, display_name: "A Coruña, Galicia, España", lat: "43.3713", lon: "-8.3962" },
  { place_id: 17, display_name: "Vitoria-Gasteiz, País Vasco, España", lat: "42.8467", lon: "-2.6716" },
  { place_id: 18, display_name: "Elche, Comunidad Valenciana, España", lat: "38.2655", lon: "-0.6968" },
  { place_id: 19, display_name: "Oviedo, Asturias, España", lat: "43.3614", lon: "-5.8497" },
  { place_id: 20, display_name: "Badalona, Cataluña, España", lat: "41.4399", lon: "2.2474" },
  { place_id: 21, display_name: "Cádiz, Andalucía, España", lat: "36.5298", lon: "-6.2926" },
  { place_id: 22, display_name: "Santander, Cantabria, España", lat: "43.4628", lon: "-3.8044" },
  { place_id: 23, display_name: "Pamplona, Navarra, España", lat: "42.8186", lon: "-1.6442" },
  { place_id: 24, display_name: "Toledo, Castilla-La Mancha, España", lat: "39.8628", lon: "-4.0273" },
  { place_id: 25, display_name: "Salamanca, Castilla y León, España", lat: "40.9701", lon: "-5.6635" },
  { place_id: 26, display_name: "Burgos, Castilla y León, España", lat: "42.3404", lon: "-3.6997" },
  { place_id: 27, display_name: "Albacete, Castilla-La Mancha, España", lat: "38.9945", lon: "-1.8555" },
  { place_id: 28, display_name: "Logroño, La Rioja, España", lat: "42.4650", lon: "-2.4506" },
  { place_id: 29, display_name: "Huelva, Andalucía, España", lat: "37.2614", lon: "-6.9447" },
  { place_id: 30, display_name: "Tarragona, Cataluña, España", lat: "41.1188", lon: "1.2455" },
  { place_id: 31, display_name: "León, Castilla y León, España", lat: "42.5987", lon: "-5.5671" },
  { place_id: 32, display_name: "Castellón, Comunidad Valenciana, España", lat: "39.9859", lon: "-0.0499" },
  { place_id: 33, display_name: "Badajoz, Extremadura, España", lat: "38.8786", lon: "-6.9705" },
  { place_id: 34, display_name: "Almería, Andalucía, España", lat: "36.8340", lon: "-2.4637" },
  { place_id: 35, display_name: "Girona, Cataluña, España", lat: "41.9818", lon: "2.8237" },
  { place_id: 36, display_name: "Jaén, Andalucía, España", lat: "37.7795", lon: "-3.7829" },
  { place_id: 37, display_name: "Cáceres, Extremadura, España", lat: "39.4753", lon: "-6.3724" },
  { place_id: 38, display_name: "Ourense, Galicia, España", lat: "42.3359", lon: "-7.8642" },
  { place_id: 39, display_name: "Lleida, Cataluña, España", lat: "41.6175", lon: "0.6200" },
  { place_id: 40, display_name: "Donostia-San Sebastián, País Vasco, España", lat: "43.3224", lon: "-1.9846" },
  { place_id: 41, display_name: "Cartagena, Región de Murcia, España", lat: "37.6257", lon: "-0.9966" },
  { place_id: 42, display_name: "Marbella, Andalucía, España", lat: "36.5103", lon: "-4.8845" },
  { place_id: 43, display_name: "Jerez de la Frontera, Andalucía, España", lat: "36.6866", lon: "-6.1375" },
  { place_id: 44, display_name: "Valladolid, Castilla y León, España", lat: "41.6521", lon: "-4.7286" },
  { place_id: 45, display_name: "Palencia, Castilla y León, España", lat: "42.0096", lon: "-4.5288" },
  { place_id: 46, display_name: "Lugo, Galicia, España", lat: "43.0097", lon: "-7.5567" },
  { place_id: 47, display_name: "Ávila, Castilla y León, España", lat: "40.6564", lon: "-4.6937" },
  { place_id: 48, display_name: "Segovia, Castilla y León, España", lat: "40.9429", lon: "-4.1088" },
  { place_id: 49, display_name: "Cuenca, Castilla-La Mancha, España", lat: "40.0703", lon: "-2.1374" },
  { place_id: 50, display_name: "Zamora, Castilla y León, España", lat: "41.5036", lon: "-5.7449" },
  // Más ciudades españolas
  { place_id: 51, display_name: "Torremolinos, Andalucía, España", lat: "36.6200", lon: "-4.5000" },
  { place_id: 52, display_name: "Benidorm, Comunidad Valenciana, España", lat: "38.5410", lon: "-0.1224" },
  { place_id: 53, display_name: "Fuengirola, Andalucía, España", lat: "36.5333", lon: "-4.6167" },
  { place_id: 54, display_name: "Salou, Cataluña, España", lat: "41.0753", lon: "1.1387" },
  { place_id: 55, display_name: "Lloret de Mar, Cataluña, España", lat: "41.7000", lon: "2.8333" },
  { place_id: 56, display_name: "Sitges, Cataluña, España", lat: "41.2333", lon: "1.8167" },
  { place_id: 57, display_name: "Mijas, Andalucía, España", lat: "36.5954", lon: "-4.6373" },
  { place_id: 58, display_name: "Estepona, Andalucía, España", lat: "36.4256", lon: "-5.1462" },
  { place_id: 59, display_name: "San Sebastián de la Gomera, Canarias, España", lat: "28.0920", lon: "-17.1076" },
  { place_id: 60, display_name: "Arrecife, Canarias, España", lat: "28.9637", lon: "-13.5477" }
];

/**
 * Función simplificada que busca localidades españolas localmente sin llamadas API externas
 */
export const fetchLocations = async (query: string): Promise<NominatimResult[]> => {
  console.log("Buscando localidades con query:", query);
  
  // Si la consulta es muy corta, no mostrar sugerencias
  if (query.length < 2) return [];
  
  try {
    // Normalizar la consulta (quitar acentos, convertir a minúsculas)
    const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Buscar en nuestra lista local
    const results = allSpanishLocations.filter(location => {
      const normalizedLocation = location.display_name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normalizedLocation.includes(normalizedQuery);
    });
    
    console.log("Resultados encontrados localmente:", results.length);
    return results;
  } catch (error) {
    console.error("Error en la búsqueda de localidades:", error);
    return [];
  }
};

export const removeDuplicateLocations = (results: NominatimResult[]): NominatimResult[] => {
  const seen = new Set<string>();
  return results.filter(result => {
    const mainLocation = result.display_name.split(',')[0].trim();
    if (seen.has(mainLocation)) return false;
    seen.add(mainLocation);
    return true;
  });
};

export const formatDisplayName = (displayName: string): { main: string, secondary: string } => {
  const parts = displayName.split(',').map(part => part.trim());
  const main = parts[0];
  const secondary = parts.length > 2 ? `${parts[1]}, España` : 'España';
  return { main, secondary };
};

export const storeSelectedLocation = (suggestion: NominatimResult, simplifiedName: string) => {
  localStorage.setItem('selectedLocation', JSON.stringify({
    name: simplifiedName,
    lat: suggestion.lat,
    lon: suggestion.lon,
    full: suggestion.display_name,
    country: "España"
  }));
};
