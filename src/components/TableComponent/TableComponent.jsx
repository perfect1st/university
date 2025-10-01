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
  Button,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import { ReactComponent as SortIcon } from "../../assets/Sort-icon.svg";
import { ReactComponent as InfoIcon } from "../../assets/InfoIcon.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Define all possible status styles
const statusStyles = {
  // Account status styles (for passengers/drivers)
  Active: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />
  },
  active: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />
  },
  Available: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />
  },
  available: {
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
  pending: {
    textColor: "#1849A9",
    bgColor: "#EFF8FF",
    borderColor: "#B2DDFF",
    // icon: <AccessTimeIcon fontSize="small" sx={{ color: "#1849A9" }} />
  },
  inactive: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
    // icon: <WarningIcon fontSize="small" sx={{ color: "#912018" }} />
  },
  Rejected: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
    // icon: <WarningIcon fontSize="small" sx={{ color: "#912018" }} />
  },
  unavailable: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
    // icon: <WarningIcon fontSize="small" sx={{ color: "#912018" }} />
  },
  banned: {
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
  refused: {
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
  paid: {
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
  accepted: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />
  },
  active: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />
  },
  OnRequest: {
    textColor: "#93370D",
    bgColor: "#FFFAEB",
    borderColor: "#FEDF89",
    // icon: <AccessTimeIcon fontSize="small" sx={{ color: "#93370D" }} />
  },
  maintenance: {
    textColor: "#93370D",
    bgColor: "#FFFAEB",
    borderColor: "#FEDF89",
    // icon: <AccessTimeIcon fontSize="small" sx={{ color: "#93370D" }} />
  },
  "Approved by driver": {
    textColor: "#1F2A37",
    bgColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#1F2A37" }} />
  },
  Leaved: {
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
  },
  "in-progress": {
    textColor: "#93370D", // برتقالي غامق
    bgColor: "#FFFAEB",   // أصفر فاتح
    borderColor: "#FEDF89",
    // icon: <AccessTimeIcon fontSize="small" sx={{ color: "#93370D" }} />
  },
"arrived": {
  textColor: "#9D174D",   // وردي غامق
  bgColor: "#FCE7F3",     // وردي فاتح
  borderColor: "#F9A8D4", // بينك متوسط
  // icon: <AccessTimeIcon fontSize="small" sx={{ color: "#9D174D" }} />
},

  resolved: {
    textColor: "#085D3A", // أخضر غامق
    bgColor: "#ECFDF3",   // أخضر فاتح
    borderColor: "#ABEFC6",
    // icon: <CheckCircleIcon fontSize="small" sx={{ color: "#085D3A" }} />
  },
  closed: {
    textColor: "#1F2A37", // رمادي غامق
    bgColor: "#F9FAFB",   // رمادي فاتح
    borderColor: "#E5E7EB",
    // icon: <BlockIcon fontSize="small" sx={{ color: "#1F2A37" }} />
  },
};

const TableComponent = ({
  columns,
  data,
  onStatusChange,
  onViewDetails,
  statusKey = "accountStatus", // Default to account status tripStatus
  showStatusChange = true, // Show status change options in menu
  actionIconType = "more", // "more" or "info"
  actionIconType2 = "", // liqudation_now
  isCar = false,
  isCarType = false,
  isCarDriver = false,
  isTrafficTime = false,
  isWallet = false,
  isInDetails = false,
  paymentMethod = false,
  isCommissionCategory = false,
  dontShowActions = false,
  onActionClick,
  liqudationClick,
  onSortClick,
  releasedClick,
  isUsers=false,
  isCoupon=false,
  isContactUs=false,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  // Make all chips with the same width
  const chipRefs = useRef({});
  const [maxChipWidth, setMaxChipWidth] = useState(0);

  useEffect(() => {
    const widths = Object.values(chipRefs.current)?.map(
      (ref) => ref?.offsetWidth || 0
    );
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
    return (
      statusStyles[status] || {
        textColor: theme.palette.text.primary,
        bgColor: theme.palette.background.default,
        borderColor: theme.palette.divider,
      }
    );
  };

  const visibleColumns = columns?.filter((col) => !col.isPrivate);

  return (
    <TableContainer component={Paper}  PaperProps={{
      sx: { boxShadow: "none !important", }
    }} sx={{ width: "100%", boxShadow: "none !important",}}>
      {/* Outer box to allow horizontal scroll */}
      <Box sx={{ overflowX: "auto", width: "100%" , boxShadow: "none !important",}}>
        <Table
          sx={{
            minWidth: 600,
            borderCollapse: "collapse",
            boxShadow: "none !important", // ده اللي يضمن الإزالة
          }}
        >
          <TableHead>
            <TableRow>
              {visibleColumns?.map((column) => (
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
                    {false && column.label !== t("Account status") &&
                      column.label !== t("Trip status") && (
                        <IconButton
                          size="small"
                          onClick={() => onSortClick?.(column)}
                        >
                          <SortIcon width={20} height={20} />
                        </IconButton>
                      )}
                  </Box>
                </TableCell>
              ))}
              {actionIconType2=="liqudation_now" && (
                <TableCell
                  align={i18n.dir() === "rtl" ? "right" : "left"}
                  sx={{
                    backgroundColor: theme.palette.background.secDefault,
                    border: "1px solid #F5F0F2",
                    fontWeight: "bold",
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  {/* Actions column header */}
                </TableCell>
              )}
              {!dontShowActions && (
                <TableCell
                  align={i18n.dir() === "rtl" ? "right" : "left"}
                  sx={{
                    backgroundColor: theme.palette.background.secDefault,
                    border: "1px solid #F5F0F2",
                    fontWeight: "bold",
                    py: { xs: 1, sm: 1.5 },
                  }}
                >
                  {/* Actions column header */}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => {
              const status = row[statusKey];
              const styles = getStatusStyles(status);

              return (
                <TableRow key={row.id} hover>
                  {visibleColumns?.map((column) => (
                    <TableCell
                      key={`${row.id}-${column.key}`}
                      align={i18n.dir() === "rtl" ? "right" : "left"}
                      sx={{
                        border: "1px solid #e0e0e0",
                        py: { xs: 0.75, sm: 1.5 },
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
                                  transform: "scale(1.02)",
                                }
                              : {},
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
                   { actionIconType2 == "liqudation_now" && <TableCell
                      align="center"
                      sx={{
                        border: "1px solid #e0e0e0",
                        py: { xs: 0.75, sm: 1.5 },
                      }}
                    >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) => liqudationClick?.(e, row)} // ⬅️ من الأب
                          sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            borderRadius: 1,
                            px: 2,
                            py: 0.5,
                            minWidth: "auto",
                          }}
                        >
                          {t("liquidation_now")}
                        </Button>
                     
                    </TableCell>}
                 
                  {!dontShowActions && (
                    <TableCell
                      align="center"
                      sx={{
                        border: "1px solid #e0e0e0",
                        py: { xs: 0.75, sm: 1.5 },
                      }}
                    >
                      {actionIconType === "details" ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) => onActionClick?.(e, row)} // ⬅️ من الأب
                          sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            borderRadius: 1,
                            px: 2,
                            py: 0.5,
                            minWidth: "auto",
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
                            color: "#fff",
                          }}
                        >
                          {
                            <InfoIcon width={18} height={18} /> // لو عايز الـ info تفتح تفاصيل
                          }
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={(e) => handleClick(e, row)} // ده هيفتح المينيو
                          sx={{
                            border: `1px solid ${theme.palette.primary.main}`,
                            borderRadius: 1,
                            p: 0.5,
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff",
                          }}
                        >
                          <MoreHorizIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
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
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 160 },
        }}
      >
        {/* Details */}
        {!isInDetails && (
          <MenuItem
            onClick={handleDetailsClick}
            sx={{
              borderLeft: isArabic
                ? ""
                : `4px solid ${alpha(theme.palette.text.primary, 0.5)}`,
              borderRight: isArabic
                ? `4px solid ${alpha(theme.palette.text.primary, 0.5)}`
                : "",
              py: 1,
            }}
          >
            {t("Details")}
          </MenuItem>
        )}
        {/* Status options - only show if enabled */}
        {showStatusChange && selectedRow && (
          <>
            {/* Status for CarDriver */}
            {isCarDriver ? (
               <>
               {/* released */}
               <MenuItem
                 onClick={()=>{releasedClick(selectedRow)}}
                 sx={{
                   color: statusStyles.Cancelled.textColor,
                   borderLeft: isArabic
                     ? ""
                     : `4px solid ${statusStyles.Cancelled.borderColor}`,
                   borderRight: isArabic
                     ? `4px solid ${statusStyles.Cancelled.borderColor}`
                     : "",
                   pl: 2,
                   py: 1,
                   display: "flex",
                   alignItems: "center",
                 }}
               >
                 {statusStyles.Cancelled.icon}
                 <Box component="span" sx={{ ml: 1 }}>
                   {t("release now")}
                 </Box>
               </MenuItem>
             </>
          
            ) : (
              <>
                {/* Available */}
               {!isContactUs && <>
                {isWallet ? (
                  <MenuItem
                    onClick={() => handleStatusSelect("Available")}
                    sx={{
                      color: statusStyles.Available.textColor,
                      borderLeft: isArabic
                        ? ""
                        : `4px solid ${statusStyles.Available.borderColor}`,
                      borderRight: isArabic
                        ? `4px solid ${statusStyles.Available.borderColor}`
                        : "",
                      pl: 2,
                      py: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {statusStyles.Available.icon}
                    <Box component="span" sx={{ ml: 1 }}>
                      {t("Accept")}
                    </Box>
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => handleStatusSelect("active")}
                    sx={{
                      color: statusStyles.Accepted.textColor,
                      borderLeft: isArabic
                        ? ""
                        : `4px solid ${statusStyles.active.borderColor}`,
                      borderRight: isArabic
                        ? `4px solid ${statusStyles.active.borderColor}`
                        : "",
                      pl: 2,
                      py: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {statusStyles.active.icon}
                    <Box component="span" sx={{ ml: 1 }}>
                      {t("active")}
                    </Box>
                  </MenuItem>
                )}{" "}
                </>}
                {/* pending */}
                
                { !isUsers &&
                  !isContactUs &&
                  !isCar &&
                  !isCarType &&
                  !isTrafficTime &&
                  !isWallet &&
                  !paymentMethod &&
                  !isCoupon &&
                  !isCommissionCategory && (
                    <MenuItem
                      onClick={() => handleStatusSelect("pending")}
                      sx={{
                        color: statusStyles.pending.textColor,
                        borderLeft: isArabic
                          ? ""
                          : `4px solid ${statusStyles.pending.borderColor}`,
                        borderRight: isArabic
                          ? `4px solid ${statusStyles.pending.borderColor}`
                          : "",
                        pl: 2,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {statusStyles.pending.icon}
                      <Box component="span" sx={{ ml: 1 }}>
                        {t("Pending")}
                      </Box>
                    </MenuItem>
                  )}
               {isContactUs && (
  <>
    <MenuItem
      onClick={() => handleStatusSelect("pending")}
      sx={{
        color: statusStyles.pending.textColor,
        borderLeft: isArabic
          ? ""
          : `4px solid ${statusStyles.pending.borderColor}`,
        borderRight: isArabic
          ? `4px solid ${statusStyles.pending.borderColor}`
          : "",
        pl: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      {statusStyles.pending.icon}
      <Box component="span" sx={{ ml: 1 }}>
        {t("Pending")}
      </Box>
    </MenuItem>

    <MenuItem
      onClick={() => handleStatusSelect("in-progress")}
      sx={{
        color: statusStyles["in-progress"].textColor,
        borderLeft: isArabic
          ? ""
          : `4px solid ${statusStyles["in-progress"].borderColor}`,
        borderRight: isArabic
          ? `4px solid ${statusStyles["in-progress"].borderColor}`
          : "",
        pl: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      {statusStyles["in-progress"].icon}
      <Box component="span" sx={{ ml: 1 }}>
        {t("In Progress")}
      </Box>
    </MenuItem>

    <MenuItem
      onClick={() => handleStatusSelect("resolved")}
      sx={{
        color: statusStyles.resolved.textColor,
        borderLeft: isArabic
          ? ""
          : `4px solid ${statusStyles.resolved.borderColor}`,
        borderRight: isArabic
          ? `4px solid ${statusStyles.resolved.borderColor}`
          : "",
        pl: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      {statusStyles.resolved.icon}
      <Box component="span" sx={{ ml: 1 }}>
        {t("Resolved")}
      </Box>
    </MenuItem>

    <MenuItem
      onClick={() => handleStatusSelect("closed")}
      sx={{
        color: statusStyles.closed.textColor,
        borderLeft: isArabic
          ? ""
          : `4px solid ${statusStyles.closed.borderColor}`,
        borderRight: isArabic
          ? `4px solid ${statusStyles.closed.borderColor}`
          : "",
        pl: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      {statusStyles.closed.icon}
      <Box component="span" sx={{ ml: 1 }}>
        {t("Closed")}
      </Box>
    </MenuItem>
  </>
)}

                { isCar &&
                   (
                    <MenuItem
                      onClick={() => handleStatusSelect("maintenance")}
                      sx={{
                        color: statusStyles.maintenance.textColor,
                        borderLeft: isArabic
                          ? ""
                          : `4px solid ${statusStyles.maintenance.borderColor}`,
                        borderRight: isArabic
                          ? `4px solid ${statusStyles.maintenance.borderColor}`
                          : "",
                        pl: 2,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {statusStyles.maintenance.icon}
                      <Box component="span" sx={{ ml: 1 }}>
                        {t("maintenance")}
                      </Box>
                    </MenuItem>
                  )}
                {/* Rejected */}
               {!isContactUs && <MenuItem
                  onClick={() => handleStatusSelect("Rejected")}
                  sx={{
                    color: statusStyles.banned.textColor,
                    borderLeft: isArabic
                      ? ""
                      : `4px solid ${statusStyles.banned.borderColor}`,
                    borderRight: isArabic
                      ? `4px solid ${statusStyles.banned.borderColor}`
                      : "",
                    pl: 2,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {statusStyles.banned.icon}
                  <Box component="span" sx={{ ml: 1 }}>
                    {t("banned")}
                  </Box>
                </MenuItem>}
              </>
            )}
          </>
        )}{" "}
      </Menu>
    </TableContainer>
  );
};

export default TableComponent;
