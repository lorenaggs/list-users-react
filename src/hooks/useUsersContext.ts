import { useContext } from 'react';
import { UsersContext } from '../context/UsersContext';

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsersContext must be used within UsersProvider');
  }
  return context;
};

