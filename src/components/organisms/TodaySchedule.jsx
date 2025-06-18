import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import ScheduleBlock from '@/components/molecules/ScheduleBlock';
import { scheduleService, courseService } from '@/services';

const TodaySchedule = ({ className = '' }) => {
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodaySchedule = async () => {
      try {
        const today = format(new Date(), 'EEEE'); // Get day name (Monday, Tuesday, etc.)
        const [schedulesData, coursesData] = await Promise.all([
          scheduleService.getByDay(today),
          courseService.getAll()
        ]);

        // Sort by start time
        const sortedSchedules = schedulesData.sort((a, b) => {
          return a.startTime.localeCompare(b.startTime);
        });

        setSchedules(sortedSchedules);
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to load today schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTodaySchedule();
  }, []);

  const getCourse = (courseId) => {
    return courses.find(c => c.Id === courseId);
  };

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

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 ${className}`}>
        <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
          Today's Schedule
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-surface-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 ${className}`}>
        <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
          Today's Schedule
        </h3>
        <div className="text-center py-8">
          <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-600">No classes scheduled for today</p>
          <p className="text-sm text-surface-500 mt-1">Enjoy your free day!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <ApperIcon name="Calendar" className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-display font-semibold text-surface-900">
          Today's Schedule
        </h3>
        <span className="text-sm text-surface-500">
          {format(new Date(), 'EEEE, MMM d')}
        </span>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {schedules.map((schedule, index) => {
          const course = getCourse(schedule.courseId);
          return (
            <motion.div key={schedule.Id} variants={itemVariants}>
              <ScheduleBlock
                schedule={schedule}
                course={course}
                className="hover:shadow-md transition-shadow duration-200"
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TodaySchedule;