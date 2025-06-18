import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  title = 'Something went wrong',
  message = 'We encountered an error while loading your data.',
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      <div className="max-w-sm mx-auto">
        <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error-500" />
        </div>
        
        <h3 className="text-lg font-display font-semibold text-surface-900 mb-2">
          {title}
        </h3>
        
        <p className="text-surface-600 mb-6 leading-relaxed">
          {message}
        </p>
        
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            icon="RefreshCw"
            className="mx-auto"
          >
            Try Again
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorState;