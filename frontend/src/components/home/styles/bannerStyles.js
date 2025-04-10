import { StyleSheet } from 'react-native';

export const bannerStyles = StyleSheet.create({
  banner: {
    height: 200,
    marginVertical: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 51, 102, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  bannerButton: {
    backgroundColor: '#0099ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bannerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: -15,
    alignSelf: 'center',
    backgroundColor: '#003366',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollText: {
    color: '#fff',
    marginRight: 8,
    fontSize: 13,
    fontWeight: '500',
  },
}); 