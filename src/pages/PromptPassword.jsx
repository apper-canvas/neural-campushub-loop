import React, { useEffect } from 'react';

const PromptPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showPromptPassword('#authentication-prompt-password');
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-surface-900">Set Password</h1>
          <p className="text-surface-600 mt-2">Please set your account password</p>
        </div>
        <div id="authentication-prompt-password"></div>
      </div>
    </div>
  );
};

export default PromptPassword;