import React from "react";

type StatusType = "active" | "banned" | "suspended";

interface StatusBadgeProps {
  status: StatusType | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-600",
    banned: "bg-gray-200 text-gray-600",
    suspended: "bg-red-50 text-red-500",
  };

  const dotColors: Record<string, string> = {
    active: "bg-green-500",
    banned: "bg-gray-500",
    suspended: "bg-red-500",
  };

  const currentStyle = styles[status] || styles.banned;
  const currentDot = dotColors[status] || dotColors.banned;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${currentStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${currentDot}`}></span>
      {status}
    </span>
  );
}
