'use client';
import { UserRecord } from '@/api/user/types';
import { delToken } from '@/utils/token';
import React, { createContext, useContext, useState } from 'react';

const IdentityContext = createContext<{
  user?: UserRecord;
  setUser: React.Dispatch<React.SetStateAction<UserRecord | undefined>>;
  logout: () => void;
} | null>(null);

const IdentityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<UserRecord>();

  const logout = () => {
    setUser(undefined);
    delToken();
  };

  return (
    <IdentityContext.Provider
      value={{
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
};

const useIdentity = () => {
  const context = useContext(IdentityContext);
  if (!context) {
    throw new Error('useIdentity must be within an IdentityProvider');
  }
  return context;
};

export { IdentityProvider, useIdentity };
