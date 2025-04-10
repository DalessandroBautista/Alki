import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  Alert,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import propertyService from '../../services/propertyService';
import { useAuth } from '../../store/AuthContext';

const { width } = Dimensions.get('window');

const PropertyDetailScreen = ({ route, navigation }) => {
  const { propertyId } = route.params;
  const { user } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadPropertyDetails();
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getPropertyById(propertyId);
      setProperty(data);
    } catch (err) {
      setError('No se pudo cargar la información de la propiedad');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    // Verificar si el usuario está logueado
    if (!user) {
      Alert.alert(
        'Iniciar sesión requerido',
        'Necesitas iniciar sesión para contactar al propietario',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar sesión', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    // Navegar a la pantalla de mensajes o crear conversación
    navigation.navigate('CreateConversation', { 
      recipientId: property.owner.id,
      propertyId: property.id
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `¡Mira esta propiedad en Alki! ${property.titulo} - ${property.precio}€`,
        url: `https://alki.com/properties/${property.id}`,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir la propiedad');
    }
  };

  const nextImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={loadPropertyDetails}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Si no hay propiedad después de cargar, mostrar mensaje
  if (!property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Propiedad no encontrada</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Galería de imágenes */}
      <View style={styles.imageContainer}>
        {property.images && property.images.length > 0 ? (
          <>
            <Image 
              source={{ uri: property.images[currentImageIndex] }} 
              style={styles.image} 
              resizeMode="cover"
            />
            {property.images.length > 1 && (
              <View style={styles.imageControls}>
                <TouchableOpacity onPress={prevImage} style={styles.imageControlButton}>
                  <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.imageCounter}>
                  {currentImageIndex + 1}/{property.images.length}
                </Text>
                <TouchableOpacity onPress={nextImage} style={styles.imageControlButton}>
                  <Ionicons name="chevron-forward" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-outline" size={50} color="#cccccc" />
            <Text style={styles.noImageText}>Sin imágenes disponibles</Text>
          </View>
        )}
      </View>

      {/* Información de la propiedad */}
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{property.titulo}</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#4a90e2" />
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>{property.moneda} {property.precio}{property.tipoAlquiler === 'temporario' ? '/día' : '/mes'}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={styles.location}>{property.direccion?.direccion}, {property.direccion?.ciudad}</Text>
        </View>

        <View style={styles.featuresContainer}>
          {property.habitaciones && (
            <View style={styles.featureItem}>
              <Ionicons name="bed-outline" size={18} color="#666" />
              <Text style={styles.featureText}>{property.habitaciones} hab.</Text>
            </View>
          )}
          {property.baños && (
            <View style={styles.featureItem}>
              <Ionicons name="water-outline" size={18} color="#666" />
              <Text style={styles.featureText}>{property.baños} baños</Text>
            </View>
          )}
          {property.size && (
            <View style={styles.featureItem}>
              <Ionicons name="resize-outline" size={18} color="#666" />
              <Text style={styles.featureText}>{property.size} m²</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{property.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Características</Text>
        <View style={styles.amenitiesContainer}>
          {property.features && property.features.map((feature, index) => (
            <View key={index} style={styles.amenityItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#4a90e2" />
              <Text style={styles.amenityText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Propietario</Text>
        <View style={styles.ownerContainer}>
          <Image 
            source={{ 
              uri: property.owner?.avatar || 'https://via.placeholder.com/50' 
            }} 
            style={styles.ownerAvatar} 
          />
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>{property.owner?.name || 'Propietario'}</Text>
            <Text style={styles.memberSince}>Miembro desde {property.owner?.createdAt?.slice(0, 4) || '2023'}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.contactButton} 
          onPress={handleContact}
        >
          <Text style={styles.contactButtonText}>Contactar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4a90e2',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageControls: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  imageControlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  imageCounter: {
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    fontSize: 12,
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  noImageText: {
    marginTop: 10,
    color: '#999',
  },
  infoContainer: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  shareButton: {
    padding: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  featuresContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  featureText: {
    marginLeft: 5,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  amenityText: {
    marginLeft: 5,
    color: '#333',
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberSince: {
    color: '#666',
    fontSize: 14,
  },
  contactButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PropertyDetailScreen;