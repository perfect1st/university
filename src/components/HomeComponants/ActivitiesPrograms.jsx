import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import TitleComponent from "./TitleComponent";
import image from "../../assets/news.jpg";

const data = {
  upcoming: [
    {
      id: 1,
      img: image,
      title: "Event 1",
      description:
        "This is a short description for the upcoming event. It will be limited to two lines only.",
    },
    {
      id: 2,
      img: image,
      title: "Event 2",
      description:
        "Another example of an upcoming event. The text will end with dots if it's too long.",
    },
    {
      id: 3,
      img: image,
      title: "Event 3",
      description:
        "Upcoming event description should be truncated after two lines using CSS line clamp.",
    },
  ],
  future: [
    {
      id: 1,
      img: image,
      title: "Program 1",
      description:
        "This is a future academic program. More details can be added but limited to 2 lines.",
    },
    {
      id: 2,
      img: image,
      title: "Program 2",
      description:
        "Another academic program in the future. Description truncated with ellipsis.",
    },
    {
      id: 3,
      img: image,
      title: "Program 3",
      description:
        "Future program description should only show two lines. Extra text will be hidden.",
    },
  ],
};

export default function ActivitiesPrograms() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const currentData = tab === 0 ? data.upcoming : data.future;

  return (
    <Paper sx={{ p: 4, backgroundColor: "background.paper",  borderRadius: 0 }} elevation={3}>
      {/* Title */}
      <TitleComponent title={t("Activities & Programs")} />

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={handleChange}
        textColor="inherit"
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": {
            backgroundColor: "orange", // orange underline
            height: "3px",
          },
        }}
      >
        <Tab label={t("Upcoming Events")} />
        <Tab label={t("Future Academic Programs")} />
      </Tabs>

      {/* Cards */}
      <Grid container spacing={3}>
        {currentData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: "100%", borderRadius: 0, boxShadow: "none" }}>
              <CardMedia
                component="img"
                height="200"
                image={item.img}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
