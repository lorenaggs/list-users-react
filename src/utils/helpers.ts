import type { UserModel } from "../models/usersModels";

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const searchUsers = (users: UserModel[], query: string): UserModel[] => {
  if (!query.trim()) return users;

  const lowerQuery = query.toLowerCase();
  return users.filter(
    user =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
  );
};

export const filterUsers = (
  users: UserModel[],
  filters: { gender?: string; status?: string }
): UserModel[] => {
  return users.filter(user => {
    if (filters.gender && user.gender !== filters.gender) return false;
    if (filters.status && user.status !== filters.status) return false;
    return true;
  });
};

export const sortUsers = (
  users: UserModel[],
  sortBy: keyof UserModel,
  order: 'asc' | 'desc' = 'asc'
): UserModel[] => {
  const sortedUsers = [...users];
  
  return sortedUsers.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const paginateUsers = (
  users: UserModel[],
  page: number,
  itemsPerPage: number
): { paginatedUsers: UserModel[]; totalPages: number } => {
  if (itemsPerPage <= 0) {
    return { paginatedUsers: users, totalPages: 1 };
  }

  const totalPages = Math.max(1, Math.ceil(users.length / itemsPerPage));
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return { paginatedUsers, totalPages };
};

