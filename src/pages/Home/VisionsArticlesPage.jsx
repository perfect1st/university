import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import image from "../../assets/news.jpg";
import TitleComponent from "../../components/HomeComponants/TitleComponent";
import { useQuery } from "@apollo/client/react";
import { GetWebsiteArticles ,ArticalesById} from "../../graphql/articleQueries.js";

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

export default function VisionsArticlesPage({ }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  

  const { data: visionArticalesData, loading: visionArticalesLoading, error: visionArticalesError } = useQuery(ArticalesById, {
    variables: { departmentId: "68f09521023da961743a06a8" },
    fetchPolicy: "network-only",
  });
  // state for dialog / selected article
  const [openArticle, setOpenArticle] = useState(null);

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

  // short excerpt: use desc and clamp in CSS in layout

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, backgroundColor: "background.paper", borderRadius: 0 }} elevation={0}>
      <TitleComponent title={t("Future Vision Articles")} />

      {visionArticalesData?.getArticlesByDepartment.length === 0 ? (
        <Box sx={{ py: 6 }}>
          <Typography align="center">{t("No Future Vision articles found.")}</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {visionArticalesData?.getArticlesByDepartment?.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card sx={{ height: "100%", borderRadius: 0, boxShadow: "none", display: "flex", flexDirection: "column" }}>
                <ArticleImageSlider images={buildImages(article)} height={mdUp ? 260 : 200} intervalMs={3500} />

                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {isArabic ? article.title_ar : article.title_en}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      color: "text.secondary",
                      mb: 2,
                    }}
                  >
                    {isArabic ? article.desc_ar : article.desc_en}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(article.article_date)}
                    </Typography>

                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setOpenArticle(article)}
                      size="small"
                    >
                      {t("Read More")}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Detail dialog (inline so no extra route needed) */}
      <Dialog open={Boolean(openArticle)} onClose={() => setOpenArticle(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {openArticle ? (isArabic ? openArticle.title_ar : openArticle.title_en) : ""}

          <IconButton
            aria-label="close"
            onClick={() => setOpenArticle(null)}
            sx={{ position: "absolute", ...( !isArabic && { right: 8 } ),...( isArabic && { left: 8 } ), top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {openArticle && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ArticleImageSlider images={buildImages(openArticle)} height={mdUp ? 400 : 220} intervalMs={3000} />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {formatDate(openArticle.article_date)}
                </Typography>

                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {isArabic ? openArticle.desc_ar : openArticle.desc_en}
                </Typography>

                {/* You can add share buttons, download, or link to a full article page here */}
                <Box sx={{ mt: 3 }}>
                  <Button variant="outlined" onClick={() => setOpenArticle(null)}>
                    {t("Close")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
