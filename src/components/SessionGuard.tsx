'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoaderPage from '../UI/loaders/LoaderPage';

export const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && !token) {
      router.replace('/auth/login'); 
    }
  }, [user, isLoading, router, token]);

  if (isLoading) return <LoaderPage/>

  return <>{children}</>;
};