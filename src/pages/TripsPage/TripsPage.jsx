// src/pages/Trips/TripsPage.js
import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import LoadingPage from "../../components/LoadingComponent";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTrips,
  getAllTripsWithoutPaginations,
} from "../../redux/slices/trip/thunk";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { getAllCarTypesWithoutPaginations } from "../../redux/slices/carType/thunk";

const statusMap = {
  requested: "OnRequest",
  accepted: "Approved",
  cancelled: "Cancelled",
  complete: "Complete",
  started: "Start",
};

const TripsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams, setSearchParams] = useSearchParams();
  const { allCarTypes } = useSelector((state) => state.carType);

  // URL params
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const car_types_id = searchParams.get("carType") || "";
  const is_scheduled = searchParams.get("tripType") || "";
  const statusFilter = searchParams.get("status") || "";

  // redux state
  const { trips = {}, loading } = useSelector((s) => s.trip);
  const { data = [], total = 0, page: currentPage = 1, totalPages = 1 } = trips;

  // fetch trips whenever params change
  useEffect(() => {
    const q =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (car_types_id ? `&car_types_id=${car_types_id}` : "") +
      (is_scheduled ? `&is_scheduled=${is_scheduled == 'Scheduled' ? 'true' : 'false'}` : "") +
      (statusFilter ? `&status=${statusFilter}` : "");
    dispatch(getAllTrips({ query: q }));
  }, [dispatch, page, limit, keyword, statusFilter, car_types_id, is_scheduled]);

  // update URL params helper
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

  // map API data to table rows
  const rows = data.map((trip, i) => ({
    id: trip._id,
    tripId: trip._id.slice(-6).toUpperCase(), // or any custom formatting
    riderName: trip.user_id.fullname,
    driverName: trip.driver_id?.fullname || t("Unassigned"),
    tripType: trip.is_scheduled ? t("Scheduled") : t("On Demand"),
    carType: trip.car_types_id.name_en,
    tripStatus: statusMap[trip.trips_status] || trip.trips_status,
  }));

  // table columns
  const columns = [
    { key: "tripId", label: t("Trip ID") },
    { key: "riderName", label: t("Rider name") },
    { key: "driverName", label: t("Driver name") },
    { key: "tripType", label: t("Trip Type") },
    { key: "carType", label: t("Car Type") },
    { key: "tripStatus", label: t("Trip status") },
  ];

  const tripTypeOptions = [
    { _id: 'Scheduled', name: t("Scheduled") },
    { _id: 'OnDemand', name: t("On Demand") }
  ];

  // prevent horizontal scroll
  useEffect(() => {
    dispatch(getAllCarTypesWithoutPaginations({ query: "" }));

    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  const fetchAndExport = async (type) => {
    try {
      const q =
        (keyword ? `&keyword=${keyword}` : "") +
        (statusFilter ? `&status=${statusFilter}` : "");
      const response = await dispatch(
        getAllTripsWithoutPaginations({ query: q })
      ).unwrap();

      console.log("response", response);
      const exportData = response.data.map((trip, idx) => ({
        ID: idx + 1,
        "Trip ID": trip._id.slice(-6).toUpperCase(),
        Rider: trip.user_id.fullname,
        Driver: trip.driver_id?.fullname || t("Unassigned"),
        Type: trip.car_types_id.name_en,
        Status: statusMap[trip.trips_status] || trip.trips_status,
        Cost: trip.cost,
        "Created At": new Date(trip.createdAt).toLocaleDateString(),
      }));

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Trips");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(
          new Blob([buf], { type: "application/octet-stream" }),
          `Trips_${Date.now()}.xlsx`
        );
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Trips Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((r) => Object.values(r)),
        });
        doc.save(`Trips_${Date.now()}.pdf`);
      } else {
        const w = window.open("", "_blank");
        const html = `
          <html><head><title>Trips</title>
          <style>table{width:100%;border-collapse:collapse}th,td{border:1px solid #333;padding:4px;text-align:left}th{background:#eee}</style>
          </head><body>
            <h2>Trips Report</h2>
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
      console.error("Export trips error:", err);
    }
  };

  if (loading) return <LoadingPage />;

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
        title={t("Trips")}
        subtitle={t("Trips Details")}
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
          initialFilters={{ keyword, status: statusFilter }}
          statusOptions={Object.values(statusMap)}
          tripTypeOptions={tripTypeOptions} // if you want server‐side, fetch distinct types
          isTrip
          carTypeOptions={allCarTypes?.data}
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => navigate(`/tripDetails/${r.id}`)}
        statusKey="tripStatus"
        showStatusChange={false}
        actionIconType="info"
        onActionClick={(_, r) => navigate(`/tripDetails/${r.id}`)}
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

export default TripsPage;
