import * as Yup from 'yup';
import type { UserModel } from '../models/usersModels';

export const createValidationSchema = (
    existingUsers: UserModel[] = [],
    isEditMode: boolean = false,
    currentUserEmail: string = ''
) => {
    return Yup.object({
        name: Yup.string()
            .required('El nombre es requerido')
            .min(2, 'El nombre debe tener al menos 2 caracteres')
            .max(50, 'El nombre no puede tener más de 50 caracteres')
            .matches(
                /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
                'El nombre solo puede contener letras y espacios'
            )
            .trim()
            .test('no-only-spaces', 'El nombre no puede contener solo espacios', (value) => {
                return value ? value.trim().length > 0 : false;
            }),
        email: Yup.string()
            .required('El email es requerido')
            .email('El email no es válido')
            .max(100, 'El email no puede tener más de 100 caracteres')
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'El formato del email no es válido'
            )
            .test('unique-email', 'Este email ya está registrado', (value) => {
                if (!value) return true;
                if (isEditMode && value.toLowerCase() === currentUserEmail.toLowerCase()) {
                    return true;
                }
                return !existingUsers.some(
                    user => user.email.toLowerCase() === value.toLowerCase()
                );
            })
            .trim()
            .lowercase(),
        gender: Yup.string()
            .required('El género es requerido')
            .oneOf(['hombre', 'mujer'], 'Debe seleccionar un género válido'),
        status: Yup.string()
            .required('El estatus es requerido')
            .oneOf(['activo', 'inactivo'], 'Debe seleccionar un estatus válido'),
    });
};

