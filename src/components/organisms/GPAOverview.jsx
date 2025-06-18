import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/atoms/ProgressRing';
import { gradeService, courseService } from '@/services';

const GPAOverview = ({ className = '' }) => {
  const [gpa, setGpa] = useState(0);
  const [courseGrades, setCourseGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGPAData = async () => {
      try {
        const [gradesData, coursesData] = await Promise.all([
          gradeService.getAll(),
          courseService.getAll()
        ]);

        // Calculate GPA for each course
        const courseGradeMap = {};
        gradesData.forEach(grade => {
          if (!courseGradeMap[grade.courseId]) {
            courseGradeMap[grade.courseId] = {
              totalWeightedScore: 0,
              totalWeight: 0
            };
          }
          
          const weightedScore = (grade.percentage / 100) * grade.weight;
          courseGradeMap[grade.courseId].totalWeightedScore += weightedScore;
          courseGradeMap[grade.courseId].totalWeight += grade.weight;
        });

        // Calculate final grades and GPA
        const courseGradesList = coursesData.map(course => {
          const gradeInfo = courseGradeMap[course.Id];
          let finalGrade = 0;
          
          if (gradeInfo && gradeInfo.totalWeight > 0) {
            finalGrade = (gradeInfo.totalWeightedScore / gradeInfo.totalWeight) * 100;
          }

          // Convert percentage to GPA scale (4.0)
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
            course: course.name,
            code: course.code,
            credits: course.credits,
            grade: finalGrade,
            gradePoints,
            color: course.color
          };
        });

        // Calculate overall GPA
        const totalPoints = courseGradesList.reduce((sum, course) => sum + (course.gradePoints * course.credits), 0);
        const totalCredits = courseGradesList.reduce((sum, course) => sum + course.credits, 0);
        const calculatedGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

        setGpa(calculatedGPA);
        setCourseGrades(courseGradesList);
      } catch (error) {
        console.error('Failed to load GPA data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGPAData();
  }, []);

  const getGPAColor = (gpa) => {
    if (gpa >= 3.5) return '#10B981';
    if (gpa >= 3.0) return '#F59E0B';
    if (gpa >= 2.5) return '#EF4444';
    return '#6B7280';
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

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 ${className}`}>
        <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
          GPA Overview
        </h3>
        <div className="animate-pulse">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-surface-200 rounded-full"></div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-surface-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-surface-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <ApperIcon name="Award" className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-display font-semibold text-surface-900">
          GPA Overview
        </h3>
      </div>

      {/* Overall GPA */}
      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <ProgressRing
            progress={(gpa / 4.0) * 100}
            size={80}
            strokeWidth={6}
            color={getGPAColor(gpa)}
            showPercentage={false}
            className="mb-3"
          />
          <div className="text-2xl font-bold text-surface-900">
            {gpa.toFixed(2)}
          </div>
          <div className="text-sm text-surface-500">
            Current GPA
          </div>
        </div>
      </div>

      {/* Course Breakdown */}
      <div className="space-y-3">
        <h4 className="font-medium text-surface-700 text-sm">Course Breakdown</h4>
        {courseGrades.map((course, index) => (
          <motion.div
            key={course.code}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: course.color }}
              />
              <div>
                <p className="font-medium text-surface-900 text-sm">
                  {course.code}
                </p>
                <p className="text-xs text-surface-600">
                  {course.credits} credits
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-surface-900">
                {getLetterGrade(course.grade)}
              </p>
              <p className="text-xs text-surface-600">
                {course.grade.toFixed(1)}%
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* GPA Scale Reference */}
      <div className="mt-6 p-3 bg-surface-50 rounded-lg">
        <p className="text-xs text-surface-600 mb-2">GPA Scale</p>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="font-medium text-success-600">A</div>
            <div className="text-surface-500">4.0</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-info-600">B</div>
            <div className="text-surface-500">3.0</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-warning-600">C</div>
            <div className="text-surface-500">2.0</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-error-600">D</div>
            <div className="text-surface-500">1.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPAOverview;