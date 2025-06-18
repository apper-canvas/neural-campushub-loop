import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import FilterBar from '@/components/molecules/FilterBar';
import AssignmentItem from '@/components/molecules/AssignmentItem';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import { assignmentService, courseService } from '@/services';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState('dueDate');

  const filters = [
    { label: 'Due Today', value: 'due-today', icon: 'Clock' },
    { label: 'Due This Week', value: 'due-week', icon: 'Calendar' },
    { label: 'High Priority', value: 'high-priority', icon: 'AlertTriangle' },
    { label: 'Completed', value: 'completed', icon: 'CheckCircle' },
    { label: 'Pending', value: 'pending', icon: 'Circle' },
    { label: 'Overdue', value: 'overdue', icon: 'AlertCircle' }
  ];

  const sortOptions = [
    { label: 'Due Date', value: 'dueDate' },
    { label: 'Priority', value: 'priority' },
    { label: 'Course', value: 'course' },
    { label: 'Status', value: 'status' }
  ];

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [assignmentsData, coursesData] = await Promise.all([
          assignmentService.getAll(),
          courseService.getAll()
        ]);

        setAssignments(assignmentsData);
        setCourses(coursesData);
      } catch (err) {
        setError(err.message || 'Failed to load assignments');
        toast.error('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  const handleToggleComplete = async (assignment) => {
    try {
      const updatedAssignment = assignment.completed 
        ? await assignmentService.markIncomplete(assignment.Id)
        : await assignmentService.markComplete(assignment.Id);

      setAssignments(prev => 
        prev.map(a => a.Id === assignment.Id ? updatedAssignment : a)
      );

      toast.success(
        assignment.completed 
          ? 'Assignment marked as incomplete' 
          : 'Assignment completed! 🎉'
      );
    } catch (error) {
      toast.error('Failed to update assignment status');
    }
  };

  const handleDeleteAssignment = async (assignment) => {
    if (!window.confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      return;
    }

    try {
      await assignmentService.delete(assignment.Id);
      setAssignments(prev => prev.filter(a => a.Id !== assignment.Id));
      toast.success('Assignment deleted');
    } catch (error) {
      toast.error('Failed to delete assignment');
    }
  };

  const getCourse = (courseId) => {
    return courses.find(c => c.Id === courseId);
  };

  const filteredAndSortedAssignments = () => {
    let filtered = assignments.filter(assignment => {
      // Search filter
      const course = getCourse(assignment.courseId);
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course?.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Active filters
      const matchesFilters = activeFilters.length === 0 || activeFilters.every(filter => {
        const dueDate = new Date(assignment.dueDate);
        const today = new Date();
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        switch (filter) {
          case 'due-today':
            return dueDate.toDateString() === today.toDateString();
          case 'due-week':
            return dueDate <= weekFromNow && dueDate >= today;
          case 'high-priority':
            return assignment.priority === 'high';
          case 'completed':
            return assignment.completed;
          case 'pending':
            return !assignment.completed;
          case 'overdue':
            return dueDate < today && !assignment.completed;
          default:
            return true;
        }
      });

      return matchesSearch && matchesFilters;
    });

    // Sort assignments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'course':
          const courseA = getCourse(a.courseId)?.code || '';
          const courseB = getCourse(b.courseId)?.code || '';
          return courseA.localeCompare(courseB);
        case 'status':
          return a.completed - b.completed;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredAssignments = filteredAndSortedAssignments();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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
        <SkeletonLoader type="list" count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to Load Assignments"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.completed).length;
  const overdueAssignments = assignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    return dueDate < new Date() && !a.completed;
  }).length;

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
              Assignments
            </h1>
            <p className="text-surface-600">
              Track your assignments and stay on top of deadlines.
            </p>
          </div>
          <Button
            variant="primary"
            icon="Plus"
          >
            Add Assignment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-surface-200 p-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="FileText" className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-surface-600">Total</p>
                <p className="text-xl font-bold text-surface-900">{totalAssignments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-surface-200 p-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-success-600" />
              <div>
                <p className="text-sm text-surface-600">Completed</p>
                <p className="text-xl font-bold text-success-600">{completedAssignments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-surface-200 p-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="Circle" className="w-5 h-5 text-warning-600" />
              <div>
                <p className="text-sm text-surface-600">Pending</p>
                <p className="text-xl font-bold text-warning-600">
                  {totalAssignments - completedAssignments}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-surface-200 p-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="AlertCircle" className="w-5 h-5 text-error-600" />
              <div>
                <p className="text-sm text-surface-600">Overdue</p>
                <p className="text-xl font-bold text-error-600">{overdueAssignments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filters, and Sort */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search assignments, courses..."
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm('')}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-surface-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <FilterBar
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
            onClearAll={() => setActiveFilters([])}
          />
        </div>
      </motion.div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          icon="FileText"
          title="No assignments found"
          description="Try adjusting your search terms or filters to find assignments."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setActiveFilters([]);
          }}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-surface-600">
              Showing {filteredAssignments.length} of {totalAssignments} assignments
            </p>
          </div>

          <AnimatePresence>
            {filteredAssignments.map((assignment) => (
              <motion.div
                key={assignment.Id}
                variants={itemVariants}
                exit={{ opacity: 0, x: -20 }}
                layout
              >
                <AssignmentItem
                  assignment={assignment}
                  course={getCourse(assignment.courseId)}
                  onToggleComplete={handleToggleComplete}
                  onEdit={(assignment) => console.log('Edit assignment:', assignment)}
                  onDelete={handleDeleteAssignment}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Assignments;