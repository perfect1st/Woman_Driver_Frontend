import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme, Typography } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  editPassenger,
  getAllPassengers,
  getAllPassengersWithoutPaginations,
} from "../../redux/slices/passenger/thunk";
import LoadingPage from "../../components/LoadingComponent";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ⬅️ هذا هو الجزء الناقص عندك

const PassengersPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const currentStatusFilter = status; 

  const { passengers = {}, loading } = useSelector((state) => state.passenger);
  const {
    users = [],
    currentPage = 1,
    totalPages = 1,
    totalUsers = 0,
  } = passengers;

  console.log("loading", loading);
  useEffect(() => {
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (status ? `&status=${status}` : "");
    dispatch(getAllPassengers({ query }));
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

  const rows = users.map((u) => ({
    id: u._id,
    riderId: u._id.slice(-6).toUpperCase(),
    name: u.fullname,
    phone: u.phone_number,
    rate: u.rate || "N/A",
    trips: u.trips || 0,
    accountStatus:
      u.status === "active"
        ? "Available"
        : u.status === "pending"
        ? "Pending"
        : "Rejected",
  }));

  const columns = [
    { key: "riderId", label: t("Rider ID") },
    { key: "name", label: t("Rider name") },
    { key: "phone", label: t("Phone Number") },
    { key: "rate", label: t("Rate") },
    { key: "trips", label: t("Trips number") },
    { key: "accountStatus", label: t("Account Status") },
  ];

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  useEffect(() => {
    if (loading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [loading]);
  if (loading) {
    return <LoadingPage />;
  }

  const onStatusChange = async (id, status) => {
    console.log("id", id, "status", status);
    const PassengerId = id?.id;
    const accountStatus =
      status == "Accepted"
        ? "active"
        : status == "Rejected"
        ? "banned"
        : "pending";
    await dispatch(
      editPassenger({ id: PassengerId, data: { status: accountStatus } })
    );
    const query =
    `page=${page}&limit=${limit}` +
    (keyword ? `&keyword=${keyword}` : "") +
    (currentStatusFilter ? `&status=${currentStatusFilter}` : "");

  dispatch(getAllPassengers({ query }));
  };

  const fetchAndExport = async (type) => {
    try {
      const query =
        (keyword ? `&keyword=${keyword}` : "") +
        (status ? `&status=${status}` : "");
  
      const response = await dispatch(
        getAllPassengersWithoutPaginations({ query })
      ).unwrap();
  
      const fullUsers = response.users || [];
  
      const exportData = fullUsers.map((user, index) => ({
        "Rider ID": index + 1,
        "Full Name": user.fullname,
        "Phone Number": user.phone_number,
        "Email": user.email,
        "Status":
          user.status === "active"
            ? "Available"
            : user.status === "pending"
            ? "Pending"
            : "Rejected",
        "Created At": new Date(user.createdAt).toLocaleDateString(),
      }));
  
      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Riders");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(data, `Riders_${new Date().toISOString()}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Riders Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((row) => Object.values(row)),
        });
        doc.save(`Riders_${new Date().toISOString()}.pdf`);
      } else if (type === "print") {
        const printableWindow = window.open("", "_blank");
        const htmlContent = `
          <html>
            <head>
              <title>Riders Report</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h2>Riders Report</h2>
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
  

  const handleSortClick = (column) => {
    console.log("Coloum Clicked", column.key);
    // نفّذ عملية الفرز هنا حسب العمود
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
        title={t("Rider")}
        subtitle={t("Riders Details")}
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
          initialFilters={{ keyword, status }}
          statusOptions={["Available", "Pending", "Rejected"]}
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => navigate(`/riderDetails/${r.id}`)}
        loading={loading}
        sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1 }}
        onStatusChange={onStatusChange}
        onSortClick={handleSortClick}
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

export default PassengersPage;
