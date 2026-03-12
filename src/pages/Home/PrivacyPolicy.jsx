import React from "react";
import { Box, Typography, Container, Paper, CircularProgress, Divider, Fade, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { GET_SITE_CONFIG } from "../../graphql/siteConfigQueries";

// Icons
import ShieldTwoToneIcon from '@mui/icons-material/ShieldTwoTone';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';

export default function PrivacyPolicy() {
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
          {isArabic ? "جاري تحميل البيانات الأكاديمية..." : "Loading academic data..."}
        </Typography>
      </Box>
    );
  }

  const config = data?.getSiteConfig || {};
  const content = isArabic ? config.privacy_policy_ar : config.privacy_policy_en;

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      
      {/* Dynamic Header Section */}
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
              <ShieldTwoToneIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9, color: '#eab308' }} />
              <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: isArabic ? 0 : 1 }}>
                {t("footer.privacy")}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 300, maxWidth: 600, mx: 'auto' }}>
                {isArabic 
                  ? "نلتزم في الجامعة بحماية بيانات طلابنا وخصوصيتهم وفق أعلى المعايير التقنية والأكاديمية." 
                  : "We are committed at the university to protecting our students' data and privacy in accordance with the highest technical and academic standards."}
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
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Academic Watermark Badge */}
            <Box sx={{ position: 'absolute', top: 40, right: 40, opacity: 0.03, display: { xs: 'none', md: 'block' } }}>
              <VerifiedUserTwoToneIcon sx={{ fontSize: 150 }} />
            </Box>

            {content ? (
              <Box>
                {/* Visual Label */}
                <Typography variant="overline" color="primary" fontWeight="700" sx={{ letterSpacing: 2 }}>
                  {isArabic ? "وثيقة رسمية" : "OFFICIAL DOCUMENT"}
                </Typography>
                
                <Divider sx={{ my: 3, width: "50px", height: "4px", bgcolor: "#eab308", borderRadius: 2, border: 'none' }} />

                <Typography 
                  variant="body1" 
                  component="div" 
                  sx={{ 
                    whiteSpace: "pre-wrap", 
                    lineHeight: 2.1, 
                    color: '#334155', 
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

            {/* Footer Sign-off */}
            <Divider sx={{ mt: 6, mb: 4 }} />
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={2} 
              alignItems="center" 
              justifyContent="center" 
              sx={{ opacity: 0.7 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <VerifiedUserTwoToneIcon fontSize="small" color="primary" />
                <Typography variant="caption" fontWeight="bold">
                  {isArabic ? "سياسة معتمدة إدارياً" : "Administratively Approved Policy"}
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' } }}>•</Typography>
              <Typography variant="caption">
                {isArabic ? "تطبق على جميع الطلاب والزوار" : "Applies to all students and visitors"}
              </Typography>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}