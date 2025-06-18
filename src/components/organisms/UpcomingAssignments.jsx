import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { assignmentService, courseService } from '@/services';

const UpcomingAssignments = ({ limit = 5, className = '' }) => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [assignmentsData, coursesData] = await Promise.all([
          assignmentService.getAll(),
          courseService.getAll()
        ]);

        // Filter upcoming assignments and sort by due date
        const upcoming = assignmentsData
          .filter(a => !a.completed && new Date(a.dueDate) > new Date())
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, limit);

        setAssignments(upcoming);
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to load upcoming assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [limit]);

  const getCourse = (courseId) => {
    return courses.find(c => c.Id === courseId);
  };

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 ${className}`}>
        <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
          Upcoming Assignments
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-surface-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 ${className}`}>
        <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
          Upcoming Assignments
        </h3>
        <div className="text-center py-8">
          <ApperIcon name="CheckCircle" className="w-12 h-12 text-success-400 mx-auto mb-3" />
          <p className="text-surface-600">All caught up! No upcoming assignments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold text-surface-900">
          Upcoming Assignments
        </h3>
        <Badge variant="primary" size="sm">
          {assignments.length}
        </Badge>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {assignments.map((assignment) => {
          const course = getCourse(assignment.courseId);
          const dueDate = new Date(assignment.dueDate);
          const isUrgent = dueDate < new Date(Date.now() + 24 * 60 * 60 * 1000);

          return (
            <motion.div
              key={assignment.Id}
              variants={itemVariants}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                isUrgent ? 'border-warning-200 bg-warning-50' : 'border-surface-200 bg-surface-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {course && (
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                    )}
                    <span className="text-xs font-medium text-surface-600">
                      {course?.code || 'Unknown Course'}
                    </span>
                    <Badge variant={assignment.priority} size="sm">
                      {assignment.priority}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-surface-900 truncate mb-1">
                    {assignment.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-surface-600">
                    <span className={isUrgent ? 'text-warning-700 font-medium' : ''}>
                      {getDateLabel(dueDate)} at {format(dueDate, 'h:mm a')}
                    </span>
                    {isUrgent && (
                      <div className="flex items-center gap-1 text-warning-700">
                        <ApperIcon name="Clock" className="w-3 h-3" />
                        <span>Due Soon</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default UpcomingAssignments;