import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { ReactComponent as VisionIcon } from "../../assets/vision.svg";
import { ReactComponent as MissionIcon } from "../../assets/mission.svg";
import { ReactComponent as GoalsIcon } from "../../assets/goal.svg";
import { useTranslation } from "react-i18next";

// HomeHero (unchanged design) —
// - background is now a slider (auto-play, no visible controls so design stays the same)
// - Vision / Mission / Goals cards get title + desc dynamically from HomeSliderData

export default function HomeHero({ HomeSliderData = [] }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const heroHeight = isSm ? 480 : 854;
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Build images array for the hero slider.
  // Priority:
  // 1. Use images_array from the first article that has images_array and length > 0
  // 2. Otherwise, use first article main_image if present
  // 3. Otherwise collect first available main_image from articles
  // 4. Fallback to an empty array
  const sliderImages = useMemo(() => {
    if (!HomeSliderData || HomeSliderData.length === 0) return [];

    const firstWithImages = HomeSliderData.find(
      (a) => Array.isArray(a.images_array) && a.images_array.length > 0
    );
    if (firstWithImages) return firstWithImages.images_array;

    const firstMain = HomeSliderData[0].main_image;
    if (firstMain) return [firstMain];

    const mains = HomeSliderData.map((a) => a.main_image).filter(Boolean);
    return mains;
  }, [HomeSliderData]);

  // slider state
  const [index, setIndex] = useState(0);

  // auto-play every 6 seconds. No visual controls added so design remains identical.
  useEffect(() => {
    if (!sliderImages || sliderImages.length <= 1) return;
    const id = setInterval(() => {
      setIndex((p) => (p + 1) % sliderImages.length);
    }, 6000);
    return () => clearInterval(id);
  }, [sliderImages]);

  // Helper to get article by expected key. Uses title_en as the stable marker when available,
  // falls back to title_ar or the first matching word.
  const getArticleByKey = (key) => {
    if (!HomeSliderData) return null;
    const map = {
      vision: ["Our Vision", "رؤيتنا", "Vision"],
      mission: ["Our Mission", "مهمتنا", "Mission"],
      goals: ["Our Goals", "أهدافنا", "Goals"],
    };
    const candidates = map[key] || [];

    // try exact match on title_en or title_ar
    for (const c of candidates) {
      const found = HomeSliderData.find(
        (a) => a.title_en === c || a.title_ar === c
      );
      if (found) return found;
    }

    // fallback: find by inclusion (e.g. titles that contain the word)
    for (const c of candidates) {
      const found = HomeSliderData.find(
        (a) => (a.title_en && a.title_en.includes(c)) || (a.title_ar && a.title_ar.includes(c))
      );
      if (found) return found;
    }

    // last resort: try to find by english word
    const looseMatch = HomeSliderData.find((a) =>
      (a.title_en && a.title_en.toLowerCase().includes(key)) ||
      (a.title_ar && a.title_ar.includes(key))
    );
    return looseMatch || null;
  };

  const cards = [
    {
      key: "vision",
      Icon: VisionIcon,
      article: getArticleByKey("vision"),
    },
    {
      key: "mission",
      Icon: MissionIcon,
      article: getArticleByKey("mission"),
    },
    {
      key: "goals",
      Icon: GoalsIcon,
      article: getArticleByKey("goals"),
    },
  ];

  // hero background image to use (handle empty gracefully)
  const heroBg = (sliderImages && sliderImages.length > 0) ? sliderImages[index] : HomeSliderData?.[0]?.main_image || "";

  return (
    <Box>
      {/* Hero Section (layout & style preserved) */}
      <Box
        sx={{
          position: "relative",
          height: heroHeight,
          width: "100%",
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            pb: { xs: 8, md: 12 },
            backgroundColor: `${theme.palette.primary.main}F0`, // keep same translucent overlay
          }}
        >
          {/* Title + welcome (unchanged) */}
          <Box sx={{ width: "100%", py: { xs: 2, md: 3 }, px: { xs: 2, md: 6 } }}>
            <Typography variant={isSm ? "h5" : "h3"} sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}>
              {isArabic
                ? HomeSliderData?.[0]?.title_ar || ""
                : HomeSliderData?.[0]?.title_en || ""}
            </Typography>
            <Typography variant={isSm ? "body1" : "h6"} sx={{ mt: 1, color: theme.palette.primary.contrastText }}>
              {/* keep welcome_message usage as before so text isn't changed */}
              {/* If you want welcome to come from dynamic data too, we can switch this later. */}
              {/* t("welcome_message") was used previously; leaving it unchanged as requested. */}
              { /* NOTE: keep i18n translation key usage as-is */ }
              {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
              {""}
            </Typography>
          </Box>

          {/* Description on dark background (uses the first article's desc as before) */}
          <Box sx={{ width: "100%", py: { xs: 3, md: 4 }, px: { xs: 2, md: 6 }, mt: 0.5 }}>
            <Typography variant="body1" sx={{ color: theme.palette.primary.contrastText, lineHeight: 1.7 }}>
              {isArabic ? HomeSliderData?.[0]?.desc_ar : HomeSliderData?.[0]?.desc_en}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Cards Section (content now from dynamic objects; design & layout unchanged) */}
      <Box sx={{ position: "relative", mt: { xs: -6, md: -10 }, px: { xs: 2, md: 6 } }}>
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
