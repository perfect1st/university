import React from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTranslation } from "react-i18next";

export default function RegistrationSteps({ paid = false, semester = "first" }) {
  const theme = useTheme();
  const { t , i18n} = useTranslation();
  const isArabic = i18n.language == "ar"

  const stepColor = "#166A45";
  const notPaidColor = "#D92E43";

  const status = paid ? "completed" : "pending";

  const statusStyles = {
    completed: {
      bg: "#ECFDF3",
      border: "#ABEFC6",
      color: "#085D3A",
      text: "Completed Steps",
    },
    pending: {
      bg: "#FEF3F2",
      border: "#FECDCA",
      color: "#912018",
      text: "Check your fee Payment",
    },
  };

  const steps = [
    t("registrationSteps.personalInformation"),
    t("registrationSteps.academicInformation"),
    t("registrationSteps.majorInformation"),
    t("registrationSteps.feePayment"),
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        background: theme.palette.background.grey ?? "#F4F4F4",
        borderRadius: 0,
        p: 1,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: paid ? stepColor : notPaidColor,
            ...(isArabic ? { ml: 1.5 } : { mr: 1.5 }),

          }}
        />
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
        >
    {t("registrationSteps.title")}
    </Typography>
      </Box>

      {/* Status Box */}
      <Box
        sx={{
          background: theme.palette.background.paper,
          borderRadius: 0,
          p: 1,
          my:1
        }}
      >
        <Typography
          variant="caption"
          sx={{ mb: 1, fontWeight: "bold", color: theme.palette.text.primary }}
        >
    {t("registrationSteps.registrationStages")}
    </Typography>
<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        <Box
          sx={{
            border: `2px solid ${statusStyles[status].border}`,
            background: statusStyles[status].bg,
            color: statusStyles[status].color,
            borderRadius: 0.7,
            px: 1,
            py: 0.5,
            fontSize: "0.6rem",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {statusStyles[status].text}
        </Box>

        {/* Arrow Down */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 1,
            mb: 2,
          }}
        >
          <KeyboardArrowDownIcon sx={{ color: "#999" }} />
        </Box>
</Box>
</Box>
<Box
        sx={{
          background: theme.palette.background.paper,
          borderRadius: 0,
          p: 2,
          my:1
        }}
      >
        {/* Vertical Timeline */}
        {steps.map((step, index) => {
  const isLast = index === steps.length - 1;

  return (
    <Box key={step} sx={{ position: "relative", pb: isLast ? 0 : 3 }}>
      {/* Vertical line */}
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            top: 18,
            ...(isArabic ? { right: 8 } : { left: 8 }),
            bottom: 0,
            width: 2,
            height: "calc(100% - 18px)",
            backgroundColor: stepColor,
            zIndex: 0,
          }}
        />
      )}

      {/* Circle Icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...(isArabic ? { ml: 1.5 } : { mr: 1.5 }),
          }}
        >
          {isLast && !paid ? (
            <RadioButtonUncheckedIcon sx={{ fontSize: 24, color: stepColor }} />
          ) : (
            <CheckCircleIcon sx={{ fontSize: 24, color: stepColor }} />
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: theme.palette.text.primary , fontSize:"0.75rem"}}
        >
          {step}
        </Typography>
      </Box>

      {/* Payment note */}
      {isLast && !paid && (
        <Typography
          variant="body2"
          sx={{
            ...(isArabic ? { ml: 4 } : { mr: 4 }),
            mt: 0.5,
            color: "#D92E43",
            fontWeight: 500,
            fontSize:"0.65rem"
          }}
        >
          {semester === "first"
            ? t("registrationSteps.payFirstSemester")
            : t("registrationSteps.paySecondSemester")}
        </Typography>
      )}
    </Box>
  );
})}

      </Box>
    </Paper>
  );
}
