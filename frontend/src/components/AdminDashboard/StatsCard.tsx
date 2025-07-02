import React from 'react';
import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  color: string;
  change: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change 
}) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`text-3xl ${color}`}>
          <Icon />
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-gray-500 text-sm ml-2">from last month</span>
      </div>
    </div>
  );
};

export default StatsCard;