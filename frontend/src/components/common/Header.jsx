import React from 'react';
import useAuth from '../../hooks/useAuth';
import Button from '../ui/Button';

function Header({ title }) {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <Button onClick={logout} variant="red">
          Logout
        </Button>
      </div>
    </header>
  );
}

export default Header;
