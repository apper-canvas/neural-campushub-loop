import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import QuickActions from '@/components/organisms/QuickActions';
import UpcomingAssignments from '@/components/organisms/UpcomingAssignments';
import TodaySchedule from '@/components/organisms/TodaySchedule';
import GPAOverview from '@/components/organisms/GPAOverview';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { courseService, assignmentService } from '@/services';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    upcomingDeadlines: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [coursesData, assignmentsData] = await Promise.all([
          courseService.getAll(),
          assignmentService.getAll()
        ]);

        const enrolledCourses = coursesData.filter(c => c.enrolled);
        const completedAssignments = assignmentsData.filter(a => a.completed);
        const upcomingDeadlines = assignmentsData.filter(a => {
          const dueDate = new Date(a.dueDate);
          const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          return !a.completed && dueDate <= weekFromNow;
        });

        setStats({
          totalCourses: enrolledCourses.length,
          totalAssignments: assignmentsData.length,
          completedAssignments: completedAssignments.length,
          upcomingDeadlines: upcomingDeadlines.length
        });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

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
          <div className="h-8 bg-surface-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-5 bg-surface-100 rounded w-1/2 animate-pulse"></div>
        </div>
        <SkeletonLoader type="stat" count={4} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonLoader type="card" count={2} className="lg:col-span-2" />
          <SkeletonLoader type="card" count={1} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Dashboard Error"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const completionRate = stats.totalAssignments > 0 
    ? (stats.completedAssignments / stats.totalAssignments) * 100 
    : 0;

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
          Welcome back, John! 👋
        </h1>
        <p className="text-surface-600">
          Here's what's happening with your academic progress today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Enrolled Courses"
            value={stats.totalCourses}
            subtitle="This semester"
            icon="BookOpen"
            color="primary"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Assignments"
            value={stats.totalAssignments}
            subtitle={`${stats.completedAssignments} completed`}
            icon="FileText"
            color="info"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Completion Rate"
            value={`${Math.round(completionRate)}%`}
            subtitle="Assignments done"
            icon="CheckCircle"
            color="success"
            trend={completionRate >= 80 ? { type: 'positive', value: 'On track' } : { type: 'negative', value: 'Needs attention' }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Upcoming Deadlines"
            value={stats.upcomingDeadlines}
            subtitle="Next 7 days"
            icon="Clock"
            color={stats.upcomingDeadlines > 5 ? 'warning' : 'accent'}
          />
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <QuickActions />
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column - Assignments and Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants}>
            <UpcomingAssignments />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <TodaySchedule />
          </motion.div>
        </div>

        {/* Right Column - GPA Overview */}
        <motion.div variants={itemVariants}>
          <GPAOverview />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;