import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ProgressRing from '@/components/atoms/ProgressRing';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import { gradeService, courseService } from '@/services';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [overallGPA, setOverallGPA] = useState(0);
  const [showAddGrade, setShowAddGrade] = useState(false);

  useEffect(() => {
    const loadGradesData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [gradesData, coursesData] = await Promise.all([
          gradeService.getAll(),
          courseService.getAll()
        ]);

        setGrades(gradesData);
        setCourses(coursesData);

        // Calculate overall GPA
        const courseGrades = calculateCourseGrades(gradesData, coursesData);
        const gpa = await gradeService.calculateGPA(courseGrades);
        setOverallGPA(gpa);
      } catch (err) {
        setError(err.message || 'Failed to load grades data');
        toast.error('Failed to load grades data');
      } finally {
        setLoading(false);
      }
    };

    loadGradesData();
  }, []);

  const calculateCourseGrades = (gradesData, coursesData) => {
    const courseGradeMap = {};
    
    // Group grades by course
gradesData.forEach(grade => {
      const courseId = grade.course_id || grade.courseId;
      if (!courseGradeMap[courseId]) {
courseGradeMap[courseId] = {
          totalWeightedScore: 0,
          totalWeight: 0
        };
      }
      
const weightedScore = (grade.percentage / 100) * grade.weight;
      courseGradeMap[courseId].totalWeightedScore += weightedScore;
      courseGradeMap[courseId].totalWeight += grade.weight;
    });

    // Calculate final grades for each course
    return coursesData.map(course => {
      const gradeInfo = courseGradeMap[course.Id];
      let finalGrade = 0;
      
      if (gradeInfo && gradeInfo.totalWeight > 0) {
        finalGrade = (gradeInfo.totalWeightedScore / gradeInfo.totalWeight) * 100;
      }

      // Convert to 4.0 scale
      let gradePoints = 0;
      if (finalGrade >= 97) gradePoints = 4.0;
      else if (finalGrade >= 93) gradePoints = 3.7;
      else if (finalGrade >= 90) gradePoints = 3.3;
      else if (finalGrade >= 87) gradePoints = 3.0;
      else if (finalGrade >= 83) gradePoints = 2.7;
      else if (finalGrade >= 80) gradePoints = 2.3;
      else if (finalGrade >= 77) gradePoints = 2.0;
      else if (finalGrade >= 73) gradePoints = 1.7;
      else if (finalGrade >= 70) gradePoints = 1.3;
      else if (finalGrade >= 67) gradePoints = 1.0;
      else if (finalGrade >= 65) gradePoints = 0.7;

      return {
courseId: course.Id,
        courseName: course.Name || course.name,
        courseCode: course.code,
        credits: course.credits,
        grade: finalGrade,
        gradePoints
      };
    });
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 65) return 'D';
    return 'F';
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#10B981';
    if (percentage >= 80) return '#F59E0B';
    if (percentage >= 70) return '#EF4444';
    return '#6B7280';
  };

  const getCourse = (courseId) => {
    return courses.find(c => c.Id === courseId);
  };

  const filteredGrades = selectedCourse === 'all' 
    ? grades 
: grades.filter(g => (g.course_id || g.courseId) === parseInt(selectedCourse, 10));
  const courseGrades = calculateCourseGrades(grades, courses);

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
          title="Failed to Load Grades"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

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
              Grades & GPA
            </h1>
            <p className="text-surface-600">
              Monitor your academic performance and track your GPA.
            </p>
          </div>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setShowAddGrade(true)}
          >
            Add Grade
          </Button>
        </div>

        {/* Course Filter */}
        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium text-surface-700">Filter by course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.Id} value={course.Id}>
{course.code} - {course.Name || course.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Grades List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overall GPA Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Award" className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-display font-semibold text-surface-900">
                    Overall Performance
                  </h2>
                </div>
              </div>

              <div className="flex items-center justify-center mb-6">
                <ProgressRing
                  progress={(overallGPA / 4.0) * 100}
                  size={100}
                  strokeWidth={8}
                  color={getGradeColor((overallGPA / 4.0) * 100)}
                  showPercentage={false}
                />
                <div className="ml-8">
                  <div className="text-3xl font-bold text-surface-900">
                    {overallGPA.toFixed(2)}
                  </div>
                  <div className="text-sm text-surface-500">Cumulative GPA</div>
                  <div className="mt-2">
                    <Badge variant="primary" size="sm">
                      {getLetterGrade((overallGPA / 4.0) * 100)} Average
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Course Grades */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
              <div className="p-6 border-b border-surface-200">
                <h3 className="text-lg font-display font-semibold text-surface-900">
                  Course Grades
                </h3>
              </div>

              {courseGrades.length === 0 ? (
                <EmptyState
                  icon="Award"
                  title="No grades yet"
                  description="Start adding grades to track your academic performance."
                  actionLabel="Add Grade"
                  onAction={() => setShowAddGrade(true)}
                />
              ) : (
                <div className="divide-y divide-surface-100">
                  {courseGrades.map((courseGrade, index) => (
                    <motion.div
                      key={courseGrade.courseId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 hover:bg-surface-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-surface-900">
                              {courseGrade.courseCode}
                            </h4>
                            <Badge variant="default" size="sm">
                              {courseGrade.credits} credits
                            </Badge>
                          </div>
                          <p className="text-sm text-surface-600">
                            {courseGrade.courseName}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-surface-900">
                              {getLetterGrade(courseGrade.grade)}
                            </div>
                            <div className="text-sm text-surface-500">
                              {courseGrade.grade.toFixed(1)}%
                            </div>
                          </div>
                          
                          <ProgressRing
                            progress={courseGrade.grade}
                            size={50}
                            strokeWidth={4}
                            color={getGradeColor(courseGrade.grade)}
                            showPercentage={false}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Grade Breakdown Sidebar */}
        <div className="space-y-6">
          {/* Grade Distribution */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
              <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
                Grade Distribution
              </h3>
              
              <div className="space-y-3">
                {['A', 'B', 'C', 'D', 'F'].map((grade) => {
                  const count = courseGrades.filter(cg => {
                    const letter = getLetterGrade(cg.grade);
                    return letter.charAt(0) === grade;
                  }).length;
                  
                  const percentage = courseGrades.length > 0 ? (count / courseGrades.length) * 100 : 0;
                  
                  return (
                    <div key={grade} className="flex items-center justify-between">
                      <span className="font-medium text-surface-700">{grade}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-surface-200 rounded-full h-2">
                          <div 
                            className="h-2 bg-primary-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-surface-500 w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Semester Summary */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
              <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
                Semester Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-surface-600">Total Credits</span>
                  <span className="font-medium text-surface-900">
                    {courses.reduce((sum, course) => sum + course.credits, 0)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-surface-600">Courses</span>
                  <span className="font-medium text-surface-900">{courses.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-surface-600">Avg Grade</span>
                  <span className="font-medium text-surface-900">
                    {courseGrades.length > 0 
                      ? (courseGrades.reduce((sum, cg) => sum + cg.grade, 0) / courseGrades.length).toFixed(1)
                      : '0.0'
                    }%
                  </span>
                </div>
                
                <hr className="border-surface-200" />
                
                <div className="flex justify-between text-lg">
                  <span className="font-medium text-surface-700">Cumulative GPA</span>
                  <span className="font-bold text-primary-600">{overallGPA.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GPA Scale */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
              <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
                GPA Scale
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-600">A (90-100%)</span>
                  <span className="font-medium text-success-600">4.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">B (80-89%)</span>
                  <span className="font-medium text-info-600">3.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">C (70-79%)</span>
                  <span className="font-medium text-warning-600">2.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">D (60-69%)</span>
                  <span className="font-medium text-error-600">1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">F (0-59%)</span>
                  <span className="font-medium text-surface-500">0.0</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Grades;