// yupExtensions.ts
import * as yup from 'yup';

declare module 'yup' {
    interface StringSchema {
        password(): StringSchema;
        confirmPassword(ref: string): StringSchema;
    }
}

yup.addMethod<yup.StringSchema>(yup.string, 'password', function () {
    return this
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
            'Password must contain uppercase, lowercase, number, and special character'
        );
});

yup.addMethod<yup.StringSchema>(yup.string, 'confirmPassword', function (ref: string) {
    return this
        .oneOf([yup.ref(ref), undefined], 'Passwords must match')
        .required('Confirm password is required');
});
