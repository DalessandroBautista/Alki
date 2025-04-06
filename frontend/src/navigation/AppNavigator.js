import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importar navegadores secundarios
import MainNavigator from './MainNavigator';
import ProfileNavigator from './ProfileNavigator';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Main') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4a90e2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Main" 
        component={MainNavigator} 
        options={{ 
          headerShown: false,
          title: 'Inicio' 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator} 
        options={{ 
          headerShown: false,
          title: 'Perfil' 
        }} 
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;