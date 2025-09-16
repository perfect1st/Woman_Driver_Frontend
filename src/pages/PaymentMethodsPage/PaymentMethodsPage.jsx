import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
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
  editPaymentMethod,
  getAllPaymentMethods,
  getAllPaymentMethodsWithoutPaginations,
} from "../../redux/slices/paymentMethod/thunk";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";

const PaymentMethodsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("PaymentMethods");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view");
  const hasAddPermission = hasPermission("add");
  const hasEditPermission = hasPermission("edit");
  const hasDeletePermission = hasPermission("delete");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const currentStatusFilter = status;

  const { paymentMethods = {}, loading } = useSelector(
    (state) => state.paymentMethod
  );

  const {
    data = [],
    total = 0,
    page: currentPage = 1,
    totalPages = 1,
  } = paymentMethods;

  useEffect(() => {
    const statusMap = {
      Available: true,
      Rejected: false,
    };

    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (status ? `&status=${status == "Available" ? "true" : "false" }` : "");

    dispatch(getAllPaymentMethods({ query }));
  }, [dispatch, page, limit, keyword, status]);

  const updateParams = (updates) => {
    const newParams = Object.fromEntries(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams[key] = value;
      else delete newParams[key];
    });
    setSearchParams(newParams);
  };

  const handleSearch = (filters) => {
    updateParams({ ...filters, page: 1 });
  };

  const handleLimitChange = (e) => {
    updateParams({ limit: e.target.value, page: 1 });
  };

  const handlePageChange = (_, value) => {
    updateParams({ page: value });
  };

  const rows = data.map((pm, index) => ({
    id: pm._id,
    typeId: pm?.serial_num,
    nameEn: pm.name_en,
    nameAr: pm.name_ar,
    status: pm.status ? "Available" : "Rejected",
  }));

  const tableColumns = [
    { key: "typeId", label: t("Payment Method ID") },
    { key: "nameEn", label: t("nameEn") },
    { key: "nameAr", label: t("nameAr") },
    { key: "status", label: t("Status") },
  ];

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  const addPaymentMethodSubmit = () => {
    navigate("/paymentMethod/AddPaymentMethod");
  };

  const handleViewDetails = (row) => {
    navigate(`/paymentMethodDetails/${row.id}`);
  };

  const handleStatusChange = async (id, status) => {
    if (!hasEditPermission) {
      return notify("noPermissionToUpdateStatus", "warning");
    }

    const PaymentMethodId = id?.id;
    const accountStatus =
      status == "Available"
        ? true
        : status == "active"
        ? true
        : status == "Rejected"
        ? false
        : status;
    await dispatch(
      editPaymentMethod({
        id: PaymentMethodId,
        data: { status: accountStatus },
      })
    );
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (currentStatusFilter ? `&status=${  currentStatusFilter == "Available" ? "true" : "false" }` : "");

    dispatch(getAllPaymentMethods({ query }));
  };

  const exportDataHandler = async (type) => {
    try {
      const query =
        (keyword ? `&keyword=${keyword}` : "") +
        (status === "Available"
          ? `&status=true`
          : status === "Rejected"
          ? `&status=false`
          : "");

      const result = await dispatch(
        getAllPaymentMethodsWithoutPaginations({ query })
      ).unwrap();

      const exportData = result.data.map((pm, idx) => ({
        ID: pm?.serial_num || "",
        "Payment Method (EN)": pm.name_en,
        "Payment Method (AR)": pm.name_ar,
        Status: pm.status ? "Available" : "Rejected",
        "Created At": new Date(pm.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "PaymentMethods");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(blob, `PaymentMethods_${new Date().toISOString()}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Payment Methods Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((row) => Object.values(row)),
        });
        doc.save(`PaymentMethods_${new Date().toISOString()}.pdf`);
      } else if (type === "print") {
        const printableWindow = window.open("", "_blank");
        const htmlContent = `
          <html>
            <head>
              <title>Payment Methods Report</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h2>Payment Methods Report</h2>
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
                          .map((val) => `<td>${val}</td>`)
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
  if (!hasViewPermission) return <Navigate to="/profile" />;

  return (
    <Box
      component="main"
      sx={{
        p: isSmallScreen ? 2 : 3,
        width: "100%",
        maxWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header
        title={t("Payment Methods")}
        subtitle={t("Payment Methods Details")}
        haveBtn={hasAddPermission}
        btn={t("Add Payment Method")}
        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        onSubmit={addPaymentMethodSubmit}
        isExcel
        isPdf
        isPrinter
        onExcel={() => exportDataHandler("excel")}
        onPdf={() => exportDataHandler("pdf")}
        onPrinter={() => exportDataHandler("print")}
        i18n={i18n}
      />

      {false && <Box sx={{ my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          initialFilters={{ keyword, status }}
          statusOptions={["Available", "Rejected"]}
          paymentMethod
        />
      </Box>}

      <TableComponent
        columns={tableColumns}
        data={rows}
        onViewDetails={handleViewDetails}
        onStatusChange={handleStatusChange}
        showStatusChange
        paymentMethod
        statusKey="status"
        loading={loading}
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

export default PaymentMethodsPage;
