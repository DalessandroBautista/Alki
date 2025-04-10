import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import propertyService from '../../services/propertyService';
import PropertyCard from '../../components/property/PropertyCard';

// Solución multiplataforma para el Picker
const Picker = Platform.select({
  web: () => require('./WebPicker').default,
  default: () => require('@react-native-picker/picker').Picker,
})();

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
        ...(bathrooms !== 'any' && { baños: bathrooms })
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
        <Text style={styles.title}>Busca tu próximo hogar</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ciudad, barrio, código postal..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        
        <View style={styles.priceContainer}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Precio mínimo</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="cash-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Desde..."
                value={priceMin}
                onChangeText={setPriceMin}
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Precio máximo</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="cash-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Hasta..."
                value={priceMax}
                onChangeText={setPriceMax}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Habitaciones</Text>
          <View style={styles.pickerContainer}>
            {Platform.OS === 'web' ? (
              <select 
                style={styles.webPicker}
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            ) : (
              <Picker
                selectedValue={bedrooms}
                onValueChange={(itemValue) => setBedrooms(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Cualquiera" value="" />
                <Picker.Item label="1+" value="1" />
                <Picker.Item label="2+" value="2" />
                <Picker.Item label="3+" value="3" />
                <Picker.Item label="4+" value="4" />
                <Picker.Item label="5+" value="5" />
              </Picker>
            )}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de propiedad</Text>
          <View style={styles.pickerContainer}>
            {Platform.OS === 'web' ? (
              <select 
                style={styles.webPicker}
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="all">Todos los tipos</option>
                <option value="apartment">Apartamento</option>
                <option value="house">Casa</option>
                <option value="studio">Estudio</option>
                <option value="room">Habitación</option>
              </select>
            ) : (
              <Picker
                selectedValue={propertyType}
                onValueChange={(itemValue) => setPropertyType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Todos los tipos" value="all" />
                <Picker.Item label="Apartamento" value="apartment" />
                <Picker.Item label="Casa" value="house" />
                <Picker.Item label="Estudio" value="studio" />
                <Picker.Item label="Habitación" value="room" />
              </Picker>
            )}
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputIcon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 10,
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  webPicker: {
    height: 50,
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    border: 'none',
    outline: 'none',
  },
  searchButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
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