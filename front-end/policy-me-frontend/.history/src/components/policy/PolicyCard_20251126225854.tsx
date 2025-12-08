// PolicyCard component - displays policy information

import React from 'react';

export default function PolicyCard({ user }: { user?: { firstName?: string } }) {
  return (
    <div>
      {user?.firstName ?? 'No name available'}
    </div>
  );
}