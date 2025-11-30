import { useEffect, useState, useCallback, useMemo } from "react";
import type { UserModel } from "../models/usersModels";
import { CustomForm } from "../shared/form";
import type { UserFormModel } from "../models/userForm";
import { Header } from "../shared/header.tsx";
import { Loading } from "../shared/loading.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faPlus, faUser, faTrash, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useUsersContext } from "../hooks/useUsersContext";
import { SearchBar } from "./SearchBar";
import { Filters } from "./Filters";
import { Pagination } from "./Pagination";
import { searchUsers, filterUsers, sortUsers, paginateUsers } from "../utils/helpers";
import { PAGINATION } from "../constants";
import { initialFormValues, formFields } from "../constants/formConfig";

type SortField = keyof UserModel;
type SortOrder = 'asc' | 'desc';

export const ListUsers = () => {
    const {
        users,
        loading,
        createUser,
        updateUser,
        deleteUser,
        deleteUsers,
        deleteAllUsers,
        refreshUsers
    } = useUsersContext();

    const [showForm, setShowForm] = useState<boolean>(false);
    const [editUser, setEditUser] = useState<UserFormModel | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
    const [formValues, setFormValues] = useState<UserFormModel>(initialFormValues);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterGender, setFilterGender] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');

    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const [currentPage, setCurrentPage] = useState<number>(PAGINATION.DEFAULT_PAGE);

    const currentFilterKey = useMemo(() => {
        return `${searchQuery}-${filterGender}-${filterStatus}`;
    }, [searchQuery, filterGender, filterStatus]);

    const [lastFilterKey, setLastFilterKey] = useState<string>(currentFilterKey);

    const resetFilters = useCallback(() => {
        setSearchQuery('');
        setFilterGender('');
        setFilterStatus('');
        setLastFilterKey('');
        setCurrentPage(PAGINATION.DEFAULT_PAGE);
        setSortField(null);
        setSortOrder('asc');
        setSelectedUsers(new Set());
    }, []);

    useEffect(() => {
        const initializeData = async () => {
            await refreshUsers();
        };
        initializeData();
    }, [refreshUsers]);

    const filters = useMemo(() => ({
        gender: filterGender || undefined,
        status: filterStatus || undefined
    }), [filterGender, filterStatus]);

    const effectivePage = useMemo(() => {
        if (lastFilterKey !== currentFilterKey) {
            return PAGINATION.DEFAULT_PAGE;
        }
        return currentPage;
    }, [lastFilterKey, currentFilterKey, currentPage]);

    const handlePageChange = useCallback((page: number) => {
        setLastFilterKey(currentFilterKey);
        setCurrentPage(page);
    }, [currentFilterKey]);

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
        setLastFilterKey('');
    }, []);

    const handleGenderChange = useCallback((gender: string) => {
        setFilterGender(gender);
        setLastFilterKey('');
    }, []);

    const handleStatusChange = useCallback((status: string) => {
        setFilterStatus(status);
        setLastFilterKey('');
    }, []);

    const processedUsers = useCallback(() => {
        let result = [...users];

        if (searchQuery) {
            result = searchUsers(result, searchQuery);
        }

        if (filters.gender || filters.status) {
            result = filterUsers(result, filters);
        }

        if (sortField) {
            result = sortUsers(result, sortField, sortOrder);
        }

        const { paginatedUsers, totalPages } = paginateUsers(result, effectivePage, PAGINATION.ITEMS_PER_PAGE);

        return { paginatedUsers, totalPages, totalResults: result.length };
    }, [users, searchQuery, filters, sortField, sortOrder, effectivePage]);

    const { paginatedUsers, totalPages, totalResults } = processedUsers();

    const handleCreateUser = useCallback((values: UserFormModel) => {
        createUser(values);
        setShowForm(false);
        setEditUser(null);
        setFormValues(initialFormValues);
        setSelectedUsers(new Set());
    }, [createUser]);

    const handleUpdateUser = useCallback((values: UserFormModel) => {
        if (!editUser) return;
        
        const userToUpdate = users.find(u => u.email === editUser.email);
        if (!userToUpdate) {
            console.error('Usuario no encontrado para actualizar');
            return;
        }
        
        updateUser(userToUpdate.id, values);
        setShowForm(false);
        setEditUser(null);
        setFormValues(initialFormValues);
        setSelectedUsers(new Set());
    }, [editUser, users, updateUser]);

    const editUserItem = useCallback((id: number) => {
        const userToEdit = users.find(user => user.id === id);
        if (!userToEdit) {
            console.error(`Usuario con id ${id} no encontrado`);
            return;
        }
        
        const userFormData: UserFormModel = {
            name: userToEdit.name,
            email: userToEdit.email,
            gender: userToEdit.gender,
            status: userToEdit.status
        };
        
        setEditUser(userFormData);
        setFormValues(userFormData);
        setShowForm(true);
    }, [users]);

    const openCreateForm = useCallback(() => {
        setEditUser(null);
        setFormValues(initialFormValues);
        setShowForm(true);
    }, []);

    const getStatusBadgeStyle = useCallback((status: string): React.CSSProperties => {
        return status === 'activo'
            ? { backgroundColor: 'var(--status-active-bg)', color: 'var(--status-active-text)', borderColor: 'var(--status-active-bg)' }
            : { backgroundColor: 'var(--status-inactive-bg)', color: 'var(--status-inactive-text)', borderColor: 'var(--status-inactive-bg)' };
    }, []);

    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            setSelectedUsers(new Set(paginatedUsers.map(u => u.id)));
        } else {
            setSelectedUsers(new Set());
        }
    }, [paginatedUsers]);

    const handleSelectUser = useCallback((userId: number, checked: boolean) => {
        setSelectedUsers(prev => {
            const newSelected = new Set(prev);
            if (checked) {
                newSelected.add(userId);
            } else {
                newSelected.delete(userId);
            }
            return newSelected;
        });
    }, []);

    const isAllSelected = paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUsers.has(u.id));
    const isIndeterminate = selectedUsers.size > 0 && !isAllSelected;

    const handleDeleteSelected = () => {
        if (selectedUsers.size === 0) return;
        deleteUsers(Array.from(selectedUsers));
        setSelectedUsers(new Set());
    };

    const handleSort = useCallback((field: SortField) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    }, [sortField]);

    const getSortIcon = useCallback((field: SortField) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? faArrowUp : faArrowDown;
        }
        return faArrowUp; // Icono por defecto cuando no está ordenado
    }, [sortField, sortOrder]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleRefreshUsers = useCallback(async () => {
        resetFilters();
        deleteAllUsers();
    }, [deleteAllUsers, resetFilters]);

    return (
        <div className="min-h-screen pb-12">
            <Loading loading={loading} />
            <Header
                logout={handleLogout}
                onRefresh={handleRefreshUsers}
            />

            <div className="container mx-auto px-8 sm:px-10 lg:px-12 py-8 sm:py-10 lg:py-12 max-w-8xl">
                <div className="rounded-2xl shadow-xl p-8 lg:p-10 mb-10 fade-in" style={{ backgroundColor: 'var(--bg-card)' }}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: 'var(--badge-green-bg)' }}>
                                <FontAwesomeIcon icon={faUser} className="text-3xl" style={{ color: 'var(--badge-green-text)' }} />
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <h1 className="text-4xl lg:text-5xl font-bold uppercase" style={{ color: 'var(--text-primary)' }}>Lista de Usuarios</h1>
                                <span className="px-5 py-2.5 rounded-full text-base font-medium" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
                                    {totalResults} {totalResults === 1 ? 'usuario' : 'usuarios'}
                                    {searchQuery || filters.gender || filters.status ? ' (filtrados)' : ''}
                                </span>
                            </div>
                        </div>

                        <button
                            className="text-white rounded-xl px-10 py-5 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 transform hover:-translate-y-1 w-full sm:w-auto justify-center"
                            style={{ backgroundColor: 'var(--button-primary)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-primary-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--button-primary)'}
                            onClick={openCreateForm}
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-xl" />
                            Nuevo Usuario
                        </button>
                    </div>

                    {/* Búsqueda y Filtros */}
                    <div className="mb-6 space-y-4">
                        <SearchBar 
                            query={searchQuery}
                            onSearch={setSearchQuery}
                            onQueryChange={handleSearchChange}
                        />
                            <Filters
                                gender={filterGender}
                                status={filterStatus}
                                onGenderChange={handleGenderChange}
                                onStatusChange={handleStatusChange}
                            />
                    </div>

                    {users.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <FontAwesomeIcon icon={faUser} className="text-gray-300 dark:text-gray-600 text-7xl mb-8" />
                            <p className="text-gray-500 dark:text-gray-400 text-xl mb-8">No hay usuarios registrados</p>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-10 py-4 text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                                onClick={openCreateForm}
                            >
                                Crear primer usuario
                            </button>
                        </div>
                    ) : paginatedUsers.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <FontAwesomeIcon icon={faUser} className="text-7xl mb-8" style={{ color: 'var(--text-tertiary)' }} />
                            <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>No se encontraron usuarios con los filtros aplicados</p>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-10 py-4 text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                                onClick={resetFilters}
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <>
                            {selectedUsers.size > 0 && (
                                <div className="mb-6 p-4 border-2 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4" style={{ backgroundColor: 'var(--badge-red-bg)', borderColor: 'var(--badge-red-bg)' }}>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-lg" style={{ color: 'var(--badge-red-text)' }}>
                                            {selectedUsers.size} {selectedUsers.size === 1 ? 'usuario seleccionado' : 'usuarios seleccionados'}
                                        </span>
                                    </div>
                                    <button
                                        className="text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
                                        style={{ backgroundColor: 'var(--badge-red-text)' }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                        onClick={handleDeleteSelected}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                        Eliminar Seleccionados
                                    </button>
                                </div>
                            )}
                            <div className="overflow-x-auto scrollbar-thin -mx-4 px-4">
                                <table className="w-full border-collapse rounded-xl overflow-hidden shadow-md" style={{ backgroundColor: 'var(--bg-table)' }}>
                                    <thead className="bg-gradient-to-r from-green-600 to-green-500 dark:from-green-800 dark:to-green-700">
                                        <tr>
                                            <th className="px-6 py-3 text-center text-white font-semibold uppercase text-base tracking-wider w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    ref={(input) => {
                                                        if (input) input.indeterminate = isIndeterminate;
                                                    }}
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                    className="w-5 h-5 rounded focus:ring-green-500 cursor-pointer"
                                                    style={{ 
                                                        borderColor: 'var(--border-color)',
                                                        accentColor: 'var(--button-primary)'
                                                    }}
                                                />
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-white font-semibold uppercase text-base tracking-wider cursor-pointer transition-colors"
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-primary-hover)'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--button-primary)'}
                                                onClick={() => handleSort('name')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Nombre
                                                    <FontAwesomeIcon 
                                                        icon={getSortIcon('name')} 
                                                        className="text-sm" 
                                                        style={{ 
                                                            opacity: sortField === 'name' ? 1 : 0.4 
                                                        }} 
                                                    />
                                                </div>
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-white font-semibold uppercase text-base tracking-wider cursor-pointer transition-colors"
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-primary-hover)'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--button-primary)'}
                                                onClick={() => handleSort('email')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Email
                                                    <FontAwesomeIcon 
                                                        icon={getSortIcon('email')} 
                                                        className="text-sm" 
                                                        style={{ 
                                                            opacity: sortField === 'email' ? 1 : 0.4 
                                                        }} 
                                                    />
                                                </div>
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
                                        {paginatedUsers.map((userItem) => (
                                            <tr
                                                key={userItem.id}
                                                className="table-row border-b transition-colors"
                                                style={{ 
                                                    borderBottomColor: 'var(--border-color)',
                                                    ...(selectedUsers.has(userItem.id) ? { backgroundColor: 'var(--badge-blue-bg)', opacity: 0.3 } : {})
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!selectedUsers.has(userItem.id)) {
                                                        e.currentTarget.style.backgroundColor = 'var(--table-hover)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!selectedUsers.has(userItem.id)) {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                    }
                                                }}
                                            >
                                                <td className="px-6 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.has(userItem.id)}
                                                        onChange={(e) => handleSelectUser(userItem.id, e.target.checked)}
                                                        className="w-5 h-5 rounded focus:ring-green-500 cursor-pointer"
                                                        style={{ 
                                                            borderColor: 'var(--border-color)',
                                                            backgroundColor: 'var(--bg-input)',
                                                            accentColor: 'var(--button-primary)'
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-6 py-3 font-medium text-base" style={{ color: 'var(--text-primary)' }}>
                                                    {userItem.name}
                                                </td>
                                                <td className="px-6 py-3 text-base" style={{ color: 'var(--text-secondary)' }}>
                                                    {userItem.email}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className="inline-block px-5 py-2.5 rounded-full text-base font-medium capitalize" style={{ backgroundColor: 'var(--badge-blue-bg)', color: 'var(--badge-blue-text)' }}>
                                                        {userItem.gender}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className="inline-block px-5 py-2.5 rounded-full text-base font-medium border capitalize" style={getStatusBadgeStyle(userItem.status)}>
                                                        {userItem.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className="flex justify-center items-center gap-5">
                                                        <button
                                                            className="p-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                                            style={{ color: 'var(--badge-blue-text)' }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'var(--badge-blue-bg)';
                                                                e.currentTarget.style.opacity = '0.8';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                                e.currentTarget.style.opacity = '1';
                                                            }}
                                                            onClick={() => editUserItem(userItem.id)}
                                                            title="Editar usuario"
                                                        >
                                                            <FontAwesomeIcon icon={faPenToSquare} className="text-xl" />
                                                        </button>
                                                        <button
                                                            className="p-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                                            style={{ color: 'var(--badge-red-text)' }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'var(--badge-red-bg)';
                                                                e.currentTarget.style.opacity = '0.8';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                                e.currentTarget.style.opacity = '1';
                                                            }}
                                                            onClick={() => deleteUser(userItem.id)}
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
                            <Pagination
                                currentPage={effectivePage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
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
                            setFormValues(initialFormValues);
                        }
                    }}
                >
                    <div className="rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto slide-in relative" style={{ backgroundColor: 'var(--bg-modal)' }}>
                        <button
                            className="absolute top-6 right-6 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-3xl font-bold w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors z-10"
                            onClick={() => {
                                setShowForm(false);
                                setEditUser(null);
                                setFormValues(initialFormValues);
                            }}
                            aria-label="Cerrar"
                        >
                            ×
                        </button>

                        <div className="p-10 lg:p-12">
                            <CustomForm
                                initialValues={formValues}
                                fields={formFields}
                                onSubmit={(values: UserFormModel) =>
                                    editUser ? handleUpdateUser(values) : handleCreateUser(values)
                                }
                                onCancel={() => {
                                    setShowForm(false);
                                    setEditUser(null);
                                    setFormValues(initialFormValues);
                                }}
                                existingUsers={users}
                                isEditMode={Boolean(editUser)}
                                currentUserEmail={editUser?.email || ''}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
