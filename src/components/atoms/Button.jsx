import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
    secondary: 'bg-white text-surface-700 border border-surface-300 hover:bg-surface-50 focus:ring-primary-500 shadow-sm',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 shadow-sm',
    ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 focus:ring-primary-500',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-sm'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-6 py-3 text-base rounded-lg gap-2'
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const buttonHover = { scale: disabled ? 1 : 1.02 };
  const buttonTap = { scale: disabled ? 1 : 0.98 };

  return (
    <motion.button
      whileHover={buttonHover}
      whileTap={buttonTap}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className="w-4 h-4" />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className="w-4 h-4" />
      )}
    </motion.button>
  );
};

export default Button;