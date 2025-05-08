import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Paper,
    Avatar,
    Fab,
    useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router";
import { Pages } from "../../layouts/dashboard/MainMenu";

const ChatBubble = ({ sender, text }: { sender: string; text: string }) => {
    const isUser = sender === "user";

    return (
        <Box display="flex" justifyContent={isUser ? "flex-end" : "flex-start"} my={1}>
            {!isUser && <Avatar sx={{ mr: 1, bgcolor: "#1976d2" }}><SmartToyIcon /></Avatar>}
            <Paper
                sx={{
                    px: 2,
                    py: 1,
                    maxWidth: "75%",
                    bgcolor: isUser ? "#1976d2" : "#f5f5f5",
                    color: isUser ? "#fff" : "#000",
                    borderRadius: 3,
                }}
            >
                <Typography variant="body2" style={{ whiteSpace: "pre-line", wordWrap: "break-word" }}>
                    {text}
                </Typography>
            </Paper>
            {isUser && <Avatar sx={{ ml: 1, bgcolor: "#1976d2" }}><PersonIcon /></Avatar>}
        </Box>
    );
};

export default function ChatBot() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:600px)");

    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
        {
            sender: "bot",
            text: "Hi, I'm Bob your Dashboard Assistant.\nWhat would you like to do today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Example static response
        const data = { reply: "Test reply..." };

        const botMessage = { sender: "bot", text: data.reply };
        setMessages((prev) => [...prev, botMessage]);

        await handleChatAction(userMessage.text);
    };

    const handleChatAction = async (intent: string) => {
        const normalized = intent.toLowerCase();
        if (normalized.includes("query")) navigate(Pages.QUERIES);
        else if (normalized.includes("database")) navigate(Pages.DATABASES);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <Box
                sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    zIndex: 1300,
                }}
            >
                <Fab color="primary" onClick={() => setOpen(!open)}>
                    {open ? <CloseIcon /> : <ChatIcon />}
                </Fab>
            </Box>

            {/* Chat Window */}
            {open && (
                <Paper
                    elevation={6}
                    sx={{
                        position: "fixed",
                        bottom: 90,
                        right: 20,
                        width: isMobile ? "90%" : "25%",
                        minWidth: 240,
                        maxHeight: "70vh",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 1200,
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            p: 1.5,
                            backgroundColor: "primary.main",
                            color: "white",
                            fontWeight: 500,
                        }}
                    >
                        Dashboard Assistant
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            p: 2,
                            overflowY: "auto",
                            bgcolor: "#fafafa",
                        }}
                    >
                        {messages.map((msg, i) => (
                            <ChatBubble key={i} sender={msg.sender} text={msg.text} />
                        ))}
                        <div ref={messagesEndRef} />
                    </Box>

                    <Box sx={{ p: 1.5, borderTop: "1px solid #eee" }}>
                        <Box display="flex" gap={1}>
                            <TextField
                                fullWidth
                                placeholder="Ask your dashboard assistant..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                size="small"
                            />
                            <IconButton onClick={sendMessage} color="primary">
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Paper>
            )}
        </>
    );
}
