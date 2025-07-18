'use client';

import { Bottombar } from '@/components/Bottombar';
import { Navbar } from '@/components/Navbar';
import { UserProvider } from '@/contexts/UserContext';
import { JSX, useEffect } from 'react';

export default function Layout({ children }: { children: JSX.Element }) {
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <UserProvider>
      <Navbar />
      {children}
      <Bottombar />
    </UserProvider>
  );
}
