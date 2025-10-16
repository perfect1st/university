import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ArticaleById } from "../../graphql/queries/articleQueries";

export default function ArticalDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const theme = useTheme();

  const { data, loading, error } = useQuery(ArticaleById, {
    variables: { id },
    fetchPolicy: "network-only",
    skip: !id,
  });

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 6 }}>
        {t("Failed to load article details")}
      </Typography>
    );

  const article = data?.getWebsiteArticleById;
  if (!article)
    return (
      <Typography sx={{ textAlign: "center", mt: 6 }}>
        {t("Article not found")}
      </Typography>
    );

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 4, md: 8 },
        direction: isArabic ? "rtl" : "ltr",
      }}
    >
      {/* 🔹 Main Image */}
      <Box
        component="img"
        src={article.main_image}
        alt={isArabic ? article.title_ar : article.title_en}
        sx={{
          width: "100%",
          height: { xs: 220, sm: 350, md: 450 },
          borderRadius: 2,
          objectFit: "cover",
          mb: 4,
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      />

      {/* 🔹 Title */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign={isArabic ? "right" : "left"}
        sx={{
          mb: 2,
          color: theme.palette.primary.main,
          fontSize: { xs: "1.6rem", md: "2rem" },
          lineHeight: 1.4,
        }}
      >
        {isArabic ? article.title_ar : article.title_en}
      </Typography>

      {/* 🔹 Description */}
      <Typography
        variant="body1"
        sx={{
          whiteSpace: "pre-line",
          color: "text.primary",
          lineHeight: 2,
          fontSize: "1.1rem",
          textAlign: "justify",
        }}
      >
        {isArabic ? article.desc_ar : article.desc_en}
      </Typography>
    </Container>
  );
}
