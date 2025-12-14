'use client';

import { useState, useEffect } from 'react';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setAccentColor: (color: string) => void;
}

export function useThemeStore(): ThemeState {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const [accentColor, setAccentColorState] = useState<string>('default');

  // Helper function to apply accent color to DOM
  const applyAccentColor = (color: string) => {
    const root = document.documentElement;
    
    // Remove all existing accent classes
    root.classList.remove(
      'accent-default',
      'accent-purple',
      'accent-blue',
      'accent-green',
      'accent-red',
      'accent-orange',
      'accent-pink',
      'accent-teal',
      'accent-yellow'
    );
    
    // Add the new accent class
    root.classList.add(`accent-${color}`);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    const storedAccent = localStorage.getItem('accentColor');
    if (storedTheme) setThemeState(storedTheme);
    if (storedAccent) setAccentColorState(storedAccent);
    
    // Apply saved accent color to DOM on initialization
    if (storedAccent) {
      applyAccentColor(storedAccent);
    }
  }, []);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setAccentColor = (newColor: string) => {
    setAccentColorState(newColor);
    localStorage.setItem('accentColor', newColor);
    
    // Apply accent color to DOM
    applyAccentColor(newColor);
  };

  return {
    theme,
    accentColor,
    setTheme,
    setAccentColor,
  };
}