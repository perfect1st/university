import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export default function TitleComponent({ title }) {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }} display="flex" alignItems="center" gap={2}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          width: "70px",
          height: "4px",
          bgcolor: theme.palette.secondary.main,
          mt: 1,
          borderRadius: "2px",
        }}
      />
    </Box>
  );
}
