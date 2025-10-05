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
export default function TermsConditions({setAcceptTerms, acceptTerms}) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar"
  const handleAcceptTerms = () =>{
    setAcceptTerms(true)
    console.log("acceptTerms",acceptTerms)
  }


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
        {/* Card 1 */}
        <Paper elevation={1} sx={{ p: 3, textAlign: "start" }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.info.main,
              fontWeight: "bold",
              mb: 1,
            }}
          >
            {t("card1_title")}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.primary, lineHeight: 1.7 }}
          >
            {t("card1_desc")}
          </Typography>
        </Paper>

        {/* Card 2 */}
        <Paper elevation={1} sx={{ p: 3, textAlign: "start"  }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.info.main,
              fontWeight: "bold",
              mb: 1,
            }}
          >
            {t("card2_title")}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.primary, lineHeight: 1.7 }}
          >
            {t("card2_desc")}
          </Typography>
        </Paper>
      </Stack>

      {/* Accept Button */}
      <Box sx={{ mt: 4, textAlign: "end" }}>
        <Button
          variant="contained"
          endIcon={<KeyboardDoubleArrowRightIcon 
            sx={{
              transform: i18n.language === "ar" ? "rotate(180deg)" : "none",
              transition: "transform 0.3s ease",
              mr:1
            }}
            />}
            onClick={handleAcceptTerms}
          sx={{
            bgcolor: theme.palette.secondary.main,
            color: theme.palette.primary.contrastText,
            px: 4,
            py: 1,
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
