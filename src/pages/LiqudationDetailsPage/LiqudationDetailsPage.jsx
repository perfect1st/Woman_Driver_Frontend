// LiquidationDetailsPage.js
import React, { useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import LoadingPage from "../../components/LoadingComponent";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getOneLiquidation, getOneLiquidationWithoutPagination } from "../../redux/slices/liquidation/thunk";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const LiquidationDetailsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // query params
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const user_type = searchParams.get("user_type") || "";

  const { liquidation, loading } = useSelector((state) => state.liquidation);

  const details = liquidation?.details || [];
  const total = liquidation?.total || 0;
  const currentPage = liquidation?.page || 1;
  const totalPages = liquidation?.totalPages || 1;

  useEffect(() => {
    const query =
      `page=${page}&limit=${limit}` + (keyword ? `&serial_num=${keyword}` : "")+ (user_type ? `&user_type=${user_type}` : "");
    dispatch(getOneLiquidation({ id, query }));
  }, [dispatch, id, page, limit, keyword,user_type]);

  // update query params
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

  // table rows
  const rows = details.map((d, index) => ({
    id: d._id,
    rowId: (currentPage - 1) * limit + index + 1,
    driverName: d.driver_id?.fullname || "-",
    driverType: t(d.driver_id?.user_type) || "-",
    totalBalance: d.total_balance_array.toFixed(2) || 0,
    transactions: d.balance_array || [],
  }));

  // table columns
  const columns = [
    { key: "rowId", label: t("ID") },
    { key: "driverName", label: t("Driver Name") },
    { key: "driverType", label: t("User Type") },
    {
      key: "totalBalance",
      label: t("Total Balance"),
      render: (row) => {
        const isPositive = row.totalBalance >= 0;
        const Icon = isPositive ? ArrowUpward : ArrowDownward;
        const color = isPositive
          ? theme.palette.success.main
          : theme.palette.error.main;
        return (
          <Box display="flex" alignItems="center" sx={{ color }}>
            <Icon fontSize="small" />
            <Box component="span" sx={{ ml: 0.5 }}>
              {row.totalBalance}
            </Box>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  const fetchAndExport = async (type) => {
  try {
    // build query without pagination so we get full details
    const query =
      (keyword ? `&keyword=${keyword}` : "") +
      (user_type ? `&user_type=${user_type}` : "");

    // fetch the liquidation (full data)
    const response = await dispatch(getOneLiquidationWithoutPagination({ id, query })).unwrap();

    console.log("response",response)
    // normalize response shape (handle possible shapes)
    const payload = response?.liquidation || {};
    const allDetails = response?.details || [];

    if (!allDetails.length) {
      console.warn("No details to export");
      return;
    }

    // Build export rows (one row per driver detail)
    const exportData = allDetails.map((d, idx) => ({
      "No.": (idx + 1),
      "Driver Name": d.driver_id?.fullname || "-",
      "Driver Type": d.driver_id?.user_type || "-",
      "Total Balance": Number(d.total_balance_array ?? 0).toFixed(2),
      "Transactions Count": Array.isArray(d.balance_array) ? d.balance_array.length : 0,
    }));

    // Excel
    if (type === "excel") {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Liquidation Details");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(dataBlob, `Liquidation_${id}_Details_${new Date().toISOString()}.xlsx`);
      return;
    }

    // PDF
    if (type === "pdf") {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      const title = `Liquidation ${payload?.serial_num ? `#${payload.serial_num} ` : ""} Details`;
      doc.setFontSize(14);
      doc.text(title, 40, 40);

      const head = [Object.keys(exportData[0])];
      const body = exportData.map((row) => Object.values(row));

      autoTable(doc, {
        startY: 60,
        head,
        body,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [220, 220, 220] },
        margin: { left: 20, right: 20 },
      });

      doc.save(`Liquidation_${id}_Details_${new Date().toISOString()}.pdf`);
      return;
    }

    // Print
    if (type === "print") {
      const printableWindow = window.open("", "_blank");
      const keys = Object.keys(exportData[0]);
      const htmlContent = `
        <html>
          <head>
            <title>Liquidation Details</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #333; padding: 6px 8px; text-align: left; font-size: 12px; }
              th { background:#f2f2f2; }
            </style>
          </head>
          <body>
            <h2>${payload?.serial_num ? `Liquidation #${payload.serial_num} - ` : ""}Details</h2>
            <table>
              <thead>
                <tr>${keys.map((k) => `<th>${k}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${exportData
                  .map(
                    (row) =>
                      `<tr>${keys
                        .map((k) => `<td>${(row[k] !== null && row[k] !== undefined) ? row[k] : ""}</td>`)
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
      printableWindow.focus();
      printableWindow.print();
      return;
    }

    // unknown type
    console.warn("Unknown export type:", type);
  } catch (err) {
    console.error("Export error:", err);
  }
};



  if (loading) return <LoadingPage />;

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

<Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/Liqudation")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Liquidations")}
        </Typography>
        <Typography mx={1}>{"<"}</Typography>
        <Typography
          onClick={() => navigate("/Liqudation")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Liquidation Details")}
        </Typography>  <Typography mx={1}>{`<`}</Typography>
        <Typography>{liquidation?.liquidation?.serial_num}</Typography>    </Box>

      <Header
        title={""}
        subtitle={t("Liquidation Details")}
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
          initialFilters={{ keyword }}
          statusOptions={[]} // not needed unless you want to filter by status
          hasDriversType={true}
          DonthasStatus={true}
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        loading={loading}
        dontShowActions
        showStatusChange={false}
        sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1 }}
      />

      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </Box>
  );
};

export default LiquidationDetailsPage;
