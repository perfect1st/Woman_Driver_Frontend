// CommissionCategoryDetails.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  IconButton,
  TextField,
  CircularProgress,
  MenuItem,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCarTypesWithoutPaginations,
} from "../../redux/slices/carType/thunk";
import {
  getOneCommissionsCategory,
  editCommissionCategory,
} from "../../redux/slices/commissionCategory/thunk";
import notify from "../../components/notify";
import LoadingPage from "../../components/LoadingComponent";

const CommissionCategoryDetails = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux slice states
  const { allCarTypes } = useSelector((state) => state.carType);
  const { category} = useSelector(
    (state) => state.commissionCategory
  );
  const [loading, setLoading] = useState(false);

  // Local state for the editable values shown in the UI
  const [editableFields, setEditableFields] = useState({
    commission_value_driver_with_car: "",
    commission_value_driver_company: "",
    car_types_id: "",
    amount_from: "",
    amount_to: "",
  });

  // edit mode toggles per field
  const [editMode, setEditMode] = useState({
    commission_value_driver_with_car: false,
    commission_value_driver_company: false,
    car_types_id: false,
    amount_from: false,
    amount_to: false,
  });

  // per-field saving state
  const [saving, setSaving] = useState({
    commission_value_driver_with_car: false,
    commission_value_driver_company: false,
    car_types_id: false,
    amount_from: false,
    amount_to: false,
  });

  // fetch car types and the category
  const fetchData = async () => {
    try {
      setLoading(true);
      await dispatch(getAllCarTypesWithoutPaginations({ query: "" })).unwrap();
      if (id) {
        await dispatch(getOneCommissionsCategory(id)).unwrap();
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);


  // when category (from redux) changes, map its values to editableFields
  useEffect(() => {
    if (category && category?._id) {
      setEditableFields({
        commission_value_driver_with_car:
          category.commission_value_driver_with_car ?? "",
        commission_value_driver_company:
          category.commission_value_driver_company ?? "",
        car_types_id: category.car_types_id ?? "",
        amount_from: category.amount_from ?? "",
        amount_to: category.amount_to ?? "",
      });
    }
  }, [category]);

  const handleFieldChange = (field, value) => {
    // allow numeric strings for numeric fields
    setEditableFields((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = (field) =>
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSave = async (field) => {
    if (!id) return;
    // Prepare payload for this single field (convert numbers where necessary)
    const payload = {};
    if (field === "commission_value_driver_with_car") {
      if (editableFields[field] === "" || isNaN(Number(editableFields[field]))) {
        return notify("invalidValue", "warning");
      }
      payload.commission_value_driver_with_car = Number(
        editableFields[field]
      );
    } else if (field === "commission_value_driver_company") {
      if (editableFields[field] === "" || isNaN(Number(editableFields[field]))) {
        return notify("invalidValue", "warning");
      }
      payload.commission_value_driver_company = Number(
        editableFields[field]
      );
    } else if (field === "car_types_id") {
      if (!editableFields[field]) {
        return notify("selectCarType", "warning");
      }
      payload.car_types_id = editableFields[field];
    } else if (field === "amount_from") {
      if (editableFields[field] === "" || isNaN(Number(editableFields[field]))) {
        return notify("invalidValue", "warning");
      }
      payload.amount_from = Number(editableFields[field]);
    } else if (field === "amount_to") {
      if (editableFields[field] === "" || isNaN(Number(editableFields[field]))) {
        return notify("invalidValue", "warning");
      }
      payload.amount_to = Number(editableFields[field]);
    } else {
      return;
    }

    try {
      setSaving((s) => ({ ...s, [field]: true }));
      await dispatch(editCommissionCategory({ id, data: payload })).unwrap();
      await dispatch(getOneCommissionsCategory(id)).unwrap();
      // notify("updateSuccess", "success");
      setEditMode((e) => ({ ...e, [field]: false }));
    } catch (err) {
      console.error("update error:", err);
      notify("updateFailed", "error");
    } finally {
      setSaving((s) => ({ ...s, [field]: false }));
    }
  };

  const carTypesList = allCarTypes?.data || [];

  // Helper to display car type name from ID
  const getCarTypeName = (carTypeId) => {
    const c = carTypesList.find((x) => x._id === carTypeId);
    if (!c) return "";
    return isArabic ? c.name_ar : c.name_en;
  };

  // If slice is loading, show a small loader
  if (loading)
    return (
        <LoadingPage />
    );

  // if (!category || !category._id)
  //   return (
  //     <LoadingPage />
  //   );

  const renderEditableCard = (
    field,
    label,
    type = "text",
    selectOptions = [],
    adornment = null
  ) => (
    <Card
      key={field}
      sx={{
        background: theme.palette.secondary.sec,
        p: 2,
        mb: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography fontWeight="bold">{t(label)}</Typography>

      {editMode[field] ? (
        <Box display="flex" alignItems="center" mt={1} gap={1}>
          {selectOptions.length > 0 ? (
            <TextField
              select
              fullWidth
              size="small"
              value={editableFields[field]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
            >
              {selectOptions.map((opt) => (
                <MenuItem key={opt._id || opt} value={opt._id || opt}>
                  {isArabic ? opt.name_ar ?? opt : opt.name_en ?? opt}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              fullWidth
              size="small"
              type={type}
              value={editableFields[field]}
              onChange={(e) => {
                // allow only numbers and dot for numeric fields
                if (["commission_value_driver_with_car", "commission_value_driver_company", "amount_from", "amount_to"].includes(field)) {
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val)) handleFieldChange(field, val);
                } else {
                  handleFieldChange(field, e.target.value);
                }
              }}
              InputProps={{
                endAdornment: adornment ? (
                  <Typography ml={1}>{adornment}</Typography>
                ) : undefined,
              }}
            />
          )}

          <IconButton
            onClick={() => handleSave(field)}
            disabled={saving[field]}
            aria-label={`save-${field}`}
          >
            {saving[field] ? <CircularProgress size={20} /> : <SaveIcon />}
          </IconButton>
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={1}
          gap={1}
        >
          <Typography sx={{ color: theme.palette.text.primary }}>
            {/* Display value formatted */}
            {field === "car_types_id"
              ? getCarTypeName(editableFields[field])
              : `${editableFields[field]}${adornment ? ` ${adornment}` : ""}`}
          </Typography>

          <IconButton
            onClick={() => toggleEditMode(field)}
            aria-label={`edit-${field}`}
          >
            <EditIcon />
          </IconButton>
        </Box>
      )}
    </Card>
  );

  return (
    <Box p={2}>
      {/* Breadcrumbs */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={4} gap={1}>
        <Typography
          onClick={() => navigate("/CommissionCategory")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Commission Categories")}
        </Typography>
        <Typography>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/CommissionCategory")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Commission Categories Details")}
        </Typography>
        <Typography>{`<`}</Typography>
        <Typography>#{category?._id}</Typography>
      </Box>

      <Box maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderEditableCard(
              "commission_value_driver_with_car",
              "Commission (Driver With Car) %",
              "text",
              [],
              "%"
            )}
          </Grid>

          <Grid item xs={12}>
            {renderEditableCard(
              "commission_value_driver_company",
              "Commission (Driver Company) %",
              "text",
              [],
              "%"
            )}
          </Grid>

          <Grid item xs={12}>
            {renderEditableCard(
              "car_types_id",
              "Car Type",
              "text",
              carTypesList,
              null
            )}
          </Grid>

          <Grid item xs={12}>
            {renderEditableCard(
              "amount_from",
              "Amount From",
              "text",
              [],
              t("SAR")
            )}
          </Grid>

          <Grid item xs={12}>
            {renderEditableCard(
              "amount_to",
              "Amount To",
              "text",
              [],
              t("SAR")
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CommissionCategoryDetails;
