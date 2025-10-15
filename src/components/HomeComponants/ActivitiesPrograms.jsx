import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import TitleComponent from "./TitleComponent";
import image from "../../assets/news.jpg";
import { useQuery } from "@apollo/client/react";
import { newsActivityArticales } from "../../graphql/queries/articleQueries.js";

export default function ActivitiesPrograms({ Activities = [] }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

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
  const { data: newsData, loading, error } = useQuery(newsActivityArticales, {
    variables: { departmentId: tab },
    skip: !tab, // don't run until we have a valid tab
    fetchPolicy: "network-only",
  });

  const articles = newsData?.getArticlesByDepartment ?? [];

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  // helper to get image (main_image -> first images_array -> fallback image)
  const getImage = (article) =>
    article?.main_image || (article?.images_array && article.images_array[0]) || image;

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
          "& .MuiTabs-indicator": {
            backgroundColor: "orange", // orange underline
            height: "3px",
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
                <Card sx={{ height: "100%", borderRadius: 0, boxShadow: "none" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImage(item)}
                    alt={isArabic ? item.title_ar : item.title_en}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {isArabic ? item.title_ar : item.title_en}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
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
