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
  const [loadingCheckbox, setLoadingCheckbox] = useState({});

  const { onePermissionGroups, loading } = useSelector(
    (state) => state.permissionGroup
  );

  useEffect(() => {
      if (id) {
       dispatch(getOnePermissionGroups(id));
      }
  }, [dispatch, id]);
  

  const handleToggle = async (screenId, permissionKey) => {
    const key = `${screenId}_${permissionKey}`;
    setLoadingCheckbox((prev) => ({ ...prev, [key]: true }));
  
    const screenToUpdate = onePermissionGroups?.screens?.find(
      (screen) => screen._id === screenId
    );
    if (!screenToUpdate) return;
  
    const updatedPermissions = {
      ...screenToUpdate.permissions,
      [permissionKey]: !screenToUpdate.permissions[permissionKey],
    };
  
    const data = {
      screen: screenToUpdate.screen,
      permissions: updatedPermissions,
    };
  
    await dispatch(updatePermissionsActions({ id, data }));
  
    setLoadingCheckbox((prev) => ({ ...prev, [key]: false }));
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

      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 2 }}>
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
            {onePermissionGroups?.screens?.map((screen) => (
              <TableRow key={screen._id} hover>
                <TableCell align={isArabic ? "right" : "left"}>
                {t(`screens.${screen.screen}`)}
                </TableCell>
                {["view", "edit", "add", "delete"].map((key) => {
  const checkboxKey = `${screen._id}_${key}`;
  const isLoadingCheckbox = loadingCheckbox[checkboxKey];

  return (
    <TableCell align="center" key={key}>
      {isLoadingCheckbox ? (
        <CircularProgress size={20} thickness={8} />
      ) : (
        <Checkbox
          checked={screen.permissions[key]}
          onChange={() => handleToggle(screen._id, key)}
          color="primary"
        />
      )}
    </TableCell>
  );
})}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
