import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import FilterBar from '@/components/molecules/FilterBar';
import CourseCard from '@/components/molecules/CourseCard';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import { courseService } from '@/services';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const filters = [
    { label: 'Enrolled', value: 'enrolled', icon: 'Check' },
    { label: 'Available', value: 'available', icon: 'Plus' },
    { label: '3 Credits', value: '3-credits', icon: 'Hash' },
    { label: '4 Credits', value: '4-credits', icon: 'Hash' },
    { label: 'High GPA', value: 'high-gpa', icon: 'Award' }
  ];

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await courseService.getAll();
        setCourses(result);
      } catch (err) {
        setError(err.message || 'Failed to load courses');
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleDropCourse = async (course) => {
if (!window.confirm(`Are you sure you want to drop ${course.Name || course.name}?`)) {
      return;
    }

    try {
      await courseService.drop(course.Id);
      const updatedCourses = courses.map(c => 
        c.Id === course.Id ? { ...c, enrolled: false } : c
      );
      setCourses(updatedCourses);
toast.success(`Dropped ${course.Name || course.name}`);
    } catch (error) {
      toast.error('Failed to drop course');
    }
  };

  const handleEnrollCourse = async (course) => {
    try {
      await courseService.enroll(course.Id);
      const updatedCourses = courses.map(c => 
        c.Id === course.Id ? { ...c, enrolled: true } : c
      );
      setCourses(updatedCourses);
toast.success(`Enrolled in ${course.Name || course.name}`);
    } catch (error) {
      toast.error('Failed to enroll in course');
    }
  };

  const filteredCourses = courses.filter(course => {
    // Search filter
const matchesSearch = (course.Name || course.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.professor?.toLowerCase().includes(searchTerm.toLowerCase());

    // Active filters
    const matchesFilters = activeFilters.length === 0 || activeFilters.every(filter => {
      switch (filter) {
        case 'enrolled':
          return course.enrolled;
        case 'available':
          return !course.enrolled;
        case '3-credits':
          return course.credits === 3;
        case '4-credits':
          return course.credits === 4;
case 'high-gpa':
          return (course.current_grade || course.currentGrade) >= 90;
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

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
        <SkeletonLoader type="card" count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to Load Courses"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const enrolledCourses = courses.filter(c => c.enrolled);
  const availableCourses = courses.filter(c => !c.enrolled);

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
              My Courses
            </h1>
            <p className="text-surface-600">
              Manage your enrolled courses and explore new ones.
            </p>
          </div>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setShowAddModal(true)}
          >
            Add Course
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <SearchBar
            placeholder="Search courses, professors, or course codes..."
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
          />
          
          <FilterBar
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
            onClearAll={() => setActiveFilters([])}
          />
        </div>
      </motion.div>

      {/* Course Sections */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon="BookOpen"
          title="No courses found"
          description="Try adjusting your search terms or filters to find courses."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setActiveFilters([]);
          }}
        />
      ) : (
        <div className="space-y-8">
          {/* Enrolled Courses */}
          {filteredCourses.some(c => c.enrolled) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <ApperIcon name="BookOpen" className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-display font-semibold text-surface-900">
                  Enrolled Courses
                </h2>
                <span className="text-sm text-surface-500">
                  ({filteredCourses.filter(c => c.enrolled).length})
                </span>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredCourses
                    .filter(course => course.enrolled)
                    .map((course) => (
                      <motion.div
                        key={course.Id}
                        variants={itemVariants}
                        exit={{ opacity: 0, scale: 0.9 }}
                        layout
                      >
                        <CourseCard
                          course={course}
                          onDrop={handleDropCourse}
                          onEdit={(course) => console.log('Edit course:', course)}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {/* Available Courses */}
          {filteredCourses.some(c => !c.enrolled) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <ApperIcon name="Plus" className="w-5 h-5 text-accent-600" />
                <h2 className="text-xl font-display font-semibold text-surface-900">
                  Available Courses
                </h2>
                <span className="text-sm text-surface-500">
                  ({filteredCourses.filter(c => !c.enrolled).length})
                </span>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredCourses
                    .filter(course => !course.enrolled)
                    .map((course) => (
                      <motion.div
                        key={course.Id}
                        variants={itemVariants}
                        exit={{ opacity: 0, scale: 0.9 }}
                        layout
                        className="opacity-75 hover:opacity-100 transition-opacity"
                      >
                        <CourseCard
                          course={course}
                          onEdit={() => handleEnrollCourse(course)}
                          onDrop={() => {}} // Hide drop for available courses
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;