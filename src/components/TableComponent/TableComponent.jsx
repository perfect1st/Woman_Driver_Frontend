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
  Box
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ReactComponent as SortIcon } from '../../assets/Sort-icon.svg'
import { useTranslation } from "react-i18next";

const statusStyles = {
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
};

const TableComponent = ({ columns, data, onStatusChange, onViewDetails, isDriver = false }) => {
  const {t,i18n} = useTranslation()
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const open = Boolean(anchorEl);


  // make all chips with the same width 
  const chipRefs = useRef({});
  const [maxChipWidth, setMaxChipWidth] = useState(0);
  
  useEffect(() => {
    const widths = Object.values(chipRefs.current).map(ref => ref?.offsetWidth || 0);
    const largest = Math.max(...widths);
    setMaxChipWidth(largest);
  }, [data, i18n.language]);

// ----------------------------------------------------
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

  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      {/* Outer box to allow horizontal scroll */}
      <Box sx={{ overflowX: "auto", width: "100%" }}>
        <Table
          sx={{
            minWidth: 600, // ensure a minimum width: adjust based on number of columns
            borderCollapse: "collapse"
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
        <TableCell
        key={column.key}
        sx={{
          backgroundColor: "#F7FAFA",
          border: "1px solid #F5F0F2",
          fontWeight: "bold",
          py: { xs: 1, sm: 1.5 },
          // no display:flex on the cell itself
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",      // take up the full cell content width
          }}
        >
          {column.label}
         {column.label != t('Account status') && <IconButton size="small">
            <SortIcon width={20} height={20} />
          </IconButton>}
        </Box>
      </TableCell>
              ))}
              <TableCell
                align="start"
                sx={{
                  backgroundColor: "#F7FAFA",
                  border: "1px solid #F5F0F2",
                  fontWeight: "bold",
                  py: { xs: 1, sm: 1.5 }
                }}
              >
                
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const status = row.accountStatus;
              const styles = statusStyles[status] || {};
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
                      {column.key === "accountStatus" ? (
                        <Chip
                          label={t(status)}
                          ref={(el) => (chipRefs.current[row.id] = el)}  // for make all width == together

                          // onClick={(e) => handleClick(e, row)}
                          icon={styles.icon}
                          sx={{
                            cursor: "pointer",
                            color: styles.textColor,
                            backgroundColor: styles.bgColor,
                            border: `1px solid ${styles.borderColor}`,
                            fontWeight: "bold",
                            minWidth: maxChipWidth,  // for make all width == together
                            borderRadius: 1,
                            textTransform: "none",
                            px: 1.5,
                            py: 0.5,
                            // Do NOT force a minWidth here; let it size naturally
                            "&:hover": {
                              opacity: 0.9,
                              transform: "scale(1.02)"
                            }
                          }}
                        />
                      ) : (
                        row[column.key]
                      )}
                    </TableCell>
                  ))}
                  {/* Actions column: ... icon */}
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #e0e0e0",
                      // backgroundColor: theme.palette.background.default,
                      py: { xs: 0.75, sm: 1.5 }
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => handleClick(e, row)}
                      sx={{
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: 1,
                        // border: "1px solid #e0e0e0",
                        p: 0.5,
                        "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        }
                      }}
                    >
                      <MoreHorizIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
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
        <MenuItem onClick={handleDetailsClick} sx={{ py: 1 }}>
          {t('Details')}
          <InfoIcon sx={{ color: "black", mr: 1.5 }} fontSize="small" />
        </MenuItem>
        <Divider />
        {/* Available */}
        <MenuItem
          onClick={() => handleStatusSelect("Available")}
          sx={{
            color: statusStyles.Available.textColor,
            borderLeft: `4px solid ${statusStyles.Available.borderColor}`,
            pl: 2,
            py: 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          {statusStyles.Available.icon}
          <Box component="span" sx={{ ml: 1 }}>{t('Available')}</Box>
        </MenuItem>
        {/* Pending */}
        <MenuItem
          onClick={() => handleStatusSelect("Pending")}
          sx={{
            color: statusStyles.Pending.textColor,
            borderLeft: `4px solid ${statusStyles.Pending.borderColor}`,
            pl: 2,
            py: 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          {statusStyles.Pending.icon}
          <Box component="span" sx={{ ml: 1 }}>{t('Pending')}</Box>
        </MenuItem>
        {/* Rejected */}
        <MenuItem
          onClick={() => handleStatusSelect("Rejected")}
          sx={{
            color: statusStyles.Rejected.textColor,
            borderLeft: `4px solid ${statusStyles.Rejected.borderColor}`,
            pl: 2,
            py: 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          {statusStyles.Rejected.icon}
          <Box component="span" sx={{ ml: 1 }}>{t('Rejected')}</Box>
        </MenuItem>
      </Menu>
    </TableContainer>
  );
};

export default TableComponent;
