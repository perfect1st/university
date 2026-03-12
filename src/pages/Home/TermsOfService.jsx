import React from "react";
import { Box, Typography, Container, Paper, CircularProgress, Divider, Fade, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { GET_SITE_CONFIG } from "../../graphql/siteConfigQueries";

// Icons
import GavelTwoToneIcon from '@mui/icons-material/GavelTwoTone';
import AssignmentTurnedInTwoToneIcon from '@mui/icons-material/AssignmentTurnedInTwoTone';

export default function TermsOfService() {
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
          {isArabic ? "جاري جلب البنود الأكاديمية..." : "Fetching academic terms..."}
        </Typography>
      </Box>
    );
  }

  const config = data?.getSiteConfig || {};
  const content = isArabic ? config.terms_of_service_ar : config.terms_of_service_en;

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      
      {/* Header Section - Modern Legal Style */}
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
              <GavelTwoToneIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9, color: '#eab308' }} />
              <Typography variant="h3" fontWeight="900" gutterBottom>
                {t("footer.terms")}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 300, maxWidth: 600, mx: 'auto' }}>
                {isArabic 
                  ? "تحدد هذه الوثيقة القواعد واللوائح المنظمة لاستخدام منصة الجامعة والخدمات التعليمية المرتبطة بها." 
                  : "This document outlines the rules and regulations governing the use of the university platform and its related educational services."}
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
            {/* Background Watermark */}
            <Box sx={{ position: 'absolute', top: 40, right: 40, opacity: 0.03, display: { xs: 'none', md: 'block' } }}>
              <AssignmentTurnedInTwoToneIcon sx={{ fontSize: 150 }} />
            </Box>

            {content ? (
              <Box>
                {/* Visual Label */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <Typography variant="overline" color="primary" fontWeight="700" sx={{ letterSpacing: 2 }}>
                    {isArabic ? "اتفاقية الاستخدام" : "USER AGREEMENT"}
                  </Typography>
                  <Divider sx={{ flexGrow: 1, opacity: 0.3 }} />
                </Stack>
                
                <Typography 
                  variant="body1" 
                  component="div" 
                  sx={{ 
                    whiteSpace: "pre-wrap", 
                    lineHeight: 2.2, 
                    color: '#334155', 
                    fontSize: '1.1rem',
                    textAlign: 'justify',
                    '& p': { mb: 2 } // Adds spacing between paragraphs if they exist
                  }}
                >
                  {content}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {isArabic ? "شروط الخدمة غير متوفرة حالياً." : "Terms of service are not available currently."}
                </Typography>
              </Box>
            )}

            {/* Acknowledgment Footer */}
            <Box sx={{ mt: 6, p: 3, bgcolor: '#f1f5f9', borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {isArabic 
                  ? "باستخدامك لهذه المنصة، فإنك تقر بموافقتك على كافة الشروط والالتزامات الواردة أعلاه." 
                  : "By using this platform, you acknowledge your agreement to all the terms and obligations stated above."}
              </Typography>
            </Box>

            <Divider sx={{ mt: 4, mb: 4 }} />
            
            <Stack direction="row" justifyContent="center" spacing={4} sx={{ opacity: 0.6 }}>
               <Typography variant="caption" fontWeight="bold">© 2026 {isArabic ? "الجامعة" : "The University"}</Typography>
               <Typography variant="caption" fontWeight="bold">{isArabic ? "الحقوق محفوظة" : "All Rights Reserved"}</Typography>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}