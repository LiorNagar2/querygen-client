// validationSchemas.ts
import * as yup from 'yup';
import '../../../utils/yup/yupExtensions';

export const signInSchema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});


