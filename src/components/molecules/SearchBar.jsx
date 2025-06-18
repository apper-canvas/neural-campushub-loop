import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = 'Search...', 
  value, 
  onChange, 
  onClear,
  className = '' 
}) => {
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    onChange?.('');
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
            focused ? 'text-primary-500' : 'text-surface-400'
          }`} 
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-11 pr-10 py-2.5 bg-white border border-surface-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            transition-all duration-200 text-surface-900 placeholder-surface-500
          `}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;