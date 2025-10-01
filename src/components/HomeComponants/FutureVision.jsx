import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import TitleComponent from "./TitleComponent";
import image from "../../assets/image.png";

export default function FutureVision() {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 4 }}>
      {/* Title */}
      <TitleComponent title={t("Future Vision")} />

      {/* Content */}
      <Grid container spacing={4} alignItems="center">
        {/* Image */}
        <Grid item xs={12} md={6}>
        <Box
    component="img"
    src={image}
    alt="Future Vision"
    sx={{
      width: "100%",
      height: { xs: 200, md: 300 }, 
      objectFit: "cover",          
      borderRadius: 0,
    }}
  />
        </Grid>

        {/* Text + Button */}
        <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: { xs: 200, md: 300 }, 
 }}>
          <Typography variant="h5" gutterBottom>
            {t("Building the Future of Education")}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {t(
              "Our ambitious expansion plans include state-of-the-art facilities, research labs, and collaborative spaces to enhance the learning experience."
            )}
          </Typography>

          {/* Button aligned to end */}
          <Box sx={{ mt: "auto", textAlign: "end" }}>
            <Button variant="contained" color="secondary">
              {t("Read More")}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
