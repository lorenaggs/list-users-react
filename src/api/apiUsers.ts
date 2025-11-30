import type { UserModel } from "../models/usersModels";
import { API_URL } from "../constants";

export const getUser = async (): Promise<UserModel[]> => {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error al obtener usuarios: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};
