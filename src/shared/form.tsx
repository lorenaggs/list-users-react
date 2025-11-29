import { ErrorMessage, Field, Form, Formik } from "formik";
import type { UserFormModel } from "../models/userForm";
import * as Yup from 'yup';
import type { ItemForm } from "../models/itemForm.ts";

interface FormProps {
    initialValues: UserFormModel;
    fields: ItemForm[];
    onSubmit: (values: UserFormModel) => void;
    onCancel: () => void;
}

const validationSchema = Yup.object({
    name: Yup.string()
        .required('El nombre es requerido')
        .min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: Yup.string()
        .required('El email es requerido')
        .email('El email no es válido'),
    gender: Yup.string().required('El género es requerido'),
    status: Yup.string().required('El estatus es requerido'),
});

export const CustomForm = ({ initialValues, fields, onSubmit, onCancel }: FormProps) => {
    const isEditMode = Boolean(initialValues.name);

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {({ isValid, dirty, isSubmitting }) => (
                <Form className="flex flex-col gap-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-4 uppercase">
                        {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                    </h2>

                    <div className="flex flex-col gap-7">
                        {fields.map((field) => (
                            <div key={field.name} className="flex flex-col gap-2">
                                <label 
                                    htmlFor={field.name}
                                    className="text-base font-semibold text-gray-700 uppercase tracking-wide"
                                >
                                    {field.label}
                                </label>

                                {field.typeInput === "text" && (
                                    <Field
                                        id={field.name}
                                        name={field.name}
                                        type="text"
                                        placeholder={field.placeholder}
                                        className="border-2 border-gray-300 rounded-xl px-5 py-4 text-base w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    />
                                )}

                                {field.typeInput === "select" && (
                                    <Field
                                        as="select"
                                        id={field.name}
                                        name={field.name}
                                        className="border-2 border-gray-300 rounded-xl px-5 py-4 text-base w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
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

                                <ErrorMessage 
                                    name={field.name} 
                                    component="div"
                                    className="text-red-500 text-sm mt-2"
                                />
                            </div>
                        ))}
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

