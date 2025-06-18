import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  icon = 'Package',
  title = 'Nothing here yet',
  description = 'Get started by creating your first item.',
  actionLabel,
  onAction,
  className = ''
}) => {
  const emptyStateInitial = { scale: 0.9, opacity: 0 };
  const emptyStateAnimate = { scale: 1, opacity: 1 };

  const iconBounceAnimate = { y: [0, -10, 0] };
  const iconBounceTransition = { repeat: Infinity, duration: 3 };

  const buttonHover = { scale: 1.05 };
  const buttonTap = { scale: 0.95 };

  return (
    <motion.div
      initial={emptyStateInitial}
      animate={emptyStateAnimate}
      className={`text-center py-12 px-6 ${className}`}
    >
      <motion.div
        animate={iconBounceAnimate}
        transition={iconBounceTransition}
        className="mb-4"
      >
        <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto" />
      </motion.div>
      
      <h3 className="text-lg font-display font-semibold text-surface-900 mb-2">
        {title}
      </h3>
      
      <p className="text-surface-600 mb-6 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <motion.div
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <Button
            variant="primary"
            onClick={onAction}
            className="mx-auto"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;