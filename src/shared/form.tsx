import {ErrorMessage, Field, Form, Formik} from "formik";
import type {UserFormModel} from "../models/userForm";
import * as Yup from 'yup';
import type {ItemForm} from "../models/itemForm.ts";

interface FormProps {
    initialValues: UserFormModel;
    fields: ItemForm[];
    onSubmit: (values: UserFormModel) => void;
    onCancel: () => void;
}

export const CustomForm = ({initialValues, fields, onSubmit, onCancel}: FormProps) => {

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={Yup.object({
                name: Yup.string().required('El nombre es requerido'),
                email: Yup.string().required('El email es requerido'),
                gender: Yup.string().required('El genero es requerido'),
                status: Yup.string().required('El estatus es requerido'),
            })}
        >
            {({ isValid, dirty }) => (
                <Form className="flex flex-col grap-2 items-center">

                    <h1 className="text-2xl text-center uppercase p-4">
                        {initialValues.name ? 'Editar usuario' : 'Crear usuario'}
                    </h1>

                    <div className="flex flex-col w-full items-center justify-center">
                        {fields.map((field) => (
                            <div key={field.name} className="w-full">
                                <div className="flex flex-row w-full items-center p-2">
                                    <label className="uppercase w-1/2">{field.label}:</label>

                                    {field.typeInput === "text" && (
                                        <Field
                                            id={field.name}
                                            name={field.name}
                                            type="text"
                                            placeholder={field.placeholder}
                                            className="border-2 border-gray-300 rounded-md p-2 w-full"
                                        />
                                    )}

                                    {field.typeInput === "select" && (
                                        <Field
                                            as="select"
                                            name={field.name}
                                            className="border-2 border-gray-300 rounded-md p-2 w-full"
                                        >
                                            <option value="">
                                                {field.placeholder}
                                            </option>
                                            {(field.genders ?? []).map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                            {(field.status ?? []).map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </Field>
                                    )}
                                </div>

                                <div className="flex flex-row w-full items-center p-2 text-center text-red-500">
                                    <ErrorMessage name={field.name} />
                                </div>
                            </div>
                        ))}

                        <div className="flex gap-2 w-full items-center p-2 justify-center">

                            <button
                                type="submit"
                                disabled={!isValid || !dirty}
                                className={
                                    !isValid || !dirty
                                        ? "text-white rounded-md px-4 py-2 w-1/2 cursor-not-allowed opacity-50"
                                        : "text-white rounded-md px-4 py-2 w-1/2 cursor-pointer"
                                }
                                style={{
                                    backgroundColor: "#80bc00"
                                }}
                            >
                                Guardar
                            </button>

                            <button
                                type="button"
                                className="bg-red-500 text-white rounded-md px-4 py-2 w-1/2 cursor-pointer"
                                onClick={() => onCancel()}
                            >
                                Cancelar
                            </button>

                        </div>
                    </div>
                </Form>
            )}
        </Formik>

    )

}

