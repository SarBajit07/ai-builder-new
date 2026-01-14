use client";

import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      window.addEventListener('storage', handleStorageChange);
    }
  }, []);

  const toggleDarkMode = () => {
    localStorage.setItem('dark-mode', isDarkMode ? 'false' : 'true');
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, [isDarkMode]);

  const handleStorageChange = () => {
    setIsDarkMode(localStorage.getItem('dark-mode') === 'true');
  };

  return { isDarkMode, toggleDarkMode };
};

export default useDarkMode;