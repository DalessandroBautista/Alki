import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { featuredStyles } from './styles/featuredStyles';
import { sectionStyles } from './styles/sectionStyles';

const FeaturedProperties = ({ properties, loading, error, navigation }) => {
  // Verificar si hay propiedades, sino usar datos de prueba
  const hasProperties = properties && properties.length > 0;
  console.log('🏠 Propiedades destacadas a mostrar:', hasProperties ? properties.length : 0);
  
  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity 
      style={featuredStyles.featuredItem}
      onPress={() => navigation.navigate('PropertyDetail', { propertyId: item._id })}
    >
      <Image
        source={{ 
          uri: item.imagenes && item.imagenes.length > 0 
            ? item.imagenes[0] 
            : 'https://via.placeholder.com/400x300/e0e0e0/333333?text=Propiedad'
        }}
        style={featuredStyles.featuredImage}
        resizeMode="cover"
      />
      <View style={featuredStyles.featuredInfo}>
        <Text style={featuredStyles.featuredPrice}>${item.precio}/mes</Text>
        <Text style={featuredStyles.featuredTitle} numberOfLines={1}>{item.titulo}</Text>
        <Text style={featuredStyles.featuredLocation} numberOfLines={1}>
          {item.ubicacion?.direccion || 'Ubicación no disponible'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Mostrar componente de prueba si no hay propiedades
  if (!hasProperties && !loading && !error) {
    return (
      <View style={sectionStyles.section}>
        <View style={sectionStyles.sectionHeader}>
          <Text style={sectionStyles.sectionTitle}>Destacados</Text>
        </View>
        <View style={featuredStyles.demoContainer}>
          <Text style={featuredStyles.demoText}>Elemento de prueba visible</Text>
          <View style={featuredStyles.demoProperty}>
            <View style={featuredStyles.demoImage} />
            <View style={featuredStyles.demoContent}>
              <View style={featuredStyles.demoTitle} />
              <View style={featuredStyles.demoDetails} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={sectionStyles.section}>
      <View style={sectionStyles.sectionHeader}>
        <Text style={sectionStyles.sectionTitle}>Destacados</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PropertyList')}>
          <Text style={sectionStyles.seeAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#003366" style={sectionStyles.loader} />
      ) : error ? (
        <Text style={sectionStyles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={properties}
          renderItem={renderFeaturedItem}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={featuredStyles.featuredList}
        />
      )}
    </View>
  );
};

export default FeaturedProperties; 