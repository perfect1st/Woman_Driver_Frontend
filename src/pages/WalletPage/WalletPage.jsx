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
  getAllWallets,
  getAllWalletsWithoutPaginations,
  updateTransation,
} from "../../redux/slices/wallet/thunk";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import notify from "../../components/notify";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";

const WalletPage = () => {
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
  const user_type = searchParams.get("user_type") || "";
  const trans_type = searchParams.get("trans_type") || "";
  const transaction_type = searchParams.get("transaction_type") || "";
  const status = searchParams.get("status") || "";
  const currentStatusFilter = status;
  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Wallet");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view");
  const hasAddPermission = hasPermission("add");
  const hasEditPermission = hasPermission("edit");
  const hasDeletePermission = hasPermission("delete");

  const { wallets: walletsData = {}, loading } = useSelector(
    (state) => state.wallet
  );
  const {
    data = [],
    total = 0,
    currentPage = 1,
    totalPages = 1,
  } = walletsData;

  useEffect(() => {
    const q =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (status ? `&status=${status}` : "") +
      (user_type ? `&user_type=${user_type}` : "") +
      (trans_type ? `&trans_type=${trans_type}` : "") +
      (transaction_type ? `&transaction_type=${transaction_type}` : "");
    dispatch(getAllWallets({ query: q }));
  }, [
    dispatch,
    page,
    limit,
    keyword,
    status,
    user_type,
    trans_type,
    transaction_type,
  ]);

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

  const statusOptions = ["accepted", "pending", "refused"];

  const rows = data.map((wallet, index) => ({
    mainId: wallet?._id,
    id: (currentPage - 1) * limit + index + 1,
    userName: wallet.user_id?.fullname || "-",
    userType: t(wallet.user_id?.user_type) || "-",
    dashboardUser: wallet.admin_id?.name ?  wallet.admin_id?.name : t("System"),
    transactionType: t(wallet.trans_type),
    transactionReason: t(wallet.transaction_type),
    status: wallet.status,
    amount: wallet.amount,
    notes: wallet.notes,
  }));

  const columns = [
    { key: "id", label: t("Transaction ID") },
    { key: "userName", label: t("User Name") },
    { key: "userType", label: t("User Type") },
    { key: "dashboardUser", label: t("Dashboard User") },
    { key: "transactionType", label: t("Transaction Type") },
    { key: "transactionReason", label: t("Transaction Reason") },
    { key: "status", label: t("Status") },
  ];

  const fetchAndExport = async (type) => {
    try {
      const q =
        `` +
        (keyword ? `&keyword=${keyword}` : "") +
        (status ? `&status=${status}` : "") +
        (user_type ? `&user_type=${user_type}` : "") +
        (trans_type ? `&trans_type=${trans_type}` : "") +
        (transaction_type ? `&transaction_type=${transaction_type}` : "");
      const response = await dispatch(
        getAllWalletsWithoutPaginations({ query: q })
      ).unwrap();

      const exportData = response.data.map((wallet, i) => ({
        ID: i + 1,
        "User Name": wallet.user_id?.fullname || "-",
        "User Type": wallet.user_id?.user_type || "-",
        dashboardUser:  wallet.admin_id?.name ?  wallet.admin_id?.name : "System",
        "Transaction Type": wallet.trans_type,
        Amount: wallet.amount,
        Status: wallet.status,
        Date: new Date(wallet.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        Notes: wallet.notes,
      }));

      if (type === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Wallets");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(
          new Blob([buf], { type: "application/octet-stream" }),
          `Wallets_${Date.now()}.xlsx`
        );
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("Wallets Report", 14, 10);
        autoTable(doc, {
          startY: 20,
          head: [Object.keys(exportData[0])],
          body: exportData.map((r) => Object.values(r)),
        });
        doc.save(`Wallets_${Date.now()}.pdf`);
      } else {
        const w = window.open("", "_blank");
        const html = `
          <html><head><title>Wallets</title>
          <style>table{width:100%;border-collapse:collapse}th,td{border:1px solid #333;padding:4px;text-align:left}th{background:#eee}</style>
          </head><body>
            <h2>Wallets Report</h2>
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
      console.error("Export wallets error:", err);
    }
  };

  const addTransactionSubmit = () => {
    navigate("/Wallet/AddTransaction");
  };

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  const onStatusChange = async (id, status) => {
    if (!hasEditPermission) {
      return notify("noPermissionToUpdateStatus", "warning");
    }
    console.log("id", id, "status", status);
    const walletId = id?.mainId;
    const accountStatus =
      status == "Accepted"
        ? "accepted"
        : status == "Available"
        ? "accepted"
        : status == "Rejected"
        ? "refused"
        : status == "Pending"
        ? "pending"
        : status;
    await dispatch(
      updateTransation({ id: walletId, data: { status: accountStatus } })
    );
    const query =
      `page=${page}&limit=${limit}` +
      (keyword ? `&keyword=${keyword}` : "") +
      (currentStatusFilter ? `&status=${currentStatusFilter}` : "");

    dispatch(getAllWallets({ query }));
  };

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
        title={t("Wallet")}
        subtitle={t("Wallet Details")}
        i18n={i18n}
        haveBtn
        btn={t("Add Transaction")}
        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        onSubmit={addTransactionSubmit}
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
          initialFilters={{
            keyword,
            status,
            user_type,
            trans_type,
            transaction_type,
          }}
          statusOptions={statusOptions}
          isWallet
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => navigate(`/walletDetails/${r.mainId}`)}
        statusKey="status"
        showStatusChange={true}
        isWallet
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

export default WalletPage;
