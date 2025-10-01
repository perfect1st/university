import React from "react";
import { Box, Typography, Link, IconButton, Stack } from "@mui/material";
import { Twitter, Facebook, Instagram, LinkedIn } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.secDefault,
        py: 4,
        px: 2
      }}
    >
      {/* Top Links */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 2, textAlign: "center" }}
      >
        <Link href="#contact" underline="hover" sx={{ color: theme.palette.background.secDefault }}>
          {t("footer.contact")}
        </Link>
        <Link href="#privacy" underline="hover" sx={{ color: theme.palette.background.secDefault }}>
          {t("footer.privacy")}
        </Link>
        <Link href="#terms" underline="hover" sx={{ color: theme.palette.background.secDefault }}>
          {t("footer.terms")}
        </Link>
        <Link href="#accessibility" underline="hover" sx={{ color: theme.palette.background.secDefault }}>
          {t("footer.accessibility")}
        </Link>
      </Stack>

      {/* Social Icons */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap"
        sx={{ mb: 2 }}
      >
        <IconButton
          component="a"
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: theme.palette.background.secDefault }}
        >
          <Twitter />
        </IconButton>
        <IconButton
          component="a"
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: theme.palette.background.secDefault }}
        >
          <Facebook />
        </IconButton>
        <IconButton
          component="a"
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: theme.palette.background.secDefault }}
        >
          <Instagram />
        </IconButton>
        <IconButton
          component="a"
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: theme.palette.background.secDefault }}
        >
          <LinkedIn />
        </IconButton>
      </Stack>

      {/* Bottom Text */}
      <Typography
        variant="body2"
        align="center"
        sx={{ color: theme.palette.background.secDefault }}
      >
        {t("footer.rights")}
      </Typography>
    </Box>
  );
}
