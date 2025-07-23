import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  Box,
  alpha,
  Button
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import { ReactComponent as SortIcon } from '../../assets/Sort-icon.svg';
import { ReactComponent as InfoIcon } from '../../assets/InfoIcon.svg';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Define all possible status styles
const statusStyles = {
  // Account status styles (for passengers/drivers)
  Available: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />
  },
  Pending: {
    textColor: "#1849A9",
    bgColor: "#EFF8FF",
    borderColor: "#B2DDFF",
    // icon: <AccessTimeIcon fontSize="small" sx={{ color: "#1849A9" }} />
  },
  Rejected: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
    // icon: <WarningIcon fontSize="small" sx={{ color: "#912018" }} />
  },
  
  // Trip status styles
  Cancelled: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
    // icon: <WarningIcon fontSize="small" sx={{ color: "#912018" }} />
  },
  Complete: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />
  },
  Linked: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />
  },
  Accepted: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />
  },
  'OnRequest': {
    textColor: "#93370D",
    bgColor: "#FFFAEB",
    borderColor: "#FEDF89",
    // icon: <AccessTimeIcon fontSize="small" sx={{ color: "#93370D" }} />
  },
  'Approved by driver': {
    textColor: "#1F2A37",
    bgColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#1F2A37" }} />
  },
  'Leaved': {
    textColor: "#1F2A37",
    bgColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#1F2A37" }} />
  },
  Start: {
    textColor: "#1849A9",
    bgColor: "#EFF8FF",
    borderColor: "#B2DDFF",
    // icon: <AccessTimeIcon fontSize="small" sx={{ color: "#1849A9" }} />
  }
};

const TableComponent = ({ 
  columns, 
  data, 
  onStatusChange, 
  onViewDetails,
  statusKey = "accountStatus", // Default to account status tripStatus
  showStatusChange = true,     // Show status change options in menu
  actionIconType = "more" ,     // "more" or "info"
  isCar = false,
  isCarType = false,
  isCarDriver=false,
  isTrafficTime=false,
  isWallet=false,
  isInDetails=false,
  paymentMethod=false,
  isCommissionCategory=false,
  dontShowActions=false,
  onActionClick
}) => {
  const {t, i18n} = useTranslation();
  const isArabic = i18n.language === 'ar';
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const open = Boolean(anchorEl);
const navigate = useNavigate();
  // Make all chips with the same width 
  const chipRefs = useRef({});
  const [maxChipWidth, setMaxChipWidth] = useState(0);
  
  useEffect(() => {
    const widths = Object.values(chipRefs.current).map(ref => ref?.offsetWidth || 0);
    const largest = Math.max(...widths);
    setMaxChipWidth(largest);
  }, [data, i18n.language]);

  // Open menu when clicking status chip or action icon
  const handleClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDetailsClick = () => {
    if (onViewDetails && selectedRow) {
      onViewDetails(selectedRow);
    }
    handleClose();
  };

  const handleStatusSelect = (newStatus) => {
    if (onStatusChange && selectedRow) {
      onStatusChange(selectedRow, newStatus);
    }
    handleClose();
  };

  // Get status styles for a given status value
  const getStatusStyles = (status) => {
    return statusStyles[status] || {
      textColor: theme.palette.text.primary,
      bgColor: theme.palette.background.default,
      borderColor: theme.palette.divider
    };
  };

  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      {/* Outer box to allow horizontal scroll */}
      <Box sx={{ overflowX: "auto", width: "100%" }}>
        <Table
          sx={{
            minWidth: 600,
            borderCollapse: "collapse"
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    backgroundColor: theme.palette.background.secDefault,
                    border: "1px solid #F5F0F2",
                    fontWeight: "bold",
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    {column.label}
                    {column.label !== t('Account status') && column.label !== t('Trip status') && (
                      <IconButton size="small">
                        <SortIcon width={20} height={20} />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}
             {!dontShowActions && <TableCell
                align={i18n.dir() === 'rtl' ? 'right' : 'left'}
                sx={{
                  backgroundColor: theme.palette.background.secDefault,
                  border: "1px solid #F5F0F2",
                  fontWeight: "bold",
                  py: { xs: 1, sm: 1.5 }
                }}
              >
                {/* Actions column header */}
              </TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const status = row[statusKey];
              const styles = getStatusStyles(status);
              
              return (
                <TableRow key={row.id} hover>
                  {columns.map((column) => (
  <TableCell
    key={`${row.id}-${column.key}`}
    align={i18n.dir() === 'rtl' ? 'right' : 'left'}
    sx={{
      border: "1px solid #e0e0e0",
      py: { xs: 0.75, sm: 1.5 }
    }}
  >
    {column.key === statusKey ? (
      <Chip
        label={t(status)}
        ref={(el) => (chipRefs.current[row.id] = el)}
        icon={styles.icon}
        sx={{
          cursor: showStatusChange ? "pointer" : "default",
          color: styles.textColor,
          backgroundColor: styles.bgColor,
          border: `1px solid ${styles.borderColor}`,
          fontWeight: "bold",
          minWidth: maxChipWidth,
          borderRadius: 1,
          textTransform: "none",
          py: 0.5,
          "&:hover": showStatusChange
            ? {
                opacity: 0.9,
                transform: "scale(1.02)"
              }
            : {}
        }}
      />
    ) : column.render ? (
      column.render(row)
    ) : (
      row[column.key]
    )}
  </TableCell>
))}

                  {/* Actions column */}
               {!dontShowActions &&   <TableCell
  align="center"
  sx={{
    border: "1px solid #e0e0e0",
    py: { xs: 0.75, sm: 1.5 }
  }}
>
  {actionIconType === "details" ? (
    <Button
      variant="contained"
      color="primary"
      onClick={(e) => onActionClick?.(e, row)}  // ⬅️ من الأب
      sx={{
        textTransform: "none",
        fontWeight: "bold",
        fontSize: "0.875rem",
        borderRadius: 1,
        px: 2,
        py: 0.5,
        minWidth: "auto"
      }}
    >
      {t("Details")}
    </Button>
  ) : actionIconType === "info" ? (
    <IconButton
    size="small"
    onClick={(e) => onActionClick?.(e, row)}
        sx={{
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: 1,
      p: 0.5,
      backgroundColor: theme.palette.primary.main,
      color: "#fff"
    }}
  >
    { (
      <InfoIcon width={18} height={18}  />  // لو عايز الـ info تفتح تفاصيل
    ) }
  </IconButton>
  
  ) : (
    <IconButton
    size="small"
    onClick={(e) => handleClick(e, row)}  // ده هيفتح المينيو
    sx={{
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: 1,
      p: 0.5,
      backgroundColor: theme.palette.primary.main,
      color: "#fff"
    }}
  >
    
      <MoreHorizIcon fontSize="small" />
    
  </IconButton>
  
  )
  }
</TableCell>}

                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      {/* Menu for status/details */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 160 }
        }}
      >
        {/* Details */}
       {!isInDetails && <MenuItem onClick={handleDetailsClick} sx={{
          borderLeft: isArabic ? '' : `4px solid ${alpha(theme.palette.text.primary, 0.5)}`,
          borderRight: isArabic ? `4px solid ${alpha(theme.palette.text.primary, 0.5)}` : '',
          py: 1,
        }}>
          {t('Details')}
        </MenuItem>}
        
        {/* Status options - only show if enabled */}
        {showStatusChange && selectedRow && (
  <>
    {/* Status for CarDriver */}
    {isCarDriver ? (
      <>
        {/* Linked */}
        <MenuItem
          onClick={() => handleStatusSelect("Linked")}
          sx={{
            color: statusStyles.Linked.textColor,
            borderLeft: isArabic ? '' : `4px solid ${statusStyles.Linked.borderColor}`,
            borderRight: isArabic ? `4px solid ${statusStyles.Linked.borderColor}` : '',
            pl: 2,
            py: 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          {statusStyles.Linked.icon}
          <Box component="span" sx={{ ml: 1 }}>{t('Linked')}</Box>
        </MenuItem>
         {/* OnRequest */}
         <MenuItem
          onClick={() => handleStatusSelect("OnRequest")}
          sx={{
            color: statusStyles["OnRequest"].textColor,
            borderLeft: isArabic ? '' : `4px solid ${statusStyles["OnRequest"].borderColor}`,
            borderRight: isArabic ? `4px solid ${statusStyles["OnRequest"].borderColor}` : '',
            pl: 2,
            py: 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          {statusStyles["OnRequest"].icon}
          <Box component="span" sx={{ ml: 1 }}>{t('OnRequest')}</Box>
        </MenuItem>
           {/* Leaved */}
           <MenuItem
          onClick={() => handleStatusSelect("Leaved")}
          sx={{
            color: statusStyles.Leaved.textColor,
            borderLeft: isArabic ? '' : `4px solid ${statusStyles.Leaved.borderColor}`,
            borderRight: isArabic ? `4px solid ${statusStyles.Leaved.borderColor}` : '',
            pl: 2,
            py: 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          {statusStyles.Leaved.icon}
          <Box component="span" sx={{ ml: 1 }}>{t('Leaved')}</Box>
        </MenuItem>
        <MenuItem
          onClick={() => handleStatusSelect("Rejected")}
          sx={{
            color: statusStyles.Rejected.textColor,
            borderLeft: isArabic ? '' : `4px solid ${statusStyles.Rejected.borderColor}`,
            borderRight: isArabic ? `4px solid ${statusStyles.Rejected.borderColor}` : '',
            pl: 2,
            py: 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          {statusStyles.Rejected.icon}
          <Box component="span" sx={{ ml: 1 }}>{t('Rejected')}</Box>
        </MenuItem>
      </>
    ) : (
      <>
        {/* Available */}
        {isWallet ? <MenuItem
          onClick={() => handleStatusSelect("Available")}
          sx={{
            color: statusStyles.Available.textColor,
            borderLeft: isArabic ? '' : `4px solid ${statusStyles.Available.borderColor}`,
            borderRight: isArabic ? `4px solid ${statusStyles.Available.borderColor}` : '',
            pl: 2,
            py: 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          {statusStyles.Available.icon}
          <Box component="span" sx={{ ml: 1 }}>{t('Accept')}</Box>
        </MenuItem> :
        <MenuItem
        onClick={() => handleStatusSelect("Accepted")}
        sx={{
          color: statusStyles.Accepted.textColor,
          borderLeft: isArabic ? '' : `4px solid ${statusStyles.Accepted.borderColor}`,
          borderRight: isArabic ? `4px solid ${statusStyles.Accepted.borderColor}` : '',
          pl: 2,
          py: 1,
          display: "flex",
          alignItems: "center"
        }}
      >
        {statusStyles.Accepted.icon}
        <Box component="span" sx={{ ml: 1 }}>{t('Accepted')}</Box>
      </MenuItem>
        } {/* Pending */}
        {(!isCar && !isCarType && !isTrafficTime && !isWallet && !paymentMethod && !isCommissionCategory) && (
          <MenuItem
            onClick={() => handleStatusSelect("Pending")}
            sx={{
              color: statusStyles.Pending.textColor,
              borderLeft: isArabic ? '' : `4px solid ${statusStyles.Pending.borderColor}`,
              borderRight: isArabic ? `4px solid ${statusStyles.Pending.borderColor}` : '',
              pl: 2,
              py: 1,
              display: "flex",
              alignItems: "center"
            }}
            >
              {statusStyles.Pending.icon}
              <Box component="span" sx={{ ml: 1 }}>{t('Pending')}</Box>
              </MenuItem>
        )}

        {/* Rejected */}
        <MenuItem
          onClick={() => handleStatusSelect("Rejected")}
          sx={{
            color: statusStyles.Rejected.textColor,
            borderLeft: isArabic ? '' : `4px solid ${statusStyles.Rejected.borderColor}`,
            borderRight: isArabic ? `4px solid ${statusStyles.Rejected.borderColor}` : '',
            pl: 2,
            py: 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          {statusStyles.Rejected.icon}
          <Box component="span" sx={{ ml: 1 }}>{t('Rejected')}</Box>
        </MenuItem>
      </>
    )}
  </>
)}      </Menu>



    </TableContainer>
  );
};

export default TableComponent;