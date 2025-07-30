import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const currentStatusFilter = status;

  const { drivers = {}, loading } = useSelector((state) => state.driver);
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
      (status ? `&status=${status}` : "") 
     ;
        
    dispatch(getAllDrivers({ query }));
  }, [dispatch, page, limit, status, keyword]);

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
    driverId: (currentPage - 1) * limit + index + 1,
    name: driver.fullname,
    phone: driver.phone_number,
    carType: isArabic ? driver.car?.car_types_id?.name_ar : driver.car?.car_types_id?.name_en || "N/A",
    nationalId: driver.national_id_number || "N/A",
    driverLicenseExpiry: driver.driver_license_expired_date 
      ? new Date(driver.driver_license_expired_date).toLocaleDateString() 
      : "N/A",
    carLicenseExpiry: driver.car?.car_license_expired_date 
      ? new Date(driver.car.car_license_expired_date).toLocaleDateString() 
      : "N/A",
    accountStatus: 
      driver.status 
  }));

  // Table columns configuration
  const tableColumns = [
    { key: "driverId", label: t("Driver ID") },
    { key: "name", label: t("Driver name") },
    { key: "phone", label: t("phone number") },
    { key: "carType", label: t("Car type") },
    { key: "nationalId", label: t("National ID") },
    { key: "driverLicenseExpiry", label: t("Driver license expiry") },
    { key: "carLicenseExpiry", label: t("Car license expiry") },
    { key: "accountStatus", label: t("Account status") },
  ];

  // Handle status change
  const onStatusChange = async (id, newStatus) => {
    const driverId = id.id;
    const backendStatus =  newStatus
    
    await dispatch(
      editDriver({ id: driverId, data: { status: backendStatus } })
    );
    
    // Refresh data
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
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

      const exportData = response.map((driver, index) => ({
        "Driver ID": index + 1,
        "Full Name": driver.fullname,
        "Phone Number": driver.phone_number,
        "Car Model": driver.car?.car_model || "N/A",
        "National ID": driver.national_id_number || "N/A",
        "Driver License Expiry": driver.driver_license_expired_date 
          ? new Date(driver.driver_license_expired_date).toLocaleDateString() 
          : "N/A",
        "Car License Expiry": driver.car?.car_license_expired_date 
          ? new Date(driver.car.car_license_expired_date).toLocaleDateString() 
          : "N/A",
        "Account Status": driver.status
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

  // Prevent horizontal scrolling
  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  if (loading) return <LoadingPage />;

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
          statusOptions={["active", "pending", "panned"]}
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