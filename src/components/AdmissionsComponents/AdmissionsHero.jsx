// src/components/AdmissionsComponents/AdmissionsHero.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function AdmissionsHero({ data }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const heroHeight = 397;
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Combine main image + additional images and filter falsy
  const images = [data?.main_image, ...(data?.images_array || [])].filter(Boolean);

  const fallback = require("../../assets/home.jpg"); // local fallback
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const pausedRef = useRef(false);

  // start autoplay
  useEffect(() => {
    if (images.length > 1) startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  function startAutoplay() {
    stopAutoplay();
    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) setIndex((p) => (p + 1) % images.length);
    }, 4000);
  }

  function stopAutoplay() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function goTo(i) {
    setIndex(i);
    startAutoplay();
  }

  function prev() {
    setIndex((p) => (p - 1 + images.length) % images.length);
    startAutoplay();
  }

  function next() {
    setIndex((p) => (p + 1) % images.length);
    startAutoplay();
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: heroHeight,
        overflow: "hidden",
        direction: isArabic ? "rtl" : "ltr",
      }}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {/* Slides */}
      {images.length === 0 ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${fallback})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        images.map((src, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${src || fallback})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "opacity 800ms ease-in-out",
              opacity: i === index ? 1 : 0,
              zIndex: i === index ? 2 : 1,
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            {/* Overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.55)",
                zIndex: 1,
              }}
            />

            {/* Content */}
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: isArabic ? "right" : "center",
                pb: { xs: 6, md: 10 },
                px: { xs: 2, md: 6 },
              }}
            >
              <Typography
                variant={isSm ? "h5" : "h3"}
                sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}
              >
                {isArabic ? data?.title_ar : data?.title_en}
              </Typography>

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

              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  color: theme.palette.primary.contrastText,
                  lineHeight: 1.7,
                  maxWidth: "900px",
                }}
              >
                {isArabic ? data?.desc_ar : data?.desc_en}
              </Typography>
            </Box>
          </Box>
        ))
      )}

      {/* Dots */}
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 1,
          zIndex: 3,
        }}
      >
        {images.map((_, i) => (
          <Box
            key={i}
            onClick={() => goTo(i)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              cursor: "pointer",
              backgroundColor:
                i === index ? theme.palette.secondary.main : "rgba(255,255,255,0.45)",
              border: i === index ? "2px solid rgba(0,0,0,0.12)" : "none",
            }}
          />
        ))}
      </Box>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <IconButton
            onClick={prev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              zIndex: 4,
              color: "white",
              bgcolor: "rgba(0,0,0,0.35)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.45)" },
            }}
            aria-label="previous"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={next}
            sx={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              zIndex: 4,
              color: "white",
              bgcolor: "rgba(0,0,0,0.35)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.45)" },
            }}
            aria-label="next"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Box>
  );
}
