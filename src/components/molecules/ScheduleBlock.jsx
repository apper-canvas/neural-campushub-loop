import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ScheduleBlock = ({ schedule, course, className = '' }) => {
  const blockHover = { scale: 1.02 };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <motion.div
      whileHover={blockHover}
      className={`rounded-lg p-3 border-l-4 bg-white shadow-sm border-surface-200 ${className}`}
      style={{ borderLeftColor: course?.color || '#6B7280' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-surface-900 truncate mb-1">
            {course?.name || 'Unknown Course'}
          </h4>
          <p className="text-sm text-surface-600 mb-1">
            {course?.code} • {course?.professor}
          </p>
          <div className="flex items-center gap-1 text-xs text-surface-500">
            <ApperIcon name="Clock" className="w-3 h-3" />
            <span>
              {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-surface-500 mt-1">
            <ApperIcon name="MapPin" className="w-3 h-3" />
            <span>{schedule.room}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleBlock;