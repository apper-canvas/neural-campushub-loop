import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import ScheduleBlock from '@/components/molecules/ScheduleBlock';
import { scheduleService, courseService } from '@/services';

const WeeklyCalendar = ({ className = '' }) => {
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        const [schedulesData, coursesData] = await Promise.all([
          scheduleService.getAll(),
          courseService.getAll()
        ]);

        setSchedules(schedulesData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to load schedule data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadScheduleData();
  }, []);

  const getCourse = (courseId) => {
    return courses.find(c => c.Id === courseId);
  };

  const getSchedulesForDay = (dayName) => {
    return schedules.filter(s => s.dayOfWeek === dayName);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    });
  };

  const isCurrentDay = (dayName) => {
    const today = format(new Date(), 'EEEE');
    return today === dayName;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 ${className}`}>
        <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
          Weekly Schedule
        </h3>
        <div className="animate-pulse">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 bg-surface-200 rounded"></div>
                <div className="h-20 bg-surface-100 rounded"></div>
                <div className="h-20 bg-surface-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden ${className}`}>
      <div className="p-6 border-b border-surface-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="Calendar" className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-display font-semibold text-surface-900">
              Weekly Schedule
            </h3>
          </div>
          <div className="text-sm text-surface-600">
            {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d')} - {format(addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), 4), 'MMM d, yyyy')}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-6 border-b border-surface-200">
            <div className="p-3 text-sm font-medium text-surface-500">
              Time
            </div>
            {daysOfWeek.map((day) => (
              <div 
                key={day}
                className={`p-3 text-sm font-medium text-center ${
                  isCurrentDay(day) 
                    ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
                    : 'text-surface-500'
                }`}
              >
                {day}
                <div className="text-xs text-surface-400 mt-1">
                  {format(addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), daysOfWeek.indexOf(day)), 'MMM d')}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {timeSlots.map((timeSlot, timeIndex) => (
            <div key={timeSlot} className="grid grid-cols-6 border-b border-surface-100">
              <div className="p-3 text-sm text-surface-500 bg-surface-50">
                {formatTime(timeSlot)}
              </div>
              {daysOfWeek.map((day) => {
                const daySchedules = getSchedulesForDay(day);
                const scheduleAtTime = daySchedules.find(s => 
                  s.startTime <= timeSlot && s.endTime > timeSlot
                );

                return (
                  <div 
                    key={`${day}-${timeSlot}`}
                    className={`p-2 min-h-[60px] ${
                      isCurrentDay(day) ? 'bg-primary-25' : ''
                    }`}
                  >
                    {scheduleAtTime && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: timeIndex * 0.05 }}
                      >
                        <ScheduleBlock
                          schedule={scheduleAtTime}
                          course={getCourse(scheduleAtTime.courseId)}
                          className="h-full text-xs"
                        />
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Empty state for no classes */}
      {schedules.length === 0 && (
        <div className="p-8 text-center">
          <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-600">No classes scheduled</p>
          <p className="text-sm text-surface-500 mt-1">
            Add courses to see your weekly schedule
          </p>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;