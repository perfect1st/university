import React from "react";
import {
  Grid,
  Typography,
  useTheme,
  Box,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";

export default function LabelValueRow({ label, value, file = false, onOpen, onDownload }) {
  const theme = useTheme();

 // console.log('file........',file);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary?.gray || "#f5f5f5",
        borderRadius: 1,
        px: 2,
        py: 1.2,
        my: 1,
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
          {file ? (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography
                variant="body1"
                color="primary"
                sx={{
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={onOpen}
              >
                {value}
              </Typography>
            </Box>
              <IconButton size="small" onClick={onDownload}>
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ fontWeight: 700 }}
            >
              {value}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
