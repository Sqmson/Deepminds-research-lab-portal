import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOAD_USER_START: 'LOAD_USER_START',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
  UPDATE_PROFILE_SUCCESS: 'UPDATE_PROFILE_SUCCESS',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
    case AUTH_ACTIONS.LOAD_USER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
    case AUTH_ACTIONS.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
    case AUTH_ACTIONS.LOAD_USER_FAILURE:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptor for token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Response interceptor for handling token expiration
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && token) {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
          toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch({ type: AUTH_ACTIONS.LOAD_USER_START });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await api.get('/auth/me');
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
            payload: response.data.data
          });
        } catch (error) {
          console.error('Load user error:', error);
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER_FAILURE,
            payload: error.response?.data?.error || 'Failed to load user'
          });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE, payload: null });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const response = await api.post('/auth/login', { email, password });
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response.data.data
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      toast.success('Login successful!');
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });
      
      const response = await api.post('/auth/register', userData);
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: response.data.data
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      toast.success('Registration successful!');
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      delete api.defaults.headers.common['Authorization'];
      toast.success('Logged out successfully');
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE_SUCCESS,
        payload: response.data.data
      });

      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Profile update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });

      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Password change failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    api // Expose api instance for other components
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;