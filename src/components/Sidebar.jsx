import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  useTheme,
  Typography,
  ListItemIcon,
  Divider,
  IconButton,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Link, useLocation, matchPath } from "react-router-dom";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import FlagIcon from "@mui/icons-material/Flag";
import { closeNav } from "../redux/slices/user/userSlice";
import useAccessibleRoutes from "../hooks/getAccessibleRoutes";

const Sidebar = ({ userType = "admin", mobileOpen, onClose, onAction }) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();

  const [openKeys, setOpenKeys] = useState({});
  const me = useSelector((state) => state.user.loggedUser);
  const isNavOpen = useSelector((state) => state.user.isNavOpen);
  const storedStudentForm = JSON.parse(localStorage.getItem("registerForm"));

  const lang = i18n.language;
  const accessibleRoutes = useAccessibleRoutes();
  console.log("accessibleRoutes", accessibleRoutes);

  // const menuItems = useMemo(() => getAccessibleRoutes("admin"), []);  .role
  let menuItems = accessibleRoutes;

  // if (me?.role == "student")
  //   menuItems = [
  //     {
  //       icon: AccountBalanceIcon,
  //       key: "StudentDashboard",
  //       path: "/StudentDashboard",
  //       label: {
  //         ar: "لوحة التحكم",
  //         en: "StudentDashboard",
  //       },
  //     },
  //     {
  //       icon: PersonOutlineIcon,
  //       key: "profile3",
  //       path: "/profile",
  //       label: {
  //         ar: "الصفحة الشخصية",
  //         en: "Profile",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "StudentlecturesSchedule",
  //       path: "/StudentlecturesSchedule",
  //       label: {
  //         ar: "جداول المحاضرات",
  //         en: "Lectures Schedule",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "LectureSessionDetails2",
  //       path: "/LectureSessionDetails",
  //       label: {
  //         ar: "سجلات المحاضرات",
  //         en: "Lectures Records",
  //       },
  //     },

  //     {
  //       // icon: MonetizationOnOutlinedIcon,
  //       key: "FeePayment",
  //       path: "/FeePayment",
  //       label: {
  //         ar: "المدفوعات",
  //         en: "Fee Payments",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "materials2",
  //       path: `/materials?faculty_department_id=${storedStudentForm?.faculty_department_id?.id}`,
  //       label: {
  //         ar: "المكتبة الالكترونية",
  //         en: "Electronic Library",
  //       },
  //     },

  //     {
  //       key: "support1",
  //       path: "/Support",
  //       label: {
  //         ar: "الدعم الفني",
  //         en: "Support",
  //       },
  //     },
  //   ];

  // if (me?.role == "admin")
  //   menuItems = [
  //     {
  //       icon: AccountBalanceIcon,
  //       key: "dashboard",
  //       // path: "/dashboard",
  //       label: {
  //         ar: "لوحة التحكم",
  //         en: "Dashboard",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "website-departments",
  //       path: "/website-departments",
  //       label: {
  //         ar: "اقسام الموقع",
  //         en: "Website Departments",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "website-articles",
  //       path: "/website-articles",
  //       label: {
  //         ar: "مقالات الموقع",
  //         en: "Website Articles",
  //       },
  //     },

  //     {
  //       // icon: FlagIcon,
  //       key: "users",
  //       path: "/users",
  //       label: {
  //         ar: "المستخدمين",
  //         en: "Users",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "nationality",
  //       path: "/nationality",
  //       label: {
  //         ar: "الجنسيات",
  //         en: "Nationality",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "countries",
  //       path: "/countries",
  //       label: {
  //         ar: "الدول",
  //         en: "Countries",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "faculities",
  //       path: "/faculities",
  //       label: {
  //         ar: "الكليات",
  //         en: "Faculities",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "academic-departments",
  //       path: "/departments",
  //       label: {
  //         ar: "الاقسام",
  //         en: "Departments",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "prices",
  //       path: "/prices",
  //       label: {
  //         ar: "اسعار الكليات",
  //         en: "Faculities Prices",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "materials3",
  //       path: "/materials",
  //       label: {
  //         ar: "المواد الدراسية",
  //         en: "Subjects",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "academyTerms",
  //       path: "/academyTerms",
  //       label: {
  //         ar: "الفصول الدراسية",
  //         en: "Academy Terms",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "lecturesSchedule",
  //       path: "/lecturesSchedule",
  //       label: {
  //         ar: "جداول المحاضرات",
  //         en: "Lectures Schedule",
  //       },
  //     },

  //     {
  //       key: "feesTypes",
  //       path: "/feesTypes",
  //       label: {
  //         ar: "انواع الرسوم",
  //         en: "Fees Types",
  //       },
  //     },
  //     {
  //       key: "transactionTypes",
  //       path: "/transactionTypes",
  //       label: {
  //         ar: "انواع المعاملات المالية",
  //         en: "Transaction Types",
  //       },
  //     },
  //     {
  //       key: "transactions",
  //       path: "/transactions",
  //       label: {
  //         ar: "المعاملات المالية",
  //         en: "Transactions",
  //       },
  //     },
  //     {
  //       key: "requiredFees",
  //       path: "/requiredFees",
  //       label: {
  //         ar: "رسوم الطلاب",
  //         en: "Student Required Fees",
  //       },
  //     },

  //     {
  //       key: "PermissionsGroups",
  //       path: "/PermissionsGroups",
  //       label: {
  //         ar: "مجموعات الصلاحيات",
  //         en: "Permissions Groups",
  //       },
  //     },
  //     {
  //       // icon: PersonOutlineIcon,
  //       key: "profile2",
  //       path: "/profile",
  //       label: {
  //         ar: "الصفحة الشخصية",
  //         en: "Profile",
  //       },
  //     },
  //     {
  //       key: "support2",
  //       path: "/Support",
  //       label: {
  //         ar: "الدعم الفني",
  //         en: "Support",
  //       },
  //     },
  //   ];

  // if (me?.role == "doctor")
  //   menuItems = [
  //     {
  //       icon: PersonOutlineIcon,
  //       key: "profile1",
  //       path: "/profile",
  //       label: {
  //         ar: "الصفحة الشخصية",
  //         en: "Profile",
  //       },
  //     },

  //     {
  //       // icon: FlagIcon,
  //       key: "DoctorlecturesSchedule",
  //       path: "/DoctorlecturesSchedule",
  //       label: {
  //         ar: "جداول المحاضرات",
  //         en: "Lectures Schedule",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "LectureSessionDetails",
  //       path: "/LectureSessionDetails",
  //       label: {
  //         ar: "سجلات المحاضرات",
  //         en: "Lectures Records",
  //       },
  //     },
  //     {
  //       // icon: FlagIcon,
  //       key: "exams",
  //       path: "/exams",
  //       label: {
  //         ar: "الامتحانات",
  //         en: "Exams",
  //       },
  //     },

  //     {
  //       // icon: FlagIcon,
  //       key: "allStudentDegrees",
  //       path: "/allStudentDegrees",
  //       label: {
  //         ar: "درجات الطلاب",
  //         en: "Student Degrees",
  //       },
  //     },
  //     {
  //       key: "support3",
  //       path: "/Support",
  //       label: {
  //         ar: "الدعم الفني",
  //         en: "Support",
  //       },
  //     },
  //   ];

  const toggleOpen = (key) =>
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const drawerContent = (
    <Box
      sx={{
        width: 230,
        //       minHeight: "100vh",
        // height: "fit-content",
        height: isMobile
          ? me?.role == "admin"
            ? "auto"
            : "100vh"
          : "-webkit-fill-available",

        background: theme.palette.background.secDefault,
        color: theme.palette.primary.main,
        pt: 2,
      }}
    >
      {/* Close Button */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: lang === "ar" ? "flex-end" : "flex-start",
            mb: 2,
          }}
        >
          <IconButton onClick={() => dispatch(closeNav())}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <List component="nav">
        {menuItems.map((item, index) => {
          const hasChildren = !!item.children;

          const isActiveParent = !!(
            hasChildren &&
            item.children.some((child) =>
              matchPath(child.path, location.pathname),
            )
          );

          const cleanPath = item?.path?.split("?")[0];
          let isDirectlyActive = location.pathname?.includes(cleanPath);

          console.log("isDirectlyActive", isDirectlyActive);

          const IconComponent = item.icon;

          console.log("item.key", item.key);

          return (
            <React.Fragment key={item.key}>
              <Box sx={{ px: 1, mb: 0.5 }}>
                <ListItemButton
                  component={item.path ? Link : "div"}
                  to={item.path || undefined}
                  onClick={() => {
                    if (hasChildren) {
                      toggleOpen(item.key);
                    }

                    dispatch(closeNav());
                  }}
                  selected={!!(isDirectlyActive || isActiveParent)}
                  sx={{
                    pl: 3,
                    mb: 0.5,
                    height: 40,
                    gap: 1,
                    "&.Mui-selected": {
                      backgroundColor: isDirectlyActive
                        ? theme.palette.primary.main
                        : "transparent",
                      color: isDirectlyActive
                        ? theme.palette.background.secDefault
                        : theme.palette.primary.main,
                      p: 0,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: isDirectlyActive
                        ? theme.palette.primary.main
                        : "rgba(255, 255, 255, 0.1)",
                    },
                    borderRadius: "8px",
                  }}
                >
                  {isDirectlyActive && (
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 24,
                          borderRadius: "3px",
                          backgroundColor: theme.palette.info.main,
                        }}
                      />
                    </ListItemIcon>
                  )}

                  {IconComponent && (
                    <ListItemIcon
                      sx={{
                        minWidth: 24,
                        color: isDirectlyActive
                          ? theme.palette.background.secDefault
                          : theme.palette.primary.main,
                      }}
                    >
                      <IconComponent
                        sx={{
                          color: isDirectlyActive
                            ? theme.palette.background.secDefault
                            : theme.palette.primary.main,
                          // mx:1
                        }}
                      />
                    </ListItemIcon>
                  )}

                  <ListItemText
                    primary={
                      <Typography
                        sx={{ display: "flex", alignItems: "start" }}
                        variant="body1"
                        fontWeight="bold"
                        color={
                          isDirectlyActive ? "background.secDefault" : "inherit"
                        }
                      >
                        {item.label[i18n.language]}
                      </Typography>
                    }
                  />
                  {hasChildren &&
                    (openKeys[item.key] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>

                {hasChildren && (
                  <Collapse
                    in={openKeys[item.key]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.children.map((child) => {
                        const isChildActive = !!matchPath(
                          child.path,
                          location.pathname,
                        );

                        return (
                          <ListItemButton
                            key={child.key}
                            component={child.path ? Link : "button"}
                            to={child.path || undefined}
                            onClick={() => {
                              if (child.action && onAction) {
                                onAction(child.action);
                              }
                            }}
                            selected={!!isChildActive}
                            sx={{
                              mb: 0.5,
                              height: 40,
                              width: "100%",
                              borderRadius: "8px",
                              "&.Mui-selected": {
                                backgroundColor:
                                  theme.palette.background.default,
                                color: theme.palette.primary.main,
                              },
                              "&.Mui-selected:hover": {
                                backgroundColor:
                                  theme.palette.background.default,
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <Box
                                sx={{
                                  width: 6,
                                  height: 24,
                                  borderRadius: "3px",
                                  backgroundColor: theme.palette.primary.main,
                                }}
                              />
                            </ListItemIcon>

                            <ListItemText
                              primary={
                                <Typography
                                  sx={{ display: "flex", alignItems: "start" }}
                                  variant="body1"
                                  color={
                                    isChildActive ? "primary.main" : "inherit"
                                  }
                                >
                                  {child.label[i18n.language]}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>

              {index < menuItems.length - 1 && (
                <Divider
                  sx={{
                    borderColor: "primary.main",
                    mx: 2,
                    my: 0.5,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  // console.log('sidebaaaaaaaaaaaaaaaar');

  if (me == null) return <CircularProgress />;
  return (
    <>
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: 230,
          flexShrink: 0,
          height: "-webkit-fill-available",
          // minHeight:"100vh",
        }}
      >
        {drawerContent}
      </Box>

      <Drawer
        variant="temporary"
        open={isNavOpen}
        onClose={() => dispatch(closeNav())}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 250,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
