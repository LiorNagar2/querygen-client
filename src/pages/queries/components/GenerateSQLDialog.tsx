import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Typography
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

interface GenerateSQLDialogProps {
    open: boolean;
    onClose: () => void;
    onGenerate: (sql: string, question: string) => void;
    dbId: string;
}

export default function GenerateSQLDialog({
                                              open,
                                              onClose,
                                              onGenerate,
                                              dbId,
                                          }: GenerateSQLDialogProps) {
    const [question, setQuestion] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        try {
            const res = await axios.post(`http://localhost:3001/database/generate-sql/${dbId}`, { question });
            onGenerate(res.data.sql || '', question);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to generate SQL');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Ask a Database Question</DialogTitle>
            <DialogContent>
                <TextField
                    label="Question"
                    placeholder="e.g. Top 5 Products by Sales"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                {error && <Typography color="error">{error}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleGenerate} variant="contained">Generate SQL</Button>
            </DialogActions>
        </Dialog>
    );
}
