import React from 'react';

interface Genre {
  genre: string;
}

export default function GenreBadge({ genre }: Genre) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-[11px] font-semibold mr-1 mb-1">
      {genre}
    </span>
  );
}