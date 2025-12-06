// Main content area component
'use client';

import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className="container mx-auto py-8 px-4">
      {children}
    </main>
  );
}

