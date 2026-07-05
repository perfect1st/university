import React from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import { Twitter, Facebook, Instagram, LinkedIn } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client/react";
import { Link as RouterLink } from "react-router-dom";
import Link from '@mui/material/Link';
import { GET_SITE_CONFIG } from "../graphql/siteConfigQueries";
import { AiFillTikTok } from "react-icons/ai";

export default function Footer() {
  const theme = useTheme();
  const { t } = useTranslation();

  const { data } = useQuery(GET_SITE_CONFIG);
  const config = data?.getSiteConfig || {};
  const social = config.social_media || {};

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.secDefault,
        py: 4,
        px: 2,
        mt: 'auto'
      }}
    >
      {/* Top Links */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        // spacing={4}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 3, textAlign: "center", gap: 4 }}
              >
        <Link component={RouterLink} to="/contact-us" underline="hover" sx={{ color: theme.palette.background.secDefault, fontWeight: 'medium' }}>
          {t("footer.contact")}
        </Link>
        <Link component={RouterLink} to="/privacy-policy" underline="hover" sx={{ color: theme.palette.background.secDefault, fontWeight: 'medium' }}>
          {t("footer.privacy")}
        </Link>
        <Link component={RouterLink} to="/terms-of-service" underline="hover" sx={{ color: theme.palette.background.secDefault, fontWeight: 'medium' }}>
          {t("footer.terms")}
        </Link>
        <Link component={RouterLink} to="/accessibility" underline="hover" sx={{ color: theme.palette.background.secDefault, fontWeight: 'medium' }}>
          {t("footer.accessibility")}
        </Link>
      </Stack>

      {/* Social Icons */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap"
        sx={{ mb: 3 }}
      >
        {social.twitter && (
          <IconButton
            component="a"
            href={social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: theme.palette.background.secDefault, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <Twitter />
          </IconButton>
        )}
        {social.facebook && (
          <IconButton
            component="a"
            href={social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: theme.palette.background.secDefault, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <Facebook />
          </IconButton>
        )}
        {social.tiktok && (
          <IconButton
            component="a"
            href={social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: theme.palette.background.secDefault, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <AiFillTikTok size={24} />
          </IconButton>
        )}
        {/* Placeholder for others if added later */}
      </Stack>

      {/* Bottom Text */}
      <Typography
        variant="body2"
        align="center"
        sx={{ color: theme.palette.background.secDefault, opacity: 0.8 }}
      >
        {t("footer.rights")}
      </Typography>
    </Box>
  );
}
