import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCarAssignments, getAllCarAssignmentsWithoutPaginations, editCarAssignment } from "../../redux/slices/carAssignment/thunk";
import LoadingPage from "../../components/LoadingComponent";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import notify from "../../components/notify";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";

const CarDriverPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isArabic = i18n.language === "ar";

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("CarDriver");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view")
  const hasAddPermission = hasPermission("add")
  const hasEditPermission = hasPermission("edit");
  const hasDeletePermission = hasPermission("delete")


  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";

  const { assignments = {}, loading } = useSelector((state) => state.carAssignment);
  const { data = [], totalPages = 1, page: currentPage = 1 } = assignments;

  useEffect(() => {
    const q =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (status ? `&status=${status}` : "");
    dispatch(getAllCarAssignments({ query: q }));
  }, [dispatch, page, limit, keyword, status]);

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  const updateParams = (upd) => {
    const next = Object.fromEntries(searchParams);
    Object.entries(upd).forEach(([k, v]) => {
      if (v !== undefined && v !== "") next[k] = v;
      else delete next[k];
    });
    setSearchParams(next);
  };

  const handleSearch = (filters) => updateParams({ ...filters, page: 1 });
  const handleLimitChange = (e) => updateParams({ limit: e.target.value, page: 1 });
  const handlePageChange = (_, v) => updateParams({ page: v });

  const addCarDriverSubmit = () => navigate("/CarDriverDetails/AddCarDrive");

  const rows = data.map((item, index) => ({
    mainId: item._id,
    user_type: item.driver_id?.user_type,
    id: item?.serial_num,
    driverName: item?.driver_id?.fullname || "-",
    driver_type: t(item.driver_id?.user_type) || "",    carModel: item?.cars_id?.car_model || "-",
    assignDate: new Date(item?.assign_datetime).toLocaleDateString( i18n.language === "ar" ? "ar-EG" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      numberingSystem: "latn",
    }),
    releaseDate: item?.release_date ? new Date(item?.release_date).toLocaleDateString( i18n.language === "ar" ? "ar-EG" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      numberingSystem: "latn",
    }) : t("notReleased"),
    // status: item?.driver_id?.status || "Unknown",
  }));

  const columns = [
    
    { key: "mainId", label: t("mainId") , isPrivate:true },
    { key: "id", label: t("Cars-drivers ID") },
    { key: "driverName", label: t("Driver Name") },
    { key: "driver_type", label: t("Driver Type") },
    { key: "carModel", label: t("Car Model") },
    { key: "assignDate", label: t("Assign Date") },
    { key: "releaseDate", label: t("Release Date") },
    // { key: "status", label: t("Status") },
  ];

  const fetchAndExport = async (type) => {
    try {
      const q =
        (keyword ? `&keyword=${keyword}` : "") +
        (status ? `&status=${status}` : "");
  
      const response = await dispatch(getAllCarAssignmentsWithoutPaginations({ query: q })).unwrap();
  
      const exportData = response.data.map((item, i) => ({
        [t("Cars-drivers ID")]: item?.serial_num,
        [t("Driver Name")]: item?.driver_id?.fullname || "-",
        [t("Car Model")]: item?.cars_id?.car_model || "-",
        [t("Assign Date")]: new Date(item.assign_datetime).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        [t("Release Date")]:item?.release_date ?  new Date(item.release_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) : t("notReleased"),
      }));
  
      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Car-Driver");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf], { type: "application/octet-stream" }), `Car-Driver_${Date.now()}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text(t("Cars-Drivers Report"), 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((r) => Object.values(r)),
        });
        doc.save(`Car-Driver_${Date.now()}.pdf`);
      } else {
        const w = window.open("", "_blank");
        const html = `
          <html><head><title>${t("Cars-Drivers Report")}</title>
          <style>table{width:100%;border-collapse:collapse}th,td{border:1px solid #333;padding:4px;text-align:left}th{background:#eee}</style>
          </head><body>
            <h2>${t("Cars-Drivers Report")}</h2>
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
      console.error("Export car-driver error:", err);
    }
  };


  const handleViewDetails = (row) => {
    navigate(`/CarDriverDetails/${row.mainId}`);
  };
  const releasedClick = async (row) => {
    console.log("row",row)
    if(!hasEditPermission){
      return notify("noPermissionToUpdateStatus", "warning");
    }
    if(row?.user_type == "driver_with_car"){
      return notify(t("cantreleasePersonaldriver"), "warning");
    }


    try {
      // تحقق إن كان هناك تاريخ إنهاء مسبق
      if (row?.releaseDate && row.releaseDate !== t("notReleased")) {
        notify(t("The driver has already been released from the car"), "warning");
        return;
      }
  
      await dispatch(
        editCarAssignment({
          id: row.mainId,
          data: { release_date: new Date().toISOString().split("T")[0] },
        })
      ).unwrap();
  
      notify(t("The driver has been released from the car successfully"), "success");
  
      // يمكنك إعادة التحميل أو التحديث إن أردت:
      dispatch(getAllCarAssignments({ query: `page=${page}&limit=${limit}` }));
  
    } catch (error) {
      console.error("Release driver error:", error);
      notify(t("An error occurred while releasing the driver from the car"), "error");
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
        overflowX: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
  <Header
  title={t("Cars-Drivers")}
  subtitle={t("Cars-Drivers Details")}
  i18n={i18n}
  haveBtn={hasAddPermission}
  btn={t("Link Car-Driver")}
  btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
  onSubmit={addCarDriverSubmit}
  isExcel
  isPdf
  isPrinter
  onExcel={() => fetchAndExport("excel")}
  onPdf={() => fetchAndExport("pdf")}
  onPrinter={() => fetchAndExport("print")}
/>


      {/* Filters */}
      <Box sx={{ width: "100%", flexShrink: 0, my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          initialFilters={{ keyword, status }}
          statusOptions={["released", "not_released"]}
          isCarDriver
        />
      </Box>

      {/* Table */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          overflow: "auto",
          borderRadius: 1,
          boxShadow: 1,
          minHeight: 0,
        }}
      >
        <TableComponent
          columns={columns}
          data={rows}
          onViewDetails={handleViewDetails}
          releasedClick={releasedClick}
          statusKey="status"
          showStatusChange={true}
          isCarDriver
        />
      </Box>

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

export default CarDriverPage;
