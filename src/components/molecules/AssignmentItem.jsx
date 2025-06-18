import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const AssignmentItem = ({ assignment, course, onToggleComplete, onEdit, onDelete, className = '' }) => {
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date() && !assignment.completed;
  const isDueSoon = dueDate < new Date(Date.now() + 24 * 60 * 60 * 1000) && !assignment.completed;

  const checkboxVariants = {
    checked: { scale: 1.1, backgroundColor: '#10B981' },
    unchecked: { scale: 1, backgroundColor: 'transparent' }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Clock';
      case 'low': return 'Minus';
      default: return 'Minus';
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`bg-white rounded-lg border border-surface-200 p-4 hover:shadow-md transition-all duration-200 ${
        assignment.completed ? 'opacity-75' : ''
      } ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <motion.button
          onClick={() => onToggleComplete?.(assignment)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 mt-0.5 ${
            assignment.completed
              ? 'bg-success-500 border-success-500'
              : 'border-surface-300 hover:border-primary-500'
          }`}
          variants={checkboxVariants}
          animate={assignment.completed ? 'checked' : 'unchecked'}
        >
          {assignment.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <ApperIcon name="Check" className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium ${assignment.completed ? 'line-through text-surface-500' : 'text-surface-900'}`}>
                {assignment.title}
              </h4>
              {course && (
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                  <span className="text-sm text-surface-600">{course.code}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Badge variant={assignment.priority} size="sm">
                <ApperIcon name={getPriorityIcon(assignment.priority)} className="w-3 h-3 mr-1" />
                {assignment.priority}
              </Badge>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Calendar" className="w-4 h-4 text-surface-400" />
            <span className={`text-sm ${
              isOverdue 
                ? 'text-error-600 font-medium' 
                : isDueSoon 
                  ? 'text-warning-600 font-medium'
                  : 'text-surface-600'
            }`}>
              Due {format(dueDate, 'MMM d, yyyy')} at {format(dueDate, 'h:mm a')}
              {isOverdue && ' (Overdue)'}
              {isDueSoon && !isOverdue && ' (Due Soon)'}
            </span>
          </div>

          {/* Grade */}
          {assignment.grade !== null && assignment.grade !== undefined && (
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Award" className="w-4 h-4 text-surface-400" />
              <span className="text-sm font-medium text-success-600">
                Grade: {assignment.grade}%
              </span>
            </div>
          )}

          {/* Notes */}
          {assignment.notes && (
            <p className="text-sm text-surface-600 bg-surface-50 rounded-md p-2 mb-2">
              {assignment.notes}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit?.(assignment)}
              className="text-xs text-surface-500 hover:text-primary-600 transition-colors"
            >
              Edit
            </button>
            <span className="text-surface-300">•</span>
            <button
              onClick={() => onDelete?.(assignment)}
              className="text-xs text-surface-500 hover:text-error-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssignmentItem;