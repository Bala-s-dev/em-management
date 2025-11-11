import React from 'react';

function Button({
  children,
  onClick,
  type = 'button',
  variant = 'blue',
  className = '',
  disabled = false,
}) {
  const colors = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 text-white',
    red: 'bg-red-600 hover:bg-red-700 text-white',
    gray: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm ${
        colors[variant]
      } ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      {children}
    </button>
  );
}

export default Button;
