import React, { useState } from "react";
import { Box, Typography, Grid, Button, useTheme } from "@mui/material";
import TitleComponent from "./TitleComponent";
import { useTranslation } from "react-i18next";

export default function News() {
  const theme = useTheme();
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();

  const newsData = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title: `News Title ${i + 1}`,
    desc: `This is the description for news item ${
      i + 1
    }. It provides a quick summary of the news content.`,
    image: require("../../assets/news.jpg"),
  }));

  const displayedNews = showAll ? newsData : newsData.slice(0, 6);

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
        {displayedNews.map((news, index) => (
          <Grid
            item
            key={news.id}
            xs={12}
            md={4}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Box
              sx={{
                position: "relative",
                height: 300 ,
                overflow: "hidden",
                // boxShadow: 3,
              }}
            >
              {/* صورة الخبر */}
              <Box
                component="img"
                src={news.image}
                alt={news.title}
                sx={{
                  width: "100%",
                  height: 250,
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* البوكس اللي فيه النصوص */}
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
                    {news.title}
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
                  {news.desc}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* زرار Show More */}
      <Box sx={{ textAlign: "end", mt: 6 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setShowAll((prev) => !prev)}
        >
  {showAll ? t("show_less") : t("show_more")}
  </Button>
      </Box>

    </Box>
  );
}
