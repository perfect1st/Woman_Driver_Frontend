import { Backdrop, Box, Button, Divider, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/PageHeader/header';
import FilterComponent from '../../components/FilterComponent/FilterComponent';
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { addOneBackup, getAllBackups, downloadBackup } from '../../redux/slices/backups/thunk';
import TableComponent from '../../components/TableComponent/TableComponent';
import CloseIcon from "@mui/icons-material/Close";
import { getUserCookie } from '../../hooks/authCookies';


export default function BackUpPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isArabic = i18n.language === "ar";

  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [radius, setRadius] = useState("");
  const [backupType, setBackupType] = useState("");
  const [backupCategory, setBackupCategory] = useState("");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  // const car_types_id = searchParams.get("carType") || "";
  // const companyCar = searchParams.get("companyCar") || "";
  // const status = searchParams.get("status") || "";
  // const currentStatusFilter = status;

  useEffect(() => {
    const get_all = async () => {
      setLoading(true);


      const queryParams = new URLSearchParams();

      queryParams.set("limit", 10);
      queryParams.set(
        "page",
        searchParams.get("page") && searchParams.get("page") !== "0"
          ? searchParams.get("page")
          : "1"
      );

      if (searchParams.get("type") && searchParams.get("type") !== "all") {
        queryParams.set("type", searchParams.get("type"));
      }

      if (searchParams.get("status") && searchParams.get("status") !== "all") {
        queryParams.set("status", searchParams.get("status"));
      }

      const query = queryParams.toString();

      await dispatch(getAllBackups(query));
      setLoading(false);
    };

    get_all();
  }, [searchParams]);

  const backups = useSelector((state) => state.backupsReducer.backups);

  console.log("backups", backups);

  const updateParams = (upd) => {
    const next = Object.fromEntries(searchParams);
    Object.entries(upd).forEach(([k, v]) => {
      if (v !== undefined && v !== "") next[k] = v;
      else delete next[k];
    });
    setSearchParams(next);
  };

  const handleSearch = (f) => updateParams({ ...f, page: 1 });

  const rows = backups?.backups?.map((u, index) => ({
    id: u._id,
    filename: u.filename,
    fileSize: u.fileSize,
    performedBy: u?.performedBy?.username,
    dateCreated: u?.createdAt?.split("T")[0],
    type: u?.type == "manual" ? "يدوي" : "تلقائي",
    status: u?.status == "success" ? "عملية ناجحة" : "عملية فاشلة",
  }));

  const columns = [
    // { key: "userId", label: t("User ID") },
    { key: "filename", label: t("Name") },
    { key: "fileSize", label: t("size") },
    { key: "performedBy", label: t("createdBy") },
    { key: "dateCreated", label: t("dateCreated") },
    { key: "type", label: t("type") },
    { key: "status", label: t("Status") },
  ];

  const addModal =()=> {
      setShowModal(()=>true);
  };

  const handleSave=async()=>{
      const user=getUserCookie();

      // console.log("user", user);

      // console.log("radius",radius);

       const data = {
            note: radius,
            userId: user?.id
        };

        await dispatch(addOneBackup({ data }));
        await dispatch(getAllBackups());
        setLoading(false);
        setShowModal(false);
        setRadius("");

  }

  return (
    <Box
      component="main"
      sx={{
        p: isSmall ? 2 : 3,
        width: "100%",
        maxWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header
        title={t("Back Up & Restore")}
        subtitle={t("Back Up & Restore")}
        i18n={i18n}
        haveBtn={true}
        btn={t("Add Backup")}
        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        onSubmit={addModal}

      />

      {/* add modal */}
      
      {
        showModal && (
           <Modal
      open={showModal}
      onClose={()=>setShowModal(()=>false)}
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
          width: isSmall ? "90%" : 400,
          bgcolor: "#fff",
          borderRadius: 2,
          p: 2,
          mx: "auto",
          mt: isSmall ? "30%" : "10%",
          outline: "none",
          boxShadow: 24,
          position: "relative",
          isolation: "isolate",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography fontWeight="bold" variant="h6">
              {t("Add Backup")}
            </Typography>
            <IconButton onClick={()=>setShowModal(()=>false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" flexDirection="column" alignItems="start" mt={2}>
            <Typography variant="subtitle1" mb={2} fontWeight="bold">
              {t("Notes")}
            </Typography>

            <TextField
              placeholder={t("Enter the Notes")}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              maxRows={6}
              value={radius}
              onChange={(e) => {
                setRadius(e.target.value);
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
        )
      }

      <Box sx={{ my: 2 }}>
        <Box display="grid" gap={2} gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 140px' }} alignItems="center">
          <FormControl fullWidth sx={{ '& .MuiInputBase-root': { height: 48 }, '& .MuiSelect-select': { display: 'flex', alignItems: 'center', height: 48 } }}>
            <InputLabel>{t("type")}</InputLabel>
            <Select
              value={searchParams.get("type") || ""}
              label={t("type")}
              onChange={(e) => {
                if (e.target.value == "") return;
                searchParams.set("type", e.target.value);
                setSearchParams(searchParams);
              }}
            >
              <MenuItem value="">{t("Select Backup Type")}</MenuItem>
              <MenuItem value="manual">يدوي</MenuItem>
              <MenuItem value="automatic">تلقائي</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ '& .MuiInputBase-root': { height: 48 }, '& .MuiSelect-select': { display: 'flex', alignItems: 'center', height: 48 } }}>
            <InputLabel>{t("Status")}</InputLabel>
            <Select
              value={searchParams.get("status") || ""}
              label={t("Status")}
              onChange={(e) => {
                if (e.target.value == "") return;
                searchParams.set("status", e.target.value);
                setSearchParams(searchParams);
              }}
            >
              <MenuItem value="">{t("Select Status")}</MenuItem>
              <MenuItem value="success">عملية ناجحة</MenuItem>
              <MenuItem value="failed">عملية فاشلة</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              className="danger"
              fullWidth
              sx={{ height: 48, minHeight: 48 }}
              onClick={() => {
                searchParams.delete("type");
                searchParams.delete("status");
                setSearchParams(searchParams);
              }}
            >
              {t("الغاء")}
            </Button>
          </Box>
        </Box>
      </Box>

      <TableComponent
              columns={columns}
              data={rows}
              onViewDetails={(r) => {
                console.log("view details of", r);
                setShowModal(() => true);
              }}
              loading={loading}
              // isUsers={true}
              // statusKey="status"
              sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1 }}
              // onStatusChange={onStatusChange}
              showStatusChange={false}
            />
    </Box>
  )
}
