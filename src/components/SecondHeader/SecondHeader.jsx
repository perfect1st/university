import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { key: "home", path: "/home" },
  { key: "admissions.title", path: "/admissions" },
  { key: "support", path: "/support" },
];

export default function SecondHeader() {
  const theme = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const getActive = (path) => {
    if (path === "/") return currentPath == "/home";
    return currentPath.startsWith(path);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
          background: theme.palette.primary.main,
          px: { xs: 1, md: 2 },
          py: { xs: 0.5, md: 1 },
        }}
      >
        {navItems.map((item) => {
          const active = getActive(item.path);
          return (
            <Button
              key={item.key}
              onClick={() => navigate(item.path)}
              sx={{
                color: active ? theme.palette.secondary.main : theme.palette.text.sec,
                background: "transparent",
                textTransform: "none",
                fontWeight: active ? 700 : 500,
                borderRadius: 1,
                px: { xs: 2, md: 3 },
                py: { xs: 0.5, md: 0.8 },
                textDecoration: active ? "underline" : "none",
                textDecorationColor: active ? theme.palette.secondary.main : "transparent",
                textDecorationThickness: active ? "2px" : "auto", // سماكة الخط
                textUnderlineOffset: active ? "6px" : "0px",     // المسافة بين الكلمة والخط
                "&:hover": {
                  background: active ? theme.palette.secondary.dark : theme.palette.primary.dark,
                },
              }}
              
              
            >
              {t(item.key)}
            </Button>
          );
        })}
      </Box>
      <Box sx={{ height: 2, backgroundColor: theme.palette.divider, width: "100%" }} />
    </Box>
  );
}
