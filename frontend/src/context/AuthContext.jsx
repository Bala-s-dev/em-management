import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // Will hold { token, role, userId }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On initial load, check localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
    setLoading(false);
  }, []);

  const login = (authData) => {
    const authPayload = {
      token: authData.token,
      role: authData.role,
      userId: authData.emp_id || authData.admin_id,
    };
    localStorage.setItem('auth', JSON.stringify(authPayload));
    setAuth(authPayload);

    // Redirect after login
    if (authPayload.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/employee');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
