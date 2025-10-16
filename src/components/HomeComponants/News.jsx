import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
} from "@mui/material";
import TitleComponent from "./TitleComponent";
import { useTranslation } from "react-i18next";
import mainImage from "../../assets/news.jpg";
import { useNavigate } from "react-router-dom";

export default function News({ news = [] }) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Choose real data or dummy
  const newsList = news?.length > 0 ? news : [];

  // Show only first 6 on homepage
  const displayedNews = newsList.slice(0, 6);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.secDefault,
        py: 2,
        px: { xs: 2, md: 6 },
      }}
    >
      <TitleComponent title={t("news_updates")} />

      <Grid container spacing={2}>
        {displayedNews.map((item) => (
          <Grid
            item
            key={item.id}
            xs={12}
            md={4}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <NewsCard item={item} i18n={i18n} theme={theme} />
          </Grid>
        ))}
      </Grid>

      {/* Show More Button */}
      <Box sx={{ textAlign: "end", mt: 6 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/news")}
        >
          {t("show_more")}
        </Button>
      </Box>
    </Box>
  );
}

function NewsCard({ item, i18n, theme }) {
  // prepare images
  const images = [item.main_image, ...(item.images_array || [])].filter(Boolean);
  const [index, setIndex] = useState(0);

  // 🔹 Auto slide every 3 seconds
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  const getImageSrc = (path) => path || mainImage;

  return (
    <Box
      sx={{
        position: "relative",
        height: 300,
        overflow: "hidden",
      }}
    >
      {/* 🔹 Auto-changing image */}
      <Box
        component="img"
        src={getImageSrc(images[index])}
        alt={i18n.language === "ar" ? item.title_ar : item.title_en}
        sx={{
          width: "100%",
          height: 250,
          objectFit: "cover",
          display: "block",
          transition: "opacity 1s ease-in-out",
        }}
      />

      {/* 🔹 Optional dots indicator */}
      {images.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 64,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 1,
            zIndex: 5,
          }}
        >
          {images.map((_, i) => (
            <Box
              key={i}
              onClick={() => setIndex(i)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor:
                  i === index
                    ? theme.palette.primary.main
                    : "rgba(255,255,255,0.6)",
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
      )}

      {/* 🔹 Text Box */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "background.paper",
          p: 2,
          width: "90%",
          margin: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: theme.palette.primary.main,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
            }}
          >
            {i18n.language === "ar" ? item.title_ar : item.title_en}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: theme.palette.text.secondary,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {i18n.language === "ar" ? item.desc_ar : item.desc_en}
        </Typography>
      </Box>
    </Box>
  );
}
