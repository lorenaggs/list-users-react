import { createContext } from 'react';
import type { UserFormModel } from '../models/userForm';
import type { UserModel } from '../models/usersModels';

export interface UsersContextType {
  users: UserModel[];
  loading: boolean;
  error: string | null;
  createUser: (user: UserFormModel) => void;
  updateUser: (id: number, user: UserFormModel) => void;
  deleteUser: (id: number) => void;
  deleteUsers: (ids: number[]) => void;
  deleteAllUsers: () => void;
  refreshUsers: () => Promise<void>;
  setUsers: (users: UserModel[]) => void;
}

export const UsersContext = createContext<UsersContextType | undefined>(undefined);

