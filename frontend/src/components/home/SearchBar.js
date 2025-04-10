import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchBarStyles } from './styles/searchBarStyles';

const SearchBar = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (searchText.trim()) {
      navigation.navigate('PropertySearch', { initialQuery: searchText });
    }
  };

  return (
    <View style={searchBarStyles.searchHeader}>
      <View style={searchBarStyles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={searchBarStyles.searchIcon} />
        <TextInput
          style={searchBarStyles.searchInput}
          placeholder="¿Dónde buscas alquilar?"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity 
        style={searchBarStyles.filterButton} 
        onPress={() => navigation.navigate('PropertySearch')}
      >
        <Ionicons name="options" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar; 