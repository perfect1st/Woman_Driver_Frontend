// TrafficTimePage.jsx
import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  editTrafficTime,
  getAllTrafficTimes,
  getAllTrafficTimesWithoutPaginations,
} from "../../redux/slices/trafficTime/thunk";
import LoadingPage from "../../components/LoadingComponent";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

const TrafficTimePage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const currentStatusFilter = status;

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? t("PM") : t("AM");
    const adjustedHours = hours % 12 || 12; // 0 -> 12
    return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  };
  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("TrafficTimes");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view");
  const hasAddPermission = hasPermission("add");
  const hasEditPermission = hasPermission("edit");

  const { trafficTimes = {}, loading } = useSelector(
    (state) => state.trafficTime
  );

  const {
    data = [],
    page: currentPage = 1,
    totalPages = 1,
    total = 0,
  } = trafficTimes;
  

  useEffect(() => {
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (status ? `&status=${status}` : "");
    dispatch(getAllTrafficTimes({ query }));
  }, [dispatch, page, limit, status, keyword]);

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

  // rows mapping for traffic times
  const rows = data.map((tTime, index) => ({
    id: tTime._id,
    index: (currentPage - 1) * limit + index + 1,
    title: i18n.language === "ar" ? tTime.title_ar : tTime.title_en,
    kiloPrice: `${tTime.kilo_price_percentage}`,
    timeFrom: formatTime(tTime.time_from),
    timeTo: formatTime(tTime.time_to),
    status: tTime.status === "active" ? "active" : "inactive",
  }));

  const columns = [
    { key: "index", label: t("ID") },
    { key: "title", label: t("Traffic Time Name") },
    { key: "kiloPrice", label: t("kilo_price_percentage") },
    { key: "timeFrom", label: t("Time From") },
    { key: "timeTo", label: t("Time To") },
    { key: "status", label: t("Status") },
  ];

  if (loading) return <LoadingPage />;
  if (!hasViewPermission) return <Navigate to="/profile" />;

  const onStatusChange = async (row, status) => {
    if (!hasEditPermission) {
      return notify("noPermissionToUpdateStatus", "warning");
    }
    const trafficTimeId = row?.id;
    const newStatus = status === "active" ? "active" : "inactive";
    await dispatch(
      editTrafficTime({ id: trafficTimeId, data: { status: newStatus } })
    );
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (currentStatusFilter ? `&status=${currentStatusFilter}` : "");
    dispatch(getAllTrafficTimes({ query }));
  };

  const fetchAndExport = async (type) => {
    try {
      const queryParts = [];
      if (keyword) queryParts.push(`keyword=${keyword}`);
      if (status !== "") queryParts.push(`status=${status}`);
      const query = queryParts.join("&");

      const response = await dispatch(
        getAllTrafficTimesWithoutPaginations({ query })
      ).unwrap();

      const exportData = response?.data.map((tTime, idx) => {
        return {
          ID: idx + 1,
          Title: `${tTime.title_en}`,
          "Kilo Price": tTime.kilo_price_percentage,
          "Time From":formatTime(tTime.time_from),
          "Time To": formatTime(tTime.time_to),
          Status: tTime.status,
        };
      });

      if (exportData.length === 0) return;

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "TrafficTimes");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(dataBlob, `TrafficTimes_${new Date().toISOString()}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Traffic Times Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((row) => Object.values(row)),
        });
        doc.save(`TrafficTimes_${new Date().toISOString()}.pdf`);
      } else if (type === "print") {
        const printableWindow = window.open("", "_blank");
        const htmlContent = `
          <html>
            <head>
              <title>Traffic Times Report</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h2>Traffic Times Report</h2>
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

  const addTrafficTimeSubmit = () => {
    navigate("addTrafficTime");
  };

  return (
    <Box
      component="main"
      sx={{
        p: isSmall ? 2 : 3,
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header
        title={t("Traffic Time")}
        subtitle={t("Traffic Time Details")}
        i18n={i18n}
        isExcel
        isPdf
        isPrinter
        haveBtn={hasAddPermission}
        btn={t("Add Traffic Time")}
        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        onSubmit={addTrafficTimeSubmit}
        onExcel={() => fetchAndExport("excel")}
        onPdf={() => fetchAndExport("pdf")}
        onPrinter={() => fetchAndExport("print")}
      />

      <Box sx={{ my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          initialFilters={{ keyword, status }}
          statusOptions={["active", "inactive"]}
          isTrafficTime
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => navigate(`/trafficTimeDetails/${r.id}`)}
        loading={loading}
        sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1 }}
        onStatusChange={onStatusChange}
        statusKey="status"
        isTrafficTime
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

export default TrafficTimePage;
