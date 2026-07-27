import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import image from "../../assets/news.jpg";
import TitleComponent from "../../components/HomeComponants/TitleComponent.jsx";
import { useQuery } from "@apollo/client/react";
import { GetWebsiteArticles, ArticalesById } from "../../graphql/articleQueries.js";
import { GetWebsiteDepartments } from "../../graphql/departmentsQueries.js";

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

export default function LeadersArticlesPage({ }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const { data: deptsData } = useQuery(GetWebsiteDepartments, {
    fetchPolicy: "cache-first",
  });

  const department = deptsData?.websiteDepartments?.find(d => d.id === "6a4e08cf262780da7d29616e");

  const { data: visionArticalesData, loading: visionArticalesLoading, error: visionArticalesError } = useQuery(ArticalesById, {
    variables: { departmentId: "6a4e08cf262780da7d29616e" },
    fetchPolicy: "network-only",
  });

  // simple helper to build images from main_image + images_array
  const buildImages = (article) => {
    if (!article) return [];
    const arr = [];
    if (article.main_image) arr.push(article.main_image);
    if (Array.isArray(article.images_array) && article.images_array.length) arr.push(...article.images_array);
    return arr.filter(Boolean);
  };

  // format date safely (article_date is a timestamp in ms as string in your sample)
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

  const pageTitle = department
    ? (isArabic ? department.title_ar : department.title_en)
    : t("Future Vision Articles");

  const pageDesc = department
    ? (isArabic ? department.desc_ar : department.desc_en)
    : "";

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, backgroundColor: "background.paper", borderRadius: 0 }} elevation={0}>
      <TitleComponent title={pageTitle} />
      {pageDesc && (
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 1.5, mb: 4, maxWidth: "800px", lineHeight: 1.6 }}>
          {pageDesc}
        </Typography>
      )}

      {visionArticalesData?.getArticlesByDepartment?.length === 0 ? (
        <Box sx={{ py: 6 }}>
          <Typography align="center">{t("No articles found.")}</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {visionArticalesData?.getArticlesByDepartment?.map((article) => {
            const parts = (isArabic ? article.title_ar : article.title_en)?.split('#$') || [];
            const mainTitle = parts[0] || (isArabic ? article.title_ar : article.title_en);
            const subtitle = parts[1] || "";
            const rate = parts[2] || "";
            const rateNum = Number(rate);
            const stars = !isNaN(rateNum) ? Array.from({ length: Math.min(Math.max(rateNum, 0), 5) }) : [];

            return (
              <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={article.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    }
                  }}
                >
                  <ArticleImageSlider images={buildImages(article)} height={mdUp ? 240 : 180} intervalMs={3500} />

                  <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 1.75, "&:last-child": { pb: 1.75 } }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "text.primary", mb: 0.25, lineHeight: 1.3, fontSize: "1rem" }}>
                      {mainTitle}
                    </Typography>

                    {subtitle && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.secondary.main,
                          textTransform: "uppercase",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          letterSpacing: "0.4px",
                          mb: 0.75
                        }}
                      >
                        {subtitle}
                      </Typography>
                    )}

                    {stars.length > 0 && (
                      <Box sx={{ display: "flex", gap: 0.2, mb: 1, alignItems: "center" }}>
                        {stars.map((_, idx) => (
                          <span key={idx} style={{ color: "#F39A15", fontSize: "0.9rem", lineHeight: 1 }}>★</span>
                        ))}
                      </Box>
                    )}

                    {!subtitle && (
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          color: "text.secondary",
                          mb: 1.5,
                          fontSize: "0.8rem",
                        }}
                      >
                        {isArabic ? article.desc_ar : article.desc_en}
                      </Typography>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto", pt: 1 }}>
                      {!subtitle && (
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(article.article_date)}
                        </Typography>
                      )}

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: "text.primary",
                          fontSize: "0.85rem",
                          transition: "color 0.2s",
                          "&:hover": {
                            color: theme.palette.primary.main,
                          }
                        }}
                        onClick={() => navigate(`/leader-biography/${article.id}`)}
                      >
                        {subtitle ? (isArabic ? "اقرأ السيرة الذاتية ←" : "Read Biography →") : (isArabic ? "اقرأ المزيد ←" : "Read More →")}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Paper>
  );
}
