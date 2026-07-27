import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Container,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client/react";
import image from "../../assets/news.jpg";
import { ArticalesById } from "../../graphql/articleQueries.js";
import { GetWebsiteDepartments } from "../../graphql/departmentsQueries.js";

const DEPARTMENT_ID = "6a4e1ac7262780da7d296338";

export default function StudentVoicesPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { data: deptsData } = useQuery(GetWebsiteDepartments, {
    fetchPolicy: "cache-first",
  });

  const department = deptsData?.websiteDepartments?.find((d) => d.id === DEPARTMENT_ID);

  const { data: articlesData } = useQuery(ArticalesById, {
    variables: { departmentId: DEPARTMENT_ID },
    fetchPolicy: "network-only",
  });

  const buildImages = (article) => {
    if (!article) return [];
    const arr = [];
    if (article.main_image) arr.push(article.main_image);
    if (Array.isArray(article.images_array) && article.images_array.length) arr.push(...article.images_array);
    return arr.filter(Boolean);
  };

  const pageTitle = department
    ? isArabic ? department.title_ar : department.title_en
    : t("Student Voices");

  const pageDesc = department
    ? isArabic ? department.desc_ar : department.desc_en
    : t("At St. Jude’s, our students aren’t just learning—they’re leading. Discover the stories of academic excellence and personal growth from our vibrant campus community.");

  const deptImage = department?.image;
  const articles = articlesData?.getArticlesByDepartment || [];

  return (
    <Paper sx={{ backgroundColor: "background.paper", borderRadius: 0, p: 0, minHeight: "100vh" }} elevation={0}>

      {/* Hero Banner Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 340, md: 440 },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={deptImage || image}
          alt={pageTitle}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.5) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            px: { xs: 3, md: 8 },
            pb: { xs: 8, md: 12 }, // leaves room for the card overlap
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 500,
              fontSize: { xs: "2rem", md: "2.8rem" },
              mb: 2,
              fontFamily: "inherit",
            }}
          >
            {pageTitle}
          </Typography>
          {pageDesc && (
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.85)",
                maxWidth: "750px",
                lineHeight: 1.6,
                fontSize: { xs: "0.9rem", md: "1.05rem" },
              }}
            >
              {pageDesc}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Testimonials Grid Wrapper Container */}
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
        {articles.length === 0 ? (
          <Box sx={{ py: 8 }}>
            <Typography align="center" color="text.secondary">
              {t("No articles found.")}
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{
              mt: { xs: "-60px", md: "-100px" }, // Creates the card overlay effect
              position: "relative",
              zIndex: 2,
              mb: 8
            }}
          >
            {articles.map((article) => {
              const parts = (isArabic ? article.title_ar : article.title_en)?.split('#$') || [];
              const mainTitle = parts[0] || (isArabic ? article.title_ar : article.title_en);
              const subtitle = parts[1] || "";
              const rate = parts[2] || "";
              const rateNum = Number(rate);
              const stars = !isNaN(rateNum) ? Array.from({ length: Math.min(Math.max(rateNum, 0), 5) }) : [];

              const articleImages = buildImages(article);
              const displayAvatar = articleImages.length > 0 ? articleImages[0] : image;
              const cardDescription = isArabic ? article.desc_ar : article.desc_en;

              return (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "4px",
                      overflow: "visible",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      backgroundColor: "#FFFDFB", // Off-white/cream tinted background
                      borderTop: "4px solid #F39A15", // Top accent bar
                      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                      p: 3,
                    }}
                  >
                    {/* Centered Rounded Image */}
                    <Avatar
                      variant="rounded"
                      src={displayAvatar}
                      alt={subtitle || mainTitle}
                      sx={{
                        width: 75,
                        height: 75,
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        mb: 2,
                        mt: 1
                      }}
                    />

                    {/* Star Ratings */}
                    {stars.length > 0 && (
                      <Box sx={{ display: "flex", gap: 0.3, mb: 1.5, justifyContent: "center" }}>
                        {stars.map((_, idx) => (
                          <span key={idx} style={{ color: "#F39A15", fontSize: "1.1rem" }}>★</span>
                        ))}
                      </Box>
                    )}

                    {/* Stylized Quote Icon */}
                    <Typography
                      sx={{
                        color: "#F39A15",
                        fontSize: "2.5rem",
                        lineHeight: 0.5,
                        fontFamily: "Georgia, serif",
                        fontWeight: "bold",
                        mb: 1
                      }}
                    >
                      ”
                    </Typography>

                    <CardContent sx={{ p: 0, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      {/* Italicized Testimonial/Quote Text */}
                      <Typography
                        variant="body1"
                        sx={{
                          fontStyle: "italic",
                          color: "#2C3E50",
                          lineHeight: 1.6,
                          fontSize: "1.05rem",
                          fontFamily: "Georgia, serif",
                          mb: 4,
                        }}
                      >
                        "{cardDescription || mainTitle}"
                      </Typography>

                      {/* Author Info Section */}
                      <Box sx={{ mt: "auto" }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            color: "#1A252F",
                            fontSize: "0.85rem",
                            mb: 0.5
                          }}
                        >
                          {mainTitle}
                        </Typography>

                        {subtitle && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.78rem",
                            }}
                          >
                            {subtitle || mainTitle}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Paper>
  );
}