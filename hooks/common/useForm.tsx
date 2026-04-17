import { useState } from "react";


export function useForm<T>(initialValues: T) {

    const [ formValue, setFormValue ] = useState<T>(initialValues)

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;

        setFormValue( prev => ({
            ...prev,
            [name]: value
        }))
    }

    const setFieldValue = <K extends keyof T>(key: K, value: T[K]) => {
        setFormValue( prev => ({
            ...prev,
            [key]: value
        }))
    }


    const resetValues = () => {
        setFormValue(initialValues)
    }

    return {
        handleChange,
        formValue,
        resetValues,
        setFieldValue
    }
}