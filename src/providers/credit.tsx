'use client';
import { getUserCredits } from '@/api/user';
import { useRequest } from 'ahooks';
import React, { createContext, useContext, useState } from 'react';

const CreditContext = createContext<{
  available: number;
  loading: boolean;
  refresh: () => void;
} | null>(null);

const CreditProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [available, setAvailable] = useState<number>(0);

  const { refresh, loading } = useRequest(getUserCredits, {
    onSuccess: (res) => {
      setAvailable(res.data || 0);
    },
  });

  return (
    <CreditContext.Provider
      value={{
        available,
        refresh,
        loading,
      }}
    >
      {children}
    </CreditContext.Provider>
  );
};

const useCredit = () => {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCredit must be used within a CreditProvider');
  }
  return context;
};

export { CreditProvider, useCredit };
