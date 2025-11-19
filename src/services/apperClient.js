let _client = null;
let _isInitializing = false;

class ApperClientSingleton {
  constructor() {
    if (_client) {
      return _client;
    }
    this._initialize();
  }

  _initialize() {
    if (_isInitializing) {
      return;
    }
    
    _isInitializing = true;
    
    try {
      if (!window.ApperSDK) {
        console.error('ApperSDK not loaded');
        return null;
      }
      
      const { ApperClient } = window.ApperSDK;
      this.client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      _client = this;
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
    } finally {
      _isInitializing = false;
    }
  }

  getInstance() {
    return this.client;
  }

  reset() {
    _client = null;
    _isInitializing = false;
  }
}

export const getApperClient = () => {
  if (!window.ApperSDK) {
    return null;
  }
  const singleton = new ApperClientSingleton();
  return singleton.getInstance();
};