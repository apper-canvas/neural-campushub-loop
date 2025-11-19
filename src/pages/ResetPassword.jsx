import React, { useEffect } from 'react';

const ResetPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showResetPassword('#authentication-reset-password');
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-surface-900">Reset Password</h1>
          <p className="text-surface-600 mt-2">Enter your new password</p>
        </div>
        <div id="authentication-reset-password"></div>
      </div>
    </div>
  );
};

export default ResetPassword;