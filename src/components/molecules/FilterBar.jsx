import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const FilterBar = ({ 
  filters = [], 
  activeFilters = [], 
  onFilterChange, 
  onClearAll,
  className = '' 
}) => {
  const toggleFilter = (filterValue) => {
    const isActive = activeFilters.includes(filterValue);
    if (isActive) {
      onFilterChange?.(activeFilters.filter(f => f !== filterValue));
    } else {
      onFilterChange?.([...activeFilters, filterValue]);
    }
  };

  const removeFilter = (filterValue) => {
    onFilterChange?.(activeFilters.filter(f => f !== filterValue));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Filter Options */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeFilters.includes(filter.value);
          return (
            <motion.button
              key={filter.value}
              onClick={() => toggleFilter(filter.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-white text-surface-600 border border-surface-300 hover:bg-surface-50'
                }
              `}
            >
              {filter.icon && (
                <ApperIcon name={filter.icon} className="w-4 h-4 mr-1.5 inline" />
              )}
              {filter.label}
            </motion.button>
          );
        })}
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="text-sm text-surface-600">Active filters:</span>
            {activeFilters.map((filterValue) => {
              const filter = filters.find(f => f.value === filterValue);
              return (
                <motion.div
                  key={filterValue}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge 
                    variant="primary" 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {filter?.label || filterValue}
                    <button
                      onClick={() => removeFilter(filterValue)}
                      className="ml-1 hover:bg-primary-200 rounded-full p-0.5 transition-colors"
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </button>
                  </Badge>
                </motion.div>
              );
            })}
            <motion.button
              onClick={onClearAll}
              className="text-xs text-surface-500 hover:text-surface-700 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Clear all
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;