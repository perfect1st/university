import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client/react";

// GraphQL queries paths (Update them according to your file structure)
import { ArticalesById } from "../../graphql/articleQueries.js";
import { GetWebsiteDepartments } from "../../graphql/departmentsQueries.js";
import AcademicAccoladesBanner from "../../components/HomeComponants/AcademicAccoladesBanner.jsx";
import AcademicLegacySection from "../../components/HomeComponants/AcademicLegacySection.jsx";

// The requested department ID
const DEPARTMENT_ID = "6a4e34d5262780da7d296a6e";

export default function AcademicsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // 1. Fetch Department Data
  const { data: deptsData } = useQuery(GetWebsiteDepartments, {
    fetchPolicy: "cache-first",
  });
  const department = deptsData?.websiteDepartments?.find((d) => d.id === DEPARTMENT_ID);

  // 2. Fetch Articles Data
  const { data: articlesData, loading } = useQuery(ArticalesById, {
    variables: { departmentId: DEPARTMENT_ID },
    fetchPolicy: "network-only",
  });

  // Fallback structural data if GraphQL hasn't resolved yet
  const pageTitle = department
    ? isArabic ? department.title_ar : department.title_en
    : t("Accreditation & Recognitions");

  const pageDesc = department
    ? isArabic ? department.desc_ar : department.desc_en
    : "";

  const articles = articlesData?.getArticlesByDepartment || [];

  return (
    <Paper 
      sx={{ 
        backgroundColor: "#FFFFFF", 
        borderRadius: 0, 
        minHeight: "100vh",
        py: { xs: 6, md: 10 } 
      }} 
      elevation={0}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 }, px: { xs: 2, md: 6 } }}>
          <Typography
            variant="caption"
            sx={{
              color: "#F39A15",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              fontSize: "0.85rem",
              display: "block",
              mb: 1,
            }}
          >
            {isArabic ? "الجودة والتميز" : "QUALITY & EXCELLENCE"}
          </Typography>

          <Typography
            variant="h2"
            sx={{
              color: "#0F1E36",
              fontWeight: 500,
              fontFamily: "Georgia, serif",
              fontSize: { xs: "2.2rem", md: "3.2rem" },
              mb: 3,
            }}
          >
            {pageTitle}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#5A6A85",
              maxWidth: "800px",
              margin: "0 auto",
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            {pageDesc}
          </Typography>
        </Box>

        {/* Content Section / Grid */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">{t("Loading...")}</Typography>
          </Box>
        ) : articles.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">{t("No accreditations found.")}</Typography>
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {articles.map((article) => {
              // Parse titles logic using your custom split identifier: #$
              const rawTitle = isArabic ? article.title_ar : article.title_en;
              const parts = rawTitle?.split("#$") || [];
              const mainTitle = parts[0] || rawTitle;
              const badgeStatus = parts[1] || "";

              return (
                <Grid item xs={12} sm={6} md={3} key={article.id}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "8px",
                      border: "1px solid #EAEFF5",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      p: 3,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 30px rgba(15, 30, 54, 0.06)",
                        borderColor: "#D3DFEE"
                      },
                    }}
                  >
                    {/* Badge Icon/Logo Container */}
                    <Box
                      sx={{
                        width: 65,
                        height: 65,
                        borderRadius: "8px",
                        backgroundColor: "#FDF8F0", // subtle warm container background
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        p: 1.5
                      }}
                    >
                      <Box
                        component="img"
                        src={article.main_image}
                        alt={mainTitle}
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>

                    {/* Card Content Section */}
                    <CardContent 
                      sx={{ 
                        p: 0, 
                        display: "flex", 
                        flexDirection: "column", 
                        flexGrow: 1, 
                        width: "100%" 
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "Georgia, serif",
                          fontWeight: 600,
                          color: "#0F1E36",
                          fontSize: "1.15rem",
                          lineHeight: 1.4,
                          mb: 2,
                          minHeight: "52px", // balanced heading heights across items
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {mainTitle}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748B",
                          lineHeight: 1.6,
                          fontSize: "0.88rem",
                          mb: 3,
                          flexGrow: 1,
                        }}
                      >
                        {isArabic ? article.desc_ar : article.desc_en}
                      </Typography>

                      {/* Dynamic Certification Metadata string line at bottom */}
                      {badgeStatus && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#F39A15",
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            mt: "auto",
                          }}
                        >
                          {badgeStatus}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
      <AcademicAccoladesBanner />
      <AcademicLegacySection />
    </Paper>
  );
}