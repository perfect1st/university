import React from "react";
import {
    Box,
    Typography,
    Grid,
    Container,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client/react";

// Update these paths to match your actual structure
import { ArticalesById } from "../../graphql/articleQueries.js";
import { GetWebsiteDepartments } from "../../graphql/departmentsQueries.js";

const DEPARTMENT_ID = "6a4e399b262780da7d296c73";

export default function AcademicAccoladesBanner() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    // 1. Fetch Department Data
    const { data: deptsData } = useQuery(GetWebsiteDepartments, {
        fetchPolicy: "cache-first",
    });
    const department = deptsData?.websiteDepartments?.find((d) => d.id === DEPARTMENT_ID);

    // 2. Fetch Articles (The Award Badges)
    const { data: articlesData, loading } = useQuery(ArticalesById, {
        variables: { departmentId: DEPARTMENT_ID },
        fetchPolicy: "network-only",
    });

    const pageTitle = department
        ? isArabic ? department.title_ar : department.title_en
        : t("Recent Academic Accolades");

    const pageDesc = department
        ? isArabic ? department.desc_ar : department.desc_en
        : "";

    const articles = articlesData?.getArticlesByDepartment || [];

    return (
        <Box
            component="section"
            sx={{
                width: "100%",
                backgroundColor: "#085690",
                color: "#ffffff",
                py: { xs: 5, md: 6 }, // Slightly tighter section padding
                mt  : { xs: 5, md: 6 },
                display: "flex",
                alignItems: "center",
            }}
        >
            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={4}
                    alignItems="center"
                    direction={"row"} // Adapts layouts cleanly for RTL
                >

                    {/* Left Text Column: Title and Description */}
                    <Grid item xs={12} md={6} sx={{ textAlign: isArabic ? "right" : "left" }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 500,
                                textAlign: "start",
                                fontSize: { xs: "1.6rem", md: "2.2rem" },
                                mb: 1.5,
                                letterSpacing: "0.5px",
                            }}
                        >
                            {pageTitle}
                        </Typography>

                        {pageDesc && (
                            <Typography
                                variant="body2"
                                sx={{
                                    textAlign: "start",
                                    color: "rgba(255, 255, 255, 0.75)",
                                    lineHeight: 1.6,
                                    maxWidth: "520px",
                                    fontSize: { xs: "0.88rem", md: "0.92rem" },
                                }}
                            >
                                {pageDesc}
                            </Typography>
                        )}
                    </Grid>

                    {/* Right Accolades Column: Minimalist Small Badges */}
                    <Grid item xs={12} md={6}>
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
                                    {t("Loading accolades...")}
                                </Typography>
                            </Box>
                        ) : (
                            <Grid
                                container
                                spacing={2}
                                justifyContent={{ xs: "center", md: "flex-end" }}
                                alignItems="flex-start"
                            >
                                {articles.map((article) => {
                                    const itemTitle = isArabic ? article.title_ar : article.title_en;

                                    return (
                                        <Grid
                                            item
                                            key={article.id}
                                            xs={4}
                                            sm={3}
                                            md={3.5}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                textAlign: "center",
                                                px: 0.5
                                            }}
                                        >
                                            {/* Reduced Size Gold Badge Icon */}
                                            <Box
                                                sx={{
                                                    width: { xs: 35, md: 35 },  // Made smaller
                                                    height: { xs: 35, md: 35 }, // Made smaller
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mb: 1,
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={article.main_image}
                                                    alt={itemTitle}
                                                    sx={{
                                                        maxWidth: "100%",
                                                        maxHeight: "100%",
                                                        objectFit: "contain",
                                                        filter: "brightness(0) saturate(100%) invert(69%) sepia(85%) saturate(718%) hue-rotate(352deg) brightness(97%) contrast(93%)"
                                                    }}
                                                />
                                            </Box>

                                            {/* Tighter, More Legible Text Formatting for both EN & AR */}
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: "#F39A15",
                                                    fontWeight: 600,
                                                    fontSize: { xs: "0.62rem", md: "0.62rem" }, // Shrunk text sizes
                                                    lineHeight: 1.4,
                                                    // Language optimizations
                                                    letterSpacing: isArabic ? "0px" : "0.8px",
                                                    textTransform: isArabic ? "none" : "uppercase",
                                                    fontFamily: isArabic ? "inherit" : "sans-serif",
                                                    textShadow: isArabic ? "0px 0.3px 1px rgba(0,0,0,0.15)" : "none", // Adds crispness to small Arabic fonts
                                                    maxWidth: "90px", // Keeps multi-word titles perfectly grouped
                                                    display: "block"
                                                }}
                                            >
                                                {itemTitle}
                                            </Typography>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        )}
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
}