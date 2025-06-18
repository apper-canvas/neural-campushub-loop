import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import WeeklyCalendar from '@/components/organisms/WeeklyCalendar';
import TodaySchedule from '@/components/organisms/TodaySchedule';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { scheduleService, courseService } from '@/services';

const Schedule = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'today'
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadScheduleData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [schedulesData, coursesData] = await Promise.all([
          scheduleService.getAll(),
          courseService.getAll()
        ]);

        setSchedules(schedulesData);
        setCourses(coursesData);
      } catch (err) {
        setError(err.message || 'Failed to load schedule data');
      } finally {
        setLoading(false);
      }
    };

    loadScheduleData();
  }, []);

  const navigateWeek = (direction) => {
    if (direction === 'prev') {
      setCurrentWeek(subWeeks(currentWeek, 1));
    } else {
      setCurrentWeek(addWeeks(currentWeek, 1));
    }
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
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
      <div className="p-6 max-w-full overflow-hidden">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-2 animate-pulse"></div>
          <div className="h-5 bg-surface-100 rounded w-1/3 animate-pulse"></div>
        </div>
        <SkeletonLoader type="table" count={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to Load Schedule"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const totalClasses = schedules.length;
  const enrolledCourses = courses.filter(c => c.enrolled).length;

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
              My Schedule
            </h1>
            <p className="text-surface-600">
              View your class schedule and manage your time effectively.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-surface-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('today')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'today'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'week'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                Week
              </button>
            </div>

            <Button variant="primary" icon="Plus">
              Add Class
            </Button>
          </div>
        </div>

        {/* Week Navigation (only show in week view) */}
        {viewMode === 'week' && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-surface-200 p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                icon="ChevronLeft"
                onClick={() => navigateWeek('prev')}
                className="p-2"
              />
              
              <div className="text-center">
                <h3 className="font-display font-semibold text-surface-900">
                  {format(weekStart, 'MMMM d, yyyy')}
                </h3>
                <p className="text-sm text-surface-600">
                  Week of {format(weekStart, 'MMM d')}
                </p>
              </div>

              <Button
                variant="ghost"
                icon="ChevronRight"
                onClick={() => navigateWeek('next')}
                className="p-2"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-surface-900">
                  {enrolledCourses} Courses
                </p>
                <p className="text-xs text-surface-500">
                  {totalClasses} Classes/Week
                </p>
              </div>
              
              <Button
                variant="secondary"
                onClick={goToCurrentWeek}
                className="text-sm"
              >
                Today
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Schedule Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {viewMode === 'today' ? (
          <motion.div variants={itemVariants}>
            <TodaySchedule />
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <WeeklyCalendar currentWeek={currentWeek} />
          </motion.div>
        )}

        {/* Schedule Summary */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="BookOpen" className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-surface-900">Enrolled Courses</h3>
                  <p className="text-2xl font-bold text-primary-600">{enrolledCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Clock" className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-medium text-surface-900">Classes per Week</h3>
                  <p className="text-2xl font-bold text-accent-600">{totalClasses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Calendar" className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <h3 className="font-medium text-surface-900">This Week</h3>
                  <p className="text-2xl font-bold text-success-600">
{schedules.filter(s => {
                      const today = format(new Date(), 'EEEE');
                      return (s.day_of_week || s.dayOfWeek) === today;
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Schedule;