// CommissionPage.js
import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllDailyCommissions, getAllDailyCommissionsWithoutPaginations } from "../../redux/slices/dailyCommissions/thunk";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import LoadingPage from "../../components/LoadingComponent";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CommissionPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // parse url params
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const user_type = searchParams.get("user_type") || ""; // "true" or "false" or ""
  const date = searchParams.get("date") || ""; // e.g. 2025-09-01

  // redux state
  const { dailyCommissions = {}, allDailyCommissions, loading } = useSelector(
    (state) => state.dailyCommissions
  );
  const {
    data = [],
    total = 0,
    page: currentPage = 1,
    totalPages = 1,
  } = dailyCommissions;

  console.log("dailyCommissions",dailyCommissions)
  useEffect(() => {
    // build query string for API
    const queryParts = [`page=${page}`, `limit=${limit}`];
    if (keyword) queryParts.push(`keyword=${keyword}`);
    if (user_type !== "") queryParts.push(`user_type=${user_type}`);
    if (date) queryParts.push(`date=${date}`);
    const query = queryParts.join("&");

    dispatch(getAllDailyCommissions({ query }));
  }, [dispatch, page, limit, keyword, user_type, date]);

  const updateParams = (updates) => {
    const params = Object.fromEntries(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params[key] = value;
      else delete params[key];
    });
    setSearchParams(params);
  };

  // helper function
const formatDate = (dateStr, lang) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const locale = lang === "ar" ? "ar-EG" : "en-GB";
  return date.toLocaleDateString(locale, {
    year: "numeric",
     month: "short",
    day: "numeric",
    numberingSystem: "latn",
  });
};



  const handleSearch = (filters) => {
    // FilterComponent should return { keyword, user_type, date } (it already had isCommission in your original)
    updateParams({ ...filters, page: 1 });
  };

  const handleLimitChange = (e) =>
    updateParams({ limit: e.target.value, page: 1 });
  const handlePageChange = (_, value) => updateParams({ page: value });

  // Prepare rows for the table
  const rows = data.map((c, index) => {
    const is_user_type = c.driver_id?.user_type === "driver_company";
    return {
      id: c._id,
      commissionId: (currentPage - 1) * limit + index + 1,
      driverName:c.driver_id?.fullname,
      is_user_type,
      date: formatDate(c.day || c.createdAt, i18n.language),
      totalAmount: c.total_amount,
      commissionAmount: c.commission_amount,
      // tripsCount: c.trips_array?.length || 0,
      raw: c,
    };
  });

  const columns = [
    { key: "commissionId", label: t("Commission ID") },
    { key: "driverName", label: t("Driver Name") },
    {
      key: "is_user_type",
      label: t("App Vehicle?"),
      render: (row) => (row.is_user_type ? t("Yes") : t("No")),
    },
    { key: "date", label: t("Date") },
    { key: "totalAmount", label: t("Total Amount") },
    { key: "commissionAmount", label: t("Commission Amount") },
    // { key: "tripsCount", label: t("Trips") },
  ];

  useEffect(() => {
    // prevent horizontal scroll on page
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  const onViewDetails = (r) => {
    navigate(`/CommissionDetails/${r.id}`);
  };

  // Export (excel/pdf/print)
  const fetchAndExport = async (type) => {
    try {
      const queryParts = [];
      if (keyword) queryParts.push(`keyword=${keyword}`);
      if (user_type !== "") queryParts.push(`user_type=${user_type}`);
      if (date) queryParts.push(`date=${date}`);

     ;
      const query = queryParts.join("&");

      const response = await dispatch(getAllDailyCommissionsWithoutPaginations({ query })).unwrap();
      
      const exportData = allDailyCommissions?.data.map((c, idx) => {
        
        const is_user_type = c.driver_id?.user_type === "driver_company";
        return {
          ID: idx + 1,
          "Driver Name": c.driver_id?.fullname,
          "App Vehicle": is_user_type ? "Yes" : "No",
          Date: formatDate(c.day || c.createdAt, "en"),
          "Total Amount": c.total_amount,
          "Commission Amount": c.commission_amount,
          // "Trips Count": c.trips_array?.length || 0,
        };
      });

      if (exportData.length === 0) return;

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Commissions");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(dataBlob, `Commissions_${new Date().toISOString()}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Daily Commissions Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((row) => Object.values(row)),
        });
        doc.save(`Commissions_${new Date().toISOString()}.pdf`);
      } else if (type === "print") {
        const printableWindow = window.open("", "_blank");
        const htmlContent = `
          <html>
            <head>
              <title>Commissions Report</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h2>Commissions Report</h2>
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
      <Header
        title={t("Commissions")}
        subtitle={t("Commissions Details")}
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
          initialFilters={{ keyword, user_type, date }}
          isCommission
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        actionIconType="details"
        showStatusChange={false}
        onActionClick={(e, row) => navigate(`/CommissionDetails/${row.id}`)}
        onViewDetails={onViewDetails}
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

export default CommissionPage;
