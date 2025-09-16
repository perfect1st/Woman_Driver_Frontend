import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDrivers,
  getAllDriversWithoutPaginations,
  editDriver,
} from "../../redux/slices/driver/thunk";
import LoadingPage from "../../components/LoadingComponent";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllCarTypesWithoutPaginations } from "../../redux/slices/carType/thunk";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";

const DriversPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == 'ar'
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get query parameters from URL
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const carType = searchParams.get("carType") || "";
  const currentStatusFilter = status;

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Drivers");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view")
  const hasAddPermission = hasPermission("add")
  const hasEditPermission = hasPermission("edit")
  const hasDeletePermission = hasPermission("delete")
  const { drivers = {}, loading } = useSelector((state) => state.driver);
  const { allCarTypes } = useSelector((state) => state.carType);
  const {
    drivers: driverList = [],
    currentPage = 1,
    totalPages = 1,
    totalDrivers = 0,
  } = drivers;

  // Fetch drivers when parameters change
  useEffect(() => {
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (carType ? `&car_types_id=${carType}` : "") +
      (status ? `&status=${status}` : "") 
     ;
        
    dispatch(getAllDrivers({ query }));

  }, [dispatch, page, limit, status, keyword,carType]);

  // Update URL parameters
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

  // Map API data to table rows
  const rows = driverList.map((driver, index) => ({
    id: driver._id,
    user_type: driver.user_type,
    driverId: driver?.serial_num,
    name: driver.fullname,
    phone: driver.phone_number,
    carType: isArabic ? driver.car?.car_types_id?.name_ar : driver.car?.car_types_id?.name_en || "N/A",
    nationalId: driver.national_id_expired_date 
    ? new Date(driver.national_id_expired_date).toLocaleDateString( i18n.language === "ar" ? "ar-EG" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      numberingSystem: "latn",
    }) 
    : "",

    driverLicenseExpiry: driver.driver_license_expired_date 
      ? new Date(driver.driver_license_expired_date).toLocaleDateString( i18n.language === "ar" ? "ar-EG" : "en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        numberingSystem: "latn",
      })
      : "",
    carLicenseExpiry: driver.car?.car_license_expired_date 
      ? new Date(driver.car.car_license_expired_date).toLocaleDateString( i18n.language === "ar" ? "ar-EG" : "en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        numberingSystem: "latn",
      })
      : "",
    accountStatus: 
      driver.status 
  }));

  // Table columns configuration
  const tableColumns = [
    { key: "driverId", label: t("Driver ID") },
    { key: "name", label: t("Driver name") },
    { key: "phone", label: t("phone number") },
    { key: "carType", label: t("Car type") },
    { key: "nationalId", label: t("nationalIdExpDate") },
    { key: "driverLicenseExpiry", label: t("Driver license expiry") },
    { key: "carLicenseExpiry", label: t("Car license expiry") },
    { key: "accountStatus", label: t("Account status") },
    { key: "user_type", label: t("user_type"), isPrivate:true },
  ];

  // Handle status change
  const onStatusChange = async (id, newStatus) => {
    if(!hasEditPermission){
      return notify("noPermissionToUpdateStatus", "warning");
    }
    const driverId = id.id;
    const data ={
      status: newStatus == "Rejected" ? "banned" : newStatus,
      user_type: id?.user_type
    }
    
    await dispatch(
      editDriver({ id: driverId, data })
    );
    
    // Refresh data
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (carType ? `&carType=${carType}` : "") +
      (currentStatusFilter ? `&status=${currentStatusFilter}` : "");
    dispatch(getAllDrivers({ query }));
  };

  // Handle view details
  const handleViewDetails = (row) => {
    navigate(`/DriverDetails/${row.id}`);
  };

  // Export functionality
  const fetchAndExport = async (type) => {
    try {
      const query =
        (keyword ? `&keyword=${keyword}` : "") +
        (status ? `&status=${status}` : "");

      const response = await dispatch(
        getAllDriversWithoutPaginations({ query })
      ).unwrap();

      const exportData = response?.drivers?.map((driver, index) => ({
        "Driver ID": driver?.serial_num || "",
        "Full Name": driver.fullname,
        "Phone Number": driver.phone_number,
        "Car Type": driver.car?.car_types_id?.name_en || "N/A",
        "National ID": driver.national_id_number || "N/A",
        "Driver License Expiry": driver.driver_license_expired_date 
          ? new Date(driver.driver_license_expired_date).toLocaleDateString() 
          : "N/A",
        "Car License Expiry": driver.car?.car_license_expired_date 
          ? new Date(driver.car.car_license_expired_date).toLocaleDateString() 
          : "N/A",
        "Account Status": driver.status,
        "Created At": new Date(driver.createdAt).toLocaleDateString("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
}),
      }));

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Drivers");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(data, `Drivers_${new Date().toISOString().split('T')[0]}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Drivers Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((row) => Object.values(row)),
        });
        doc.save(`Drivers_${new Date().toISOString().split('T')[0]}.pdf`);
      } else if (type === "print") {
        const printableWindow = window.open("", "_blank");
        printableWindow.document.write(`
          <html>
            <head>
              <title>Drivers Report</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h2>Drivers Report</h2>
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
        `);
        printableWindow.document.close();
        printableWindow.print();
      }
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  useEffect(() => {
    dispatch(getAllCarTypesWithoutPaginations({query:''}));
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  if (loading) return <LoadingPage />;
  if (!hasViewPermission) return  <Navigate to="/profile" />;

  return (
    <Box
      component="main"
      sx={{
        p: isSmallScreen ? 2 : 3,
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Header
        title={t("Drivers")}
        subtitle={t("Drivers Details")}
        i18n={i18n}
        isExcel={true}
        isPdf={true}
        isPrinter={true}
        onExcel={() => fetchAndExport("excel")}
        onPdf={() => fetchAndExport("pdf")}
        onPrinter={() => fetchAndExport("print")}
      />

      {/* Filters */}
      <Box sx={{ my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          initialFilters={{ keyword, status }}
          statusOptions={["active", "pending", "banned"]}
          carTypeOptions={allCarTypes?.data}
          isDriver={true}
        />
      </Box>

      {/* Table */}
      <TableComponent
        columns={tableColumns}
        data={rows}
        onStatusChange={onStatusChange}
        onViewDetails={handleViewDetails}
        isDriver={true}
        sx={{ 
          flex: 1, 
          overflow: "auto", 
          boxShadow: 1, 
          borderRadius: 1,
          "&::-webkit-scrollbar": {
            height: "6px",
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.grey[400],
            borderRadius: "4px",
          },
        }}
      />

      {/* Pagination */}
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

export default DriversPage;