import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { getProperties } from '../../services/propertyService';
import { Ionicons } from '@expo/vector-icons';

const PropertyListScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar las propiedades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderPropertyItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.propertyCard}
      onPress={() => navigation.navigate('PropertyDetail', { propertyId: item._id })}
    >
      <Image 
        source={{ uri: item.imagenes?.[0] || 'https://via.placeholder.com/300x200' }} 
        style={styles.propertyImage} 
      />
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle}>{item.titulo}</Text>
        <Text style={styles.propertyPrice}>${item.precio}</Text>
        <Text style={styles.propertyLocation}>
          {item.direccion.ciudad}, {item.direccion.calle} {item.direccion.numero}
        </Text>
        <View style={styles.propertyFeatures}>
          <Text style={styles.featureText}>
            <Ionicons name="bed-outline" size={16} /> {item.habitaciones || 2}
          </Text>
          <Text style={styles.featureText}>
            <Ionicons name="water-outline" size={16} /> {item.banos || 1}
          </Text>
          <Text style={styles.featureText}>
            <Ionicons name="resize-outline" size={16} /> {item.superficie || 60}m²
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredProperties = properties.filter(property => 
    property.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.direccion.ciudad.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProperties}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título o ubicación"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredProperties}
        keyExtractor={item => item._id}
        renderItem={renderPropertyItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron propiedades</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProperty')}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
  },
  listContainer: {
    padding: 16,
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  propertyImage: {
    width: '100%',
    height: 180,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 8,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  propertyFeatures: {
    flexDirection: 'row',
  },
  featureText: {
    marginRight: 12,
    fontSize: 14,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});

export default PropertyListScreen; 