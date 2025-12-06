// Container for search bar
'use client';

import { ReactNode } from 'react';

interface SearchContainerProps {
  children: ReactNode;
}

export default function SearchContainer({ children }: SearchContainerProps) {
  return (
    <div className="max-w-3xl mx-auto mb-8">
      {children}
    </div>
  );
}

