// Reusable content box component
import { ReactNode } from 'react';

interface ContentBoxProps {
  title: string;
  children: ReactNode;
}

export default function ContentBox({ title, children }: ContentBoxProps) {
  return (
    <div className="border border-border rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[400px] flex flex-col">
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

