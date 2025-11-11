import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

function LoginPage() {
  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post(`/auth/${role}/login`, { email, password });
      login(res.data); // AuthContext handles redirect
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Sign In
        </h2>
        
        <div className="flex justify-center rounded-lg shadow-sm">
          <button
            onClick={() => setRole('employee')}
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-l-lg ${
              role === 'employee' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-gray-50'
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-r-lg ${
              role === 'admin' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-gray-50'
            }`}
          >
            Admin
          </button>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;