import React from "react";
import {
  Box,
  Typography,
  useTheme,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import LabelValueRow from "../../components/LabelValueRow";
import RegistrationSteps from "../../components/studentDashboard/RegistrationSteps";

export default function ProfilePage() {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleOpenFile = (url) => window.open(url, "_blank");
  const handleDownloadFile = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    link.click();
  };

  const highSchoolFile =
    "https://via.placeholder.com/400x300.png?text=High+School+Certificate";

  return (
    <Box sx={{ p: 3 , backgroundColor:"background.paper"}}>
      <Grid container spacing={3}>
        {/* Left Side - Profile Info */}
        <Grid item xs={12} md={9}>
          {/* PERSONAL INFORMATION */}
          <Typography variant="h6" sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1 }}>
            {t("profile.personalInformation")}
          </Typography>
          {/* <Paper sx={{ p: 2, mb: 3 }}> */}
          <Grid container>
            <Grid item xs={12}><LabelValueRow label={t("profile.Name")} value="Mokhtar Mahmoud" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.NameInArabic")} value="مختار محمود" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.Gender")} value="Male" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.Nationality")} value="Egyptian" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.DateOfBirth")} value="25/06/2000" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.HomePhone")} value="02 3356409" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.Email")} value="mokhtar@email.com" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.PhoneNumber")} value="+20 1008974112" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.IDNo")} value="30006251702112" /></Grid>
          </Grid>

          {/* </Paper> */}

          {/* ACADEMIC INFORMATION */}
          <Typography variant="h6" sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1 }}>
            {t("profile.academicInformation")}
          </Typography>
          {/* <Paper sx={{ p: 2, mb: 3 }}> */}
          <Grid container>
            <Grid item xs={12}><LabelValueRow label={t("profile.YearOfEducation")} value="3rd Year" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.Country")} value="Egypt" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.City")} value="Cairo" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.StudentNoInHighSchool")} value="20254002" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.GeneralAppreciation")} value="Very Good" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.GPA")} value="3.8" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.HighSchoolCertificate")} filevalue={t("profile.ViewCertificate")} onOpen={() => handleOpenFile(highSchoolFile)} onDownload={() => handleDownloadFile(highSchoolFile)} /></Grid>
          </Grid>

          {/* </Paper> */}

          {/* MAJOR INFORMATION */}
          <Typography variant="h6" sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1 }}>
            {t("profile.majorInformation")}
          </Typography>
          {/* <Paper sx={{ p: 2 }}> */}
          <Grid container>
            <Grid item xs={12}><LabelValueRow label={t("profile.Faculty")} value="Engineering" /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.FacultyDepartment")} value="Computer Engineering" /></Grid>
        </Grid>

          {/* </Paper> */}
        </Grid>

        {/* Right Side - Registration Steps */}
        <Grid item xs={12} md={3}>
          <RegistrationSteps paid={false} semester="first" />
        </Grid>
      </Grid>
    </Box>
  );
}
