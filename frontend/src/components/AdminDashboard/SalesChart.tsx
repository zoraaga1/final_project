import React from 'react';

interface SalesData {
  month: string;
  sales: number;
}

interface SalesChartProps {
  data: SalesData[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  // Find max sales for scaling
  const maxSales = Math.max(...data.map(item => item.sales), 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Overview</h2>
      <div className="h-64 flex items-end space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
              style={{ 
                height: maxSales ? `${(item.sales / maxSales) * 100}%` : '0%',
                minHeight: '2px'
              }}
            ></div>
            <span className="text-xs text-gray-500 mt-2">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesChart;