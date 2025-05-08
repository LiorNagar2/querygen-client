import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
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
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {auth} from "../../../store/auth/auth.actions";
import {RootState} from "../../../store/store";
import {useNavigate} from "react-router-dom";
import {Pages} from "../../../layouts/dashboard/MainMenu";
import Alert from "@mui/material/Alert";
import SuspenseLoader from "../../../components/SuspenseLoader";
import {signInSchema} from "./validationSchemas";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {Link as RouterLink} from 'react-router-dom';
import {CredentialResponse, GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import config from "../../../config/config";
import {UserAuthProviderEnum} from "../../../services/backend/models";

const Login: React.FC = () => {
    const {hasJwtToken, errors, loading} = useAppSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors: formErrors},
    } = useForm({
        resolver: yupResolver(signInSchema)
    });

    useEffect(() => {
        if (hasJwtToken) {
            navigate(Pages.HOME);
        }
    }, [hasJwtToken]);

    const onSubmit = (data: any) => {
        dispatch(auth('login', {
            username: data.email,
            password: data.password,
        }));
    };

    const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
        const { credential } = credentialResponse;
        if (credential) {
            //console.log(credential);
            dispatch(auth('social', {
                token: credential,
                provider: UserAuthProviderEnum.Google,
            }));
        }
    };

    return (

        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Paper elevation={3} sx={{mt: 8, p: 4, borderRadius: 2}}>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>


                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 2, position: 'relative'}}>
                        {loading && (
                            <SuspenseLoader fullscreen={false}/>
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
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="remember"
                                    //checked={formData.remember}
                                    //onChange={handleChange}
                                    color="primary"
                                />
                            }
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 2, mb: 1, bgcolor: '#111'}}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="#" variant="body2">
                                    Forgot your password?
                                </Link>
                            </Grid>
                        </Grid>

                        <Divider sx={{my: 2}}>or</Divider>

                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <GoogleLogin onSuccess={handleGoogleSuccess}
                                             onError={() => console.error('Login Failed')} useOneTap/>
                            </Grid>
                            {/*<Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<GoogleIcon/>}
                                >
                                    Sign in with Google
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<FacebookIcon/>}
                                >
                                    Sign in with Facebook
                                </Button>
                            </Grid>*/}
                        </Grid>

                        <Grid container justifyContent="center" sx={{mt: 2}}>
                            <Grid item>
                                <Typography variant="body2">
                                    Don’t have an account?{' '}
                                    <Link underline="hover" component={RouterLink} to={Pages.REGISTER}>
                                        Sign up
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;