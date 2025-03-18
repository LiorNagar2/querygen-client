import React, { useState } from "react";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import {createEntity} from '../../store/crud/crud.actions';

interface CreateEntityFormProps {
    entity: string;
    fields: { name: string; label: string; type?: string, required?: boolean }[];
    onSuccess?: () => void;
}

const CreateEntityForm: React.FC<CreateEntityFormProps> = ({ entity, fields, onSuccess }) => {
    const dispatch = useDispatch();
    const emptyFields = fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
    const [formData, setFormData] = useState<Record<string, string>>(emptyFields);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        fields.forEach((field) => {
            if (field.required && !formData[field.name].trim()) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await dispatch(createEntity(entity, formData) as any);
            setFormData(emptyFields);
            setErrors({});
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error creating entity:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {fields.map((field) => (
                <TextField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type || "text"}
                    value={formData[field.name]}
                    onChange={handleChange}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                    fullWidth
                />
            ))}

            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Create"}
            </Button>
        </Box>
    );
};

export default CreateEntityForm;
