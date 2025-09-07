import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  IconButton,
  TextField,
  CircularProgress,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  editTrafficTime,
  getOneTrafficTime,
} from "../../redux/slices/trafficTime/thunk";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";

const TrafficTimeDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Permissions
  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("TrafficTime");
    return permissions ? permissions[permissionType] === true : false;
  }
  const hasViewPermission = hasPermission("view");
  const hasEditPermission = hasPermission("edit");

  const { trafficTime } = useSelector((state) => state.trafficTime);

  // Fetch single traffic time
  useEffect(() => {
    dispatch(getOneTrafficTime(id));
  }, [dispatch, id]);

  const [editableFields, setEditableFields] = useState({});
  const [editMode, setEditMode] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    if (trafficTime) {
      setEditableFields({
        title_en: trafficTime.title_en || "",
        title_ar: trafficTime.title_ar || "",
        time_from: trafficTime.time_from || "",
        time_to: trafficTime.time_to || "",
        kilo_price_percentage: trafficTime.kilo_price_percentage || 0,
        status: trafficTime.status || "active",
      });
    }
  }, [trafficTime]);

  const handleFieldChange = (field, value) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (field) => {
    setLoading((prev) => ({ ...prev, [field]: true }));
    const data = {
      [field]: editableFields[field],
    };
    try {
      await dispatch(editTrafficTime({ id, data }));
      await dispatch(getOneTrafficTime(id));
    } catch (error) {
      console.error("Error saving field:", error);
    } finally {
      setEditMode((prev) => ({ ...prev, [field]: false }));
      setLoading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const renderEditableCard = (field, label, type = "text") => (
    <Card
      sx={{
        background: theme.palette.secondary.sec,
        p: 2,
        mb: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {t(label)}
      </Typography>

      {editMode[field] ? (
        <Box display="flex" alignItems="center" mt={1} gap={1}>
          <TextField
            type={type}
            value={editableFields[field]}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            fullWidth
            size="small"
          />
          <IconButton
            onClick={() => handleSave(field)}
            disabled={loading[field]}
          >
            {loading[field] ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={1}
        >
          <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
            {editableFields[field]}
          </Typography>
          {hasEditPermission && (
            <IconButton onClick={() => toggleEditMode(field)}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
      )}
    </Card>
  );

  if (!hasViewPermission) return <Navigate to="/profile" />;

  return (
    <Box p={3}>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" mb={2}>
        <Typography
          onClick={() => navigate("/TrafficTime")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Traffic Time")}
        </Typography>
        <Typography mx={1}>{"<"}</Typography>
        <Typography
          onClick={() => navigate("/TrafficTime")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Traffic Time Details")}
        </Typography>
        <Typography mx={1}>{"<"}</Typography>
        <Typography>
          {isArabic ? trafficTime?.title_ar : trafficTime?.title_en}
        </Typography>
      </Box>

      {/* Title */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold">
          {isArabic ? trafficTime?.title_ar : trafficTime?.title_en}
        </Typography>
      </Box>

      {/* Editable Info Cards */}
      <Box maxWidth="sm">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderEditableCard("title_en", "Traffic Time Name English")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("title_ar", "Traffic Time Name Arabic")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("time_from", "Time From", "time")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("time_to", "Time To", "time")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard(
              "kilo_price_percentage",
              "kilo_price_percentage",
              "number"
            )}
          </Grid>
         {false && <Grid item xs={12}>
            {renderEditableCard("status", "Status")}
          </Grid>}
        </Grid>
      </Box>
    </Box>
  );
};

export default TrafficTimeDetailsPage;
