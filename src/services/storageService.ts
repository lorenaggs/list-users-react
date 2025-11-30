import type { UserModel } from "../models/usersModels";
import { STORAGE_KEYS } from "../constants";

export const storageService = {
  getUsers: (): UserModel[] => {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!users) return [];
      
      const parsedUsers = JSON.parse(users);
      return Array.isArray(parsedUsers) ? parsedUsers : [];
    } catch (error) {
      console.error('Error reading users from storage:', error);
      return [];
    }
  },

  saveUsers: (users: UserModel[]): void => {
    try {
      if (!Array.isArray(users)) {
        console.error('Invalid users data: expected array');
        return;
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  },

  clearUsers: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USERS);
    } catch (error) {
      console.error('Error clearing users from storage:', error);
    }
  },

  clearAll: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};

