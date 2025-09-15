import { cn } from '@/utils/classname';
import React from 'react';

type Size = 'small' | 'medium' | 'large';

interface Props {
  size?: Size;
  children?: React.ReactNode;
  title?: React.ReactNode;
}

const sizeMaps: Record<Size, string> = {
  small: 'max-w-4xl',
  medium: 'max-w-6xl',
  large: 'max-w-7xl',
};

const PageContainer: React.FC<Props> = ({ size, children, title }) => {
  return (
    <div
      className={cn(
        'w-full mx-auto px-4 md:px-6 lg:px-8',
        size && sizeMaps[size],
      )}
    >
      <div className="pt-4 md:pt-6 lg:pt-8">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="py-4 md:py-6 lg:py-8">{children}</div>
    </div>
  );
};

export default PageContainer;
