import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { getRouteConfig } from './route.utils';
import Root from '@/layouts/Root';

// Lazy load components
const Dashboard = lazy(() => import('@/components/pages/Dashboard'));
const Courses = lazy(() => import('@/components/pages/Courses'));
const Schedule = lazy(() => import('@/components/pages/Schedule'));
const Assignments = lazy(() => import('@/components/pages/Assignments'));
const Grades = lazy(() => import('@/components/pages/Grades'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const Callback = lazy(() => import('@/pages/Callback'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const PromptPassword = lazy(() => import('@/pages/PromptPassword'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Layout = lazy(() => import('@/Layout'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>
);

// createRoute helper
const createRoute = ({ path, index, element, access, children, ...meta }) => {
  const configPath = index ? "/" : (path?.startsWith('/') ? path : `/${path}`);
  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;
  
  return {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingSpinner />}>{element}</Suspense> : element,
    handle: { access: finalAccess, ...meta },
    ...(children && { children })
  };
};

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      // Auth pages (public)
      createRoute({
        path: 'login',
        element: <Login />,
        title: 'Login'
      }),
      createRoute({
        path: 'signup',
        element: <Signup />,
        title: 'Sign Up'
      }),
      createRoute({
        path: 'callback',
        element: <Callback />,
        title: 'Authentication Callback'
      }),
      createRoute({
        path: 'error',
        element: <ErrorPage />,
        title: 'Error'
      }),
      createRoute({
        path: 'reset-password/:appId/:fields',
        element: <ResetPassword />,
        title: 'Reset Password'
      }),
      createRoute({
        path: 'prompt-password/:appId/:emailAddress/:provider',
        element: <PromptPassword />,
        title: 'Prompt Password'
      }),
      
      // Main app layout with protected routes
      {
        path: '/',
        element: <Layout />,
        children: [
          createRoute({
            index: true,
            element: <Dashboard />,
            title: 'Dashboard'
          }),
          createRoute({
            path: 'courses',
            element: <Courses />,
            title: 'Courses'
          }),
          createRoute({
            path: 'schedule',
            element: <Schedule />,
            title: 'Schedule'
          }),
          createRoute({
            path: 'assignments',
            element: <Assignments />,
            title: 'Assignments'
          }),
          createRoute({
            path: 'grades',
            element: <Grades />,
            title: 'Grades'
          })
        ]
      },
      
      // 404 catch-all
      createRoute({
        path: '*',
        element: <NotFound />,
        title: 'Not Found'
      })
    ]
  }
]);