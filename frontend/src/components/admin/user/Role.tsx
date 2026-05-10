import React from 'react';

interface RoleBadgeProps {
  role: 'Admin' | 'Customer' | string;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  if (role === 'Admin') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold">
        Admin
      </span>
    );
  }
  

  return (
    <span className="inline-flex items-center px-3 py-1 text-gray-400 text-xs font-bold">
      Customer
    </span>
  );
}
