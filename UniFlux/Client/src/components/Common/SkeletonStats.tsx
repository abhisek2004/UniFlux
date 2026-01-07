import React from 'react';

interface SkeletonStatsProps {
  count?: number;
  className?: string;
  columns?: number;
}

const SkeletonStats: React.FC<SkeletonStatsProps> = ({ 
  count = 4, 
  className = '',
  columns = 4 
}) => {
  const gridClass = `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4 ${className}`;

  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
              <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonStats;