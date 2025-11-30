import type { UserFormModel } from "../models/userForm";
import type { ItemForm } from "../models/itemForm";
import { OptionsGender } from "../models/optionsGender";
import { OptionsStatus } from "../models/optionsStatus";

export const initialFormValues: UserFormModel = {
    email: '',
    name: '',
    gender: '',
    status: ''
};

export const formFields: ItemForm[] = [
    { name: "name", label: "Nombre", placeholder: 'Ingrese el nombre', typeInput: 'text' },
    { name: "email", label: "Email", placeholder: 'Ingrese el email', typeInput: 'text' },
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
];

