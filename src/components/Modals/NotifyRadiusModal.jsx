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

const NotifyRadiusModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { setting } = useSelector((state) => state.setting);

  const [radius, setRadius] = useState("");

 
  useEffect(() => {
    if (open && setting?.driver_search_radius !== undefined) {
      setRadius(setting.driver_search_radius);
    }
  }, [open, setting]);
  

  const handleSave = () => {
    if (!radius) return;

    dispatch(
      updateSetting({
        id: setting._id,
        data: { driver_search_radius: Number(radius) },
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
              type="text"
              placeholder={t("notifyModal.placeholder")}
              variant="outlined"
              fullWidth
              size="small"
              value={radius}
              onChange={(e) => {
                const value = e.target.value;
                // regex: only positive integers
                if (/^\d*$/.test(value)) {
                  setRadius(value);
                }
              }}
              sx={{ mb: 3 }}
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

export default NotifyRadiusModal;
