'use client';

import { Navbar } from '@/components/Navbar';
import { JSX, useEffect, useState } from 'react';

export default function Layout({ children }: { children: JSX.Element }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDarkMode) {
      console.log('El usuario prefiere modo oscuro');
    } else {
      console.log('El usuario prefiere modo claro');
    }
  }, []);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Navbar />
      {children}
    </div>
  );
}
