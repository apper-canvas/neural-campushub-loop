import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 3, className = '' }) => {
  const skeletonTypes = {
    card: () => (
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 bg-surface-200 rounded w-16"></div>
              <div className="h-4 bg-surface-200 rounded w-20"></div>
            </div>
            <div className="h-6 bg-surface-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-1/2"></div>
          </div>
          <div className="w-12 h-12 bg-surface-200 rounded-full"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-surface-200 rounded w-1/3"></div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-surface-200 rounded"></div>
            <div className="w-8 h-8 bg-surface-200 rounded"></div>
          </div>
        </div>
      </div>
    ),
    
    list: () => (
      <div className="bg-white rounded-lg border border-surface-200 p-4 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="w-5 h-5 bg-surface-200 rounded"></div>
          <div className="flex-1">
            <div className="h-5 bg-surface-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    ),

    stat: () => (
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-surface-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-surface-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-surface-200 rounded w-1/3"></div>
          </div>
          <div className="w-12 h-12 bg-surface-200 rounded-lg"></div>
        </div>
      </div>
    ),

    table: () => (
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden animate-pulse">
        <div className="p-4 border-b border-surface-200">
          <div className="h-6 bg-surface-200 rounded w-1/4"></div>
        </div>
        <div className="divide-y divide-surface-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-surface-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-surface-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  };

  const renderSkeleton = skeletonTypes[type] || skeletonTypes.card;

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;