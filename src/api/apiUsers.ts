import type { UserModel } from "../models/usersModels";
export const getUser = async (): Promise<UserModel[]> => {
    const response = await fetch('https://gorest.co.in/public/v2/users ');
    return response.json();
};


