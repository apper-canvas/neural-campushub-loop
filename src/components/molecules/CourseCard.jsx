import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import ProgressRing from '@/components/atoms/ProgressRing';

const CourseCard = ({ course, onEdit, onDrop, className = '' }) => {
  const cardHover = { scale: 1.02, y: -2 };
  const cardTap = { scale: 0.98 };

  const getGradeColor = (grade) => {
    if (grade >= 90) return '#10B981';
    if (grade >= 80) return '#F59E0B';
    if (grade >= 70) return '#EF4444';
    return '#6B7280';
  };

  return (
    <motion.div
      whileHover={cardHover}
      whileTap={cardTap}
      className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 transition-all duration-200 ${className}`}
      style={{ borderLeftColor: course.color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" size="sm">{course.code}</Badge>
            <span className="text-xs text-surface-500">{course.credits} credits</span>
          </div>
          <h3 className="font-display font-semibold text-surface-900 text-lg mb-1 truncate">
            {course.name}
          </h3>
          <p className="text-sm text-surface-600 flex items-center gap-1">
            <ApperIcon name="User" className="w-4 h-4" />
            {course.professor}
          </p>
        </div>
        
        <div className="flex-shrink-0 ml-4">
          <ProgressRing 
            progress={course.currentGrade || 0}
            size={50}
            color={getGradeColor(course.currentGrade || 0)}
            strokeWidth={3}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-surface-600 mb-4">
        <div className="flex items-center gap-1">
          <ApperIcon name="MapPin" className="w-4 h-4" />
          <span>{course.room}</span>
        </div>
        <div className="flex items-center gap-1">
          <ApperIcon name="Calendar" className="w-4 h-4" />
          <span>{course.semester}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {course.enrolled && (
            <Badge variant="success" size="sm">Enrolled</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit?.(course)}
            className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDrop?.(course)}
            className="p-2 text-surface-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;