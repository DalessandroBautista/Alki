import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importar pantallas de propiedades
import PropertyListScreen from '../screens/property/PropertyListScreen';
import PropertyDetailScreen from '../screens/property/PropertyDetailScreen';
import PropertySearchScreen from '../screens/property/PropertySearchScreen';
import CreatePropertyScreen from '../screens/property/CreatePropertyScreen';
import MyPropertiesScreen from '../screens/property/MyPropertiesScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const MainNavigator = ({ isAuthenticated }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#003366',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ navigation }) => ({
          title: 'AlquiAzul',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate(isAuthenticated ? 'MyProperties' : 'Login')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="person-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
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
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Iniciar Sesión' }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: 'Registro' }} 
      />
      {isAuthenticated && (
        <>
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
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;