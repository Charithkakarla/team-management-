// Data hook: reads shared dashboard data from the DataContext.
// It keeps the hook export separate from the provider for Fast Refresh compatibility.
import { useContext } from 'react';
import { DataContext } from '../state/DataContext';

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used inside DataProvider');
  }

  return context;
};
