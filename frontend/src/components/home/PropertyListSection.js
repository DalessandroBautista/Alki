import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import PropertyCard from '../property/PropertyCard';
import { sectionStyles } from './styles/sectionStyles';
import { propertyListStyles } from './styles/propertyListStyles';

const PropertyListSection = ({ properties, loading, error, navigation }) => {
  const handlePropertyPress = (property) => {
    navigation.navigate('PropertyDetail', { propertyId: property._id });
  };

  return (
    <View style={sectionStyles.section}>
      <View style={sectionStyles.sectionHeader}>
        <Text style={sectionStyles.sectionTitle}>Agregados recientemente</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PropertyList')}>
          <Text style={sectionStyles.seeAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#003366" style={sectionStyles.loader} />
      ) : error ? (
        <Text style={sectionStyles.errorText}>{error}</Text>
      ) : (
        <View style={propertyListStyles.propertiesList}>
          {properties.slice(0, 4).map(property => (
            <PropertyCard 
              key={property._id} 
              property={property} 
              onPress={() => handlePropertyPress(property)} 
            />
          ))}
          
          {properties.length > 0 && (
            <TouchableOpacity 
              style={propertyListStyles.viewMoreButton}
              onPress={() => navigation.navigate('PropertyList')}
            >
              <Text style={propertyListStyles.viewMoreText}>Ver más propiedades</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default PropertyListSection; 