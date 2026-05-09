import React from 'react';

interface TransactionStatusProps {
  status: 'Completed' | 'Pending' | 'Cancelled' | string;
}

export default function TransactionStatus({ status }: TransactionStatusProps) {
  // จับคู่สีตาม UI (Completed=เขียว, Pending=ฟ้า, Cancelled=แดง)
  const styles: Record<string, string> = {
    Completed: 'bg-green-100 text-green-600',
    Pending: 'bg-blue-100 text-blue-600',
    Cancelled: 'bg-red-100 text-red-500',
  };

  const currentStyle = styles[status] || 'bg-gray-100 text-gray-600';

  return (
    // สังเกตว่าเราเอา <span className="w-1.5 h-1.5..."> ที่เป็นจุดวงกลมออกไปแล้ว
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${currentStyle}`}>
      {status}
    </span>
  );
}