import React from "react";
import { Box, Typography, Container, Paper, CircularProgress, Divider, Fade, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { GET_SITE_CONFIG } from "../../graphql/siteConfigQueries";

// Icons
import AccessibilityNewTwoToneIcon from '@mui/icons-material/AccessibilityNewTwoTone';
import UniversalAccessTwoToneIcon from '@mui/icons-material/AccessibleTwoTone';

export default function Accessibility() {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const { data, loading } = useQuery(GET_SITE_CONFIG, {
    fetchPolicy: "cache-first",
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', gap: 2 }}>
        <CircularProgress thickness={2} size={50} sx={{ color: '#003366' }} />
        <Typography variant="body2" color="text.secondary">
          {isArabic ? "جاري جلب معايير الوصول..." : "Fetching accessibility standards..."}
        </Typography>
      </Box>
    );
  }

  const config = data?.getSiteConfig || {};
  const content = isArabic ? config.accessibility_ar : config.accessibility_en;

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      
      {/* Header Section - Inclusive Style */}
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, #003366 0%, #00509E 100%)`, 
          color: 'white',
          pt: { xs: 8, md: 10 },
          pb: { xs: 12, md: 15 },
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Box>
              <AccessibilityNewTwoToneIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9, color: '#eab308' }} />
              <Typography variant="h3" fontWeight="900" gutterBottom>
                {t("footer.accessibility")}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 300, maxWidth: 600, mx: 'auto' }}>
                {isArabic 
                  ? "تلتزم الجامعة بتوفير بيئة تعليمية رقمية شاملة يسهل الوصول إليها من قبل جميع الطلاب بمختلف قدراتهم." 
                  : "The University is committed to providing an inclusive digital learning environment accessible to all students of all abilities."}
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="md" sx={{ mt: -8, pb: 10 }}>
        <Fade in timeout={1500}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 4, md: 8 }, 
              borderRadius: 5, 
              border: "1px solid", 
              borderColor: "divider",
              boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
              position: 'relative'
            }}
          >
            {/* Background Watermark */}
            <Box sx={{ position: 'absolute', top: 40, right: 40, opacity: 0.03, display: { xs: 'none', md: 'block' } }}>
              <UniversalAccessTwoToneIcon sx={{ fontSize: 150 }} />
            </Box>

            {content ? (
              <Box>
                <Typography variant="overline" color="primary" fontWeight="700" sx={{ letterSpacing: 2 }}>
                  {isArabic ? "معايير التجربة الرقمية" : "DIGITAL EXPERIENCE STANDARDS"}
                </Typography>
                
                <Divider sx={{ my: 3, width: "60px", height: "4px", bgcolor: "#eab308", borderRadius: 2, border: 'none' }} />

                <Typography 
                  variant="body1" 
                  component="div" 
                  sx={{ 
                    whiteSpace: "pre-wrap", 
                    lineHeight: 2.2, 
                    color: '#1e293b', 
                    fontSize: '1.15rem',
                    textAlign: 'justify'
                  }}
                >
                  {content}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {isArabic ? "لا يوجد محتوى متاح حالياً." : "No content available currently."}
                </Typography>
              </Box>
            )}

            <Divider sx={{ mt: 6, mb: 4 }} />
            
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              alignItems="center" 
              justifyContent="center" 
              spacing={2}
              sx={{ opacity: 0.7 }}
            >
              <Typography variant="caption" sx={{ textAlign: 'center' }}>
                {isArabic 
                  ? "نحن نعمل باستمرار على تحسين تجربة المستخدم للجميع." 
                  : "We are constantly working to improve the user experience for everyone."}
              </Typography>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}