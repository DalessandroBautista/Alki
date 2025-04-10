import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const PropertyCard = ({ property, onPress }) => {
  // Verificar que la propiedad y sus campos existan para evitar errores
  if (!property) return null;
  
  // URL de imagen por defecto si no existe
  const imagenUrl = property.imagenes && property.imagenes.length > 0 
    ? property.imagenes[0] 
    : 'https://via.placeholder.com/300x200?text=Sin+Imagen';
  
  // Extraer dirección con validación
  const ubicacion = property.ubicacion || property.direccion || {};
  const direccion = typeof ubicacion === 'string' 
    ? ubicacion 
    : ubicacion.direccion || 'Dirección no disponible';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: imagenUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.price}>${property.precio?.toLocaleString() || 'Consultar'}/mes</Text>
        <Text style={styles.title} numberOfLines={1}>{property.titulo || 'Sin título'}</Text>
        <Text style={styles.location} numberOfLines={1}>{direccion}</Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>{property.habitaciones || 0} hab</Text>
          <Text style={styles.detailText}>{property.banos || 0} baños</Text>
          <Text style={styles.detailText}>{property.superficie || 0} m²</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 12,
  },
  price: {
    color: '#0066cc',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
  },
  location: {
    color: '#666',
    fontSize: 13,
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
});

export default PropertyCard;