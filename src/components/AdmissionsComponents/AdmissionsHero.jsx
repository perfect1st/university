import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function AdmissionsHero() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const heroHeight = 397;
  const { t } = useTranslation();

  return (
      <Box
        sx={{
          position: "relative",
          height: heroHeight,
          width: "100%",
          backgroundImage: `url(${require("../../assets/home.jpg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.55)", // اللون الغامق
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            pb: { xs: 6, md: 10 },
            zIndex: 2, // عشان يظهر فوق الـ overlay
            px: { xs: 2, md: 6 },
          }}
        >
          {/* العنوان */}
          <Typography
            variant={isSm ? "h5" : "h3"}
            sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}
          >
            {t("university_title")}
          </Typography>

          {/* الترحيب */}
          <Typography
            variant={isSm ? "body1" : "h6"}
            sx={{
              mt: 1,
              color: theme.palette.primary.contrastText,
              maxWidth: "800px",
            }}
          >
            {t("welcome_message")}
          </Typography>

          {/* الوصف */}
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              color: theme.palette.primary.contrastText,
              lineHeight: 1.7,
              maxWidth: "900px",
            }}
          >
            {t("university_description")}
          </Typography>
        </Box>
      </Box>
  );
}
