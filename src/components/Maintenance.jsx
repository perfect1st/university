import React from "react";
import { Box, Typography, Button as MuiButton } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Lottie from "lottie-react";
import MaintenanceAnimation from "../assets/t4tCLNn6gB.json"; // تأكد من المسار

const MotionButton = motion(MuiButton);

const MaintenancePage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      dir={isArabic ? "rtl" : "ltr"}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        textAlign: "center",
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 600, width: "80%", mb: 3 }}>
        <Lottie animationData={MaintenanceAnimation} loop autoplay style={{ width: '100%', height: 'auto' }} />
      </Box>

      <Typography variant="h3" fontWeight="bold" gutterBottom color="error">
        {t("maintenance.title")}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 500 }}
      >
        {t("maintenance.description")}
      </Typography>

      <MotionButton
        variant="contained"
        size="large"
        component={Link}
        to="/"
        sx={{
          borderRadius: 5,
          px: 4,
          py: 1.5,
          textTransform: "none",
          fontWeight: "bold",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t("maintenance.back_home")}
      </MotionButton>
    </Box>
  );
};

export default MaintenancePage;
