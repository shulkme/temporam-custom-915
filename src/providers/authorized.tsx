'use client';
import { getUserProfile } from '@/api/user';
import GlobalLoading from '@/components/global-loading';
import { useIdentity } from '@/providers/identity';
import { useRequest } from 'ahooks';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthorizedContext = createContext<{
  loading: boolean;
} | null>(null);

const AuthorizedProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { setUser } = useIdentity();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const { run } = useRequest(getUserProfile, {
    manual: true,
    onSuccess: (res) => {
      setUser(res.data);
      setLoading(false);
    },
    onError: () => {
      setUser(undefined);
      router.replace('/login');
    },
  });

  useEffect(() => {
    if (!pathname.startsWith('/login') && !pathname.startsWith('/signup')) {
      run();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
      setLoading(false);
    }
  }, [pathname]);

  if (loading) return <GlobalLoading />;

  return (
    <AuthorizedContext.Provider
      value={{
        loading,
      }}
    >
      {children}
    </AuthorizedContext.Provider>
  );
};

const useAuthorized = () => {
  const context = useContext(AuthorizedContext);
  if (!context) {
    throw new Error('useAuthorized must be used within an AuthorizedProvider');
  }
  return context;
};

export { AuthorizedProvider, useAuthorized };
