import React from "react";
import { Grid, Typography, useTheme, Box } from "@mui/material";

export default function LabelValueRow({ label, value }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary?.gray || "#f5f5f5",
        borderRadius: 1,
        px: 2,
        py: 1.2,
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        {/* Label */}
        <Grid item xs={3}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {label}
          </Typography>
        </Grid>

        {/* Value */}
        <Grid item xs={9}>
          <Typography
            variant="body1"
            color="text.primary"
            sx={{ fontWeight: 700 }}
          >
            {value}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
