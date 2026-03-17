import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../api/index.js';

const AuthContext = createContext();

const initialState = {
  user: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  loading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'AUTH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'PROFILE_UPDATE':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_REQUEST' });
    try {
      const { data } = await authAPI.login({ email, password });
      dispatch({ type: 'AUTH_SUCCESS', payload: data.data });
      localStorage.setItem('userInfo', JSON.stringify(data.data));
    } catch (err) {
      dispatch({ type: 'AUTH_FAIL', payload: err.response?.data?.message || 'Login failed' });
      throw err;
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: 'AUTH_REQUEST' });
    try {
      const { data } = await authAPI.register({ name, email, password });
      dispatch({ type: 'AUTH_SUCCESS', payload: data.data });
      localStorage.setItem('userInfo', JSON.stringify(data.data));
    } catch (err) {
      dispatch({ type: 'AUTH_FAIL', payload: err.response?.data?.message || 'Registration failed' });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await authAPI.updateProfile(profileData);
      dispatch({ type: 'PROFILE_UPDATE', payload: data.data });
      localStorage.setItem('userInfo', JSON.stringify(data.data));
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!state.user,
        isAdmin: state.user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
