'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Default to dark

  useEffect(() => {
    // This effect runs on the client after mount to sync with localStorage or initial default
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } else {
      // If no stored theme, ensure 'dark' is set (matches initial state and <html> class)
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  useEffect(() => {
    // This effect reacts to theme changes by the toggle
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className='text-foreground hover:text-primary'
    >
      {theme === 'dark' ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
    </Button>
  );
}
