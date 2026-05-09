import React from 'react';

interface ReviewStatusProps {
  status: 'Active' | 'Suspended' | 'Banned' | string;
}

export default function ReviewStatus({ status }: ReviewStatusProps) {
  const styles: Record<string, string> = {
    Active: 'bg-green-100 text-green-600',
    Suspended: 'bg-red-50 text-red-500',
    Banned: 'bg-gray-200 text-gray-600',
  };

  const dotColors: Record<string, string> = {
    Active: 'bg-green-500',
    Suspended: 'bg-red-500',
    Banned: 'bg-gray-500',
  };

  const currentStyle = styles[status] || styles.Banned;
  const currentDot = dotColors[status] || dotColors.Banned;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${currentStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${currentDot}`}></span>
      {status}
    </span>
  );
}