import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: string;
}

export const StatCard = ({ title, value, icon, trend, trendColor }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
        <h2 className="text-2xl font-black text-gray-800 mt-1">{value}</h2>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg text-blue-600">
        {icon}
      </div>
    </div>
    {trend && (
      <div className={`text-xs font-bold ${trendColor || 'text-green-500'} flex items-center gap-1`}>
        {trend}
      </div>
    )}
  </div>
);