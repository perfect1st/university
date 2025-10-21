import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import TitleComponent from "./TitleComponent";
import image from "../../assets/news.jpg";
import { useQuery } from "@apollo/client/react";
import { ArticalesById } from "../../graphql/articleQueries.js";
import { useNavigate } from "react-router-dom";

/**
 * Small image slider used inside each card.
 * - images: array of image URLs
 * - height: px height for the image area
 * - intervalMs: auto-advance interval in ms
 *
 * No arrows or controls — auto-scroll only (as requested).
 */
function ArticleImageSlider({ images = [], height = 300, intervalMs = 4000 }) {
  const imgs = useMemo(() => {
    // Deduplicate and remove falsy values, keep order (main_image + images_array)
    const seen = new Set();
    return images
      .filter(Boolean)
      .map((u) => u.trim())
      .filter((u) => {
        if (seen.has(u)) return false;
        seen.add(u);
        return true;
      });
  }, [images]);

  const fallback = [image];
  const finalImgs = imgs.length > 0 ? imgs : fallback;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!finalImgs || finalImgs.length <= 1) return;
    const id = setInterval(() => {
      setIndex((p) => (p + 1) % finalImgs.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [finalImgs, intervalMs]);

  return (
    <Box
      sx={{
        width: "100%",
        height,
        position: "relative",
        overflow: "hidden",
        borderRadius: 0,
        bgcolor: "grey.100",
      }}
    >
      {/* simple implementation: single img element updated by state */}
      <Box
        component="img"
        src={finalImgs[index]}
        alt=""
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </Box>
  );
}

export default function ActivitiesPrograms({ Activities = [] }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  // initialize tab with the first activity id if available
  const [tab, setTab] = useState(() => Activities?.[0]?.id ?? null);

  // update tab when Activities prop changes (keep controlled)
  useEffect(() => {
    if (Activities && Activities.length > 0) {
      setTab((prev) => (prev ? prev : Activities[0].id));
    } else {
      setTab(null);
    }
  }, [Activities]);

  // Query articles for the selected activity (departmentId = tab)
  const { data: newsData, loading, error } = useQuery(ArticalesById, {
    variables: { departmentId: tab },
    skip: !tab, // don't run until we have a valid tab
    fetchPolicy: "network-only",
  });

  const articles = newsData?.getArticlesByDepartment ?? [];

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  // build images array for each article: prefer main_image then images_array
  const buildImages = (article) => {
    if (!article) return [];
    // Put main_image first then any images_array entries
    const arr = [];
    if (article.main_image) arr.push(article.main_image);
    if (Array.isArray(article.images_array) && article.images_array.length > 0) {
      arr.push(...article.images_array);
    }
    return arr.length ? arr : [];
  };

  return (
    <Paper sx={{ p: 4, backgroundColor: "background.paper", borderRadius: 0 }} elevation={3}>
      {/* Title */}
      <TitleComponent title={t("Activities & Programs")} />

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={handleChange}
        textColor="inherit"
        sx={{
          mb: 3,
          position: "relative",
          // 🔹 ثابت الخط الأساسي تحت كل التابات
          "&::before": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "3px",
            bgcolor: "background.secDefault",
            zIndex: 0,
          },
          // 🔹 مؤشر التاب المختار
          "& .MuiTabs-indicator": {
            backgroundColor: "secondary.main",
            height: "3px",
            zIndex: 1,
          },
        }}
      >
        {Activities?.map((activity) => (
          <Tab
            key={activity.id}
            value={activity.id}
            label={isArabic ? activity.title_ar : activity.title_en}
            id={`tab-${activity.id}`}
            aria-controls={`tabpanel-${activity.id}`}
            sx={{
              fontWeight: "bold", // 🔹 make text bold
              color: "primary.main",
              "&.Mui-selected": {
                color: "secondary.main", // 🔹 active tab color
                fontWeight: "bold",
              },
            }}
          />
        ))}
      </Tabs>

      {/* Loading / Error */}
      {(!tab || loading) ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ py: 4 }}>
          <Typography color="error">Failed to load articles.</Typography>
        </Box>
      ) : (
        // Cards: show articles returned for the selected department (activity)
        <Grid container spacing={3}>
          {articles.length === 0 ? (
            <Grid item xs={12}>
              <Typography>{t("No articles found")}</Typography>
            </Grid>
          ) : (
            articles.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card 
                    sx={{
                      height: "100%",
                      borderRadius: 0,
                      boxShadow: "none",
                      cursor: "pointer",
                      "&:hover": { boxShadow: 4, transform: "scale(1.01)", transition: "0.3s" },
                    }}

                    onClick={() => navigate(`/ArticalDetails/${item.id}`)} // ✅ هنا الانتقال

                >
                  {/* <-- Replaced CardMedia with image slider component --> */}
                  <ArticleImageSlider images={buildImages(item)} height={300} intervalMs={4000} />

                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {isArabic ? item.title_ar : item.title_en}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        color: "primary.main",
                      }}
                    >
                      {isArabic ? item.desc_ar : item.desc_en}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Paper>
  );
}
