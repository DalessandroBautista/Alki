import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, register, verifyToken } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  // Verificar token al inicio
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          // Verificar que el token es válido
          const user = await verifyToken(token);
          setUserInfo(user);
          setUserToken(token);
        }
      } catch (e) {
        console.log('Error al restaurar token:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Login
  const loginUser = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      setUserToken(response.token);
      setUserInfo(response.user);
      await AsyncStorage.setItem('userToken', response.token);
    } catch (e) {
      setError(e.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  // Registro
  const registerUser = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await register(userData);
      setUserToken(response.token);
      setUserInfo(response.user);
      await AsyncStorage.setItem('userToken', response.token);
    } catch (e) {
      setError(e.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      setUserInfo(null);
    } catch (e) {
      console.log('Error al cerrar sesión:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userInfo,
        error,
        login: loginUser,
        register: registerUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 