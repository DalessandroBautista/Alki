import { StyleSheet } from 'react-native';

export const categoryStyles = StyleSheet.create({
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
  },
  categoryItemActive: {
    backgroundColor: '#003366',
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#fff',
  },
}); 