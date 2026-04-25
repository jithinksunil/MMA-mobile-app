import React, { createContext, useContext } from 'react';

import { useProgress, type UseProgressReturn } from '../hooks/useProgress';

const ProgressContext = createContext<UseProgressReturn | null>(null);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const progress = useProgress();
  return <ProgressContext.Provider value={progress}>{children}</ProgressContext.Provider>;
};

export function useProgressContext(): UseProgressReturn {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgressContext must be used within ProgressProvider');
  }
  return ctx;
}
