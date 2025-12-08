// Grid layout for content boxes
import { ReactNode } from 'react';

interface ContentGridProps {
  children: ReactNode;
}

export default function ContentGrid({ children }: ContentGridProps) {
  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
      {children}
    </div>
  );
}

