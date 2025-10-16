import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  Stack,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
export default function TermsConditions({setAcceptTerms, acceptTerms, data = []}) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar"
  const handleAcceptTerms = () =>{
    setAcceptTerms(true)
    console.log("acceptTerms",acceptTerms)
  }
console.log("data",data)

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.secDefault,
        py: 6,
        px: { xs: 2, md: 6 },
        maxWidth: 900,
        m: 2,
        textAlign: "center",
        mx: "auto",
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: theme.palette.primary.main,
          borderRadius: 0,
          p: 2,
          mb: 4,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: theme.palette.primary.contrastText }}
        >
          {t("terms_header")}
        </Typography>
      </Paper>

      {/* Terms Cards */}
      <Stack spacing={3}>
      {data?.map((item, index) => (
  <Paper
    key={index}
    elevation={1}
    sx={{ p: 3, textAlign: "start", mb: 2 }}
  >
    <Typography
      variant="h6"
      sx={{
        color: theme.palette.info.main,
        fontWeight: "bold",
        mb: 1,
      }}
    >
      {isArabic ? item.title_ar : item.title_en}
    </Typography>

    <Typography
  variant="body1"
  sx={{
    color: theme.palette.text.primary,
    lineHeight: 1.7,
    whiteSpace: "pre-line",
  }}
>
{(isArabic ? item.desc_ar : item.desc_en)
    ?.replace(/\s*-\s*/g, "\n- ") // ينزل سطر قبل كل شرطة
    .trim()}
</Typography>

  </Paper>
))}

      </Stack>

      {/* Accept Button */}
      <Box sx={{ mt: 4, textAlign: "end" }}>
        <Button
          variant="contained"
          endIcon={<KeyboardDoubleArrowRightIcon 
            sx={{
              transform: i18n.language === "ar" ? "rotate(180deg)" : "none",
              transition: "transform 0.3s ease",
            }}
            />}
            onClick={handleAcceptTerms}
          sx={{
            bgcolor: theme.palette.secondary.main,
            color: theme.palette.primary.contrastText,
            px: 4,
            py: 1,
            gap:1,
            "&:hover": {
              bgcolor: theme.palette.secondary.dark,
            },
          }}
        >
          {t("accept_terms")}
        </Button>
      </Box>
    </Box>
  );
}
