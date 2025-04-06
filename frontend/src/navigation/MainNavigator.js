import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importar pantallas de propiedades
import PropertyListScreen from '../screens/property/PropertyListScreen';
import PropertyDetailScreen from '../screens/property/PropertyDetailScreen';
import PropertySearchScreen from '../screens/property/PropertySearchScreen';
import CreatePropertyScreen from '../screens/property/CreatePropertyScreen';
import MyPropertiesScreen from '../screens/property/MyPropertiesScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PropertyList" 
        component={PropertyListScreen} 
        options={{ title: 'Alquileres' }} 
      />
      <Stack.Screen 
        name="PropertyDetail" 
        component={PropertyDetailScreen} 
        options={{ title: 'Detalle' }} 
      />
      <Stack.Screen 
        name="PropertySearch" 
        component={PropertySearchScreen} 
        options={{ title: 'Buscar' }} 
      />
      <Stack.Screen 
        name="CreateProperty" 
        component={CreatePropertyScreen} 
        options={{ title: 'Publicar Alquiler' }} 
      />
      <Stack.Screen 
        name="MyProperties" 
        component={MyPropertiesScreen} 
        options={{ title: 'Mis Alquileres' }} 
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;