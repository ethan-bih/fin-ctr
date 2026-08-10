'use client';

import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  color?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', color, size = 20 }) => {
  // @ts-expect-error Lucide dynamic lookup
  const IconComponent = Icons[name] || Icons.CircleDollarSign;
  return <IconComponent className={className} style={color ? { color } : undefined} size={size} />;
};
