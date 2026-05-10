interface ReviewStatusProps {
  status: 'Published' | 'Hidden' | 'Removed' | string;
}

export default function ReviewStatus({ status }: ReviewStatusProps) {
  // สี + dot ของแต่ละ status
  // Published = เขียว (active), Hidden = เหลือง (warning), Removed = แดง (banned)
  const styles: Record<string, string> = {
    Published: 'bg-green-100 text-green-600',
    Hidden: 'bg-yellow-50 text-yellow-600',
    Removed: 'bg-red-50 text-red-500',
  };

  const dotColors: Record<string, string> = {
    Published: 'bg-green-500',
    Hidden: 'bg-yellow-500',
    Removed: 'bg-red-500',
  };

  const currentStyle = styles[status] || 'bg-gray-200 text-gray-600';
  const currentDot = dotColors[status] || 'bg-gray-500';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${currentStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${currentDot}`}></span>
      {status}
    </span>
  );
}
