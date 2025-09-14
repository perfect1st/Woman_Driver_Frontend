// This is a UsersPage component similar to PassengersPage, with filtering, pagination, export, and permissions logic

import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import LoadingPage from "../../components/LoadingComponent";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getAllUsers,
  getAllUsersWithoutPaginations,
  editUser
} from "../../redux/slices/user/thunk";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import notify from "../../components/notify";

const UsersPage = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const currentStatusFilter = status;

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Users");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view")
  const hasAddPermission = hasPermission("add")
  const hasEditPermission = hasPermission("edit")
  const hasDeletePermission = hasPermission("delete")

 

  const { users = {}, loading } = useSelector((state) => state.user);
  const {
    admins = [],
    currentPage = 1,
    totalPages = 1,
    totalUsers = 0,
  } = users;

  useEffect(() => {
    const query = `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (status ? `&status=${status}` : "");
    dispatch(getAllUsers({ query }));
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
  const handleLimitChange = (e) => updateParams({ limit: e.target.value, page: 1 });
  const handlePageChange = (_, value) => updateParams({ page: value });

  const rows = admins.map((u, index) => ({
    id: u._id,
    userId: (currentPage - 1) * limit + index + 1,
    name: u.name,
    phone: u.phone_number,
    email: u.email,
    status: u.status === "active" ? t("Available") : t("Rejected"),
    superAdmin: u.super_admin ? t("Yes") : t("No"),
  }));

  const columns = [
    { key: "userId", label: t("User ID") },
    { key: "name", label: t("Name") },
    { key: "phone", label: t("Phone Number") },
    { key: "email", label: t("Email") },
    { key: "status", label: t("Status") },
    { key: "superAdmin", label: t("Super Admin") },
  ];

  const handleStatusUpdate = (id, newStatus) => {
    if(!hasEditPermission){
      return notify("noPermissionToUpdateStatus", "warning");
    }
    dispatch(editUser({ id, data: { status: newStatus } }))
      .unwrap()
      .then(() => {
        dispatch(getAllUsers({ query: `page=${page}&limit=${limit}&keyword=${keyword}&status=${status}` }));
      })
      .catch((err) => {
        console.error("Failed to update user status:", err);
      });
  };

  const onStatusChange = async (id, status) => {
    console.log("id", id, "status", status);
    const userId = id?.id;
    const accountStatus =
      status == "Accepted"
        ? "active"
        : status == "Rejected"
        ? "inactive"
        : status == "Pending" ? "pending" : status;
    await dispatch(
      editUser({ id: userId, data: { status: accountStatus } })
    );
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (currentStatusFilter ? `&status=${currentStatusFilter}` : "");

    dispatch(getAllUsers({ query }));
  };


  

  if (!hasViewPermission) return <Navigate to="/profile" />;
  if (loading) return <LoadingPage />;

  const fetchAndExport = async (type) => {
    try {
      const query = (keyword ? `&keyword=${keyword}` : "") +
        (status ? `&status=${status}` : "");

      const response = await dispatch(getAllUsersWithoutPaginations({ query })).unwrap();
      const fullUsers = response || [];

      const exportData = fullUsers.map((user, index) => ({
        userId: index + 1,
        Name: user.name,
        "Phone Number": user.phone_number,
        Email: user.email,
        Status: user.status === "active" ? t("Available") : t("Rejected"),
        "Super Admin": user.super_admin ? "Yes" : "No",
        "Created At": new Date(user.createdAt).toLocaleDateString(),
      }));

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, `Users_${new Date().toISOString()}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Users Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map(row => Object.values(row)),
        });
        doc.save(`Users_${new Date().toISOString()}.pdf`);
      } else if (type === "print") {
        const printableWindow = window.open("", "_blank");
        const htmlContent = `
          <html>
            <head>
              <title>Users Report</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h2>Users Report</h2>
              <table>
                <thead><tr>${Object.keys(exportData[0]).map(k => `<th>${k}</th>`).join("")}</tr></thead>
                <tbody>${exportData.map(row => `<tr>${Object.values(row).map(v => `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody>
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

  const addUserSubmit = () => {
    navigate("/users/addUser");
  };
  return (
    <Box component="main" sx={{ p: isSmall ? 2 : 3, width: "100%", maxWidth: "100vw", boxSizing: "border-box", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header
        title={t("Users")}
        subtitle={t("Users Details")}
        i18n={i18n}
        haveBtn={hasAddPermission}
        btn={t("Add User")}
        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        onSubmit={addUserSubmit}
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
          statusOptions={["active", "inactive"]}
          isUsers={true}
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
        loading={loading}
        isUsers={true}
        sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1 }}
        onStatusChange={onStatusChange}
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

export default UsersPage;
