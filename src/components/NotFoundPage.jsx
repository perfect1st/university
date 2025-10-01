import React from "react";
import { Box, Typography, Button as MuiButton } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Lottie from "lottie-react";
import catAnimation from "../assets/404-cat.json"; // ✅ تأكد من المسار

const MotionButton = motion(MuiButton);

const NotFoundPage = () => {
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
      {/* ✅ استخدم أنيميشن القط بدل الصورة */}
      <Box sx={{ maxWidth: 400, width: "100%", mb: 3 }}>
        <Lottie animationData={catAnimation} loop autoplay />
      </Box>

      <Typography variant="h3" fontWeight="bold" gutterBottom color="error">
        {t("notfound.title")}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 400 }}
      >
        {t("notfound.description")}
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
        {t("notfound.back_home")}
      </MotionButton>
    </Box>
  );
};

export default NotFoundPage;