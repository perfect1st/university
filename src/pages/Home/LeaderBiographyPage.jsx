import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import image from "../../assets/news.jpg";
import TitleComponent from "../../components/HomeComponants/TitleComponent.jsx";
import { ArticaleById } from "../../graphql/articleQueries.js";

function ArticleImageSlider({ images = [], height = 300, intervalMs = 3500 }) {
  const imgs = useMemo(() => {
    const seen = new Set();
    return (images || [])
      .filter(Boolean)
      .map((u) => (typeof u === "string" ? u.trim() : u))
      .filter((u) => {
        if (!u) return false;
        if (seen.has(u)) return false;
        seen.add(u);
        return true;
      });
  }, [images]);

  const finalImgs = imgs.length ? imgs : [image];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!finalImgs || finalImgs.length <= 1) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % finalImgs.length), intervalMs);
    return () => clearInterval(id);
  }, [finalImgs, intervalMs]);

  return (
    <Box
      sx={{
        width: "100%",
        height,
        overflow: "hidden",
        position: "relative",
        bgcolor: "grey.100",
        borderRadius: 0.5,
      }}
    >
      <Box
        component="img"
        src={finalImgs[index]}
        alt=""
        sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 500ms ease-in-out" }}
      />
    </Box>
  );
}

export default function LeaderBiographyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const { data, loading, error } = useQuery(ArticaleById, {
    variables: { id },
    fetchPolicy: "network-only",
    skip: !id,
  });

  const buildImages = (article) => {
    if (!article) return [];
    const arr = [];
    if (article.main_image) arr.push(article.main_image);
    if (Array.isArray(article.images_array) && article.images_array.length) arr.push(...article.images_array);
    return arr.filter(Boolean);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const num = Number(timestamp);
    if (Number.isNaN(num)) return timestamp;
    try {
      const d = new Date(num);
      return d.toLocaleDateString(isArabic ? "ar-EG" : "en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch (e) {
      return timestamp;
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress size={40} />
      </Box>
    );

  if (error)
    return (
      <Paper sx={{ p: 4 }} elevation={0}>
        <Typography color="error" sx={{ textAlign: "center", mt: 6 }}>
          {t("Failed to load article details")}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            {t("Close")}
          </Button>
        </Box>
      </Paper>
    );

  const article = data?.getWebsiteArticleById;

  if (!article)
    return (
      <Paper sx={{ p: 4 }} elevation={0}>
        <Typography sx={{ textAlign: "center", mt: 6 }}>
          {t("Article not found")}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            {t("Close")}
          </Button>
        </Box>
      </Paper>
    );

  const parts = (isArabic ? article.title_ar : article.title_en)?.split('#$') || [];
  const mainTitle = parts[0] || (isArabic ? article.title_ar : article.title_en);
  const subtitle = parts[1] || "";
  const rate = parts[2] || "";
  const rateNum = Number(rate);
  const stars = !isNaN(rateNum) ? Array.from({ length: Math.min(Math.max(rateNum, 0), 5) }) : [];

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, backgroundColor: "background.paper", borderRadius: 0 }} elevation={0}>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon sx={{ transform: isArabic ? "scaleX(-1)" : "none" }} />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: "none", fontWeight: 600, gap: 0.5 }}
        >
          {isArabic ? "رجوع" : "Back"}
        </Button>
      </Box>

      <TitleComponent title={mainTitle} />

      <Grid container spacing={3} sx={{ mt: 1 }}>


        <Grid item xs={12} md={8} sx={{ display: "flex", flexDirection: "column" }}>
          {subtitle && (
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.secondary.main,
                textTransform: "uppercase",
                fontWeight: 700,
                mb: 1,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {stars.length > 0 && (
            <Box sx={{ display: "flex", gap: 0.3, mb: 2, alignItems: "center" }}>
              {stars.map((_, idx) => (
                <span key={idx} style={{ color: "#F39A15", fontSize: "1.3rem" }}>★</span>
              ))}
            </Box>
          )}

          {!subtitle && (
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {formatDate(article.article_date)}
            </Typography>
          )}

          <Typography variant="body1" sx={{ whiteSpace: "pre-line", color: "text.primary", mt: 1, lineHeight: 2 }}>
            {isArabic ? article.desc_ar : article.desc_en}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <ArticleImageSlider images={buildImages(article)} height={mdUp ? 420 : 240} intervalMs={3000} />
        </Grid>
      </Grid>
    </Paper>
  );
}
