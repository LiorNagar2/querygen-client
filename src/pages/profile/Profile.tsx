import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Grid,
    TextField,
    Button,
    Divider,
    IconButton,
    Stack,
    Card,
    CardContent,
    Switch,
    FormControlLabel,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Notifications as NotificationsIcon,
    Security as SecurityIcon,
    Palette as PaletteIcon
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import PageContent from '../../layouts/dashboard/PageContent';

interface User {
    email?: string;
    name?: string;
}

export default function Profile() {
    const user = useAppSelector((state) => state.user.userData) as User;
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        darkMode: true,
        twoFactorAuth: false,
    });

    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handlePreferenceChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setPreferences(prev => ({
            ...prev,
            [field]: event.target.checked
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            // TODO: Implement save functionality
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
            setSuccess('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContent title="Profile">
            <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
                <Grid container spacing={3}>
                    {/* Profile Overview */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        bgcolor: 'primary.main',
                                        mb: 2,
                                        fontSize: '2.5rem'
                                    }}
                                >
                                    {user?.email?.[0]?.toUpperCase()}
                                </Avatar>
                                <Typography variant="h6" gutterBottom>
                                    {user?.name || 'User Name'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user?.email}
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Stack spacing={2}>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => setIsEditing(true)}
                                    disabled={isEditing}
                                >
                                    Edit Profile
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<SecurityIcon />}
                                    onClick={() => {/* TODO: Implement security settings */ }}
                                >
                                    Security Settings
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Profile Settings */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={3}>
                            {/* Personal Information */}
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Personal Information
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            value={formData.name}
                                            onChange={handleChange('name')}
                                            disabled={!isEditing}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={formData.email}
                                            onChange={handleChange('email')}
                                            disabled={!isEditing}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Password Change */}
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Change Password
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Current Password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.currentPassword}
                                            onChange={handleChange('currentPassword')}
                                            disabled={!isEditing}
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="New Password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.newPassword}
                                            onChange={handleChange('newPassword')}
                                            disabled={!isEditing}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Confirm New Password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={handleChange('confirmPassword')}
                                            disabled={!isEditing}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Preferences */}
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Preferences
                                </Typography>
                                <Stack spacing={2} sx={{ mt: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={preferences.emailNotifications}
                                                onChange={handlePreferenceChange('emailNotifications')}
                                            />
                                        }
                                        label="Email Notifications"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={preferences.darkMode}
                                                onChange={handlePreferenceChange('darkMode')}
                                            />
                                        }
                                        label="Dark Mode"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={preferences.twoFactorAuth}
                                                onChange={handlePreferenceChange('twoFactorAuth')}
                                            />
                                        }
                                        label="Two-Factor Authentication"
                                    />
                                </Stack>
                            </Paper>

                            {/* Action Buttons */}
                            {isEditing && (
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={() => setIsEditing(false)}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                        onClick={handleSave}
                                        disabled={loading}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            )}

                            {/* Alerts */}
                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert severity="success" sx={{ mt: 2 }}>
                                    {success}
                                </Alert>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </PageContent>
    );
} 