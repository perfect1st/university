import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TitleComponent from "./TitleComponent";

export default function FutureVision({ visionArticalesData = [] }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // 🔹 take the first article
  const article = visionArticalesData?.[0];
  const images = article
    ? [article.main_image, ...(article.images_array || [])].filter(Boolean)
    : [];
  // 🔹 handle image slider state
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 auto-swap every 3 seconds
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (!article) return null;

  return (
    <Box sx={{ p: 4 }}>
      {/* Title */}
      <TitleComponent title={t("Future Vision")} />

      {/* Content */}
      <Grid container spacing={4} alignItems="center">
        {/* Image Slider */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={images[currentIndex] || article.main_image}
            alt={article[`title_${i18n.language}`] || "Future Vision"}
            sx={{
              width: "100%",
              height: { xs: 200, md: 300 },
              objectFit: "cover",
              borderRadius: 0,
              transition: "all 0.8s ease-in-out",
            }}
          />
        </Grid>

        {/* Text + Button */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: { xs: 200, md: 300 },
          }}
        >
          <Typography variant="h5" gutterBottom>
            {article[`title_${i18n.language}`]}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {article[`desc_${i18n.language}`]}
          </Typography>

          {/* Button aligned to end */}
          <Box sx={{ mt: "auto", textAlign: "end" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/VisionsArticles")}
            >
              {t("Read More")}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
