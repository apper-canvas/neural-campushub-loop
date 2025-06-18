import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuickActions = ({ className = '' }) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add Assignment',
      icon: 'Plus',
      action: () => navigate('/assignments'),
      color: 'primary'
    },
    {
      label: 'View Schedule',
      icon: 'Calendar',
      action: () => navigate('/schedule'),
      color: 'secondary'
    },
    {
      label: 'Check Grades',
      icon: 'Award',
      action: () => navigate('/grades'),
      color: 'accent'
    },
    {
      label: 'Browse Courses',
      icon: 'BookOpen',
      action: () => navigate('/courses'),
      color: 'ghost'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 ${className}`}>
      <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
        Quick Actions
      </h3>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {actions.map((action, index) => (
          <motion.div key={action.label} variants={itemVariants}>
            <Button
              variant={action.color}
              onClick={action.action}
              className="w-full flex-col h-20 text-xs"
              icon={action.icon}
            >
              <span className="mt-1">{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default QuickActions;