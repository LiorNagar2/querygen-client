import React, { useEffect } from 'react';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Container,
    CssBaseline,
    Divider,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "./validationSchema";
import { Pages } from "../../../layouts/dashboard/MainMenu";
import { auth } from "../../../store/auth/auth.actions";
import { Link as RouterLink } from 'react-router-dom';
import SuspenseLoader from "../../../components/SuspenseLoader";
import Alert from "@mui/material/Alert/Alert";

export default function Register() {
    const { hasJwtToken, errors, loading } = useAppSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
    } = useForm({
        resolver: yupResolver(signUpSchema)
    });

    useEffect(() => {
        if (hasJwtToken) {
            navigate(Pages.HOME);
        }
    }, [hasJwtToken]);

    const onSubmit = (data: any) => {
        dispatch(auth('register', {
            username: data.email,
            email: data.email,
            password: data.password
        }));
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 2, position: 'relative'}}>
                        {loading && (
                            <SuspenseLoader fullscreen={false} />
                        )}
                        {errors.length > 0 && (
                            <Alert severity="error">{errors[0]}</Alert>
                        )}
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            {...register('email')}
                            error={!!formErrors.email}
                            helperText={formErrors.email?.message}
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Password"
                            {...register('password')}
                            type="password"
                            error={!!formErrors.password}
                            helperText={formErrors.password?.message}
                            autoComplete="new-password"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Confirm Password"
                            {...register('confirmPassword')}
                            type="password"
                            error={!!formErrors.confirmPassword}
                            helperText={formErrors.confirmPassword?.message}
                            autoComplete="new-password"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...register('updates')}
                                    color="primary"
                                />
                            }
                            label="I want to receive updates via email."
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2, bgcolor: '#111' }}
                        >
                            Sign Up
                        </Button>
                        <Divider>or</Divider>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>
                                    Sign up with Google
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button fullWidth variant="outlined" startIcon={<FacebookIcon />}>
                                    Sign up with Facebook
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="center" sx={{ mt: 2 }}>
                            <Grid item>
                                <Typography variant="body2">
                                    Already have an account?{' '}
                                    <Link underline="hover" component={RouterLink}  to={Pages.LOGIN}>
                                        Sign in
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
