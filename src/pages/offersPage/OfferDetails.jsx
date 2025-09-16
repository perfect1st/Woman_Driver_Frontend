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
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editOffer, getOneOffer } from "../../redux/slices/offer/thunk";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";

const OfferDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Offers");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view");
  const hasEditPermission = hasPermission("edit");

  useEffect(() => {
    dispatch(getOneOffer(id));
  }, [dispatch, id]);

  const { offer } = useSelector((state) => state.offer);

  const [editableFields, setEditableFields] = useState({});
  const [editMode, setEditMode] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    if (offer) {
      setEditableFields({
        title: offer.title || "",
        offer_type: offer.offer_type || "",
        offer_value: offer.offer_value || 0,
        maximum_discount_value: offer.maximum_discount_value || 0,
        usage_count: offer.usage_count || 0,
        usage_count_per_user_value: offer.usage_count_per_user_value || 0,
        start_date: offer.start_date
          ? new Date(offer.start_date).toISOString().slice(0, 10)
          : "",
        end_date: offer.end_date
          ? new Date(offer.end_date).toISOString().slice(0, 10)
          : "",
        desc: offer.desc || "",
        status: offer.status || "",
      });
    }
  }, [offer]);

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
      await dispatch(editOffer({ id, data }));
      await dispatch(getOneOffer(id));
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
          {field === "offer_type" ? (
            <TextField
              select
              value={editableFields[field]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="percentage">{t("offer.types.percentage")}</MenuItem>
              <MenuItem value="value">{t("offer.types.fixed")}</MenuItem>
            </TextField>
          ) : (
            <TextField
              type={type}
              value={editableFields[field]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              fullWidth
              size="small"
            />
          )}
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
            {t(editableFields[field])}
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
          onClick={() => navigate("/offers")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Offers")}
        </Typography>
        <Typography mx={1}>{"<"}</Typography>
        <Typography
          onClick={() => navigate("/offers")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Offer Details")}
        </Typography>
        <Typography mx={1}>{"<"}</Typography>
        <Typography>{offer?.title}</Typography>
      </Box>

      {/* Title */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold">
          {offer?.title}
        </Typography>
      </Box>

      {/* Editable Info Cards */}
      <Box maxWidth="sm">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderEditableCard("title", "offer.title")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("offer_type", "offer.type")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("offer_value", "offer.value", "number")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("maximum_discount_value", "offer.max_discount", "number")}
          </Grid>
       
          <Grid item xs={12}>
            {renderEditableCard("start_date", "offer.start_date", "date")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("end_date", "offer.end_date", "date")}
          </Grid>
          <Grid item xs={12}>
            {renderEditableCard("desc", "offer.desc")}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default OfferDetailsPage;
