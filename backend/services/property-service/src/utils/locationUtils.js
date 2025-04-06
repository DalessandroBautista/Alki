/**
 * Convierte una dirección en coordenadas de latitud y longitud
 * (En producción, utilizaríamos aquí la API de Google Maps u otro servicio de geocodificación)
 */
exports.geocodeAddress = async (address) => {
  try {
    // Mock de geocodificación para desarrollo
    // En producción, aquí iría la llamada a Google Maps Geocoding API
    
    // Coordenadas de ejemplo para algunas ciudades
    const mockCoordinates = {
      'Buenos Aires': [-34.599722, -58.381944],
      'Córdoba': [-31.420083, -64.188776],
      'Rosario': [-32.942778, -60.629167],
      'Mendoza': [-32.889458, -68.845839],
      'Madrid': [40.416775, -3.703790],
      'Barcelona': [41.385064, 2.173403],
      'Ciudad de México': [19.432608, -99.133209],
      'Monterrey': [25.686613, -100.316116]
    };
    
    // Intentamos encontrar coordenadas según la ciudad
    for (const city in mockCoordinates) {
      if (address.direccion.ciudad.includes(city) || address.direccion.ciudad.toLowerCase().includes(city.toLowerCase())) {
        // Añadir algo de aleatoriedad para simular diferentes ubicaciones en la misma ciudad
        const randomLat = (Math.random() - 0.5) * 0.02;
        const randomLng = (Math.random() - 0.5) * 0.02;
        
        return {
          lat: mockCoordinates[city][0] + randomLat,
          lng: mockCoordinates[city][1] + randomLng
        };
      }
    }
    
    // Si no encontramos la ciudad, devolvemos coordenadas aleatorias
    return {
      lat: (Math.random() * 180) - 90,
      lng: (Math.random() * 360) - 180
    };
  } catch (error) {
    console.error('Error en geocodificación:', error);
    throw new Error('No se pudo geocodificar la dirección');
  }
};

/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
 * @param {number} lat1 Latitud del punto 1
 * @param {number} lng1 Longitud del punto 1
 * @param {number} lat2 Latitud del punto 2
 * @param {number} lng2 Longitud del punto 2
 * @returns {number} Distancia en kilómetros
 */
exports.calculateDistance = (lat1, lng1, lat2, lng2) => {
  const earthRadius = 6371; // Radio de la Tierra en km
  
  const dLat = this.toRadians(lat2 - lat1);
  const dLng = this.toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  
  return distance;
};

exports.toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};
