import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  AddCircleOutline as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  getAllPermissionGroups,
  createPermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
} from "../../redux/slices/permissionGroup/thunk";

import CustomTextField from "../../components/RTLTextField";
import LoadingPage from "../../components/LoadingComponent";

export default function PermissionGroupsPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { allPermissionGroups, loading } = useSelector(
    (state) => state.permissionGroup
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(getAllPermissionGroups());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentName("");
    setEditingId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (group) => {
    setEditMode(true);
    setCurrentName(group.name);
    setEditingId(group._id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentName.trim()) return;
    if (editMode) {
      await dispatch(
        updatePermissionGroup({ id: editingId, data: { name: currentName } })
      );
    } else {
      await dispatch(createPermissionGroup({ data: { name: currentName } }));
    }
    setModalOpen(false);
    setCurrentName("");
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    await dispatch(deletePermissionGroup({ id: deleteId }));
    setDeleteModalOpen(false);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Box p={3}>
     

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          {t("permissions.title")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon sx={{mx:1}} />}
          onClick={handleOpenAdd}
        >
          {t("permissions.addGroup")}
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 0.5, boxShadow: 2 }}
      >
        <Table>
        <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
  <TableRow>
    <TableCell
      align={isArabic ? "right" : "left"}
      sx={{
        backgroundColor: theme.palette.background.secDefault,
        border: "1px solid #F5F0F2",
        fontWeight: "bold",
        py: { xs: 1, sm: 1.5 },
        width: "50px"
      }}
    >
      {t("permissions.index")}
    </TableCell>
    <TableCell
      align={isArabic ? "right" : "left"}
      sx={{
        backgroundColor: theme.palette.background.secDefault,
        border: "1px solid #F5F0F2",
        fontWeight: "bold",
        py: { xs: 1, sm: 1.5 },
        width: "100%",
      }}
    >
      {t("permissions.name")}
    </TableCell>
    <TableCell
      align="center"
      sx={{
        backgroundColor: theme.palette.background.secDefault,
        border: "1px solid #F5F0F2",
        fontWeight: "bold",
        py: { xs: 1, sm: 1.5 },
        whiteSpace: "nowrap",
      }}
    >
      {t("permissions.actions")}
    </TableCell>
  </TableRow>
</TableHead>

<TableBody>
  {allPermissionGroups.map((group, index) => (
    <TableRow key={group._id} hover>
      <TableCell
        align={isArabic ? "right" : "left"}
        sx={{ border: "1px solid #e0e0e0", py: { xs: 0.75, sm: 1.5 } }}
      >
        {index + 1}
      </TableCell>

      <TableCell
        align={isArabic ? "right" : "left"}
        sx={{
          border: "1px solid #e0e0e0",
          py: { xs: 0.75, sm: 1.5 },
          width: "100%",
        }}
      >
        {group.name}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          border: "1px solid #e0e0e0",
          py: { xs: 0.75, sm: 1.5 },
        }}
      >
        <Box display="flex" justifyContent="center" gap={1}>
          <IconButton
            onClick={() => navigate(`showpermissiongroup/${group._id}`)}
            size="small"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>

          <IconButton onClick={() => handleOpenEdit(group)} size="small">
            <EditIcon fontSize="small" color="primary" />
          </IconButton>

          <IconButton onClick={() => openDeleteModal(group._id)} size="small">
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("permissions.confirmDeleteTitle")}</DialogTitle>
        <DialogContent>
          <Typography>{t("permissions.confirmDeleteMsg")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            {t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Group Dialog */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editMode ? t("permissions.editTitle") : t("permissions.createTitle")}
        </DialogTitle>
        <DialogContent>
          <CustomTextField
            autoFocus
            margin="normal"
            label={t("permissions.groupName")}
            fullWidth
            variant="filled"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            sx={{ background: theme.palette.background.paper, borderRadius: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {editMode ? t("common.saveChanges") : t("common.create")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
