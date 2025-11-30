import { Field, Form, Formik } from "formik";
import type { UserFormModel } from "../models/userForm";
import * as Yup from 'yup';
import type { ItemForm } from "../models/itemForm.ts";
import type { UserModel } from "../models/usersModels";

interface FormProps {
    initialValues: UserFormModel;
    fields: ItemForm[];
    onSubmit: (values: UserFormModel) => void;
    onCancel: () => void;
    existingUsers?: UserModel[];
    isEditMode?: boolean;
    currentUserEmail?: string;
}

const createValidationSchema = (existingUsers: UserModel[] = [], isEditMode: boolean = false, currentUserEmail: string = '') => {
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

export const CustomForm = ({ 
    initialValues, 
    fields, 
    onSubmit, 
    onCancel,
    existingUsers = [],
    isEditMode: propIsEditMode = false,
    currentUserEmail = ''
}: FormProps) => {
    const isEditMode = propIsEditMode || Boolean(initialValues.name);
    const validationSchema = createValidationSchema(existingUsers, isEditMode, currentUserEmail);

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            validateOnChange={true}
            validateOnBlur={true}
            enableReinitialize={true}
        >
            {({ isValid, dirty, isSubmitting, errors, values, touched, setFieldTouched }) => (
                <Form className="flex flex-col gap-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-4 uppercase">
                        {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                    </h2>

                    <div className="flex flex-col gap-7">
                        {fields.map((field) => {
                            const fieldName = field.name as keyof typeof errors;
                            const fieldError = errors[fieldName];
                            const fieldValue = values[fieldName];
                            const isTouched = touched[fieldName];
                            
                            const hasValue = fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;
                            const showError = fieldError && (
                                field.typeInput === 'select' 
                                    ? isTouched || hasValue
                                    : hasValue || isTouched
                            );
                            
                            return (
                                <div key={field.name} className="flex flex-col gap-2">
                                    <label 
                                        htmlFor={field.name}
                                        className={`text-base font-semibold uppercase tracking-wide ${
                                            showError ? 'text-red-600' : 'text-gray-700'
                                        }`}
                                    >
                                        {field.label}
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>

                                    {field.typeInput === "text" && (
                                        <Field
                                            id={field.name}
                                            name={field.name}
                                            type={field.name === 'email' ? 'email' : 'text'}
                                            placeholder={field.placeholder}
                                            onBlur={() => {
                                                setFieldTouched(field.name, true);
                                            }}
                                            className={`border-2 rounded-xl px-5 py-4 text-base w-full focus:outline-none focus:ring-2 transition-all ${
                                                showError
                                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                                            }`}
                                        />
                                    )}

                                    {field.typeInput === "select" && (
                                        <Field
                                            as="select"
                                            id={field.name}
                                            name={field.name}
                                            onBlur={() => {
                                                setFieldTouched(field.name, true);
                                            }}
                                            className={`border-2 rounded-xl px-5 py-4 text-base w-full focus:outline-none focus:ring-2 transition-all bg-white ${
                                                showError
                                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                                            }`}
                                        >
                                            <option value="">{field.placeholder}</option>
                                            {(field.genders ?? []).map((option) => (
                                                <option key={option} value={option}>
                                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                                </option>
                                            ))}
                                            {(field.status ?? []).map((option) => (
                                                <option key={option} value={option}>
                                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                                </option>
                                            ))}
                                        </Field>
                                    )}

                                    {showError && (
                                        <div className="text-red-500 text-sm mt-1 flex items-center gap-1 animate-fadeIn">
                                            <span className="text-red-500">⚠</span>
                                            <span>{fieldError}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 mt-8">
                        <button
                            type="submit"
                            disabled={!isValid || !dirty || isSubmitting}
                            className={`flex-1 py-5 px-8 rounded-xl text-lg font-semibold transition-all duration-200 ${
                                !isValid || !dirty || isSubmitting
                                    ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                                    : "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            }`}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-5 px-8 rounded-xl text-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Cancelar
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

