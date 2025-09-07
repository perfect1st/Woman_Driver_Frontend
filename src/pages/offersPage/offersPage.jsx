import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  editOffer,
  getAllOffers,
  getAllOffersWithoutPaginations,
} from "../../redux/slices/offer/thunk";
import LoadingPage from "../../components/LoadingComponent";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

const OffersPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar"
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const currentStatusFilter = status;

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Offers");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view");
  const hasAddPermission = hasPermission("add");
  const hasEditPermission = hasPermission("edit");

  const { offers = {}, loading } = useSelector((state) => state.offer);
  const {
    data = [],
    page: currentPage = 1,
    totalPages = 1,
    total = 0,
  } = offers;

  useEffect(() => {
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (status ? `&status=${status}` : "");
    dispatch(getAllOffers({ query }));
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

  const formatDate = (dateStr, lang) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const locale = lang === "ar" ? "ar-EG" : "en-US";
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // rows mapping for offers
  const rows = data.map((o, index) => ({
    id: o._id,
    index: (currentPage - 1) * limit + index + 1,
    title: o.title,
    value: `${o.offer_value} ${o.offer_type == "percentage" ? "%" : t("SAR")}`,
    maxDiscount: o.maximum_discount_value,
    startDate: formatDate(o.start_date, i18n.language),
    endDate: formatDate(o.end_date, i18n.language),
    status: o.status === "active" ? "Active" : "In Active",
  }));

  const columns = [
    { key: "index", label: t("ID") },
    { key: "title", label: t("Offer Title") },
    { key: "value", label: t("Value") },
    { key: "maxDiscount", label: t("Max Discount") },
    { key: "startDate", label: t("Start Date") },
    { key: "endDate", label: t("End Date") },
    { key: "status", label: t("Status") },
  ];

  if (loading) return <LoadingPage />;
  if (!hasViewPermission) return <Navigate to="/profile" />;

  const onStatusChange = async (row, status) => {
    if (!hasEditPermission) {
      return notify("noPermissionToUpdateStatus", "warning");
    }
    const offerId = row?.id;
    const newStatus = status === "active" ? "active" : "in_active";
    await dispatch(editOffer({ id: offerId, data: { status: newStatus } }));
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (currentStatusFilter ? `&status=${currentStatusFilter}` : "");
    dispatch(getAllOffers({ query }));
  };

  const fetchAndExport = async (type) => {
    try {
      const queryParts = [];
      if (keyword) queryParts.push(`keyword=${keyword}`);
      if (status !== "") queryParts.push(`status=${status}`);
      const query = queryParts.join("&");

      const response = await dispatch(
        getAllOffersWithoutPaginations({ query })
      ).unwrap();

      const exportData = response?.data.map((o, idx) => {
        return {
          ID: idx + 1,
          Offer: o.title,
          value: `${o.offer_value} ${o.offer_type == "percentage" ? "%" : t("SAR")}`,
          "Max Discount": o.maximum_discount_value,
          "Start Date": formatDate(o.start_date, "en"),
          "End Date": formatDate(o.end_date, "en"),
        };
      });

      if (!exportData || exportData.length === 0) return;

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Offers");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(dataBlob, `Offers_${new Date().toISOString()}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Offers Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((row) => Object.values(row)),
        });
        doc.save(`Offers_${new Date().toISOString()}.pdf`);
      } else if (type === "print") {
        const printableWindow = window.open("", "_blank");
        const htmlContent = `
          <html>
            <head>
              <title>Offers Report</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h2>Offers Report</h2>
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

  const addOfferSubmit = ()=>{
    navigate("addOffer")
  }

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
        title={t("Offers")}
        subtitle={t("Offers Details")}
        i18n={i18n}
        isExcel
        isPdf
        isPrinter
        haveBtn={hasAddPermission}
        btn={t("offer.add_title")}
        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        onSubmit={addOfferSubmit}
        onExcel={() => fetchAndExport("excel")}
        onPdf={() => fetchAndExport("pdf")}
        onPrinter={() => fetchAndExport("print")}
      />

      <Box sx={{ my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          initialFilters={{ keyword, status }}
          statusOptions={["active", "in_active"]}
          isOffer={true}
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => navigate(`/offerDetails/${r.id}`)}
        loading={loading}
        sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1 }}
        onStatusChange={onStatusChange}
        statusKey="status"
        isOffer={true}
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

export default OffersPage;
