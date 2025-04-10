import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  SafeAreaView, 
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import propertyService from '../services/propertyService';
import SearchBar from '../components/home/SearchBar';
import CategoryList from '../components/home/CategoryList';
import PromoBanner from '../components/home/PromoBanner';
import FeaturedProperties from '../components/home/FeaturedProperties';
import PropertyListSection from '../components/home/PropertyListSection';
import Footer from '../components/common/Footer';
import { homeStyles } from '../styles/homeStyles';

const { height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const scrollRef = useRef(null);

  const loadProperties = async () => {
    try {
      setLoading(true);
      console.log('🔍 Iniciando carga de propiedades...');
      const data = await propertyService.getAllProperties();
      console.log('📦 Propiedades recibidas:', data);
      console.log('📦 Cantidad de propiedades:', data?.length || 0);
      
      // Si no hay datos o es null/undefined, usar un array vacío
      const propertyData = data || [];
      setProperties(propertyData);
      
      // Verificar si tenemos propiedades para destacar
      if (propertyData.length > 0) {
        console.log('🌟 Configurando propiedades destacadas');
        const shuffled = [...propertyData].sort(() => 0.5 - Math.random());
        setFeaturedProperties(shuffled.slice(0, Math.min(5, propertyData.length)));
      } else {
        console.log('⚠️ No hay propiedades para destacar');
        // Usa un arreglo de propiedades de prueba si no hay datos
        setFeaturedProperties([
          {
            _id: 'demo1',
            titulo: 'Apartamento de prueba',
            precio: 650,
            ubicacion: { direccion: 'Calle Ejemplo 123' },
            imagenes: ['https://via.placeholder.com/400x300/e0e0e0/333333?text=Propiedad+Demo']
          },
          {
            _id: 'demo2',
            titulo: 'Casa de prueba',
            precio: 1200,
            ubicacion: { direccion: 'Avenida Test 456' },
            imagenes: ['https://via.placeholder.com/400x300/e0e0e0/333333?text=Propiedad+Demo']
          }
        ]);
      }
      
      setError(null);
    } catch (err) {
      console.error('❌ Error al cargar propiedades:', err);
      setError('No pudimos cargar los alquileres disponibles');
      
      // Usar datos de prueba en caso de error
      setFeaturedProperties([
        {
          _id: 'error1',
          titulo: 'Propiedad de ejemplo',
          precio: 800,
          ubicacion: { direccion: 'Calle Fallback 789' },
          imagenes: ['https://via.placeholder.com/400x300/e0e0e0/333333?text=Propiedad+Demo']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // Ocultar el indicador después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollIndicator(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleScrollDown = () => {
    scrollRef.current?.scrollTo({ y: height * 0.2, animated: true });
  };

  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
    // Aquí podrías filtrar propiedades por categoría
  };

  return (
    <SafeAreaView style={homeStyles.safeContainer}>
      <ScrollView 
        ref={scrollRef}
        style={homeStyles.container}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={homeStyles.contentContainer}
      >
        <SearchBar navigation={navigation} />
        
        <CategoryList 
          activeCategory={activeCategory} 
          onCategoryPress={handleCategoryPress} 
        />
        
        <PromoBanner navigation={navigation} />
        
        {showScrollIndicator && (
          <TouchableOpacity 
            style={styles.scrollIndicator}
            onPress={handleScrollDown}
          >
            <Text style={styles.scrollText}>Desliza para ver más</Text>
            <Ionicons name="chevron-down" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        
        <FeaturedProperties 
          properties={featuredProperties} 
          loading={loading}
          error={error}
          navigation={navigation}
        />
        
        <PropertyListSection 
          properties={properties} 
          loading={loading}
          error={error}
          navigation={navigation}
        />
        
        <View style={styles.footerIndicator}>
          <Text style={styles.footerIndicatorText}>Más información abajo</Text>
          <Ionicons name="chevron-down" size={20} color="#003366" />
        </View>
        
        <Footer navigation={navigation} />
        
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollIndicator: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
  },
  scrollText: {
    color: '#fff',
    marginRight: 8,
    fontWeight: '500',
  },
  footerIndicator: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#f0f0f0',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  footerIndicatorText: {
    color: '#003366',
    fontWeight: 'bold',
    marginBottom: 8,
  }
});

export default HomeScreen; 