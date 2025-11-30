import { Field, Form, Formik } from "formik";
import type { UserFormModel } from "../models/userForm";
import type { ItemForm } from "../models/itemForm.ts";
import type { UserModel } from "../models/usersModels";
import { createValidationSchema } from "../utils/validationSchemas";

interface FormProps {
    initialValues: UserFormModel;
    fields: ItemForm[];
    onSubmit: (values: UserFormModel) => void;
    onCancel: () => void;
    existingUsers?: UserModel[];
    isEditMode?: boolean;
    currentUserEmail?: string;
}

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
                    <h2 className="text-2xl lg:text-3xl font-bold text-center mb-4 uppercase" style={{ color: 'var(--text-primary)' }}>
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
                                        className="text-base font-semibold uppercase tracking-wide"
                                        style={{ color: showError ? 'var(--badge-red-text)' : 'var(--text-secondary)' }}
                                    >
                                        {field.label}
                                        <span className="ml-1" style={{ color: 'var(--badge-red-text)' }}>*</span>
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
                                                    ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500'
                                                    : 'focus:ring-green-500 focus:border-transparent'
                                            }`}
                                            style={{
                                              borderColor: showError ? undefined : 'var(--border-color)',
                                              backgroundColor: 'var(--bg-input)',
                                              color: 'var(--text-primary)'
                                            }}
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
                                            className={`border-2 rounded-xl px-5 py-4 text-base w-full focus:outline-none focus:ring-2 transition-all ${
                                                showError
                                                    ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500'
                                                    : 'focus:ring-green-500 focus:border-transparent'
                                            }`}
                                            style={{
                                              borderColor: showError ? undefined : 'var(--border-color)',
                                              backgroundColor: 'var(--bg-input)',
                                              color: 'var(--text-primary)'
                                            }}
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
                                        <div className="text-sm mt-1 flex items-center gap-1 animate-fadeIn" style={{ color: 'var(--badge-red-text)' }}>
                                            <span>⚠</span>
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
                            className="flex-1 py-5 px-8 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            style={{
                              backgroundColor: (!isValid || !dirty || isSubmitting) ? 'var(--text-tertiary)' : 'var(--button-primary)',
                              color: 'white',
                              cursor: (!isValid || !dirty || isSubmitting) ? 'not-allowed' : 'pointer',
                              opacity: (!isValid || !dirty || isSubmitting) ? 0.6 : 1
                            }}
                            onMouseEnter={(e) => {
                              if (isValid && dirty && !isSubmitting) {
                                e.currentTarget.style.backgroundColor = 'var(--button-primary-hover)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (isValid && dirty && !isSubmitting) {
                                e.currentTarget.style.backgroundColor = 'var(--button-primary)';
                              }
                            }}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-5 px-8 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                            style={{
                              backgroundColor: 'var(--button-secondary)',
                              color: 'var(--button-secondary-text)',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-secondary-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--button-secondary)'}
                        >
                            Cancelar
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

