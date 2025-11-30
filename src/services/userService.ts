import type { UserModel } from "../models/usersModels";
import type { UserFormModel } from "../models/userForm";
import { GENDER_MAP, STATUS_MAP } from "../constants";

export const userService = {
  transformUserFromAPI: (user: UserModel): UserModel => {
    return {
      ...user,
      gender: user.gender === 'male' ? GENDER_MAP.male : GENDER_MAP.female,
      status: user.status === 'active' ? STATUS_MAP.active : STATUS_MAP.inactive
    };
  },

  transformUsersFromAPI: (users: UserModel[]): UserModel[] => {
    return users.map(user => userService.transformUserFromAPI(user));
  },

  createUser: (users: UserModel[], userData: UserFormModel): UserModel => {
    const maxId = users.length > 0 
      ? Math.max(...users.map(u => u.id)) 
      : 0;
    return {
      id: maxId + 1,
      ...userData
    };
  },

  updateUser: (users: UserModel[], userId: number, userData: UserFormModel): UserModel[] => {
    return users.map(user =>
      user.id === userId ? { ...user, ...userData } : user
    );
  },

  deleteUser: (users: UserModel[], userId: number): UserModel[] => {
    return users.filter(user => user.id !== userId);
  },

  deleteUsers: (users: UserModel[], userIds: number[]): UserModel[] => {
    return users.filter(user => !userIds.includes(user.id));
  }
};

