import Dashboard from '@/components/pages/Dashboard';
import Courses from '@/components/pages/Courses';
import Schedule from '@/components/pages/Schedule';
import Assignments from '@/components/pages/Assignments';
import Grades from '@/components/pages/Grades';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  courses: {
    id: 'courses',
    label: 'Courses',
    path: '/courses',
    icon: 'BookOpen',
    component: Courses
  },
  schedule: {
    id: 'schedule',
    label: 'Schedule',
    path: '/schedule',
    icon: 'Calendar',
    component: Schedule
  },
  assignments: {
    id: 'assignments',
    label: 'Assignments',
    path: '/assignments',
    icon: 'FileText',
    component: Assignments
  },
  grades: {
    id: 'grades',
    label: 'Grades',
    path: '/grades',
    icon: 'Award',
    component: Grades
  }
};

export const routeArray = Object.values(routes);
export default routes;