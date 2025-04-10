import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Footer = ({ navigation }) => {
  console.log('🦶 Renderizando footer');
  
  return (
    <View style={styles.footer}>
      <View style={styles.footerBorder}></View>
      
      <View style={styles.footerContent}>
        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>AlquiAzul</Text>
          <Text style={styles.footerText}>La manera más fácil de encontrar tu nuevo hogar</Text>
        </View>
        
        <View style={styles.footerSection}>
          <Text style={styles.footerSectionTitle}>Enlaces rápidos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PropertySearch')}>
            <Text style={styles.footerLink}>Buscar propiedades</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PropertyList')}>
            <Text style={styles.footerLink}>Ver todas las propiedades</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
            <Text style={styles.footerLink}>Contacto</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footerBottom}>
        <Text style={styles.footerCopyright}>© 2024 AlquiAzul. Todos los derechos reservados.</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-facebook" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-instagram" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-twitter" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#003366',
    paddingTop: 8,
    marginTop: 20,
  },
  footerBorder: {
    height: 6,
    backgroundColor: '#0099ff',
    marginBottom: 16,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexWrap: 'wrap',
  },
  footerSection: {
    width: '48%',
    marginBottom: 20,
  },
  footerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footerSectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  footerText: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 10,
  },
  footerLink: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 8,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  footerCopyright: {
    color: '#cccccc',
    fontSize: 12,
  },
  socialIcons: {
    flexDirection: 'row',
  },
  socialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Footer; 