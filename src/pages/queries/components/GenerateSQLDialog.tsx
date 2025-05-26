import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Typography, Box, CircularProgress
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
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!question.trim()) return;

        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`http://localhost:3001/database/generate-sql/${dbId}`, { question });
            onGenerate(res.data.sql || '', question);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to generate SQL. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" fontWeight="500">
                    Ask a Database Question
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Describe what data you want to see, and we'll generate the SQL query for you.
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Question"
                        placeholder="e.g. Show me the top 5 products by sales in the last month"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        disabled={loading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5
                            }
                        }}
                    />
                    {error && (
                        <Typography color="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                        borderRadius: 1.5,
                        px: 2
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleGenerate}
                    variant="contained"
                    disabled={loading || !question.trim()}
                    sx={{
                        borderRadius: 1.5,
                        px: 3
                    }}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Generating...
                        </>
                    ) : (
                        'Generate SQL'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
