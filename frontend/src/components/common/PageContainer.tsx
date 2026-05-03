import type { ReactNode } from 'react';

interface PageContainerProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function PageContainer({ title, description, children }: PageContainerProps) {
  return (
    <div className="max-w-7xl mx-auto">
      {title && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && (
            <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
          )}
        </div>
      )}
      <div className="content">
        {children}
      </div>
    </div>
  );
}
