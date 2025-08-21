import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  useTheme,
  Card,
  CardContent,
  Grid,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  FormControlLabel,
  ListItemText,
  Fade,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getOneUser, editUser } from "../../redux/slices/user/thunk";
import { getAllPermissionGroups } from "../../redux/slices/permissionGroup/thunk";
import LoadingPage from "../../components/LoadingComponent";
import useBaseImageUrl from "../../hooks/useBaseImageUrl";
import imageCompression from 'browser-image-compression';

const statusStyles = {
  active: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },
  banned: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
};

export default function UserDetailsPage() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { oneUser, loading } = useSelector((state) => state.user);
  const { allPermissionGroups } = useSelector((state) => state.permissionGroup);

  // EDITABLE STATE HOOKS
  const [editable, setEditable] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
    status: "",
    super_admin: false,
    has_report_actions: false,
    groups: [],
  });
  const [editMode, setEditMode] = useState({});
  const [saving, setSaving] = useState({});
  const [avatarImage, setAvatarImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef();

  // FETCH user ON MOUNT
  useEffect(() => {
    dispatch(getOneUser(id));
    dispatch(getAllPermissionGroups());
  }, [dispatch, id]);

  // SEED editable WHEN user LOADS
  useEffect(() => {
    if (oneUser) {
      setEditable({
        name: oneUser.name || "",
        phone_number: oneUser.phone_number || "",
        email: oneUser.email || "",
        password: "",
        status: oneUser.status || "active",
        super_admin: oneUser.super_admin || false,
        has_report_actions: oneUser.has_report_actions || false,
        groups: oneUser.groups || [],
      });
      setEditMode({});
      setSaving({});
    }
  }, [oneUser]);

  const baseImageUrl = useBaseImageUrl();

  // BUILD user OBJECT
  const user = useMemo(
    () => ({
      name: oneUser?.name,
      id: oneUser?._id ? `#${oneUser._id.slice(-6)}` : "",
      image: avatarImage
        ? URL.createObjectURL(avatarImage)
        : oneUser?.profile_image
        ? `${baseImageUrl}${oneUser.profile_image}`
        : null,
      phone_number: editable.phone_number,
      email: editable.email,
      status: editable.status,
      super_admin: editable.super_admin,
      has_report_actions: editable.has_report_actions,
      groups: editable.groups,
    }),
    [oneUser, editable, avatarImage]
  );

  // HANDLERS
  const handleFieldChange = (f, v) => setEditable((e) => ({ ...e, [f]: v }));
  const toggleEdit = (f) => setEditMode((m) => ({ ...m, [f]: !m[f] }));

  const handleSave = async (field) => {
    setSaving((s) => ({ ...s, [field]: true }));

    try {
      let updatedField = { [field]: editable[field] };

      // For groups, we need to send an array of IDs
      if (field === "groups") {
        updatedField = { groups: editable.groups };
      }

      await dispatch(editUser({ id, data: updatedField }));
      setEditMode((m) => ({ ...m, [field]: false }));
      setSuccessMessage(t("Changes saved successfully"));
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Refetch user data after successful edit
      dispatch(getOneUser(id));
    } catch (error) {
      console.error("Edit error:", error);
    } finally {
      setSaving((s) => ({ ...s, [field]: false }));
    }
  };

  // Save boolean fields immediately when changed
  const handleBooleanChange = async (field, value) => {
    setSaving((s) => ({ ...s, [field]: true }));
    
    try {
      await dispatch(editUser({ id, data: { [field]: value } }));
      setSuccessMessage(t("Changes saved successfully"));
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Refetch user data after successful edit
      dispatch(getOneUser(id));
    } catch (error) {
      console.error("Edit error:", error);
    } finally {
      setSaving((s) => ({ ...s, [field]: false }));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Compression options
    const options = {
      maxSizeMB: 0.5, // max size in MB
      maxWidthOrHeight: 800, // max width or height
      useWebWorker: true,
    };
  
    try {
      const compressedFile = await imageCompression(file, options);
      setAvatarImage(compressedFile);
  
      const formData = new FormData();
      formData.append("profile_image", compressedFile);
  
      setSaving((s) => ({ ...s, profile_image: true }));
      await dispatch(editUser({ id, data: formData }));
  
      setSuccessMessage(t("Image updated successfully"));
      setTimeout(() => setSuccessMessage(""), 3000);
      dispatch(getOneUser(id));
    } catch (error) {
      console.error("Image compression/upload error:", error);
    } finally {
      setSaving((s) => ({ ...s, profile_image: false }));
    }
  };
  

  const handleRemoveAvatar = () => {
    setAvatarImage(null);
    setSaving((s) => ({ ...s, profile_image: true }));
    
    // Send empty value to remove image
    dispatch(editUser({ id, data: { profile_image: "" } }))
      .then(() => {
        setSuccessMessage(t("Image removed successfully"));
        setTimeout(() => setSuccessMessage(""), 3000);
        dispatch(getOneUser(id));
      })
      .catch((error) => {
        console.error("Image removal error:", error);
      })
      .finally(() => {
        setSaving((s) => ({ ...s, profile_image: false }));
      });
  };

  const renderEditableField = (field, type = "text") => {
    const styles = statusStyles[editable.status] || statusStyles.active;
    
    if (editMode[field]) {
      return (
        <Box display="flex" alignItems="center" width="100%">
          {field === "status" ? (
            <Select
              value={editable.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              fullWidth
              size="small"
              sx={{ flexGrow: 1, mr: 1 }}
            >
              {Object.keys(statusStyles).map((st) => (
                <MenuItem key={st} value={st}>
                  {t(st)}
                </MenuItem>
              ))}
            </Select>
          ) : field === "groups" ? (
            <Select
              multiple
              value={editable.groups}
              onChange={(e) => handleFieldChange("groups", e.target.value)}
              fullWidth
              size="small"
              sx={{ flexGrow: 1, mr: 1 }}
              renderValue={(selected) => 
                allPermissionGroups
                  .filter(group => selected.includes(group._id))
                  .map(group => group.name)
                  .join(", ")
              }
            >
              {allPermissionGroups?.map((group) => (
                <MenuItem key={group._id} value={group._id}>
                  <Checkbox checked={editable.groups.includes(group._id)} />
                  <ListItemText primary={group.name} />
                </MenuItem>
              ))}
            </Select>
          ) : field === "super_admin" || field === "has_report_actions" ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={editable[field]}
                  onChange={(e) => {
                    handleFieldChange(field, e.target.checked);
                    handleBooleanChange(field, e.target.checked);
                  }}
                  disabled={saving[field]}
                />
              }
              label={t(field === "super_admin" ? "Administrator" : "Has Report Actions")}
            />
          ) : (
            <TextField
              value={editable[field]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              fullWidth
              size="small"
              type={type}
              sx={{ flexGrow: 1, mr: 1 }}
            />
          )}
          {(field !== "super_admin" && field !== "has_report_actions") && (
            <IconButton
              onClick={() => handleSave(field)}
              disabled={saving[field]}
            >
              {saving[field] ? <CircularProgress size={24} /> : <SaveIcon />}
            </IconButton>
          )}
        </Box>
      );
    }
    
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box>
          {field === "status" ? (
            <Chip
              label={t(editable.status)}
              sx={{
                color: styles.textColor,
                backgroundColor: styles.bgColor,
                border: `1px solid ${styles.borderColor}`,
                fontWeight: "bold",
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
              }}
            />
          ) : field === "groups" ? (
            <Typography>
              {editable.groups.map(groupId => {
                const group = allPermissionGroups?.find(g => g._id === groupId);
                return group ? group.name : "";
              }).filter(Boolean).join(", ")}
            </Typography>
          ) : field === "super_admin" || field === "has_report_actions" ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={editable[field]}
                  disabled
                  sx={{ p: 0, mr: 1 }}
                />
              }
              label={t(field === "super_admin" ? "Administrator" : "Has Report Actions")}
            />
          ) : (
            <Typography>{editable[field]}</Typography>
          )}
        </Box>
        <IconButton onClick={() => toggleEdit(field)}>
          <EditIcon />
        </IconButton>
      </Box>
    );
  };

  // EARLY RETURN SPINNER
  if (loading || !oneUser) {
    return <LoadingPage />;
  }

  return (
    <Box p={2}>
      {/* Success Message */}
      <Fade in={!!successMessage}>
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      </Fade>

      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/Users")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Users")}
        </Typography>
        <Typography mx={1}>&lt;</Typography>
        <Typography
          onClick={() => navigate("/Users")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Users List")}
        </Typography>
        <Typography mx={1}>&lt;</Typography>
        <Typography>{user.name}</Typography>
      </Box>

      {/* Name & ID */}
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          {user.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {user.id}
        </Typography>
      </Box>

      <Box maxWidth="md">
        <Box mb={3} display="flex" flexDirection="column" alignItems="center">
          <Box position="relative">
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                fontSize: 40,
                mb: 1,
              }}
              src={user.image}
            >
              {!user.image && user.name.charAt(0)}
            </Avatar>
            {saving.profile_image && (
              <CircularProgress
                size={40}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: -2,
                  marginLeft: -2,
                }}
              />
            )}
            <input
              accept="image/*"
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handleAvatarChange}
            />
            <IconButton
              onClick={() => fileInputRef.current.click()}
              sx={{
                position: "absolute",
                bottom: 5,
                right: 5,
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              <AddPhotoAlternateIcon fontSize="small" />
            </IconButton>
            {user.image && (
              <IconButton
                onClick={handleRemoveAvatar}
                sx={{
                  position: "absolute",
                  bottom: 5,
                  left: 5,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Typography color="primary" fontWeight="bold" fontSize={18}>
            {user.name}
          </Typography>
        </Box>
        <Typography variant="h6" color="primary" mb={1}>
          {t("User Details")}
        </Typography>

        <Grid container spacing={2} direction="column">
          {/* Full Name */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Full Name")}</Typography>
                <Box mt={1}>{renderEditableField("name")}</Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Phone */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Phone Number")}</Typography>
                <Box mt={1}>{renderEditableField("phone_number")}</Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Email */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Email")}</Typography>
                <Box mt={1}>{renderEditableField("email")}</Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Password */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Password")}</Typography>
                <Box mt={1}>{renderEditableField("password", "password")}</Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Status */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Status")}</Typography>
                <Box mt={1}>{renderEditableField("status")}</Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Permission Groups */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Typography variant="subtitle2">{t("Permission Groups")}</Typography>
                <Box mt={1}>{renderEditableField("groups")}</Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Administrator */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2">{t("Administrator")}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("User has administrator privileges")}
                    </Typography>
                  </Box>
                  <Box mt={1}>
                    {renderEditableField("super_admin")}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Report Actions */}
          <Grid item xs={12}>
            <Card sx={{ background: theme.palette.secondary.sec }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2">{t("Has Report Actions")}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("User can access report actions")}
                    </Typography>
                  </Box>
                  <Box mt={1}>
                    {renderEditableField("has_report_actions")}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}