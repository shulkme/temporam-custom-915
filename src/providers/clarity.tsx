'use client';
import Clarity from '@microsoft/clarity';
import React, { useEffect } from 'react';

const ClarityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  useEffect(() => {
    if (typeof window !== undefined) {
      Clarity.init(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID!);
    }
  }, []);
  return <>{children}</>;
};

export default ClarityProvider;
