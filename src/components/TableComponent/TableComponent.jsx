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
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL } from "../../Api/apolloClient";

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
  hasNavigateBtn=false,
  navigateBtnTitle,
  navigateTo,
  data,
  onStatusChange,
  onViewDetails,
  statusKey = "accountStatus",
  showStatusChange = true,
  hasObject=false,
  arPopulateKey,
  enPopulateKey,
  nestedPopulateKey,
  nestedArPopulateKey,
  nestedEnPopulateKey,
  actionIconType = "more",
  isInDetails = false,
  dontShowActions = false,
  onActionClick,
  onSortClick,
  handleDetailsClick
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location=useLocation();
  
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

  // const handleDetailsClick = () => {
  //   if (onViewDetails && selectedRow) {
  //     onViewDetails(selectedRow);
  //   }
  //   handleClose();
  // };

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
      // PaperProps={{
      //   sx: { boxShadow: "none !important" , width:"50%", }
      // }} 
      // sx={{ width: "100%", boxShadow: "none !important" ,maxWidth: "100%",overflowX: "auto" }}
      sx={{
        width: "100%",
    maxWidth: "100%",
    overflowX: "auto", // ✅ لو الأعمدة كتيرة بيعمل scroll تلقائي
    boxShadow: "none"
      }}
    >
      <Box sx={{ 
        overflowX: "auto", 
        // width: "100%",
        boxShadow: "none !important",
        
    width: "100%", // 👈 العرض اللي عايزه
    [theme.breakpoints.down("sm")]: {
      width: "80%", // 👈 للموبايل
      overflow:"scroll"
    },
  
          }}>
        <Table
         sx={{
     
      minWidth: 600, // ✅ يحافظ على شكل الأعمدة لكن يظل مرن
      borderCollapse: "collapse",
      direction: isArabic ? "ltr" : "rtl",
      "& .MuiTableCell-root": {
        textAlign: "start",
      },
    }}
    //       sx={{
    //         minWidth: 600,
    //         borderCollapse: "collapse",
    //         boxShadow: "none !important",
    //         direction: isArabic ? "ltr" : "rtl",
    //         overflowX: "auto",
            
    // "& .MuiTableCell-root": {
    //   textAlign:  "start" ,
    // },
    //       }}
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
                    textAlign: isArabic ? "right" : "left",
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
                    {/* {false && column.label !== t("Account status") &&
                      column.label !== t("Trip status") && (
                        <IconButton
                          size="small"
                          onClick={() => onSortClick?.(column)}
                        >
                          <SortIcon width={20} height={20} />
                        </IconButton>
                      )} */}
                  </Box>
                </TableCell>
              ))}
              {!dontShowActions && (
                <TableCell
                 // align={i18n.dir() === "rtl" ? "right" : "left"}
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
               // console.log("row[column.key]",visibleColumns[visibleColumns?.length-1].key);

              // console.log("styles.bgColor",styles.bgColor);
              console.log('rrrrrrrr',visibleColumns[2]?.nested ==true);
              return (
                <TableRow key={row.id} hover>
                  {visibleColumns?.map((column) => (
                    <TableCell
                      key={`${row.id}-${column.key}`}
                     // align={i18n.dir() === "rtl" ? "left" : "left"}
                      sx={{
                        border: "1px solid #e0e0e0",
                        py: { xs: 0.75, sm: 1.5 },
                        textAlign: isArabic ? "right" : "left"
                      }}
                    >
                      {
                      column.key === statusKey && (
                        // <Chip
                        //   label={t(status)}
                        //   ref={(el) => (chipRefs.current[row.id] = el)}
                        //   sx={{
                        //     cursor: showStatusChange ? "pointer" : "default",
                        //     color:"success",
                        //     variant:"filled",
                        //     backgroundColor: styles.bgColor,
                        //     border: `1px solid ${styles.borderColor}`,
                        //     fontWeight: "bold",
                        //     minWidth: maxChipWidth,
                        //     borderRadius: 1,
                        //     textTransform: "none",
                        //     py: 0.5,
                            
                        //     "&:hover": showStatusChange
                        //       ? {
                        //           opacity: 0.9,
                        //           transform: "scale(1.02)",
                        //         }
                        //       : {},
                        //   }}
                        // />
                        <Chip
                          label={t(status)}
                          color={status==true ? "success" : "error"}      // primary | secondary | success | error | info | warning
                          variant="filled"     // filled | outlined
                             sx={{
                            cursor: showStatusChange ? "pointer" : "default",
                            fontWeight: "bold",
                            // display:"inline-flex",
                            width:"100px",
                            borderRadius: 2,
                            textTransform: "none",
                            py: 2,
                            "& .MuiChip-label": {
      width: "100%",
      textAlign: "center",
    },
                            "&:hover": showStatusChange
                              ? {
                                  opacity: 0.9,
                                  transform: "scale(1.02)",
                                }
                              : {},
                          }}
                        />
                      ) 
                      // : 
                      // column.render ? (
                      //   column.render(row)
                      // ) : (
                      //   row[column.key]
                      // )
                      }
                      {
                      
                        // /uploads/
                     typeof row[column.key] === "string"&& row[column.key]?.includes("/uploads/") 
                      ?
                      
                      <Box
      component="img"
      src={`${baseURL}${row[column.key]}`}
      alt="وصف الصورة"
      loading="lazy"
      sx={{
        width: 100,          // ثابت أو '100%' للعرض الكامل
        height: "auto",
        objectFit: 'cover',  // contain, cover, fill
        borderRadius: 2,     // زوايا مدورة
        boxShadow: 1,
      }}
    />
    :  
    !row[column.key] || row[column.key] === "null" ?
    hasNavigateBtn && column.key=="navigate" ? 
      <Button
                    variant="contained"
                    onClick={() => navigate(`${navigateTo}/${row?.id}`,{
                      state:row
                    })}
                    sx={{
                      borderRadius: 2,
                      // px: 3,
                      py: 1,
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                    aria-label="سجل الآن"
                  >
                    {navigateBtnTitle}
                  </Button>
    :
    column.key !== statusKey &&  t("dataNotFound")   
     :

      // hasObject ? isArabic ? 
      // row[column.key]?.arPopulateKey : row[column.key]?.enPopulateKey
      // :row[column.key]  visibleColumns[2]?.nested
      row[column.key]?.id ?
      // row[column.key]?.id[nestedPopulateKey] && column?.nested == "true" ?
      // isArabic ? row[column.key]?.[nestedPopulateKey]?.[nestedArPopulateKey] : row[column.key]?.[nestedPopulateKey]?.[nestedEnPopulateKey]
      // :
      isArabic ? row[column.key]?.[arPopulateKey] : row[column.key]?.[enPopulateKey]
      :
      row[column.key]
                      }
                    </TableCell>
                  ))}

                  {!dontShowActions && (
                    <TableCell
                      align="center"
                      sx={{
                        border: "1px solid #e0e0e0",
                        py: { xs: 0.75, sm: 1.5 },
                        textAlign:isArabic ? "right" : "left",
                      }}
                    >
                      {actionIconType === "details" ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) =>{
                            console.log('uuuuuuuuuuuuuu');
                            onActionClick?.(e, row);
                          } }
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
                          onClick={(e) => {
                            onActionClick?.(e, row)
                           // navigate();
                          }}
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
                          onClick={(e) =>{
                            // console.log('llllllllllllllllllllllllll');
                              handleClick(e, row);
                          } }
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
            onClick={()=>{
              handleDetailsClick(selectedRow);

           // console.log('handleDetailsClick',selectedRow);
            }}
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