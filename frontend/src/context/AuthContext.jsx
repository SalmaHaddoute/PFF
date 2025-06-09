import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || null);
  const [userType, setUserType] = useState(() => localStorage.getItem('userType') || null);
  const [loading, setLoading] = useState(false);

  // Configure axios to use the token for all requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const checkAuth = async () => {
    if (!token) return false;
    
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      logout(); // Clear credentials on auth failure
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on initial load
  useEffect(() => {
    if (token) {
      checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // First get CSRF token
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });
      
      // Make login request
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        motdepasse: password
      }, {
        withCredentials: true
      });
      
      // Handle successful response
      if (response.data.status === 'authenticated') {
        setToken(response.data.token);
        setUser(response.data.user);
        setUserType(response.data.user_type);
        
        // Save to localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        localStorage.setItem('userType', response.data.user_type);
        
        return response.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('http://localhost:8000/api/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      // Clear all auth data regardless of API call result
      setUser(null);
      setToken(null);
      setUserType(null);
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('userType');
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      userType,
      loading,
      isAuthenticated: !!token,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};