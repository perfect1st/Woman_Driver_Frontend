import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getOnePermissionGroups,
  updatePermissionsActions,
} from "../../redux/slices/permissionGroup/thunk";
import LoadingPage from "../../components/LoadingComponent";

export default function PermissionGroupDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const [localScreens, setLocalScreens] = useState([]);
  const [saving, setSaving] = useState(false);

  const { onePermissionGroups, loading } = useSelector(
    (state) => state.permissionGroup
  );

  useEffect(() => {
    if (id) {
      dispatch(getOnePermissionGroups(id));
    }
  }, [dispatch, id]);

  // Initialize local state when data loads
  useEffect(() => {
    if (onePermissionGroups?.screens) {
      setLocalScreens(onePermissionGroups.screens);
    }
  }, [onePermissionGroups]);

  const handleCheckboxChange = (screenId, permissionKey) => {
    setLocalScreens(prevScreens =>
      prevScreens.map(screen =>
        screen._id === screenId
          ? {
              ...screen,
              permissions: {
                ...screen.permissions,
                [permissionKey]: !screen.permissions[permissionKey],
              },
            }
          : screen
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await dispatch(
        updatePermissionsActions({
          id,
          data: { screens: localScreens },
        })
      ).unwrap();
      // Refetch updated data
      dispatch(getOnePermissionGroups(id));
    } catch (error) {
      console.error("Failed to update permissions:", error);
    }
    setSaving(false);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/PermissionGroups")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("permissions.title")}
        </Typography>
        <Typography mx={1}>&lt;</Typography>
        <Typography
          onClick={() => navigate("/PermissionGroups")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("permissions.details")}
        </Typography>
        <Typography mx={1}>&lt;</Typography>
        <Typography>{onePermissionGroups?.name}</Typography>
      </Box>

      <Typography variant="h5" fontWeight={600} mb={2}>
        {t("permissions.detailsFor")} {onePermissionGroups?.name}
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 2, mb: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell align={isArabic ? "right" : "left"}>
                {t("permissions.screen")}
              </TableCell>
              <TableCell align="center">{t("permissions.view")}</TableCell>
              <TableCell align="center">{t("permissions.edit")}</TableCell>
              <TableCell align="center">{t("permissions.add")}</TableCell>
              <TableCell align="center">{t("permissions.delete")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localScreens.map((screen) => (
              <TableRow key={screen._id} hover>
                <TableCell align={isArabic ? "right" : "left"}>
                  {t(`screens.${screen.screen}`)}
                </TableCell>
                {["view", "edit", "add", "delete"].map((key) => (
                  <TableCell align="center" key={key}>
                    <Checkbox
                      checked={screen.permissions[key]}
                      onChange={() => handleCheckboxChange(screen._id, key)}
                      color="primary"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
<div style={{display:"flex", justifyContent:"flex-end"}}>
      <Button
        variant="contained"
        size="large"
        onClick={handleSave}
        disabled={saving}
        startIcon={saving ? <CircularProgress size={20} /> : null}
        sx={{display:"flex", justifyContent:"center", width:"100%"}}
      >
        {saving ? t("common.saving") : t("common.saveChanges")}
      </Button>
</div>
    </Box>
  );
}