import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const featuredStyles = StyleSheet.create({
  featuredList: {
    paddingLeft: 15,
    paddingRight: 5,
    paddingVertical: 8,
  },
  featuredItem: {
    width: width * 0.42,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  featuredImage: {
    width: '100%',
    height: width * 0.28,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  featuredInfo: {
    padding: 10,
  },
  featuredPrice: {
    color: '#0066cc',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  featuredTitle: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
  },
  featuredLocation: {
    color: '#666',
    fontSize: 13,
  },
  demoContainer: {
    padding: 16,
    borderWidth: 2,
    borderColor: 'red',
    margin: 16,
  },
  demoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8,
  },
  demoProperty: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    height: 100,
  },
  demoImage: {
    width: 100,
    backgroundColor: '#d0d0d0',
  },
  demoContent: {
    flex: 1,
    padding: 12,
  },
  demoTitle: {
    height: 20,
    backgroundColor: '#d0d0d0',
    marginBottom: 12,
    borderRadius: 4,
  },
  demoDetails: {
    height: 15,
    backgroundColor: '#d0d0d0',
    width: '70%',
    borderRadius: 4,
  }
}); 