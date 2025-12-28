import React, { createContext, useContext, useEffect, useReducer } from 'react';
import supabase from '../utils/supabaseClient';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  // Check current session on app load
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Try to get user profile from backend API
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await authAPI.getProfile();
            dispatch({
              type: 'SET_USER',
              payload: response.data
            });
          } else {
            // If no token in local storage, create a minimal user object
            dispatch({
              type: 'SET_USER',
              payload: {
                id: session.user.id,
                email: session.user.email,
                role: session.user.user_metadata?.role || 'user'
              }
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to session data
          dispatch({
            type: 'SET_USER',
            payload: {
              id: session.user.id,
              email: session.user.email,
              role: session.user.user_metadata?.role || 'user'
            }
          });
        }
      } else {
        dispatch({
          type: 'SET_USER',
          payload: null
        });
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          dispatch({
            type: 'SET_USER',
            payload: {
              id: session.user.id,
              email: session.user.email,
              role: session.user.user_metadata?.role || 'user'
            }
          });
        } else {
          dispatch({
            type: 'SET_USER',
            payload: null
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { success: false, error: error.message };
      }

      // Login automatically after signup
      const loginResult = await login(email, password);
      
      if (loginResult.success) {
        dispatch({
          type: 'SET_USER',
          payload: loginResult.user
        });
        return { success: true, user: loginResult.user };
      } else {
        dispatch({ type: 'SET_ERROR', payload: loginResult.error });
        return { success: false, error: loginResult.error };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { success: false, error: error.message };
      }

      // Call backend login API to get JWT token
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);

      dispatch({
        type: 'SET_USER',
        payload: user
      });

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { success: false, error: error.message };
      }

      dispatch({
        type: 'SET_USER',
        payload: null
      });

      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};