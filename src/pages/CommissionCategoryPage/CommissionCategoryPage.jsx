// CommissionCategoryPage.js
import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCommissionsCategory, 
  getAllCommissionsCategoryWithoutPaginations, 
  editCommissionCategory, 
} from "../../redux/slices/commissionCategory/thunk";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import LoadingPage from "../../components/LoadingComponent";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ControlPoint } from "@mui/icons-material";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";
import {
  getAllCarTypesWithoutPaginations,
} from "../../redux/slices/carType/thunk";

const CommissionCategoryPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

    const { allCarTypes } = useSelector((state) => state.carType);
    const { categories = {}, loading } = useSelector(
      (state) => state.commissionCategory
    );

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const carType = searchParams.get("carType") || "";

  const {
    data = [],
    total = 0,
    page: currentPage = 1,
    totalPages = 1,
  } = categories;

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("CommissionCategories");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view");
  const hasAddPermission = hasPermission("add");
  const hasEditPermission = hasPermission("edit");

  useEffect(() => {
    // build query string exactly like your backend expects
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (carType ? `&car_types_id=${carType}` : "") +
      (status === "Available"
        ? `&status=true`
        : status === "Rejected"
        ? `&status=false`
        : "");
    dispatch(getAllCommissionsCategory({ query }));
  }, [dispatch, page, limit, status, keyword, carType]);

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

  // map API data to table rows
  const rows = data.map((c, index) => ({
    id: c._id,
    categoryId: (currentPage - 1) * limit + index + 1,
    carType:
      i18n.language === "ar"
        ? c.car_types_id?.name_ar || ""
        : c.car_types_id?.name_en || "",
    commissionWithCar: `${c.commission_value_driver_with_car} %`,
    commissionCompany: `${c.commission_value_driver_company} %`,
    amountFrom: c.amount_from,
    amountTo: c.amount_to,
    status: c.status === true ? "Available" : "Rejected",
  }));

  const columns = [
    { key: "categoryId", label: t("Commission Category ID") },
    { key: "carType", label: t("Car Type") },
    { key: "commissionWithCar", label: t("Commission (Driver With Car)") },
    { key: "commissionCompany", label: t("Commission (Driver Company)") },
    { key: "amountFrom", label: t("Amount From") },
    { key: "amountTo", label: t("Amount To") },
    { key: "status", label: t("Status") },
  ];

  useEffect(() => {
    dispatch(getAllCarTypesWithoutPaginations({ query: "" }));
  
    // keep layout stable (same as your other pages)
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  const fetchAndExport = async (type) => {
    try {
      const query =
        (keyword ? `&keyword=${keyword}` : "") +
        (status === "Available"
          ? `&status=true`
          : status === "Rejected"
          ? `&status=false`
          : "");

      const response = await dispatch(
        getAllCommissionsCategoryWithoutPaginations({ query })
      ).unwrap();
      const allCategories = response?.data || [];

      const exportData = allCategories.map((c, index) => ({
        ID: index + 1,
        "Car Type":
          i18n.language === "ar"
            ? c.car_types_id?.name_ar
            : c.car_types_id?.name_en,
        "Commission (Driver With Car)": c.commission_value_driver_with_car,
        "Commission (Driver Company)": c.commission_value_driver_company,
        "Amount From": c.amount_from,
        "Amount To": c.amount_to,
        Status: c.status === true ? "Available" : "Rejected",
        "Created At": c.createdAt
          ? new Date(c.createdAt).toLocaleDateString()
          : "",
      }));

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "CommissionCategories");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(dataBlob, `CommissionCategories_${new Date().toISOString()}.xlsx`);
      } else if (type === "pdf") {
        if (!exportData.length) return;
        const doc = new jsPDF();
        doc.text("Commission Categories Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((row) => Object.values(row)),
        });
        doc.save(`CommissionCategories_${new Date().toISOString()}.pdf`);
      } else if (type === "print") {
        if (!exportData.length) return;
        const printableWindow = window.open("", "_blank");
        const htmlContent = `
          <html>
            <head>
              <title>Commission Categories Report</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h2>Commission Categories Report</h2>
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

  const onStatusChange = async (row, newStatus) => {
    if (!hasEditPermission) {
      return notify("noPermissionToUpdateStatus", "warning");
    }

    try {
      const data = {
        status: newStatus === "active" ? true : false,
      };

      // dispatch an edit thunk (replace `editCommissionCategory` with your actual thunk name)
      await dispatch(editCommissionCategory({ id: row.id, data })).unwrap();

      // re-fetch list after update
      const query =
        `page=${page}&limit=${limit}` +
        (keyword ? `&keyword=${keyword}` : "") +
        (status === "Available"
          ? `&status=true`
          : status === "Rejected"
          ? `&status=false`
          : "");
      await dispatch(getAllCommissionsCategory({ query }));
    } catch (err) {
      console.error("Status update error:", err);
      notify("updateFailed", "error");
    }
  };

  if (loading) return <LoadingPage />;
  if (!hasViewPermission) return <Navigate to="/profile" />;

  const addCategorySubmit = () => {
    navigate("/CommissionCategory/AddCommissionCategory");
  };

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
        title={t("Commission Categories")}
        subtitle={t("Commission Categories Details")}
        haveBtn={hasAddPermission}
        i18n={i18n}
        btn={t("Add Commission Category")}
        btnIcon={<ControlPoint sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        onSubmit={addCategorySubmit}
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
          statusOptions={["Available", "Rejected"]}
          isCommissionCategory
          carTypeOptions={allCarTypes?.data}
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => navigate(`/CommissionCategoryDetails/${r.id}`)}
        loading={loading}
        sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1 }}
        onStatusChange={onStatusChange}
        isCommissionCategory
        showStatusChange
        statusKey="status"
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

export default CommissionCategoryPage;
