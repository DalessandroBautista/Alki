import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bannerStyles } from './styles/bannerStyles';

const PromoBanner = ({ navigation }) => {
  return (
    <View style={bannerStyles.banner}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80' }}
        style={bannerStyles.bannerImage}
        resizeMode="cover"
      />
      <View style={bannerStyles.bannerContent}>
        <Text style={bannerStyles.bannerTitle}>Encuentra tu nuevo hogar</Text>
        <Text style={bannerStyles.bannerSubtitle}>Miles de opciones en un solo lugar</Text>
        <TouchableOpacity 
          style={bannerStyles.bannerButton}
          onPress={() => navigation.navigate('PropertySearch')}
        >
          <Text style={bannerStyles.bannerButtonText}>Buscar Ahora</Text>
        </TouchableOpacity>
      </View>
      
      {/* Indicador de scroll abajo del banner */}
      <View style={bannerStyles.scrollIndicator}>
        <Text style={bannerStyles.scrollText}>Descubre propiedades destacadas</Text>
        <Ionicons name="chevron-down" size={20} color="#FFF" />
      </View>
    </View>
  );
};

export default PromoBanner; 