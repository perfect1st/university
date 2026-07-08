import React from "react";
import {
    Box,
    Typography,
    Grid,
    Container,
    Paper,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client/react";

// Update paths to match your project architecture
import { GetWebsiteDepartments } from "../../graphql/departmentsQueries.js";

const DEPARTMENT_ID = "6a4e3fc8262780da7d296e39";

export default function AcademicLegacySection() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    // Fetch Department Data
    const { data: deptsData } = useQuery(GetWebsiteDepartments, {
        fetchPolicy: "cache-first",
    });
    const department = deptsData?.websiteDepartments?.find((d) => d.id === DEPARTMENT_ID);

    // Structural text definitions with hardcoded fallbacks
    const rawTitle = department
        ? (isArabic ? department.title_ar : department.title_en)
        : "A standard of excellence that transcends borders, fostering a legacy of intellectual leadership.";

    const rawDesc = department
        ? (isArabic ? department.desc_ar : department.desc_en)
        : "";

    const imageUrl = department?.image || "https://uas.edu.ye/uploads/forms/file-1783513077991-884398692.jpg";

    // Parse the description string by the custom delimiter #$
    const descParts = rawDesc ? rawDesc.split("#$") : [];
    const mainParagraph = descParts[0] || "";
    const pointsList = descParts.slice(1); // All subsequent elements become key bullet items

    return (
        <Paper
            component="section"
            sx={{
                backgroundColor: "#FCF9F6", // Warm off-white canvas background
                borderRadius: 0,
                py: { xs: 8, md: 12 },
                minHeight: "500px",
                display: "flex",
                alignItems: "center"
            }}
            elevation={0}
        >
            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={{ xs: 6, md: 8 }}
                    alignItems="center"
                    direction={isArabic ? "row-reverse" : "row"} // Native layout re-orientation for RTL support
                >

                    {/* Left Text Side Info Block */}
                    <Grid item xs={12} md={6} sx={{ textAlign: isArabic ? "right" : "left" }}>
                        {/* Italicized Featured Quote Title */}
                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: "Georgia, serif",
                                fontStyle: "italic",
                                textAlign: "start",
                                fontWeight: 500,
                                color: "#0F1E36",
                                fontSize: { xs: "1.75rem", md: "2.3rem" },
                                lineHeight: 1.35,
                                mb: 4,
                                position: "relative"
                            }}
                        >
                            "{rawTitle}"
                        </Typography>

                        {/* Core Summary Paragraph */}
                        <Typography
                            variant="body1"
                            sx={{
                                textAlign: "start",
                                color: "#5A6A85",
                                lineHeight: 1.7,
                                fontSize: "0.98rem",
                                mb: 4,
                            }}
                        >
                            {mainParagraph}
                        </Typography>

                        {/* Dynamically Generated Checked Bullet List */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2
                            }}
                        >
                            {pointsList.map((pointText, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        flexDirection: isArabic ? "row-reverse" : "row"
                                    }}
                                >
                                    <CheckCircleOutlineIcon
                                        sx={{
                                            color: "#F39A15",
                                            fontSize: "1.3rem",
                                            flexShrink: 0
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#1A252F",
                                            fontWeight: 500,
                                            fontSize: "0.92rem",
                                        }}
                                    >
                                        {pointText.trim()}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Right Graphical Side Feature Block */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                display: "flex",
                                justifyContent: isArabic ? "flex-start" : "flex-end"
                            }}
                        >
                            {/* Framed Architecture/Gallery Photo */}
                            <Box
                                sx={{
                                    width: { xs: "100%", sm: "85%" },
                                    height: { xs: "240px", sm: "360px" },
                                    borderRadius: "2px",
                                    overflow: "hidden",
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={imageUrl}
                                    alt="St. Jude's University Campus Background"
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </Box>

                            {/* Overlapping Amber Informative Accent Box */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: { xs: "-30px", sm: "-40px" },
                                    left: isArabic ? "auto" : "auto",
                                    right: isArabic ? { xs: "10px", sm: "5%" } : { xs: "10px", sm: "5%" },
                                    width: { xs: "220px", sm: "260px" },
                                    backgroundColor: "#F39A15",
                                    color: "#ffffff",
                                    p: { xs: 2.5, sm: 3 },
                                    boxShadow: "0 12px 32px rgba(243,154,21,0.25)",
                                    zIndex: 3,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontFamily: "Georgia, serif",
                                        fontWeight: 500,
                                        fontSize: "1.25rem",
                                        mb: 1,
                                    }}
                                >
                                    {isArabic ? "ختم الجودة" : "Quality Seal"}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "rgba(255,255,255,0.85)",
                                        lineHeight: 1.4,
                                        display: "block",
                                        fontSize: "0.75rem"
                                    }}
                                >
                                    {isArabic
                                        ? "تم التحقق منه بشكل مستقل لأكثر من 70 عاماً من التميز المؤسسي."
                                        : "Independently verified for 70+ years of institutional excellence."
                                    }
                                </Typography>
                            </Box>

                        </Box>
                    </Grid>

                </Grid>
            </Container>
        </Paper>
    );
}