import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  editCoupon,
  getAllCoupons,
  getAllCouponsWithoutPaginations,
} from "../../redux/slices/coupon/thunk";
import LoadingPage from "../../components/LoadingComponent";
import PaginationFooter from "../../components/PaginationFooter/PaginationFooter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";

const CouponsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const currentStatusFilter = status;

  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Coupons");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view");
  const hasEditPermission = hasPermission("edit");

  const { coupons = {}, loading } = useSelector((state) => state.coupon);
  const {
    data = [],
    page: currentPage = 1,
    totalPages = 1,
    total = 0,
  } = coupons;

  useEffect(() => {
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (status ? `&status=${status}` : "");
    dispatch(getAllCoupons({ query }));
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

  // rows mapping for coupons
  const rows = data.map((c, index) => ({
    id: c._id,
    index: (currentPage - 1) * limit + index + 1,
    title: c.title,
    type: c.coupon_type,
    value: c.coupon_value,
    usageCount: c.usage_count,
    maxDiscount: c.maximum_discount_value,
    perUser: c.usage_count_per_user_value,
    startDate: new Date(c.start_date).toLocaleDateString(),
    endDate: new Date(c.end_date).toLocaleDateString(),
    status: c.status === "active" ? "Active" : "In Active",
  }));

  const columns = [
    { key: "index", label: t("ID") },
    { key: "title", label: t("Coupon Title") },
    { key: "type", label: t("Type") },
    { key: "value", label: t("Value") },
    { key: "usageCount", label: t("Usage Count") },
    { key: "maxDiscount", label: t("Max Discount") },
    { key: "perUser", label: t("Usage/User") },
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
    const couponId = row?.id;
    const newStatus = status === "active" ? "active" : "in_active";
    await dispatch(editCoupon({ id: couponId, data: { status: newStatus } }));
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (status ? `&status=${status}` : "");
    dispatch(getAllCoupons({ query }));
  };

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
        title={t("Coupons")}
        subtitle={t("Coupons Details")}
        i18n={i18n}
        isExcel
        isPdf
        isPrinter
      />

      <Box sx={{ my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          initialFilters={{ keyword, status }}
          statusOptions={["active", "in_active"]}
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => navigate(`/couponDetails/${r.id}`)}
        loading={loading}
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

export default CouponsPage;
