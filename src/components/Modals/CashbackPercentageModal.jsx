import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { updateSetting } from "../../redux/slices/setting/thunk";

const CashbackPercentageModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { setting } = useSelector((state) => state.setting);

  const [cashback, setCashback] = useState("");

  // Reset value each time modal opens with current redux state
  useEffect(() => {
    if (open && setting?.cashback_percentage !== undefined) {
      setCashback(setting.cashback_percentage);
    }
  }, [open, setting]);

  const handleSave = () => {
    if (!cashback) return;

    dispatch(
      updateSetting({
        id: setting._id,
        data: { cashback_percentage: Number(cashback) },
      })
    );
    onClose();
  };

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
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontWeight="bold" variant="h6">
              {t("cashbackModal.title")}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              {t("cashbackModal.label")}
            </Typography>

            <TextField
              type="text"
              placeholder={t("cashbackModal.placeholder")}
              variant="outlined"
              fullWidth
              size="small"
              value={cashback}
              onChange={(e) => {
                const value = e.target.value;
                // allow only positive integers up to 100
                if (/^\d*$/.test(value) && Number(value) <= 100) {
                  setCashback(value);
                }
              }}
              sx={{ mb: 3 }}
              inputProps={{ maxLength: 3 }} // optional: prevent more than 3 digits
            />

            <Button variant="contained" fullWidth onClick={handleSave}>
              {t("common.done")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CashbackPercentageModal;
