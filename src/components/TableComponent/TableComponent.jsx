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
  useTheme,
  Box,
  alpha,
  Button,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ReactComponent as SortIcon } from "../../assets/Sort-icon.svg";
import { ReactComponent as InfoIcon } from "../../assets/InfoIcon.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Define only necessary status styles
const statusStyles = {
  active: {
    textColor: "#085D3A",
    bgColor: "#ECFDF3",
    borderColor: "#ABEFC6",
  },
  inActive: {
    textColor: "#912018",
    bgColor: "#FEF3F2",
    borderColor: "#FECDCA",
  },
};

const TableComponent = ({
  columns,
  data,
  onStatusChange,
  onViewDetails,
  statusKey = "accountStatus",
  showStatusChange = true,
  actionIconType = "more",
  isInDetails = false,
  dontShowActions = false,
  onActionClick,
  onSortClick,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  
  const chipRefs = useRef({});
  const [maxChipWidth, setMaxChipWidth] = useState(0);

  useEffect(() => {
    const widths = Object.values(chipRefs.current)?.map(
      (ref) => ref?.offsetWidth || 0
    );
    const largest = Math.max(...widths);
    setMaxChipWidth(largest);
  }, [data, i18n.language]);

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
    <TableContainer 
      component={Paper}  
      PaperProps={{
        sx: { boxShadow: "none !important" }
      }} 
      sx={{ width: "100%", boxShadow: "none !important" }}
    >
      <Box sx={{ overflowX: "auto", width: "100%", boxShadow: "none !important" }}>
        <Table
          sx={{
            minWidth: 600,
            borderCollapse: "collapse",
            boxShadow: "none !important",
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
                          onClick={(e) => onActionClick?.(e, row)}
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
                          <InfoIcon width={18} height={18} />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={(e) => handleClick(e, row)}
                          sx={{
                            border: `1px solid ${theme.palette.info.main}`,
                            borderRadius: 1,
                            p: 0.5,
                            backgroundColor: "#fff",
                            color: theme.palette.info.main,
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
            <MenuItem
              onClick={() => handleStatusSelect("active")}
              sx={{
                color: statusStyles.active.textColor,
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
              <Box component="span" sx={{ ml: 1 }}>
                {t("active")}
              </Box>
            </MenuItem>

            <MenuItem
              onClick={() => handleStatusSelect("inActive")}
              sx={{
                color: statusStyles.inActive.textColor,
                borderLeft: isArabic
                  ? ""
                  : `4px solid ${statusStyles.inActive.borderColor}`,
                borderRight: isArabic
                  ? `4px solid ${statusStyles.inActive.borderColor}`
                  : "",
                pl: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box component="span" sx={{ ml: 1 }}>
                {t("inActive")}
              </Box>
            </MenuItem>
          </>
        )}
      </Menu>
    </TableContainer>
  );
};

export default TableComponent;