import React, { useEffect, useRef, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  useTheme,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MicIcon from "@mui/icons-material/Mic";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ImageIcon from "@mui/icons-material/Image";


export default function ModernChatDrawer({
  open = false,
  onClose = () => {},
  messages = [],
  currentUserId = null,
  isArabic = false,
  isMobile = false,
  chatLoading = false,
  onSend = () => {},
  getAudioSrc = (m) => null,
  getSenderImage = () => null,
  t = (s) => s,
  typingUsers = [], // array of names currently typing
}) {
  const theme = useTheme();
  const chatListRef = useRef(null);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!chatListRef.current) return;
    const el = chatListRef.current;
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 60);
  }, [messages, chatLoading]);

  const handleSend = () => {
    if (!input.trim() && !file) return;
    onSend({ text: input.trim(), file });
    setInput("");
    setFile(null);
  };

  const anchor = isArabic ? "left" : "right";

  // helper: group messages by day (ISO date)
  const groupedByDay = messages.reduce((acc, msg) => {
    const day = new Date(msg.createdAt).toDateString();
    acc[day] = acc[day] || [];
    acc[day].push(msg);
    return acc;
  }, {});

  const renderMessageBubble = (msg) => {
    const sender = msg.sender_id || {};
    const isMine = sender._id === currentUserId;
    const audioSrc = msg.msg_type === "voice" ? getAudioSrc(msg) : null;

    const sentGradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`;
    const recvBg = theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.background.paper;

    return (
      <Box key={msg._id} sx={{ display: "flex", alignItems: "flex-end", gap: 1, width: "100%", flexDirection: isMine ? (isArabic ? "row" : "row-reverse") : (isArabic ? "row-reverse" : "row") }}>
        {/* Avatar */}
        <Avatar src={getSenderImage(sender)} sx={{ width: 36, height: 36 }} />

        {/* Content */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start", maxWidth: "78%" }}>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>{sender.fullname || t("Unknown")}</Typography>
          <Paper elevation={0} sx={{
            mt: 0.5,
            px: 2,
            py: 1.25,
            borderRadius: 2.5,
            boxShadow: 1,
            bgcolor: isMine ? "transparent" : recvBg,
            // color: isMine ? theme.palette.primary.contrastText : "inherit",
            background: isMine ? theme.palette.customBackground.mainCard : undefined,
            position: "relative",
            overflow: "visible",
          }}>
            {audioSrc ? (
              <audio controls src={audioSrc} style={{ width: "100%" }} />
            ) : (
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {msg.text_voice_message || msg.text || ""}
              </Typography>
            )}

            {/* message meta: time + status for my messages */}
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", mt: 0.5, ml: isMine ? 0 : 0 }}>
              <Typography variant="caption" color="text.secondary">
                {new Date(msg.createdAt).toLocaleTimeString(isArabic ? "ar-EG" : undefined, { hour: "2-digit", minute: "2-digit" })}
              </Typography>
              {isMine && (
                <DoneAllIcon sx={{ fontSize: 14, color: theme.palette.action.active }} />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  };

  // Render grouped days with a centered chip separator
  const renderGroupedMessages = () => {
    return Object.keys(groupedByDay).map((day) => (
      <Box key={day} sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Chip label={day === new Date().toDateString() ? t("Today") : day} size="small" />
        </Box>
        <Stack spacing={1} sx={{ px: 0 }}>
          {groupedByDay[day].map((m) => renderMessageBubble(m))}
        </Stack>
      </Box>
    ));
  };

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : "40%",
          minWidth: 340,
          display: "flex",
          flexDirection: "column",
          padding: 0,
          borderRadius:  0 ,
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 48, height: 48 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{t("Chat")}</Typography>
            <Typography variant="caption" color="text.secondary">{t("Online")}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton size="small" aria-label="options"><MoreVertIcon /></IconButton>
          <IconButton size="small" onClick={onClose} aria-label="close"><CloseIcon /></IconButton>
        </Box>
      </Box>

      {/* Messages area */}
      <Box ref={chatListRef} sx={{ flex: 1, overflowY: "auto", p: 3 }} dir={isArabic ? "rtl" : "ltr"}>
        {chatLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: "center", color: "text.secondary", py: 8 }}>
            <Typography>{t("no_chat_messages", "No messages yet.")}</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {renderGroupedMessages()}
          </Box>
        )}

        {/* typing indicator */}
        {typingUsers.length > 0 && (
          <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary">{typingUsers.join(", ")} {t("is_typing", "is typing...")}</Typography>
          </Box>
        )}
      </Box>

      {/* Input area */}
      {/* <Divider /> */}
     {false && <Box sx={{ p: 2, backgroundColor: "background.paper" }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <input
            id="chat-file"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
          <label htmlFor="chat-file">
            <IconButton component="span" size="small" aria-label="attach"><AttachFileIcon /></IconButton>
          </label>

          <IconButton size="small" aria-label="emoji"><EmojiEmotionsIcon /></IconButton>

          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("Write a message...")}
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isRecording ? (
                    <Typography variant="caption">{t("Recording...")}</Typography>
                  ) : (
                    <IconButton size="small" onClick={() => setIsRecording((s) => !s)} aria-label="mic"><MicIcon /></IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            size="small"
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={!input.trim() && !file}
          >
            {t("Send")}
          </Button>
        </Box>

        {/* file preview */}
        {file && (
          <Box sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {file.type?.startsWith("image/") ? <ImageIcon /> : <AttachFileIcon />}
              <Typography variant="caption" sx={{ maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</Typography>
            </Box>
            <Button size="small" onClick={() => setFile(null)}>{t("Remove")}</Button>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" mt={1} display="block">
          {t("chat_send_disabled_hint", "Sending not implemented — wire up a send thunk to enable.")}
        </Typography>
      </Box>}
    </Drawer>
  );
}
