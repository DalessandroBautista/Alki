import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import propertyService from '../../services/propertyService';
import PropertyCard from '../../components/property/PropertyCard';

const PropertySearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      
      const filters = {
        ...(searchQuery && { q: searchQuery }),
        ...(priceMin && { precioMin: priceMin }),
        ...(priceMax && { precioMax: priceMax }),
        ...(propertyType !== 'all' && { tipo: propertyType }),
        ...(bedrooms !== 'any' && { habitaciones: bedrooms }),
        ...(bathrooms !== 'any' && { banos: bathrooms })
      };
      
      const data = await propertyService.searchProperties(filters);
      setResults(data);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyPress = (property) => {
    navigation.navigate('PropertyDetail', { propertyId: property._id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Busca por ubicación, nombre..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.filterToggle}
        onPress={() => setFiltersVisible(!filtersVisible)}
      >
        <Text style={styles.filterToggleText}>
          {filtersVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
        </Text>
      </TouchableOpacity>

      {filtersVisible && (
        <ScrollView style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Precio</Text>
          <View style={styles.priceInputsContainer}>
            <TextInput
              style={styles.priceInput}
              placeholder="Mínimo"
              value={priceMin}
              onChangeText={setPriceMin}
              keyboardType="numeric"
            />
            <Text style={styles.priceSeparator}>-</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Máximo"
              value={priceMax}
              onChangeText={setPriceMax}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.filterTitle}>Tipo de propiedad</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={propertyType}
              onValueChange={(itemValue) => setPropertyType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Todos los tipos" value="all" />
              <Picker.Item label="Casa" value="casa" />
              <Picker.Item label="Apartamento" value="apartamento" />
              <Picker.Item label="Habitación" value="habitacion" />
            </Picker>
          </View>

          <Text style={styles.filterTitle}>Habitaciones</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={bedrooms}
              onValueChange={(itemValue) => setBedrooms(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Cualquiera" value="any" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4+" value="4" />
            </Picker>
          </View>

          <Text style={styles.filterTitle}>Baños</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={bathrooms}
              onValueChange={(itemValue) => setBathrooms(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Cualquiera" value="any" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3+" value="3" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.applyFiltersButton} onPress={handleSearch}>
            <Text style={styles.applyFiltersText}>Aplicar filtros</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PropertyCard property={item} onPress={() => handlePropertyPress(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {results.length === 0 && searchQuery 
                  ? 'No se encontraron propiedades con estos criterios'
                  : 'Busca propiedades por ubicación o características'}
              </Text>
            </View>
          }
          contentContainerStyle={styles.resultsContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterToggle: {
    padding: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  filterToggleText: {
    color: '#555',
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: 'white',
    padding: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  priceInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  priceSeparator: {
    marginHorizontal: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 12,
  },
  picker: {
    height: 40,
  },
  applyFiltersButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  applyFiltersText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    padding: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default PropertySearchScreen;