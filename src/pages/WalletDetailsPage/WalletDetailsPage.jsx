import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Link,
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
  Rating,
  useTheme,
  Grid,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useTranslation } from "react-i18next";
import { FiberManualRecord, Star, Troubleshoot } from "@mui/icons-material";

const statusStyles = {
  Available: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },
  Pending: { textColor: "#1849A9", bgColor: "#EFF8FF", borderColor: "#B2DDFF" },
  Rejected: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
  Cancelled: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
  Complete: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },
  Linked: { textColor: "#085D3A", bgColor: "#ECFDF3", borderColor: "#ABEFC6" },
  Accepted: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },
  "OnRequest": {
    textColor: "#93370D",
    bgColor: "#FFFAEB",
    borderColor: "#FEDF89",
  },
  "Approved by driver": {
    textColor: "#1F2A37",
    bgColor: "#F9FAFB",
    borderColor: "#E5E7EB",
  },
  Leaved: { textColor: "#1F2A37", bgColor: "#F9FAFB", borderColor: "#E5E7EB" },
  Start: { textColor: "#1849A9", bgColor: "#EFF8FF", borderColor: "#B2DDFF" },
};

const WalletDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);

  // Tab state
  const currentTab = params.get("tab") || "details";
  const [tab, setTab] = useState(currentTab);

  // History filters from URL
  const initialSearch = params.get("search") || "";
  const initialStatus = params.get("status") || "";

  // Dummy user
  const user = {
    name: "Emma Davis",
    id: "72641",
    type: "Rider",
    balance: 98.5,
    rate: 4.8,
    details: {
      "Dashboard User": "Admin A",
      Time: "14:32",
      Date: "14/07/2025",
      "Transaction Type": "Deposit",
      "Transaction Reason": "Weekly settlement",
      Status: "Accepted",
      Amount: "EGP 98.50",
      Trip: "Trip Details",
      Notes: "Prompt service",
    },
  };
  const statusOptions = ["Accepted", "Rejected"];
  // Initial car types data
  const initialWallet = [
    {
      id: 1,
      userType: "Driver",
      dashboardUser: "Admin A",
      transactionType: "Deposit",
      transactionReason: "Weekly settlement",
      status: "Accepted",
    },
    {
      id: 2,
      userType: "Customer",
      dashboardUser: "Admin B",
      transactionType: "Withdrawal",
      transactionReason: "Refund",
      status: "Pending",
    },
    {
      id: 3,
      userType: "Driver",
      dashboardUser: "System",
      transactionType: "Deduction",
      transactionReason: "Penalty",
      status: "Rejected",
    },
    {
      id: 4,
      userType: "Customer",
      dashboardUser: "Admin C",
      transactionType: "Deposit",
      transactionReason: "Bonus",
      status: "Accepted",
    },
    {
      id: 5,
      userType: "Driver",
      dashboardUser: "Admin A",
      transactionType: "Withdrawal",
      transactionReason: "Driver request",
      status: "Pending",
    },
  ];

  const tableColumns = [
    { key: "id", label: t("Transaction ID") },
    { key: "dashboardUser", label: t("Dashboard User") },
    { key: "userType", label: t("User Type") },
    { key: "transactionType", label: t("Transaction Type") },
    { key: "transactionReason", label: t("Transaction Reason") },
    { key: "status", label: t("Status") },
  ];

  // Initialize history and wallet lists
  const initialHistory = [{ id: 1, ...user.details }];

  const [history, setHistory] = useState(initialHistory);
  const [wallet, setWallet] = useState(initialWallet);

  // Filter state
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  // Sync URL on tab change or filters change
  useEffect(() => {
    const ps = new URLSearchParams();
    ps.set("tab", tab);
    if (tab === "history") {
      if (searchTerm) ps.set("search", searchTerm);
      if (statusFilter) ps.set("status", statusFilter);
    }
    navigate(`${pathname}?${ps.toString()}`, { replace: true });
  }, [tab, searchTerm, statusFilter]);

  // Filtered lists
  const filteredHistory = history.filter(
    (item) =>
      (!searchTerm ||
        Object.values(item).some((val) =>
          val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )) &&
      (!statusFilter || item.Status === statusFilter)
  );
  const filteredWallet = wallet.filter(
    (item) =>
      (!searchTerm ||
        Object.values(item).some((val) =>
          val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )) &&
      (!statusFilter || item.status === statusFilter)
  );

  const renderStatusChip = (status) => {
    const style = statusStyles[status] || {};
    return (
      <Chip
      label={t(status)}
      icon={<FiberManualRecord sx={{ fontSize: 12, color: style.textColor }} />}
      sx={{
        color: style.textColor,
        backgroundColor: style.bgColor,
        border: 'none',
        [`& .MuiChip-icon`]: {
          [isArabic ? 'mr' : 'ml']: 1,
          color: style.textColor,
        },      }}
    />
    );
  };

  return (
    <Box component="main" sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography
          onClick={() => navigate('/wallet')}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Wallet")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography
          onClick={() => navigate('/wallet')}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        >
          {t("Wallet Details")}
        </Typography>
        <Typography mx={1}>{`<`}</Typography>
        <Typography color="text.primary">{user.name}</Typography>
              </Box>

      <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
        {t("{{name}}’s Wallet #{{id}}", { name: user.name, id: user.id })}
      </Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={t("Wallet Details")} value="details" />
        <Tab label={t("Wallet History")} value="history" />
      </Tabs>

      {tab === "details" && (
        <Box>
          <Card sx={{ mb: 3, background: theme.palette.secondary.sec }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                {t("Wallet")}: SAR {user.balance.toFixed(2)}
              </Typography>
              <Paper
                elevation={1}
                sx={{ display: "flex", alignItems: "center", p: 2, mt: 2 }}
              >
                <CreditCardIcon sx={{ mr: 1 }} />
                <Typography>
                  {t("Your Cash")}: SAR {user.balance.toFixed(2)}
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
                {t(user.type)}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar
                    src="/path/to/demo/image.jpg"
                    sx={{ width: 64, height: 64 }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography fontWeight="bold">{user.name}</Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {user.rate}
                    </Typography>
                    <Star
                      fontSize="small"
                      color="primary"
                      sx={{ ml: 0.5 }}
                    />
                  </Box>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ borderWidth: 2 }}
                  >
                    {t("View Profile")}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
            {t("Details")}
          </Typography>

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
                {Object.entries(user.details).map(([key, val], idx) => (
                  <TableRow
                    key={key}
                    sx={{
                      backgroundColor:
                        idx % 2 === 0
                          ? theme.palette.secondary.sec
                          : theme.palette.background.paper,
                      "& td": { py: 2, px: 1 },
                    }}
                  >
                    <TableCell>{t(key)}</TableCell>
                    <TableCell>
                      {key === "Status" ? renderStatusChip(val) : val}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tab === "history" && (
        <Box>
          <Box sx={{ mb: 2 }}>
            <FilterComponent
              onSearch={({ search, status }) => {
                setSearchTerm(search);
                setStatusFilter(status);
              }}
              statusOptions={statusOptions}
              isWallet={true}
              isInWalletDetails={true}
              initialSearch={initialSearch}
              initialStatus={initialStatus}
            />
          </Box>
          <TableComponent
            columns={tableColumns}
            data={initialWallet}
            statusKey="status"
            customCellRenderer={{ Status: renderStatusChip }}
            isWallet={true}
            isInDetails={true}
          />
        </Box>
      )}
    </Box>
  );
};

export default WalletDetailsPage;
