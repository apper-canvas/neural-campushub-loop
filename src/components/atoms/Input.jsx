import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  className = '',
  required = false,
  disabled = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = value && value.length > 0;
  const isFloating = focused || hasValue;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200 bg-white
            ${icon ? 'pl-11' : 'pl-4'}
            ${type === 'password' ? 'pr-11' : 'pr-4'}
            ${error 
              ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
              : 'border-surface-300 focus:border-primary-500 focus:ring-primary-500'
            }
            ${disabled ? 'bg-surface-50 text-surface-500 cursor-not-allowed' : 'text-surface-900'}
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            placeholder-transparent
          `}
          placeholder={placeholder}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} className="w-5 h-5" />
          </button>
        )}

        {label && (
          <label
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${icon ? 'left-11' : 'left-4'}
              ${isFloating
                ? '-top-2.5 text-xs bg-white px-1 text-primary-600'
                : 'top-1/2 -translate-y-1/2 text-surface-500'
              }
              ${error && isFloating ? 'text-error-600' : ''}
            `}
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
          <ApperIcon name="AlertCircle" className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;