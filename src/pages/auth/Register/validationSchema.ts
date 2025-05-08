import * as yup from "yup";

export const signUpSchema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required').password(),
    confirmPassword: yup.string().confirmPassword('password'),
    updates: yup.boolean().optional(),
});