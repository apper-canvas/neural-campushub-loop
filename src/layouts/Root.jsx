import React, { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setInitialized } from '@/store/userSlice';
import { verifyRouteAccess, getRouteConfig } from '@/router/route.utils';

// Create auth context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContext.Provider');
  }
  return context;
};

const Root = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [urlParams] = useSearchParams();
  const [authInitialized, setAuthInitialized] = useState(false);
  
  const { user, isAuthenticated, isInitialized } = useSelector((state) => state.user);

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!window.ApperSDK) {
          console.error('ApperSDK not loaded');
          return;
        }

        const { ApperClient, ApperUI } = window.ApperSDK;
        
        const client = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        ApperUI.setup(client, {
          target: '#authentication',
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: 'both',
          onSuccess: function (user) {
            setAuthInitialized(true);
            dispatch(setInitialized(true));
            
            if (user) {
              dispatch(setUser(JSON.parse(JSON.stringify(user))));
              handleNavigation(user);
            } else {
              dispatch(clearUser());
              handleNavigation(null);
            }
          },
          onError: function(error) {
            console.error("Authentication failed:", error);
            setAuthInitialized(true);
            dispatch(setInitialized(true));
            dispatch(clearUser());
          }
        });
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setAuthInitialized(true);
        dispatch(setInitialized(true));
      }
    };

    initializeAuth();
  }, []);

  // Handle navigation after auth state change
  const handleNavigation = (authenticatedUser) => {
    const redirectPath = urlParams.get("redirect");
    const authPages = ["/login", "/signup", "/callback"];
    const isOnAuthPage = authPages.some(page => location.pathname.includes(page));
    
    if (redirectPath) {
      navigate(redirectPath);
    } else if (isOnAuthPage) {
      navigate("/");
    }
    // Otherwise stay on current page
  };

  // Route guard effect
  useEffect(() => {
    if (!isInitialized) return;
    
    const config = getRouteConfig(location.pathname);
    const accessCheck = verifyRouteAccess(config, user);
    
    if (!accessCheck.allowed && accessCheck.redirectTo) {
      const redirectUrl = accessCheck.excludeRedirectQuery 
        ? accessCheck.redirectTo
        : `${accessCheck.redirectTo}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
      
      navigate(redirectUrl);
    }
  }, [isInitialized, user, location.pathname, location.search, navigate]);

  // Authentication methods
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Show loading until auth is initialized
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export default Root;