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
} from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import LoadingPage from "../../components/LoadingComponent";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import {
  getAllLiquidations,
  getAllLiquidationsWithoutPaginations,
  editLiquidation,
} from "../../redux/slices/liquidation/thunk";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";

const LiquidationPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [confirmLiquidation, setConfirmLiquidation] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const date = searchParams.get("date") || ""; // e.g. 2025-09-01

  const { liquidations = {}, loading } = useSelector(
    (state) => state.liquidation
  );

  const {
    data = [],
    total = 0,
    page: currentPage = 1,
    totalPages = 1,
  } = liquidations;

  // Permissions
  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Liquidations");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view");
  const hasEditPermission = hasPermission("edit");

  // fetch
  useEffect(() => {
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&serial_num=${keyword}` : "") +
      (date ? `&date=${date}` : "");
    dispatch(getAllLiquidations({ query }));
  }, [dispatch, page, limit, date, keyword]);

  const updateParams = (updates) => {
    const params = Object.fromEntries(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params[key] = value;
      else delete params[key];
    });
    setSearchParams(params);
  };

  const handleSearch = (filters) => updateParams({ ...filters, page: 1 });
  const handleLimitChange = (e) =>
    updateParams({ limit: e.target.value, page: 1 });
  const handlePageChange = (_, value) => updateParams({ page: value });

  // prepare rows
  const rows = data.map((l) => ({
    id: l._id,
    serial: l.serial_num,
    startDate: new Date(l.start_date).toLocaleDateString(),
    endDate: new Date(l.end_date).toLocaleDateString(),
    status: l.status,
    driverName: l.driver?.name || "-", // عشان تستخدمها في الرسالة
  }));

  const columns = [
    { key: "serial", label: t("Serial Number") },
    { key: "startDate", label: t("Start Date") },
    { key: "endDate", label: t("End Date") },
    { key: "status", label: t("Status") },
  ];

  // Export handler (نفس الكود بتاعك)

  const fetchAndExport = async (type) => {
    try {
      const query =
        (keyword ? `&serial_num=${keyword}` : "") +
        (date ? `&date=${date}` : "");
      const response = await dispatch(
        getAllLiquidationsWithoutPaginations({ query })
      ).unwrap();
      const allLiquidations = response?.data || [];

      const exportData = allLiquidations.map((l) => ({
        "Serial Number": l.serial_num,
        "Start Date": new Date(l.start_date).toLocaleDateString(),
        "End Date": new Date(l.end_date).toLocaleDateString(),
        Status: l.status,
        "Created At": new Date(l.createdAt).toLocaleDateString(),
      }));

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Liquidations");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(data, `Liquidations_${new Date().toISOString()}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Liquidations Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((row) => Object.values(row)),
        });
        doc.save(`Liquidations_${new Date().toISOString()}.pdf`);
      } else if (type === "print") {
        const printableWindow = window.open("", "_blank");
        const htmlContent = `
          <html>
            <head>
              <title>Liquidations Report</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h2>Liquidations Report</h2>
              <table>
                <thead>
                  <tr>${Object.keys(exportData[0])
                    .map((key) => `<th>${key}</th>`)
                    .join("")}</tr>
                </thead>
                <tbody>
                  ${exportData
                    .map(
                      (row) =>
                        `<tr>${Object.values(row)
                          .map((value) => `<td>${value}</td>`)
                          .join("")}</tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </body>
          </html>
        `;
        printableWindow.document.write(htmlContent);
        printableWindow.document.close();
        printableWindow.print();
      }
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  // Row actions
  const onRowClick = (e, row) => {
    navigate(`/LiqudationDetails/${row.id}`);
  };

  const onLiquidationClick = (e, row) => {
    if (row?.status === "completed") {
      return notify(t("driver_already_liquidated"), "warning");
    }
    setSelectedRow(row);
    setConfirmLiquidation(true);
  };

  const handleConfirm = async () => {
    if (!selectedRow) return;

    try {
      await dispatch(
        editLiquidation({ id: selectedRow.id, data: { status: "completed" } })
      ).unwrap();
      notify(t("liquidation_success"), "success");

      // refresh
      const query =
        `page=${page}&limit=${limit}` +
        (keyword ? `&serial_num=${keyword}` : "") +
        (date ? `&date=${date}` : "");
      dispatch(getAllLiquidations({ query }));
    } catch (error) {
      notify(t("something_went_wrong"), "error");
    }

    setConfirmLiquidation(false);
    setSelectedRow(null);
  };

  const handleCancel = () => {
    setSelectedRow(null);
    setConfirmLiquidation(false);
  };

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
        title={t("Liquidations")}
        subtitle={""}
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
          initialFilters={{ keyword, status, date }}
          statusOptions={["pending", "completed"]}
          isLiquidation
          DonthasStatus={true}
        />
      </Box>

        <TableComponent
          columns={columns}
          data={rows}
          actionIconType="details"
          actionIconType2="liqudation_now"
          showStatusChange={false}
          onActionClick={onRowClick}
          liqudationClick={onLiquidationClick}
                  statusKey="status"
                  sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1 }}
        />

      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      {/* Dialog */}
      <Dialog
        open={confirmLiquidation}
        onClose={handleCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("confirm_liquidation_title")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("confirm_liquidation_message", {
              name: selectedRow?.serial,
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{t("cancel")}</Button>
          <Button onClick={handleConfirm} variant="contained">
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LiquidationPage;
