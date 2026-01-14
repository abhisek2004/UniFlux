import React from 'react';

interface SkeletonCardProps {
  className?: string;
  height?: string;
  width?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  className = '', 
  height = 'h-32',
  width = 'w-full'
}) => {
  return (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ${height} ${width} ${className}`}>
      <div className="p-4 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        <div>
          <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;