import { useEffect, useState, useCallback } from "react";
import type { UserModel } from "../models/usersModels"
import { getUser } from "../api/apiUsers";
import { CustomForm } from "../shared/form";
import type { UserFormModel } from "../models/userForm";
import { Header } from "../shared/header.tsx";
import type { ItemForm } from "../models/itemForm.ts";
import { Loading } from "../shared/loading.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faPlus, faUser, faTrash } from "@fortawesome/free-solid-svg-icons";
import { OptionsGender } from "../models/optionsGender.ts";
import { OptionsStatus } from "../models/optionsStatus.ts";
import Swal from 'sweetalert2';

const initialValues: UserFormModel = {
    email: '',
    name: '',
    gender: '',
    status: ''
}

const initialValuesForm: ItemForm[] = [
    {name: "name", label: "Nombre", placeholder: 'Ingrese el nombre', typeInput: 'text'},
    {name: "email", label: "Email", placeholder: 'Ingrese el email', typeInput: 'text'},
    {
        name: "gender",
        label: "Género",
        placeholder: 'Seleccione una opción',
        genders: [OptionsGender.hombre, OptionsGender.mujer],
        typeInput: 'select'
    },
    {
        name: "status",
        label: "Estado",
        placeholder: 'Seleccione una opción',
        status: [OptionsStatus.activo, OptionsStatus.inactivo],
        typeInput: 'select'
    },
]

export const Users = () => {

    const [user, setUser] = useState<UserModel[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState<UserFormModel | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

    // Estado REAL que usa el formulario
    const [formValues, setFormValues] = useState<UserFormModel>(initialValues);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // Siempre consultar el servicio primero
                const usersResponse = await getUser();

                const users = usersResponse.map((user: UserModel) => ({
                    ...user,
                    gender: user.gender === 'male' ? 'hombre' : 'mujer',
                    status: user.status === 'active' ? 'activo' : 'inactivo'
                }));

                setUser(users);
                localStorage.setItem('users', JSON.stringify(users));
            } catch (error) {
                // Si falla el servicio, intentar cargar desde localStorage como respaldo
                const usersFromStorage = localStorage.getItem('users');
                
                if (usersFromStorage) {
                    setUser(JSON.parse(usersFromStorage));
                    Swal.fire({
                        icon: 'warning',
                        title: 'Modo sin conexión',
                        text: 'No se pudo conectar al servicio. Se están mostrando los datos guardados localmente.',
                        timer: 3000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron cargar los usuarios. Por favor, verifica tu conexión e intenta de nuevo.',
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Cuando se edita un usuario → cargar valores
    useEffect(() => {
        if (editUser) {
            setFormValues(editUser);
            setShowForm(true);
        } else {
            setFormValues(initialValues);
        }
    }, [editUser]);

    const handleCreateUser = useCallback((values: UserFormModel) => {
        const maxId = user.length > 0 ? Math.max(...user.map(u => u.id)) : 0;
        const newUser: UserModel = {
            id: maxId + 1,
            ...values
        };

        const listUser = [newUser, ...user];
        localStorage.setItem('users', JSON.stringify(listUser));
        setUser(listUser);
        setShowForm(false);
        setEditUser(null);
        setSelectedUsers(new Set());
        
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: `Usuario ${values.name} creado correctamente`,
            timer: 2000,
            showConfirmButton: false
        });
    }, [user]);

    const deleteItem = useCallback((id: number, userClicked: UserModel) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres eliminar al usuario ${userClicked.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const listUser = user.filter((u: UserModel) => u.id !== id);
                localStorage.setItem('users', JSON.stringify(listUser));
                setUser(listUser);
                const newSelected = new Set(selectedUsers);
                newSelected.delete(id);
                setSelectedUsers(newSelected);
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: `El usuario ${userClicked.name} ha sido eliminado.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    }, [user, selectedUsers]);

    const editUserItem = (id: number) => {
        const userToEdit = user.find(user => user.id === id);

        if (userToEdit) {
            setEditUser({
                name: userToEdit.name,
                email: userToEdit.email,
                gender: userToEdit.gender,
                status: userToEdit.status
            });
        }
    };

    const getCurrentUserEmail = () => {
        return editUser?.email || '';
    };

    // Abrir formulario limpio al crear
    const openCreateForm = () => {
        setEditUser(null);
        setFormValues(initialValues);
        setShowForm(true);
    };

    const handleUpdateUser = useCallback((values: UserFormModel) => {
        const updatedList = user.map(u =>
            u.email === editUser?.email ? { ...u, ...values } : u
        );

        localStorage.setItem('users', JSON.stringify(updatedList));
        setUser(updatedList);
        setShowForm(false);
        setEditUser(null);
        setSelectedUsers(new Set());
        
        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: `Usuario ${values.name} actualizado correctamente`,
            timer: 2000,
            showConfirmButton: false
        });
    }, [user, editUser]);


    const getStatusBadgeClass = (status: string) => {
        return status === 'activo'
            ? 'bg-green-100 text-green-800 border-green-300'
            : 'bg-red-100 text-red-800 border-red-300';
    };

    // Manejo de selección
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(new Set(user.map(u => u.id)));
        } else {
            setSelectedUsers(new Set());
        }
    };

    const handleSelectUser = (userId: number, checked: boolean) => {
        const newSelected = new Set(selectedUsers);
        if (checked) {
            newSelected.add(userId);
        } else {
            newSelected.delete(userId);
        }
        setSelectedUsers(newSelected);
    };

    const isAllSelected = user.length > 0 && selectedUsers.size === user.length;
    const isIndeterminate = selectedUsers.size > 0 && selectedUsers.size < user.length;

    // Eliminar usuarios seleccionados
    const deleteSelectedUsers = useCallback(() => {
        if (selectedUsers.size === 0) return;

        const selectedCount = selectedUsers.size;
        const selectedNames = user
            .filter(u => selectedUsers.has(u.id))
            .map(u => u.name)
            .join(', ');

        Swal.fire({
            title: '¿Estás seguro?',
            html: `¿Quieres eliminar ${selectedCount} ${selectedCount === 1 ? 'usuario' : 'usuarios'}?<br><small>${selectedNames}</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Sí, eliminar ${selectedCount} ${selectedCount === 1 ? 'usuario' : 'usuarios'}`,
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const listUser = user.filter((u: UserModel) => !selectedUsers.has(u.id));
                localStorage.setItem('users', JSON.stringify(listUser));
                setUser(listUser);
                setSelectedUsers(new Set());
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminados!',
                    text: `${selectedCount} ${selectedCount === 1 ? 'usuario ha sido' : 'usuarios han sido'} eliminados.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    }, [selectedUsers, user]);


    const handleLogout = () => {
        localStorage.clear();
        setUser([]);
    }

    return (
        <div className="min-h-screen pb-12">
            <Loading loading={loading} />
            <Header
            logout={() => handleLogout()}
            />

            <div className="container mx-auto px-8 sm:px-10 lg:px-12 py-8 sm:py-10 lg:py-12 max-w-8xl">
                <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 mb-10 fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-md">
                                <FontAwesomeIcon icon={faUser} className="text-green-600 text-3xl" />
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 uppercase">Lista de Usuarios</h1>
                                <span className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-full text-base font-medium">
                                    {user.length} {user.length === 1 ? 'usuario' : 'usuarios'}
                                </span>
                            </div>
                        </div>

                        <button
                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-10 py-5 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 transform hover:-translate-y-1 w-full sm:w-auto justify-center"
                            onClick={openCreateForm}
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-xl" />
                            Nuevo Usuario
                        </button>
                    </div>

                    {user.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <FontAwesomeIcon icon={faUser} className="text-gray-300 text-7xl mb-8" />
                            <p className="text-gray-500 text-xl mb-8">No hay usuarios registrados</p>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-10 py-4 text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                                onClick={openCreateForm}
                            >
                                Crear primer usuario
                            </button>
                        </div>
                    ) : (
                        <>
                            {selectedUsers.size > 0 && (
                                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-red-700 font-semibold text-lg">
                                            {selectedUsers.size} {selectedUsers.size === 1 ? 'usuario seleccionado' : 'usuarios seleccionados'}
                                        </span>
                                    </div>
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                                        onClick={deleteSelectedUsers}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                        Eliminar Seleccionados
                                    </button>
                                </div>
                            )}
                            <div className="overflow-x-auto scrollbar-thin -mx-4 px-4">
                                <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-md">
                                    <thead className="bg-gradient-to-r from-green-600 to-green-500">
                                        <tr>
                                            <th className="px-6 py-3 text-center text-white font-semibold uppercase text-base tracking-wider w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    ref={(input) => {
                                                        if (input) input.indeterminate = isIndeterminate;
                                                    }}
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                    className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-white font-semibold uppercase text-base tracking-wider">
                                                Nombre
                                            </th>
                                            <th className="px-6 py-3 text-left text-white font-semibold uppercase text-base tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-white font-semibold uppercase text-base tracking-wider">
                                                Género
                                            </th>
                                            <th className="px-6 py-3 text-left text-white font-semibold uppercase text-base tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-center text-white font-semibold uppercase text-base tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {user.map((userItem) => (
                                            <tr
                                                key={userItem.id}
                                                className={`table-row border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                                    selectedUsers.has(userItem.id) ? 'bg-blue-50' : ''
                                                }`}
                                            >
                                                <td className="px-6 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.has(userItem.id)}
                                                        onChange={(e) => handleSelectUser(userItem.id, e.target.checked)}
                                                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-6 py-3 text-gray-800 font-medium text-base">
                                                    {userItem.name}
                                                </td>
                                                <td className="px-6 py-3 text-gray-600 text-base">
                                                    {userItem.email}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className="inline-block px-5 py-2.5 rounded-full text-base font-medium bg-blue-100 text-blue-800 capitalize">
                                                        {userItem.gender}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className={`inline-block px-5 py-2.5 rounded-full text-base font-medium border capitalize ${getStatusBadgeClass(userItem.status)}`}>
                                                        {userItem.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className="flex justify-center items-center gap-5">
                                                        <button
                                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                                            onClick={() => editUserItem(userItem.id)}
                                                            title="Editar usuario"
                                                        >
                                                            <FontAwesomeIcon icon={faPenToSquare} className="text-xl" />
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                                            onClick={() => deleteItem(userItem.id, userItem)}
                                                            title="Eliminar usuario"
                                                        >
                                                            <FontAwesomeIcon icon={faTrashCan} className="text-xl" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showForm && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowForm(false);
                            setEditUser(null);
                        }
                    }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto slide-in relative">
                        <button
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl font-bold w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10"
                            onClick={() => {
                                setShowForm(false);
                                setEditUser(null);
                            }}
                            aria-label="Cerrar"
                        >
                            ×
                        </button>

                        <div className="p-10 lg:p-12">
                            <CustomForm
                                initialValues={formValues}
                                fields={initialValuesForm}
                                onSubmit={(values: UserFormModel) =>
                                    editUser ? handleUpdateUser(values) : handleCreateUser(values)
                                }
                                onCancel={() => {
                                    setShowForm(false);
                                    setEditUser(null);
                                }}
                                existingUsers={user}
                                isEditMode={Boolean(editUser)}
                                currentUserEmail={getCurrentUserEmail()}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
