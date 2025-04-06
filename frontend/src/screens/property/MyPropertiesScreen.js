import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import propertyService from '../../services/propertyService';
import { useIsFocused } from '@react-navigation/native';

const MyPropertiesScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadProperties();
    }
  }, [isFocused]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getMyProperties();
      setProperties(data);
    } catch (err) {
      setError('No se pudieron cargar tus propiedades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadProperties();
    } finally {
      setRefreshing(false);
    }
  };

  const handleEdit = (property) => {
    navigation.navigate('CreateProperty', { 
      property: property,
      isEditing: true 
    });
  };

  const handleDelete = (property) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await propertyService.deleteProperty(property.id);
              // Eliminar la propiedad de la lista local
              setProperties(prevProperties => 
                prevProperties.filter(p => p.id !== property.id)
              );
              Alert.alert('Éxito', 'Propiedad eliminada correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la propiedad');
              console.error(error);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderPropertyItem = ({ item }) => (
    <View style={styles.propertyItem}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('PropertyDetail', { propertyId: item.id })}
        style={styles.propertyContent}
      >
        <Image 
          source={{ uri: item.images && item.images.length > 0 
            ? item.images[0] 
            : 'https://via.placeholder.com/150'
          }} 
          style={styles.propertyImage}
          resizeMode="cover"
        />
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.propertyPrice}>{item.price}€</Text>
          <View style={styles.propertyLocation}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.propertyLocationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, 
              { backgroundColor: item.isActive ? '#4CAF50' : '#FF9800' }]} />
            <Text style={styles.statusText}>
              {item.isActive ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={22} color="#4a90e2" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="home-outline" size={60} color="#cccccc" />
      <Text style={styles.emptyText}>No tienes propiedades publicadas</Text>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateProperty')}
      >
        <Text style={styles.createButtonText}>Publicar mi primer alquiler</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Alquileres</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateProperty')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadProperties}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={properties}
        renderItem={renderPropertyItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={properties.length === 0 ? styles.listEmptyContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4a90e2']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4a90e2',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#fdeaea',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 10,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#4a90e2',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  listEmptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  propertyContent: {
    flexDirection: 'row',
  },
  propertyImage: {
    width: 100,
    height: 100,
  },
  propertyInfo: {
    flex: 1,
    padding: 12,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 5,
  },
  propertyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  propertyLocationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MyPropertiesScreen; 