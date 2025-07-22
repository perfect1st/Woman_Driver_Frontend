import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  Backdrop,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

const NotifyRadiusModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0,0,0,0.1)",
          },
        },
      }}
    >
      <Box
        sx={{
          width: isMobile ? "90%" : 400,
          bgcolor: "#fff",
          borderRadius: 2,
          p: 2,
          mx: "auto",
          mt: isMobile ? "30%" : "10%",
          outline: "none",
          boxShadow: 24,
          position: "relative",
          isolation: "isolate",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography fontWeight="bold" variant="h6">
              {t("notifyModal.title")}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              {t("notifyModal.label")}
            </Typography>
            <TextField
              placeholder={t("notifyModal.placeholder")}
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mb: 3 }}
            />
            <Button variant="contained" fullWidth onClick={onClose}>
              {t("common.done")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default NotifyRadiusModal;
