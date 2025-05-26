import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAppDispatch } from "../../store/hooks";
import { createEntity } from "../../store/crud/crud.actions";
import PageContent from "../../layouts/dashboard/PageContent";
import * as Yup from 'yup';
import { SelectChangeEvent } from "@mui/material";

const steps = ['Database Type', 'Connection Details', 'Review'];

const databaseTypes = [
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlserver', label: 'SQL Server' },
    { value: 'oracle', label: 'Oracle' },
    { value: 'sqlite', label: 'SQLite' },
];

const CreateDatabase = () => {
    const dispatch = useAppDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        type: '',
        host: '',
        port: '',
        user: '',
        password: '',
        name: '',
        connectionName: '',
        database: '',
    });

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleTextChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSelectChange = (field: string) => (event: SelectChangeEvent<string>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await dispatch(createEntity('database', formData) as any);
            // Handle success (e.g., show success message, redirect)
        } catch (error) {
            setError('Failed to create database connection. Please check your details and try again.');
            console.error("Error creating database:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Select your database type
                        </Typography>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Database Type</InputLabel>
                            <Select
                                value={formData.type}
                                onChange={handleSelectChange('type')}
                                label="Database Type"
                            >
                                {databaseTypes.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Host"
                                    value={formData.host}
                                    onChange={handleTextChange('host')}
                                    placeholder="e.g., localhost"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Port"
                                    value={formData.port}
                                    onChange={handleTextChange('port')}
                                    placeholder="e.g., 5432"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Database Name"
                                    value={formData.name}
                                    onChange={handleTextChange('name')}
                                    placeholder="e.g., my_database"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Connection Name"
                                    value={formData.connectionName}
                                    onChange={handleTextChange('connectionName')}
                                    placeholder="e.g., Production DB"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={formData.user}
                                    onChange={handleTextChange('user')}
                                    placeholder="e.g., postgres"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleTextChange('password')}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Review your database connection details
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Database Type</Typography>
                                    <Typography variant="body1">{formData.type}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Host</Typography>
                                    <Typography variant="body1">{formData.host}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Port</Typography>
                                    <Typography variant="body1">{formData.port}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Database Name</Typography>
                                    <Typography variant="body1">{formData.name}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Username</Typography>
                                    <Typography variant="body1">{formData.user}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Connection Name</Typography>
                                    <Typography variant="body1">{formData.connectionName}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <PageContent title="New Database Connection">
            <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
                <Paper sx={{ p: 4, borderRadius: 2 }}>
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {renderStepContent(activeStep)}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                        {activeStep > 0 && (
                            <Button
                                onClick={handleBack}
                                sx={{ px: 3 }}
                            >
                                Back
                            </Button>
                        )}
                        {activeStep < steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ px: 3 }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{ px: 3 }}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Connection'
                                )}
                            </Button>
                        )}
                    </Box>
                </Paper>
            </Box>
        </PageContent>
    );
};

export default CreateDatabase;