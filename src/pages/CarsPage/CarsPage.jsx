// src/pages/Cars/CarsPage.js
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
  editCar,
  getAllCars,
  getAllCarsWithoutPaginations,
} from "../../redux/slices/car/thunk";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { getAllCarTypesWithoutPaginations } from "../../redux/slices/carType/thunk";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";

const CarsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isArabic = i18n.language === "ar";

  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const car_types_id = searchParams.get("carType") || "";
  const companyCar = searchParams.get("companyCar") || "";
  const status = searchParams.get("status") || "";
  const currentStatusFilter = status;

  const { allCarTypes } = useSelector((state) => state.carType);

  const { cars = {}, loading } = useSelector((state) => state.car);
  const { data = [], total = 0, page: currentPage = 1, totalPages = 1 } = cars;
  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Cars");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view")
  const hasAddPermission = hasPermission("add")
  const hasEditPermission = hasPermission("edit")
  const hasDeletePermission = hasPermission("delete")

  useEffect(() => {
    const q =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (status
        ? `&status=${
            status === "Available"
              ? "available"
              : status === "Rejected"
              ? "unavailable"
              : status
          }`
        : "")
       +
      (companyCar ? `&is_company_car=${companyCar == "Company Car" ? true : false}` : "") +
      (car_types_id ? `&car_types_id=${car_types_id}` : "");
    dispatch(getAllCars({ query: q }));
  }, [dispatch, page, limit, keyword, car_types_id, companyCar, status]);

  const updateParams = (upd) => {
    const next = Object.fromEntries(searchParams);
    Object.entries(upd).forEach(([k, v]) => {
      if (v !== undefined && v !== "") next[k] = v;
      else delete next[k];
    });
    setSearchParams(next);
  };

  const handleSearch = (f) => updateParams({ ...f, page: 1 });
  const handleLimitChange = (e) =>
    updateParams({ limit: e.target.value, page: 1 });
  const handlePageChange = (_, v) => updateParams({ page: v });

  const companyCarOptions = ["Company Car", "User Car"];
  const statusOptions = ["Available", "Rejected", "maintenance"];

  const rows = data.map((car, index) => ({
    mainId:car?._id,
    id: car?.serial_num,
    model: car.car_model,
    carType: (
      isArabic
        ? car?.car_types_id?.name_ar
        : car?.car_types_id?.name_en
    ) || '-',
    companyCar: car.is_company_car ? "Company Car" : "User Car",
    licenseExpiry: new Date(car.createdAt).toLocaleDateString( i18n.language === "ar" ? "ar-EG" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      numberingSystem: "latn",
    }),
    status: car.status, // تحتاج API توفر الحالة الفعلية

  }));

  const columns = [
    { key: "id", label: t("Car ID") },
    { key: "model", label: t("Car Model") },
    { key: "carType", label: t("Car type") },
    { key: "companyCar", label: t("Company Car") },
    { key: "licenseExpiry", label: t("Car license EX") },
    { key: "status", label: t("Car status") },
  ];

  const fetchAndExport = async (type) => {
    try {
      const q =
      (keyword ? `&keyword=${keyword}` : "") +
      (status
        ? `&status=${
            status === "Available"
              ? "available"
              : status === "Rejected"
              ? "unavailable"
              : status
          }`
        : "")
       +
      (companyCar ? `&is_company_car=${companyCar == "Company Car" ? true : false}` : "") +
      (car_types_id ? `&car_types_id=${car_types_id}` : "");

      const response = await dispatch(
        getAllCarsWithoutPaginations({ query: q })
      ).unwrap();

      const exportData = response.data.map((car, i) => ({
        // ID: i + 1,
        "Car ID":  car?.serial_num,
        Model: car.car_model,
        "Company Car": car.is_company_car ? "Company Car" : "User Car",
          "car Type": 
       car?.car_types_id?.name_en
     || '-',
    "license Expiry": new Date(car.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    "status": car.status, 
        "Created At": new Date(car.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cars");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(
          new Blob([buf], { type: "application/octet-stream" }),
          `Cars_${Date.now()}.xlsx`
        );
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Cars Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((r) => Object.values(r)),
        });
        doc.save(`Cars_${Date.now()}.pdf`);
      } else {
        const w = window.open("", "_blank");
        const html = `
          <html><head><title>Cars</title>
          <style>table{width:100%;border-collapse:collapse}th,td{border:1px solid #333;padding:4px;text-align:left}th{background:#eee}</style>
          </head><body>
            <h2>Cars Report</h2>
            <table>
              <thead>
                <tr>${Object.keys(exportData[0])
                  .map((k) => `<th>${k}</th>`)
                  .join("")}</tr>
              </thead>
              <tbody>
                ${exportData
                  .map(
                    (r) =>
                      `<tr>${Object.values(r)
                        .map((v) => `<td>${v}</td>`)
                        .join("")}</tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </body></html>`;
        w.document.write(html);
        w.document.close();
        w.print();
      }
    } catch (err) {
      console.error("Export cars error:", err);
    }
  };

  const addCarSubmit = () => {
    navigate("/Cars/AddCar");
  };


  const onStatusChange = async (id, status) => {
    if(!hasEditPermission){
      return notify("noPermissionToUpdateStatus", "warning");
    }
    const carId = id?.mainId;
    const accountStatus =
      status == "active"
        ? "available" 
        : status == "Rejected"
        ? "unavailable"
        : status == "maintenance"
        ? "maintenance"
        : status == "Pending" ? "pending" : status;
    await dispatch(
      editCar({ id: carId, data: { status: accountStatus } })
    );
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (currentStatusFilter ? `&status=${currentStatusFilter}` : "");

    dispatch(getAllCars({ query }));
  };


  useEffect(() => {
    dispatch(getAllCarTypesWithoutPaginations({ query: "" }));

    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  if (loading) return <LoadingPage />;
  if (!hasViewPermission) return <Navigate to="/profile" />;


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
        title={t("Cars")}
        subtitle={t("Cars Details")}
        i18n={i18n}
        haveBtn={hasAddPermission}
        btn={t("Add Car")}
        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        onSubmit={addCarSubmit}
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
          carTypeOptions={allCarTypes?.data}
          companyCarOptions={companyCarOptions}
          statusOptions={statusOptions}
          isCar
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => navigate(`/CarDetails/${r.mainId}`)}
        statusKey="status"
        showStatusChange={true}
        isCar
        onStatusChange={onStatusChange}
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

export default CarsPage;
