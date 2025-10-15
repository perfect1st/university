import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TitleComponent from "./TitleComponent";
import { useTranslation } from "react-i18next";

// import your dummy images
import mainImage from "../../assets/news.jpg";

export default function News({ news = [] }) {
  const theme = useTheme();
  const [showAll, setShowAll] = useState(false);
  const { t, i18n } = useTranslation();

  // Choose real data or dummy
  const newsList = news?.length > 0 ? news : [];

  // Determine which items to show
  const displayedNews = showAll ? newsList : newsList.slice(0, 6);

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

      {/* Show More / Less Button */}
      {news?.length > 5 && (
        <Box sx={{ textAlign: "end", mt: 6 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? t("show_less") : t("show_more")}
          </Button>
        </Box>
      )}
    </Box>
  );
}

function NewsCard({ item, i18n, theme }) {
  // Prepare images: main_image first, then any images_array
  const images = [item.main_image, ...(item.images_array || [])].filter(Boolean);
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  const getImageSrc = (path) => {
    if (!path) return mainImage;
    // keep same behavior as original: concat with base url
    return `${path}`;
    // return `${process.env.REACT_APP_API_BASE_URL}${path}`;
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: 300,
        overflow: "hidden",
      }}
    >
      {/* Slider image (keeps same size as before) */}
      <Box
        component="img"
        src={getImageSrc(images[index])}
        alt={i18n.language === "ar" ? item.title_ar : item.title_en}
        sx={{
          width: "100%",
          height: 250,
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Prev/Next buttons (transparent over image) */}
      {images.length > 1 && (
        <>
          <IconButton
            size="small"
            onClick={prev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.35)",
              color: "#fff",
              '&:hover': { bgcolor: 'rgba(0,0,0,0.45)' },
              zIndex: 5,
            }}
            aria-label="previous image"
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            size="small"
            onClick={next}
            sx={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.35)",
              color: "#fff",
              '&:hover': { bgcolor: 'rgba(0,0,0,0.45)' },
              zIndex: 5,
            }}
            aria-label="next image"
          >
            <ChevronRightIcon />
          </IconButton>

          {/* Dots */}
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
                  bgcolor: i === index ? theme.palette.primary.main : "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                }}
              />
            ))}
          </Box>
        </>
      )}

      {/* Text Box (keeps original design and position) */}
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
