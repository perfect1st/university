import React from "react";
import { Box, Typography, Link, IconButton, Stack } from "@mui/material";
import { Twitter, Facebook, Instagram, LinkedIn } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.secDefault, // النص الافتراضي
        py: 4,
      }}
    >
      {/* Top Links */}
      <Stack
        direction="row"
        spacing={4}
        justifyContent="center"
        sx={{ mb: 2 }}
      >
        <Link href="#contact" color={theme.palette.background.secDefault} underline="hover">
          Contact Us
        </Link>
        <Link href="#privacy" color={theme.palette.background.secDefault} underline="hover">
          Privacy Policy
        </Link>
        <Link href="#terms" color={theme.palette.background.secDefault} underline="hover">
          Terms of Service
        </Link>
        <Link href="#accessibility" color={theme.palette.background.secDefault} underline="hover">
          Accessibility
        </Link>
      </Stack>

      {/* Social Icons */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
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
      <Typography variant="body2" align="center" sx={{ color: theme.palette.background.secDefault }}>
        ©2024 VUAS. All rights reserved.
      </Typography>
    </Box>
  );
}
