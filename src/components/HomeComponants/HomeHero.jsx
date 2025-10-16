// src/components/AdmissionsComponents/HomeHero.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, useTheme, useMediaQuery, IconButton } from "@mui/material";
import { ReactComponent as VisionIcon } from "../../assets/vision.svg";
import { ReactComponent as MissionIcon } from "../../assets/mission.svg";
import { ReactComponent as GoalsIcon } from "../../assets/goal.svg";
import { useTranslation } from "react-i18next";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function HomeHero({ HomeSliderData = [] }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const heroHeight = isSm ? 600 : 854;
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Build images array for the hero slider.
  const sliderImages = useMemo(() => {
    if (!HomeSliderData || HomeSliderData.length === 0) return [];

    const firstWithImages = HomeSliderData.find(
      (a) => Array.isArray(a.images_array) && a.images_array.length > 0
    );
    if (firstWithImages) return firstWithImages.images_array;

    const firstMain = HomeSliderData[0]?.main_image;
    if (firstMain) return [firstMain];

    const mains = HomeSliderData.map((a) => a.main_image).filter(Boolean);
    return mains;
  }, [HomeSliderData]);

  // slider state (same behavior as AdmissionsHero)
  const images = sliderImages;
  const fallback = require("../../assets/home.jpg"); // local fallback
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (images.length > 1) startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  function startAutoplay() {
    stopAutoplay();
    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) setIndex((p) => (p + 1) % images.length);
    }, 6000); // 6s as original hero comment
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

  // Helper to get article by expected key (unchanged)
  const getArticleByKey = (key) => {
    if (!HomeSliderData) return null;
    const map = {
      vision: ["Our Vision", "رؤيتنا", "Vision"],
      mission: ["Our Mission", "مهمتنا", "Mission"],
      goals: ["Our Goals", "أهدافنا", "Goals"],
    };
    const candidates = map[key] || [];

    for (const c of candidates) {
      const found = HomeSliderData.find((a) => a.title_en === c || a.title_ar === c);
      if (found) return found;
    }

    for (const c of candidates) {
      const found = HomeSliderData.find(
        (a) =>
          (a.title_en && a.title_en.includes(c)) ||
          (a.title_ar && a.title_ar.includes(c))
      );
      if (found) return found;
    }

    const looseMatch = HomeSliderData.find(
      (a) =>
        (a.title_en && a.title_en.toLowerCase().includes(key)) ||
        (a.title_ar && a.title_ar.includes(key))
    );
    return looseMatch || null;
  };

  const cards = [
    { key: "vision", Icon: VisionIcon, article: getArticleByKey("vision") },
    { key: "mission", Icon: MissionIcon, article: getArticleByKey("mission") },
    { key: "goals", Icon: GoalsIcon, article: getArticleByKey("goals") },
  ];

  // If no images, fall back to first article main_image or empty
  const hasImages = images && images.length > 0;
  const currentBg = hasImages ? images[index] : HomeSliderData?.[0]?.main_image || "";
  const contentPb = isSm ? theme.spacing(8) : "46%"; // returns like "64px" or "96px"

  return (
    <Box>
      {/* Hero Section - now a slider */}
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
        {(!hasImages && !currentBg) ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${fallback})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "flex-end",
            }}
          />
        ) : (
          (hasImages ? images : [currentBg]).map((src, i) => (
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
 
              {/* Overlay (keeps look similar to previous backgroundColor overlay) */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.45)",
                  zIndex: 1,
                }}
              />
 {(hasImages && images.length > 1) && (
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          // bottom is set so dots sit JUST ABOVE the content box's padded area
          bottom: `calc(${contentPb} + 8px)`,
          display: "flex",
          justifyContent: "center",
          gap: 1,
          zIndex: 4,
          pointerEvents: "auto",
        }}
      >
        {images.map((_, di) => (
          <Box
            key={di}
            onClick={() => goTo(di)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              cursor: "pointer",
              backgroundColor: di === index ? theme.palette.secondary.main : "rgba(255,255,255,0.45)",
              border: di === index ? "2px solid rgba(0,0,0,0.12)" : "none",
            }}
          />
        ))}
      </Box>
         )}

              {/* Content (title + welcome + desc) */}
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: isArabic ? "right" : "center",
                  pb: { xs: 8, md: 12 },
                  px: { xs: 2, md: 6 },
                  backgroundColor: `${theme.palette.primary.main}DD`, // subtle tint to keep text readable
                }}
              >
                


                <Box sx={{ width: "100%", py: { xs: 2, md: 3 }, px: { xs: 2, md: 6 } }}>
                  <Typography
                    variant={isSm ? "h5" : "h3"}
                    sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}
                  >
                    {isArabic
                      ? HomeSliderData?.[0]?.title_ar || ""
                      : HomeSliderData?.[0]?.title_en || ""}
                  </Typography>

                  <Typography
                    variant={isSm ? "body1" : "h6"}
                    sx={{ mt: 1, color: theme.palette.primary.contrastText }}
                  >
                    {t("welcome_message")}
                  </Typography>
                </Box>

                <Box sx={{ width: "100%", py: { xs: 3, md: 4 }, px: { xs: 2, md: 6 }, mt: 0.5 }}>
                  <Typography variant="body1" sx={{ color: theme.palette.primary.contrastText, lineHeight: 1.7 }}>
                    {isArabic ? HomeSliderData?.[0]?.desc_ar : HomeSliderData?.[0]?.desc_en}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}

        {/* Dots */}
        {(hasImages && images.length > 1) && (
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
        )}

        {/* Arrows */}
        {(hasImages && images.length > 1) && !isSm && (
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

      {/* Cards Section (unchanged) */}
      <Box sx={{ position: "relative", mt: { xs: -6, md: -10 }, px: { xs: 2, md: 6 }, zIndex: 999 }}>
        <Box sx={{ display: "flex", gap: { xs: 2, md: 3 }, justifyContent: "center", alignItems: "stretch", flexWrap: "wrap" }}>
          {cards.map((c) => {
            const Icon = c.Icon;
            const article = c.article;

            const title = article ? (isArabic ? article.title_ar : article.title_en) : (isArabic ? "" : "");
            const desc = article ? (isArabic ? article.desc_ar : article.desc_en) : "";

            return (
              <Box key={c.key} sx={{ width: { xs: "100%", sm: 300, md: 320 }, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3, px: 3, py: 4, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <Icon sx={{ fontSize: 40, mb: 1, color: theme.palette.secondary.main }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1.5, color: theme.palette.primary.main }}>
                  {desc}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 6 }, pt: 8 }} />
    </Box>
  );
}
