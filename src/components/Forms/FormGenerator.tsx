import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    Checkbox,
    FormControlLabel,
    Box,
    CircularProgress,
    Grid, SelectChangeEvent,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import * as Yup from 'yup';

export type FieldType = "text" | "email" | "number" | "password" | "select" | "checkbox" | "date" | "autocomplete" | "geo";

export interface Field {
    name: string;
    label: string;
    type: FieldType;
    options?: { label: string; value: any }[]; // For select/autocomplete fields
    columnSize?: number; // Grid column size (1-12)
    validationRules?: Yup.StringSchema | Yup.NumberSchema | Yup.BooleanSchema | Yup.DateSchema; // Yup validation schema
    fetchOptions?: () => Promise<{ label: string; value: any }[]>; // Async options for autocomplete
    defaultValue?: any;
}

interface FormGeneratorProps {
    fields: Field[];
    initialValues?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => Promise<void> | void;
    submitText?: string;
}

const FormGenerator: React.FC<FormGeneratorProps> = ({
                                                         fields,
                                                         initialValues = {},
                                                         onSubmit,
                                                         submitText = "Submit",
                                                     }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [geoSuggestions, setGeoSuggestions] = useState<string[]>([]);

    const validationSchema = Yup.object(
        fields.reduce((acc, field) => {
            if (field.validationRules) {
                acc[field.name] = field.validationRules;
            }
            return acc;
        }, {} as Record<string, any>)
    );

    useEffect(() => {
        if (Object.keys(formData).length === 0) {
            const initialFormValues = fields.reduce((acc, field) => {
                acc[field.name] =
                    initialValues[field.name] ??
                        field.defaultValue ??
                            (field.type === "checkbox" ? false : "");
                return acc;
            }, {} as Record<string, any>);
            setFormData(initialFormValues);
        }
    }, [initialValues, fields]); // Only reset when initialValues change

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>
    ) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleAutocompleteChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err: any) {
            const newErrors: Record<string, string> = {};
            err.inner.forEach((validationError: any) => {
                newErrors[validationError.path] = validationError.message;
            });
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!(await validate())) return;

        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error("Form submission error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGeoSuggestions = async (query: string) => {
        if (!query) return;
        const googleApiKey = `AIzaSyCxaBFt-7mjkzu00tXC1ChhnVPdOsnx6j4`;
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${googleApiKey}`
            );
            const data = await response.json();
            setGeoSuggestions(data.predictions.map((p: any) => p.description));
        } catch (error) {
            console.error("Error fetching geolocation data:", error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={2}>
                {fields.map((field) => (
                    <Grid item xs={12} sm={field.columnSize || 12} key={field.name}>
                        <FormControl fullWidth error={!!errors[field.name]}>
                            {field.type === "text" || field.type === "email" || field.type === "password" || field.type === "number" || field.type === "date" ? (
                                <TextField
                                    label={field.label}
                                    name={field.name}
                                    type={field.type}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    error={!!errors[field.name]}
                                    helperText={errors[field.name]}
                                    fullWidth
                                />
                            ) : field.type === "select" ? (
                                <>
                                    <InputLabel>{field.label}</InputLabel>
                                    <Select name={field.name} value={formData[field.name]} onChange={handleChange} fullWidth variant={'outlined'}>
                                        {field.options?.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors[field.name] && <FormHelperText>{errors[field.name]}</FormHelperText>}
                                </>
                            ) : field.type === "checkbox" ? (
                                <FormControlLabel
                                    control={<Checkbox name={field.name} checked={formData[field.name]} onChange={handleCheckboxChange} />}
                                    label={field.label}
                                />
                            ) : field.type === "autocomplete" ? (
                                <Autocomplete
                                    options={field.options || []}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(_, value) => handleAutocompleteChange(field.name, value?.value)}
                                    renderInput={(params) => (
                                        <TextField {...params} label={field.label} error={!!errors[field.name]} helperText={errors[field.name]} />
                                    )}
                                />
                            ) : field.type === "geo" ? (
                                <Autocomplete
                                    freeSolo
                                    options={geoSuggestions}
                                    onInputChange={(_, value) => fetchGeoSuggestions(value)}
                                    onChange={(_, value) => handleAutocompleteChange(field.name, value)}
                                    renderInput={(params) => (
                                        <TextField {...params} label={field.label} error={!!errors[field.name]} helperText={errors[field.name]} />
                                    )}
                                />
                            ) : null}
                        </FormControl>
                    </Grid>
                ))}
            </Grid>

            <Box mt={2}>
                <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                    {loading ? <CircularProgress size={24} /> : submitText}
                </Button>
            </Box>
        </Box>
    );
};

export default FormGenerator;