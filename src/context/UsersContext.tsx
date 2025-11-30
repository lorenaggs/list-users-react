import { useState, useCallback, type ReactNode } from 'react';
import type { UserModel } from '../models/usersModels';
import type { UserFormModel } from '../models/userForm';
import { getUser } from '../api/apiUsers';
import { storageService } from '../services/storageService';
import { userService } from '../services/userService';
import Swal from 'sweetalert2';
import { UsersContext, type UsersContextType } from './UsersContext';

interface UsersProviderProps {
  children: ReactNode;
}

export const UsersProvider = ({ children }: UsersProviderProps) => {
  const [users, setUsers] = useState<UserModel[]>(() => {
    return storageService.getUsers();
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const usersResponse = await getUser();
      const transformedUsers = userService.transformUsersFromAPI(usersResponse);
      setUsers(transformedUsers);
      storageService.saveUsers(transformedUsers);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error fetching users:', errorMessage);
      
      const usersFromStorage = storageService.getUsers();
      if (usersFromStorage.length > 0) {
        setUsers(usersFromStorage);
        Swal.fire({
          icon: 'warning',
          title: 'Modo sin conexión',
          text: 'No se pudo conectar al servicio. Se están mostrando los datos guardados localmente.',
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        setError('No se pudieron cargar los usuarios');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los usuarios. Por favor, verifica tu conexión e intenta de nuevo.',
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback((userData: UserFormModel) => {
    const newUser = userService.createUser(users, userData);
    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    storageService.saveUsers(updatedUsers);
    
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: `Usuario ${userData.name} creado correctamente`,
      timer: 2000,
      showConfirmButton: false
    });
  }, [users]);

  const updateUser = useCallback((id: number, userData: UserFormModel) => {
    const updatedUsers = userService.updateUser(users, id, userData);
    setUsers(updatedUsers);
    storageService.saveUsers(updatedUsers);
    
    Swal.fire({
      icon: 'success',
      title: '¡Actualizado!',
      text: `Usuario ${userData.name} actualizado correctamente`,
      timer: 2000,
      showConfirmButton: false
    });
  }, [users]);

  const deleteUser = useCallback((id: number) => {
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar al usuario ${userToDelete.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUsers = userService.deleteUser(users, id);
        setUsers(updatedUsers);
        storageService.saveUsers(updatedUsers);
        
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: `El usuario ${userToDelete.name} ha sido eliminado.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }, [users]);

  const deleteUsers = useCallback((ids: number[]) => {
    if (ids.length === 0) return;

    const selectedNames = users
      .filter(u => ids.includes(u.id))
      .map(u => u.name)
      .join(', ');

    Swal.fire({
      title: '¿Estás seguro?',
      html: `¿Quieres eliminar ${ids.length} ${ids.length === 1 ? 'usuario' : 'usuarios'}?<br><small>${selectedNames}</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Sí, eliminar ${ids.length} ${ids.length === 1 ? 'usuario' : 'usuarios'}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUsers = userService.deleteUsers(users, ids);
        setUsers(updatedUsers);
        storageService.saveUsers(updatedUsers);
        
        Swal.fire({
          icon: 'success',
          title: '¡Eliminados!',
          text: `${ids.length} ${ids.length === 1 ? 'usuario ha sido' : 'usuarios han sido'} eliminados.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }, [users]);

  const deleteAllUsers = useCallback(async () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará todos los usuarios y recargará los datos del API',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar y recargar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        storageService.clearUsers();
        setUsers([]);
        await refreshUsers();
        
        Swal.fire({
          icon: 'success',
          title: '¡Completado!',
          text: 'Todos los usuarios han sido eliminados y se han recargado los datos del API.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }, [refreshUsers]);

  const value: UsersContextType = {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    deleteUsers,
    deleteAllUsers,
    refreshUsers,
    setUsers
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

