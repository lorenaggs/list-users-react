import {useEffect, useState} from "react";
import type {UserModel} from "../models/usersModels"
import {getUser} from "../api/apiUsers";
import {CustomForm} from "../shared/form";
import type {UserFormModel} from "../models/userForm";
import {Header} from "../shared/header.tsx";
import type {ItemForm} from "../models/itemForm.ts";
import {Loading} from "../shared/loading.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {OptionsGender} from "../models/optionsGender.ts";
import {OptionsStatus} from "../models/optionsStatus.ts";
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

    // Estado REAL que usa el formulario
    const [formValues, setFormValues] = useState<UserFormModel>(initialValues);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);

            const usersFromStorage = localStorage.getItem('users');

            if (usersFromStorage) {
                setUser(JSON.parse(usersFromStorage));
                setLoading(false);
            } else {
                const usersResponse = await getUser();

                const users = usersResponse.map((user: UserModel) => ({
                    ...user,
                    gender: user.gender === 'male' ? 'hombre' : 'mujer',
                    status: user.status === 'active' ? 'activo' : 'inactivo'
                }));

                setUser(users);
                localStorage.setItem('users', JSON.stringify(users));
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

    const handleCreateUser = (values: UserFormModel) => {
        const newUser = {
            id: user.length + 1,
            ...values
        };

        const listUser = [newUser, ...user];
        localStorage.setItem('users', JSON.stringify(listUser));
        setUser(listUser);
        setShowForm(false);
        setEditUser(null);
    };

    const deleteItem = (id: number, userClicked: UserModel) => {
        const showAlert = () => {
            Swal.fire({
                title: 'Estás seguro?',
                text: 'Quieres eliminar al usuario ' + userClicked.name + '?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!'
            }).then((result) => {
                if (result.isConfirmed) {

                    const listUser = user.filter((user: UserModel) => user.id !== id);
                    localStorage.setItem('users', JSON.stringify(listUser));
                    setUser(listUser);
                    Swal.fire(
                        'Eliminado!',
                        'El usuario ' + userClicked.name + ' ha sido eliminado.',
                        'success'
                    );
                }
            });
        };

        showAlert();

    };

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

    // Abrir formulario limpio al crear
    const openCreateForm = () => {
        setEditUser(null);
        setFormValues(initialValues);
        setShowForm(true);
    };

    const handleUpdateUser = (values: UserFormModel) => {
        const updatedList = user.map(u =>
            u.email === editUser?.email ? {...u, ...values} : u
        );

        localStorage.setItem('users', JSON.stringify(updatedList));
        setUser(updatedList);
        setShowForm(false);
        setEditUser(null);
    };


    return (
        <>
            <Loading loading={loading}/>
            <Header/>

            <div className="p-4">
                <div className="flex w-full justify-between p-4">
                    <h1 className="text-2xl text-center uppercase">Lista de usuario</h1>

                    <button
                        className="text-white rounded-md px-4 py-2"
                        style={{backgroundColor: '#80bc00'}}
                        onClick={openCreateForm}
                    >
                        +
                    </button>
                </div>

                <div
                    className="overflow-y-auto h-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-700">
                    <table className="border-collapse border-2 border-gray-300 rounded-md w-full">
                        <thead className="table-header">
                        <tr className="text-gray-700 border-2 border-gray-300 rounded-md"
                            style={{backgroundColor: "#80bc00"}}>
                            <th className="px-4 py-2 text-white border-2 border-gray-300 uppercase">Nombre</th>
                            <th className="px-4 py-2 text-white border-2 border-gray-300 uppercase">Email</th>
                            <th className="px-4 py-2 text-white border-2 border-gray-300 uppercase">Género</th>
                            <th className="px-4 py-2 text-white border-2 border-gray-300 uppercase">Estatus</th>
                            <th className="px-4 py-2 text-white border-2 border-gray-300 uppercase">Acciones</th>
                        </tr>
                        </thead>

                        <tbody>
                        {user.map((user) => (
                            <tr key={user.id} className="table-row">
                                <td className="border-2 border-gray-200 text-center p-2">{user.name}</td>
                                <td className="border-2 border-gray-200 text-center p-2">{user.email}</td>
                                <td className="border-2 border-gray-200 text-center p-2 capitalize">{user.gender}</td>
                                <td className="border-2 border-gray-200 text-center p-2 capitalize">{user.status}</td>
                                <td className="border-2 border-gray-200 text-center p-2">
                                    <button
                                        className="text-blue-400 hover:text-blue-700 cursor-pointer text-xl"
                                        onClick={() => editUserItem(user.id)}
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare}/>
                                    </button>

                                    <button
                                        className="text-red-500 hover:text-red-700 cursor-pointer text-xl ml-2"
                                        onClick={() => deleteItem(user.id, user)}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <dialog
                    open={showForm}
                    className="h-full w-full fixed top-0 left-0 bg-black/50 z-50 p-4 flex justify-center items-center"
                >
                    <div className="bg-white rounded-md p-4 w-full max-w-md max-h-full overflow-y-auto relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={() => setShowForm(false)}
                        >
                            X
                        </button>

                        <CustomForm
                            initialValues={formValues}
                            fields={initialValuesForm}
                            onSubmit={(values: UserFormModel) =>
                                editUser ? handleUpdateUser(values) : handleCreateUser(values)
                            }
                            onCancel={() => setShowForm(false)}
                        />


                    </div>
                </dialog>
            )}
        </>
    );
};
