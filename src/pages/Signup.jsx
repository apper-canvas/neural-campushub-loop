import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/layouts/Root';
import { useSelector } from 'react-redux';

const Signup = () => {
  const navigate = useNavigate();
  const { isInitialized } = useAuth();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (isInitialized) {
      if (user) {
        navigate('/');
        return;
      }
      
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSignup("#authentication");
    }
  }, [isInitialized, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">C</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-surface-900">Join CampusHub</h1>
          <p className="text-surface-600 mt-2">Create your account to get started</p>
        </div>
        
        <div id="authentication"></div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-surface-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;