import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import propertyService from '../../services/propertyService';
import { useAuth } from '../../store/AuthContext';

const CreatePropertyScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    tipo: 'apartamento',
    habitaciones: '1',
    banos: '1',
    'ubicacion.direccion': '',
    'ubicacion.ciudad': '',
    'ubicacion.codigoPostal': '',
    'ubicacion.pais': 'Argentina',
    superficie: '',
    amenities: []
  });

  const [amenities, setAmenities] = useState({
    wifi: false,
    aire: false,
    cochera: false,
    mascotas: false,
    pileta: false,
    lavarropas: false,
    seguridad: false
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = { ...amenities, [amenity]: !amenities[amenity] };
    setAmenities(newAmenities);
    
    // Actualizar el array de amenities en formData
    const amenitiesArray = Object.keys(newAmenities).filter(key => newAmenities[key]);
    setFormData({ ...formData, amenities: amenitiesArray });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.titulo || !formData.precio || !formData['ubicacion.direccion']) {
        Alert.alert('Error', 'Por favor completa los campos obligatorios');
        return;
      }

      setLoading(true);
      
      // Reestructurar los datos para enviar
      const propertyData = {
        ...formData,
        ubicacion: {
          direccion: formData['ubicacion.direccion'],
          ciudad: formData['ubicacion.ciudad'],
          codigoPostal: formData['ubicacion.codigoPostal'],
          pais: formData['ubicacion.pais'],
        },
        // Convertir a números
        precio: Number(formData.precio),
        habitaciones: Number(formData.habitaciones),
        banos: Number(formData.banos),
        superficie: Number(formData.superficie),
      };
      
      delete propertyData['ubicacion.direccion'];
      delete propertyData['ubicacion.ciudad'];
      delete propertyData['ubicacion.codigoPostal'];
      delete propertyData['ubicacion.pais'];
      
      await propertyService.createProperty(propertyData);
      Alert.alert('Éxito', 'Propiedad creada correctamente', [
        { text: 'OK', onPress: () => navigation.navigate('MyProperties') }
      ]);
    } catch (error) {
      console.error('Error al crear propiedad:', error);
      Alert.alert('Error', error.message || 'Error al crear la propiedad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Publicar Nuevo Alquiler</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={formData.titulo}
          onChangeText={(value) => handleChange('titulo', value)}
          placeholder="Ej: Apartamento amplio en el centro"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.descripcion}
          onChangeText={(value) => handleChange('descripcion', value)}
          placeholder="Describe tu propiedad en detalle"
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Precio Mensual (USD) *</Text>
        <TextInput
          style={styles.input}
          value={formData.precio}
          onChangeText={(value) => handleChange('precio', value)}
          placeholder="Ej: 500"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Tipo de Propiedad</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.tipo}
            onValueChange={(value) => handleChange('tipo', value)}
          >
            <Picker.Item label="Apartamento" value="apartamento" />
            <Picker.Item label="Casa" value="casa" />
            <Picker.Item label="Habitación" value="habitacion" />
            <Picker.Item label="Oficina" value="oficina" />
            <Picker.Item label="Otro" value="otro" />
          </Picker>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Habitaciones</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.habitaciones}
              onValueChange={(value) => handleChange('habitaciones', value)}
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5+" value="5" />
            </Picker>
          </View>
        </View>
        
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Baños</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.banos}
              onValueChange={(value) => handleChange('banos', value)}
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4+" value="4" />
            </Picker>
          </View>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Dirección *</Text>
        <TextInput
          style={styles.input}
          value={formData['ubicacion.direccion']}
          onChangeText={(value) => handleChange('ubicacion.direccion', value)}
          placeholder="Ej: Av. Corrientes 1234, Piso 5, Depto B"
        />
      </View>
      
      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Ciudad</Text>
          <TextInput
            style={styles.input}
            value={formData['ubicacion.ciudad']}
            onChangeText={(value) => handleChange('ubicacion.ciudad', value)}
            placeholder="Ej: Buenos Aires"
          />
        </View>
        
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Código Postal</Text>
          <TextInput
            style={styles.input}
            value={formData['ubicacion.codigoPostal']}
            onChangeText={(value) => handleChange('ubicacion.codigoPostal', value)}
            placeholder="Ej: 1425"
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Superficie (m²)</Text>
        <TextInput
          style={styles.input}
          value={formData.superficie}
          onChangeText={(value) => handleChange('superficie', value)}
          placeholder="Ej: 75"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          <TouchableOpacity 
            style={[styles.amenityTag, amenities.wifi && styles.amenityTagActive]}
            onPress={() => handleAmenityToggle('wifi')}
          >
            <Text style={[styles.amenityText, amenities.wifi && styles.amenityTextActive]}>
              WiFi
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.amenityTag, amenities.aire && styles.amenityTagActive]}
            onPress={() => handleAmenityToggle('aire')}
          >
            <Text style={[styles.amenityText, amenities.aire && styles.amenityTextActive]}>
              Aire Acondicionado
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.amenityTag, amenities.cochera && styles.amenityTagActive]}
            onPress={() => handleAmenityToggle('cochera')}
          >
            <Text style={[styles.amenityText, amenities.cochera && styles.amenityTextActive]}>
              Cochera
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.amenityTag, amenities.mascotas && styles.amenityTagActive]}
            onPress={() => handleAmenityToggle('mascotas')}
          >
            <Text style={[styles.amenityText, amenities.mascotas && styles.amenityTextActive]}>
              Acepta Mascotas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.amenityTag, amenities.pileta && styles.amenityTagActive]}
            onPress={() => handleAmenityToggle('pileta')}
          >
            <Text style={[styles.amenityText, amenities.pileta && styles.amenityTextActive]}>
              Pileta
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.amenityTag, amenities.lavarropas && styles.amenityTagActive]}
            onPress={() => handleAmenityToggle('lavarropas')}
          >
            <Text style={[styles.amenityText, amenities.lavarropas && styles.amenityTextActive]}>
              Lavarropas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.amenityTag, amenities.seguridad && styles.amenityTagActive]}
            onPress={() => handleAmenityToggle('seguridad')}
          >
            <Text style={[styles.amenityText, amenities.seguridad && styles.amenityTextActive]}>
              Seguridad 24hs
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Publicando...' : 'Publicar Alquiler'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  amenityTagActive: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  amenityText: {
    color: '#555',
  },
  amenityTextActive: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreatePropertyScreen;