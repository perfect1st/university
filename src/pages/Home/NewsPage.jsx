import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  useTheme,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import mainImage from "../../assets/news.jpg";
import TitleComponent from "../../components/HomeComponants/TitleComponent";
import { useQuery } from "@apollo/client/react";
import { ArticalesById} from "../../graphql/queries/articleQueries.js";
import LoadingPage from "../../components/LoadingComponent.jsx";
export default function NewsPage() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isArabic = i18n.language === "ar";
  const [selected, setSelected] = useState(null);

  const { data: newsArticalesData, loading: newsArticalesLoading, error: newsArticalesError } = useQuery(ArticalesById, {
    variables: { departmentId: "68ef93c7023da961743a05cc" },
    fetchPolicy: "network-only",
  });

  if(newsArticalesLoading) return <LoadingPage />
  if (!newsArticalesData?.getArticlesByDepartment?.length) {
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <Typography>{t("No news found")}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
      <TitleComponent title={t("news_updates")} />

      <Grid container spacing={3}>
        {newsArticalesData?.getArticlesByDepartment.map((item) => (
          <Grid item xs={12} md={4} key={item.id}>
            <NewsCard
              item={item}
              isArabic={isArabic}
              theme={theme}
              onClick={() => setSelected(item)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Popup for full article */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
      >
        {selected && <FullNewsDialog article={selected} isArabic={isArabic} />}
      </Dialog>
    </Box>
  );
}

// 🔹 Individual news card (image slider + summary)
function NewsCard({ item, isArabic, theme, onClick }) {
  const images = [item.main_image, ...(item.images_array || [])].filter(Boolean);
  const [index, setIndex] = useState(0);

  // auto slide
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      3000
    );
    return () => clearInterval(interval);
  }, [images]);

  const getImageSrc = (path) => path || mainImage;

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
        borderRadius: 1,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
    >
      <Box
        component="img"
        src={getImageSrc(images[index])}
        alt={isArabic ? item.title_ar : item.title_en}
        sx={{
          width: "100%",
          height: 250,
          objectFit: "cover",
          transition: "opacity 0.8s ease-in-out",
        }}
      />

      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            color: theme.palette.text.primary,
          }}
        >
          {isArabic ? item.title_ar : item.title_en}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: theme.palette.text.secondary,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {isArabic ? item.desc_ar : item.desc_en}
        </Typography>
      </Box>
    </Box>
  );
}

// 🔹 Full article popup
function FullNewsDialog({ article, isArabic }) {
  const [index, setIndex] = useState(0);
  const images = [article.main_image, ...(article.images_array || [])].filter(Boolean);

  // Auto slide every 3s
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      3000
    );
    return () => clearInterval(interval);
  }, [images]);

  return (
    <DialogContent sx={{ p: 0 }}>
      <Box>
        <Box
          component="img"
          src={images[index] || mainImage}
          alt={isArabic ? article.title_ar : article.title_en}
          sx={{
            width: "100%",
            height: 400,
            objectFit: "cover",
            transition: "opacity 1s ease-in-out",
          }}
        />

        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {isArabic ? article.title_ar : article.title_en}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {isArabic ? article.desc_ar : article.desc_en}
          </Typography>
        </Box>
      </Box>
    </DialogContent>
  );
}
