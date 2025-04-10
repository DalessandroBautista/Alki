import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categoryStyles } from './styles/categoryStyles';

const CategoryList = ({ activeCategory, onCategoryPress }) => {
  const categories = [
    { id: 'all', name: 'Todos', icon: 'grid-outline' },
    { id: 'apartment', name: 'Apartamentos', icon: 'business-outline' },
    { id: 'house', name: 'Casas', icon: 'home-outline' },
    { id: 'room', name: 'Habitaciones', icon: 'bed-outline' },
    { id: 'commercial', name: 'Locales', icon: 'storefront-outline' },
  ];

  return (
    <View style={categoryStyles.categoriesContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={categoryStyles.categoriesList}
      >
        {categories.map(category => (
          <TouchableOpacity 
            key={category.id}
            style={[
              categoryStyles.categoryItem, 
              activeCategory === category.id && categoryStyles.categoryItemActive
            ]}
            onPress={() => onCategoryPress(category.id)}
          >
            <Ionicons 
              name={category.icon} 
              size={24} 
              color={activeCategory === category.id ? '#FFFFFF' : '#003366'} 
            />
            <Text 
              style={[
                categoryStyles.categoryText,
                activeCategory === category.id && categoryStyles.categoryTextActive
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryList; 