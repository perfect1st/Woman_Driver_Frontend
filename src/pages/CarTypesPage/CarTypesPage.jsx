// CarTypesPage.js
import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCarTypes,
  getAllCarTypesWithoutPaginations,
  editCarType,
} from "../../redux/slices/carType/thunk";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import LoadingPage from "../../components/LoadingComponent";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ControlPoint } from "@mui/icons-material";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";

const CarTypesPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const currentStatusFilter = status;

  const { carTypes = {}, loading } = useSelector((state) => state.carType);
  const {
    data = [],
    total = 0,
    page: currentPage = 1,
    totalPages = 1,
  } = carTypes;

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("CarTypes");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view")
  const hasAddPermission = hasPermission("add")
  const hasEditPermission = hasPermission("edit");
  const hasDeletePermission = hasPermission("delete")


  useEffect(() => {
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (status === "Available"
        ? `&status=true`
        : status === "Rejected"
        ? `&status=false`
        : "");
    dispatch(getAllCarTypes({ query }));
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

  const rows = data.map((c, index) => ({
    id: c._id,
    typeId: c?.serial_num,
    name: i18n.language === "ar" ? c.name_ar : c.name_en,
    status: c.status === true ? "Available" : "Rejected",
  }));

  const columns = [
    { key: "typeId", label: t("Car Type ID") },
    { key: "name", label: t("Car Type Name") },
    { key: "status", label: t("Car Type Status") },
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
      const query =
        (keyword ? `&keyword=${keyword}` : "") +
        (status === "Available"
          ? `&status=true`
          : status === "Rejected"
          ? `&status=false`
          : "");

      const response = await dispatch(
        getAllCarTypesWithoutPaginations({ query })
      ).unwrap();
      const allCarTypes = response?.data || [];

      const exportData = allCarTypes?.map((c, index) => ({
        ID: c.serial_num || "",
        "Car Type Name": i18n.language === "ar" ? c.name_ar : c.name_en,
        Status: c.status === true ? "Available" : "Rejected",
        "Created At": new Date(c.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "CarTypes");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(data, `CarTypes_${new Date().toISOString()}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Car Types Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((row) => Object.values(row)),
        });
        doc.save(`CarTypes_${new Date().toISOString()}.pdf`);
      } else if (type === "print") {
        const printableWindow = window.open("", "_blank");
        const htmlContent = `
          <html>
            <head>
              <title>Car Types Report</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h2>Car Types Report</h2>
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
    // Optional: API call to update status
    if(!hasEditPermission){
      return notify("noPermissionToUpdateStatus", "warning");
    }
    const data ={
      status: newStatus == "active" ? true : false
    }
   await dispatch(editCarType({id:row.id,data}));
    const query =
    `page=${page}&limit=${limit}` +
    (keyword ? `&keyword=${keyword}` : "") +
    (status === "Available"
      ? `&status=true`
      : status === "Rejected"
      ? `&status=false`
      : "");
  await dispatch(getAllCarTypes({ query }));
  };

  if (loading) return <LoadingPage />;
  if (!hasViewPermission) return <Navigate to="/profile" />;

  const addCarTypeSubmit = () => {
    navigate("/CarTypes/AddCarType");
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
        title={t("Car Types")}
        subtitle={t("Car Types Details")}
        haveBtn={hasAddPermission}
        i18n={i18n}
        btn={t("Add Car Type")}
        btnIcon={<ControlPoint sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        onSubmit={addCarTypeSubmit}
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
          isCarType={true}
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => navigate(`/CarTypeDetails/${r.id}`)}
        loading={loading}
        sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1 }}
        onStatusChange={onStatusChange}
        isCarType
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

export default CarTypesPage;
