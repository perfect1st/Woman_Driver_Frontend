import React, { useEffect, useState } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import LoadingPage from "../../components/LoadingComponent";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllContactUs,
  getAllContactUsWithoutPaginations,
  editContactUs,
} from "../../redux/slices/contactUs/thunk";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import notify from "../../components/notify";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import CustomTextField from "../../components/RTLTextField";

// ---- Put this near top of file ----
const statusStyles = {
  "in-progress": {
    textColor: "#93370D",
    bgColor: "#FFFAEB",
    borderColor: "#FEDF89",
    icon: <AccessTimeIcon fontSize="small" sx={{ color: "#93370D" }} />,
  },
  resolved: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
    icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />,
  },
  closed: {
    textColor: "#1F2A37",
    bgColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    icon: <BlockIcon fontSize="small" sx={{ color: "#1F2A37" }} />,
  },
  pending: {
    textColor: "#1849A9",
    bgColor: "#EFF8FF",
    borderColor: "#B2DDFF",
    icon: <AccessTimeIcon fontSize="small" sx={{ color: "#1849A9" }} />,
  },
};

const ContactUsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isArabic = i18n.language === "ar";

  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const date = searchParams.get("date") || "";
  const currentStatusFilter = status;

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("contactUs");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view");
  const hasEditPermission = hasPermission("edit");

  const { contactUsList = {}, loading } = useSelector(
    (state) => state.contactUs
  );
  const {
    data = [],
    total = 0,
    page: currentPage = 1,
    totalPages = 1,
  } = contactUsList;

  useEffect(() => {
    const q =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (date ? `&date=${date}` : "") +
      (status ? `&status=${status}` : "");
    dispatch(getAllContactUs({ query: q }));
  }, [dispatch, page, limit, keyword, status, date]);

  const updateParams = (upd) => {
    const next = Object.fromEntries(searchParams);
    Object.entries(upd).forEach(([k, v]) => {
      if (v !== undefined && v !== "") next[k] = v;
      else delete next[k];
    });
    setSearchParams(next);
  };

  const handleSearch = (f) => updateParams({ ...f, page: 1 });
  const handleLimitChange = (e) =>
    updateParams({ limit: e.target.value, page: 1 });
  const handlePageChange = (_, v) => updateParams({ page: v });

  const statusOptions = ["pending", "in-progress", "resolved", "closed"];

  const rows = data.map((item, index) => ({
    mainId: item?._id,
    id: item.serial_num,
    title: item.title,
    phone: item.user?.phone_number || "-",
    // comment: item.comment,
    createdAt: new Date(item.createdAt).toLocaleDateString( i18n.language === "ar" ? "ar-EG" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: item.status,
  }));

  const columns = [
    { key: "id", label: t("ID") },
    { key: "title", label: t("Title") },
    { key: "phone", label: t("phone number") },
    // { key: "comment", label: t("Comment") },
    { key: "createdAt", label: t("Date") },
    { key: "status", label: t("Status") },
  ];

  const fetchAndExport = async (type) => {
    try {
      const q =
        `` +
        (keyword ? `&keyword=${keyword}` : "") +
        (status ? `&status=${status}` : "") +
        (date ? `&date=${date}` : "");
      const response = await dispatch(
        getAllContactUsWithoutPaginations({ query: q })
      ).unwrap();

      const exportData = response.data.map((item, i) => ({
        ID: item.serial_num,
        Title: item.title,
        phone: item.user?.phone_number || "-",
        "Created At": new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        Status: item.status,
      }));

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ContactUs");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(
          new Blob([buf], { type: "application/octet-stream" }),
          `ContactUs_${Date.now()}.xlsx`
        );
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("ContactUs Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((r) => Object.values(r)),
        });
        doc.save(`ContactUs_${Date.now()}.pdf`);
      } else {
        const w = window.open("", "_blank");
        const html = `
          <html><head><title>ContactUs</title>
          <style>table{width:100%;border-collapse:collapse}th,td{border:1px solid #333;padding:4px;text-align:left}th{background:#eee}</style>
          </head><body>
            <h2>ContactUs Report</h2>
            <table>
              <thead>
                <tr>${Object.keys(exportData[0])
                  .map((k) => `<th>${k}</th>`)
                  .join("")}</tr>
              </thead>
              <tbody>
                ${exportData
                  .map(
                    (r) =>
                      `<tr>${Object.values(r)
                        .map((v) => `<td>${v}</td>`)
                        .join("")}</tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </body></html>`;
        w.document.write(html);
        w.document.close();
        w.print();
      }
    } catch (err) {
      console.error("Export ContactUs error:", err);
    }
  };

  // ---------- Modal state & handlers ----------
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [localStatus, setLocalStatus] = useState("");

  const handleOpenDetails = (row) => {
    // find the full item from data by _id (we stored it as mainId in the rows)
    const item = data.find((d) => d._id === row.mainId);
    if (!item) {
      // fallback: try find by serial_num
      const fallback = data.find((d) => d.serial_num === row.id);
      setSelectedItem(fallback || null);
    } else {
      setSelectedItem(item);
    }
    setLocalStatus(item?.status || "");
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedItem(null);
    setLocalStatus("");
  };

  const refreshList = () => {
    const q =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (date ? `&date=${date}` : "") +
      (currentStatusFilter ? `&status=${currentStatusFilter}` : "");
    dispatch(getAllContactUs({ query: q }));
  };

  const handleSaveStatus = async () => {
    if (!selectedItem) return;
    if (!hasEditPermission) {
      notify("noPermissionToUpdateStatus", "warning");
      return;
    }

    try {
      await dispatch(
        editContactUs({ id: selectedItem._id, data: { status: localStatus } })
      ).unwrap();
      notify("statusUpdatedSuccessfully", "success");
      handleCloseDetails();
      refreshList();
    } catch (err) {
      console.error("Update status error:", err);
      notify("errorUpdatingStatus", "error");
    }
  };

  // existing onStatusChange (keeps previous table-based update behavior)
  const onStatusChange = async (row, newStatus) => {
    if (!hasEditPermission) {
      return notify("noPermissionToUpdateStatus", "warning");
    }
    await dispatch(
      editContactUs({ id: row.mainId, data: { status: newStatus } })
    );
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (currentStatusFilter ? `&status=${currentStatusFilter}` : "");
    dispatch(getAllContactUs({ query }));
  };

  // --------------------------------------------

  if (loading) return <LoadingPage />;
  if (!hasViewPermission) return <Navigate to="/profile" />;

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
        title={t("Contact Us")}
        subtitle={t("")}
        i18n={i18n}
        isExcel
        isPdf
        isPrinter
        onExcel={() => fetchAndExport("excel")}
        onPdf={() => fetchAndExport("pdf")}
        onPrinter={() => fetchAndExport("print")}
      />

      <Box sx={{ my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          initialFilters={{
            keyword,
            status,
            date,
          }}
          statusOptions={statusOptions}
          isContactUs={true}
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => handleOpenDetails(r)}
        statusKey="status"
        showStatusChange={true}
        isContactUs={true}
        onStatusChange={onStatusChange}
        sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1 }}
      />

      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="sm"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {t("Contact Us Details")}
          <IconButton onClick={handleCloseDetails}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {!selectedItem ? (
            <Typography>{t("No details available")}</Typography>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedItem.title}
              </Typography>

              <Typography variant="body2" gutterBottom>
                <strong>{t("Phone")}: </strong>
                {selectedItem.user?.phone_number || "-"}
              </Typography>

              <Typography variant="body2" gutterBottom>
                <strong>{t("Date")}: </strong>
                {new Date(selectedItem.createdAt).toLocaleDateString(
                  i18n.language,
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </Typography>

              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle2">{t("Comment")}</Typography>
                {/* comment may be string or array */}
                {typeof selectedItem.comment === "string" ? (
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {selectedItem.comment || "-"}
                  </Typography>
                ) : Array.isArray(selectedItem.comment) ? (
                  selectedItem.comment.length ? (
                    selectedItem.comment.map((c, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", mt: 1 }}
                      >
                        {`${idx + 1}. ${c}`}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2">-</Typography>
                  )
                ) : (
                  <Typography variant="body2">-</Typography>
                )}
              </Box>

            <CustomTextField
  fullWidth
  select
  label={t("Status")}
  value={localStatus}
  onChange={(e) => setLocalStatus(e.target.value)}
  disabled={!hasEditPermission}
  sx={{ mt: 2 }}
>
  {statusOptions.map((s) => (
    <MenuItem key={s} value={s}>
      {t(s)}
    </MenuItem>
  ))}
</CustomTextField>

            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDetails}>{t("Cancel")}</Button>
          <Button
            variant="contained"
            onClick={handleSaveStatus}
            disabled={
              !selectedItem ||
              !hasEditPermission ||
              localStatus === selectedItem?.status
            }
          >
            {t("Save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactUsPage;
