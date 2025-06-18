import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'primary',
  trend,
  className = '' 
}) => {
  const cardHover = { scale: 1.02, y: -2 };

  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 border-primary-200',
    secondary: 'bg-secondary-50 text-secondary-600 border-secondary-200',
    accent: 'bg-accent-50 text-accent-600 border-accent-200',
    success: 'bg-success-50 text-success-600 border-success-200',
    warning: 'bg-warning-50 text-warning-600 border-warning-200',
    error: 'bg-error-50 text-error-600 border-error-200',
    info: 'bg-info-50 text-info-600 border-info-200'
  };

  return (
    <motion.div
      whileHover={cardHover}
      className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-surface-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-surface-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${
              trend.type === 'positive' ? 'text-success-600' : 'text-error-600'
            }`}>
              <ApperIcon 
                name={trend.type === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                className="w-3 h-3" 
              />
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${colorClasses[color]}`}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;