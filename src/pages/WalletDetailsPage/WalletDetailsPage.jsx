import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Avatar,
  Divider,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
  useTheme,
  Grid,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { FiberManualRecord, Star } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  getOneWallet,
  getUserWallet,
  updateTransation,
} from "../../redux/slices/wallet/thunk";
import { ReactComponent as LinkIcon } from "../../assets/LinkIcon.svg";
import StarIcon from "@mui/icons-material/Star";
import getPermissionsByScreen from "../../hooks/getPermissionsByScreen";
import notify from "../../components/notify";
import LoadingPage from "../../components/LoadingComponent";
import useBaseImageUrl from "../../hooks/useBaseImageUrl";
const statusStyles = {
  accepted: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },
  pending: { textColor: "#1849A9", bgColor: "#EFF8FF", borderColor: "#B2DDFF" },
  refused: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
  cancelled: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
};

const WalletDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname, search, state } = useLocation();
  const params = new URLSearchParams(search);
  const fromUser = params.get("fromUser") === "true";
  const dispatch = useDispatch();
  const walletId = id;
  const { wallet, loading } = useSelector((state) => state.wallet);
  console.log("wallet", wallet);
  // Load wallet data
  useEffect(() => {
    if (id) {
      if (fromUser) {
        dispatch(getUserWallet(id));
      } else dispatch(getOneWallet(id));
    }
  }, [id, dispatch]);

  // Tab state
  const currentTab = params.get("tab") || "details";
  const [tab, setTab] = useState(currentTab);

  // Filters state
  const initialSearch = params.get("search") || "";
  const initialStatus = params.get("status") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const baseImageUrl = useBaseImageUrl();
  function hasPermission(permissionType) {
    const permissions = getPermissionsByScreen("Wallet");
    return permissions ? permissions[permissionType] === true : false;
  }

  const hasViewPermission = hasPermission("view");
  const hasAddPermission = hasPermission("add");
  const hasEditPermission = hasPermission("edit");
  const hasDeletePermission = hasPermission("delete");
  // Sync URL
  useEffect(() => {
    const ps = new URLSearchParams(search);
    ps.set("tab", tab);
    if (tab === "history") {
      if (searchTerm) ps.set("search", searchTerm);
      if (statusFilter) ps.set("status", statusFilter);
    }
    navigate(`${pathname}?${ps.toString()}`, { replace: true });
  }, [tab, searchTerm, statusFilter]);

  // Wallet data
  const user = wallet?.user || {};
  const balance = wallet?.balance || 0;
  const transactions = wallet?.transactions || [];

  // History (transaction details for one transaction)
  const history = transactions.map((trx, index) => ({
    id: index + 1,
    "Transaction Type": trx.transaction_type,
    "Transaction Reason": trx.notes,
    Status: trx.status,
    Amount: `${trx.amount} SAR`,
    "Created At": new Date(trx.createdAt).toLocaleString(),
    Notes: trx.notes,
  }));

  const tableColumns = [
    { key: "_id", label: t("Transaction ID") },
    { key: "trans_type", label: t("Transaction Type") },
    { key: "transaction_type", label: t("Transaction Reason") },
    { key: "amount", label: t("Amount") },
    { key: "status", label: t("Status") },
    { key: "createdAt", label: t("Date") },
  ];

  const filterStatus = params.get("status") || "";
  const filterTransType = params.get("trans_type") || "";
  const filterTransactionType = params.get("transaction_type") || "";

  const filteredTransactions = transactions.filter((trx) => {
    return (
      (!filterStatus || trx.status === filterStatus) &&
      (!filterTransType || trx.trans_type === filterTransType) &&
      (!filterTransactionType || trx.transaction_type === filterTransactionType)
    );
  });

  const renderStatusChip = (status) => {
    const style = statusStyles[status?.toLowerCase()] || {};
    return (
      <Chip
        label={t(status)}
        icon={
          <FiberManualRecord sx={{ fontSize: 12, color: style.textColor }} />
        }
        sx={{
          color: style.textColor,
          backgroundColor: style.bgColor,
          border: "none",
          [`& .MuiChip-icon`]: {
            [isArabic ? "mr" : "ml"]: 1,
            color: style.textColor,
          },
        }}
      />
    );
  };

  const onStatusChange = async (id, status) => {
    if (!hasEditPermission) {
      return notify("noPermissionToUpdateStatus", "warning");
    }
    console.log("iiiiiiid", id, "status", status);
    const walletId = id?._id;
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
    await dispatch(getOneWallet(walletId));
  };

  if (loading) return <LoadingPage />;

  return (
    <Box
      component="main"
      sx={{ p: 3, ...(tab === "details" && { maxWidth: "md" }) }}
    >
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate("/wallet")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Wallet")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate("/wallet")}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Wallet Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography color="text.primary">
          {wallet?.transaction?.user_id?.fullname || wallet?.user?.name || "-"}
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
        {t("{{name}}’s Wallet", {
          name: wallet?.transaction?.user_id?.fullname || wallet?.user?.name || "-",
        })}
      </Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={t("Wallet Details")} value="details" />
        {wallet?.transactions?.length > 0 && <Tab label={t("Wallet History")} value="history" />}
      </Tabs>

      {/* Details Tab */}
      {tab === "details" && (
        <Box>
          <Card sx={{ mb: 3, background: theme.palette.secondary.sec }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                {t("Wallet")}: SAR {balance.toFixed(2)}
              </Typography>
              <Paper
                elevation={1}
                sx={{ display: "flex", alignItems: "center", p: 2, mt: 2 }}
              >
                <CreditCardIcon sx={{ mr: 1 }} />
                <Typography>
                  {t("Your Cash")}: SAR {balance.toFixed(2)}
                </Typography>
              </Paper>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3, background: theme.palette.secondary.sec }}>
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="primary"
                mb={1}
              >
                {t("User")}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                <Avatar
  sx={{ width: 64, height: 64 }}
  src={`${baseImageUrl}${wallet?.transaction?.user_id?.profile_image || wallet?.user?.profile}`}
>
  {wallet?.transaction?.user_id?.fullname?.[0] || wallet?.user?.name?.[0]}
</Avatar>

                </Grid>
                <Grid item xs>
                  <Typography fontWeight="bold">
                    {wallet?.transaction?.user_id?.fullname || wallet?.user?.name }
                  </Typography>
                  {wallet?.transaction?.user_id?.ratings && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        {wallet?.transaction?.user_id?.ratings?.average ||
                          "notRated"}
                      </Typography>
                      <StarIcon fontSize="small" color="warning" />
                    </Box>
                  )}
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ borderWidth: 2 }}
                    onClick={()=>{
                      if(wallet?.transaction == null){
                        if(fromUser){
                          return navigate(`/riderDetails/${wallet?.transaction?.user_id?._id || wallet?.user?.id}`)
                        }
                        navigate(`/driverDetails/${wallet?.transaction?.user_id?._id || wallet?.user?.id}`)
                      } else{
                        if(wallet?.transaction?.user_id?.user_type == "passenger")
                          {
                            return navigate(`/riderDetails/${wallet?.transaction?.user_id?._id || wallet?.user?.id}`)                        
                          } 
                        navigate(`/driverDetails/${wallet?.transaction?.user_id?._id || wallet?.user?.id}`)
                      }
                    }}
                  >
                    {t("View Profile")}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Transaction Details Table */}
          {wallet?.transaction && <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
            {t("Details")}
          </Typography>}

          <TableContainer>
            <Table
              size="small"
              sx={{
                borderCollapse: "separate",
                direction: isArabic ? "rtl" : "ltr",
                borderSpacing: 0,
                "& td, & th": {
                  border: "none",
                  textAlign: isArabic ? "right" : "left",
                },
              }}
            >
              <TableBody>
                {(() => {
                  const trx = wallet?.transaction;
                  if (!trx) return null;

                  const rows = [
                    {
                      key: "Dashboard User",
                      value: trx?.user_id?.fullname || "-",
                      clickable: true,
                      onClick: () =>
                        navigate(`/userDetails/${trx?.user_id?._id}`),
                    },
                    {
                      key: "Time",
                      value: new Date(trx.createdAt).toLocaleTimeString(),
                    },
                    {
                      key: "Date",
                      value: new Date(trx.createdAt).toLocaleDateString(),
                    },
                    { key: "Transaction Type", value: trx.trans_type },
                    { key: "Transaction Reason", value: trx.transaction_type },
                    {
                      key: "Status",
                      value: trx.status,
                      render: () => renderStatusChip(trx.status),
                    },
                    { key: "Amount", value: `${trx.amount} SAR` },
                    trx.trips_id?._id && {
                      key: "Trip",
                      value: trx.trips_id?.trip_number || "-",
                      clickable: true,
                      onClick: () =>
                        navigate(`/tripDetails/${trx.trips_id?._id}`),
                    },
                    trx.notes && { key: "Notes", value: trx.notes },
                  ].filter(Boolean);

                  return rows.map((row, idx) => (
                    <TableRow
                      key={row.key}
                      sx={{
                        backgroundColor:
                          idx % 2 === 0
                            ? theme.palette.secondary.sec
                            : theme.palette.background.paper,
                        "& td": { py: 2, px: 1 },
                      }}
                    >
                      <TableCell>{t(row.key)}</TableCell>
                      <TableCell>
                        {row.render ? (
                          row.render()
                        ) : row.clickable ? (
                          <Button
                            sx={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              component="span"
                              sx={{
                                color: theme.palette.text.blue, // use theme blue
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                textDecoration: "underline", // underline like a real link
                                fontWeight: "bold",
                              }}
                              onClick={row.onClick}
                            >
                              {t(row.value)}
                            </Typography>
                            <LinkIcon
                              fontSize="small"
                              sx={{
                                mx: 1,
                                transform: isArabic ? "rotate(180deg)" : "none",
                              }}
                            />
                          </Button>
                        ) : (
                          t(row.value)
                        )}
                      </TableCell>
                    </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* History Tab */}
      {tab === "history" && (
        <Box>
          <Box sx={{ mb: 2 }}>
            <FilterComponent
              onSearch={({ search, status }) => {
                setSearchTerm(search);
                setStatusFilter(status);
              }}
              statusOptions={["accepted", "pending", "rejected"]}
              isWalletDetails={true}
              isInWalletDetails={true}
              initialSearch={initialSearch}
              initialStatus={initialStatus}
            />
          </Box>
          <TableComponent
            columns={tableColumns.map((col) => ({
              ...col,
              headerName:
                col.key === "status" ? col.headerName : t(col.headerName),
            }))}
            data={filteredTransactions.map((trx, index) => ({
              id: index + 1,
              ...Object.keys(trx).reduce((acc, key) => {
                acc[key] =
                  key === "status"
                    ? trx[key]
                    : typeof trx[key] === "string"
                    ? t(trx[key])
                    : trx[key];
                return acc;
              }, {}),
              createdAt: new Date(trx.createdAt).toLocaleDateString(),
            }))}
            statusKey="status"
            customCellRenderer={{ status: renderStatusChip }}
            onStatusChange={onStatusChange}
            isWallet={true}
            isInDetails={true}
          />
        </Box>
      )}
    </Box>
  );
};

export default WalletDetailsPage;
