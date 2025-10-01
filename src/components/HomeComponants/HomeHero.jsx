import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { ReactComponent as VisionIcon } from "../../assets/vision.svg";
import { ReactComponent as MissionIcon } from "../../assets/mission.svg";
import { ReactComponent as GoalsIcon } from "../../assets/goal.svg";
import { useTranslation } from "react-i18next";

export default function HomeHero() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const heroHeight = isSm ? 480 : 854;
  const { t } = useTranslation();

  const cards = [
    {
      key: "vision",
      Icon: VisionIcon,
      title: t("vision_title"),
      desc: t("vision_desc"),
    },
    {
      key: "mission",
      Icon: MissionIcon,
      title: t("mission_title"),
      desc: t("mission_desc"),
    },
    {
      key: "goals",
      Icon: GoalsIcon,
      title: t("goals_title"),
      desc: t("goals_desc"),
    },
  ];
  

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: heroHeight,
          width: "100%",
          backgroundImage: `url(${require("../../assets/home.jpg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            pb: { xs: 8, md: 12 },
            backgroundColor: `${theme.palette.primary.main}F0`, // أزرق بشفافية وسطية

          }}
        >
          {/* العنوان + الترحيب */}
          <Box
            sx={{
              width: "100%",
              py: { xs: 2, md: 3 },
              px: { xs: 2, md: 6 },
            }}
          >
            <Typography
              variant={isSm ? "h5" : "h3"}
              sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}
            >
  {t("university_title")}
  </Typography>
            <Typography
              variant={isSm ? "body1" : "h6"}
              sx={{ mt: 1, color: theme.palette.primary.contrastText }}
            >
  {t("welcome_message")}
  </Typography>
          </Box>

          {/* النص الجديد على خلفية غامقة */}
          <Box
            sx={{
              width: "100%",
              py: { xs: 3, md: 4 },
              px: { xs: 2, md: 6 },
              mt: 0.5,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.primary.contrastText,
                lineHeight: 1.7,
              }}
            >
             {t("university_description")}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Cards Section */}
      <Box sx={{ position: "relative", mt: { xs: -6, md: -10 }, px: { xs: 2, md: 6 } }}>
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, md: 3 },
            justifyContent: "center",
            alignItems: "stretch",
            flexWrap: "wrap",
          }}
        >
          {cards.map((c) => {
            const Icon = c.Icon;
            return (
              <Box
                key={c.key}
                sx={{
                  width: { xs: "100%", sm: 300, md: 320 },
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 3,
                  px: 3,
                  py: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Icon sx={{ fontSize: 40, mb: 1, color: theme.palette.secondary.main }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}>
                  {t(c.title)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1.5, color: theme.palette.primary.main }}>
                  {t(c.desc)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 6 }, pt: 8 }} />
    </Box>
  );
}
