import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="text-center">
        <ApperIcon name="FileX" className="w-24 h-24 text-surface-300 mx-auto mb-6" />
        <h1 className="text-4xl font-display font-bold text-surface-900 mb-2">404</h1>
        <p className="text-xl text-surface-600 mb-2">Page Not Found</p>
        <p className="text-surface-500 mb-8">The page you're looking for doesn't exist.</p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={() => navigate('/')}>
            Go Home
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;