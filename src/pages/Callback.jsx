import React, { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showSSOVerify("#authentication-callback");
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div id="authentication-callback"></div>
    </div>
  );
};

export default Callback;