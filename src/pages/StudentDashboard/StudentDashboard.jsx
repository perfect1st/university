import React, { useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import LabelValueRow from "../../components/LabelValueRow"; // adjust path if needed
import RegistrationSteps from "../../components/studentDashboard/RegistrationSteps";
import { useSelector } from "react-redux";
import i18n from "../../i18n/i18n";
import { useLazyQuery } from "@apollo/client/react";
import { GET_REGISTERATION_FORM_BY_USER_ID } from "../../graphql/registerationFormQueries";
import LoadingPage from "../../components/LoadingComponent";


export default function StudentDashboard() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const me=useSelector(state=>state.user.loggedUser);

    const[GetRegisterFormByUserId,{data:{getRegisterFormByUserId}={},loading:GetRegisterFormByUserIdLoading, error:GetRegisterFormByUserIdError}]=useLazyQuery(GET_REGISTERATION_FORM_BY_USER_ID , { fetchPolicy: "network-only" });

    useEffect(()=>{
      if(me?.id){
        console.log('meeeee');
        GetRegisterFormByUserId({variables:{user_id:me?.id}});
      }
    },[me]);

  const subjects = [
    { title: "Mathematics", fullMark: 100, successDegree: 50 },
    { title: "Physics", fullMark: 100, successDegree: 50 },
    { title: "Programming", fullMark: 100, successDegree: 60 },
  ];

  if(me==null||GetRegisterFormByUserIdLoading) return <LoadingPage />
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left Side - Main Info (9 Columns) */}
        <Grid item xs={12} md={9}>
          {/* Major Information */}
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.info.main,
              fontWeight: 700,
              mb: 1,
            }}
          >
            {t("studentDashboard.majorInformation")}
          </Typography>

          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.faculty")}
                  value="Engineering"
                />
              </Grid>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.facultyDepartment")}
                  value="Computer Engineering"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Year Information */}
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.info.main,
              fontWeight: 700,
              mb: 1,
            }}
          >
            {t("studentDashboard.yearInformation")}
          </Typography>

          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.yearOfEducation")}
                  value="3rd Year"
                />
              </Grid>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.studyYear")}
                  value="2025"
                />
              </Grid>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.semester")}
                  value="First"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Subjects */}
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.info.main,
              fontWeight: 700,
              mb: 1,
            }}
          >
            {t("studentDashboard.subjects")}
          </Typography>

          <Paper sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead
                sx={{
                  backgroundColor:
                    theme.palette.primary?.tabelHeader || "#e0e0e0",
                }}
              >
                <TableRow>
                  <TableCell sx={{ fontWeight: 700  , textAlign:"start"}}>
                    {t("studentDashboard.subjectTitle")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 , textAlign:"start"}}>
                    {t("studentDashboard.fullmarkDegree")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 , textAlign:"start"}}>
                    {t("studentDashboard.successDegree")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  backgroundColor:
                    theme.palette.background?.secDefault || "#fafafa",
                }}
              >
                {subjects.map((subj, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{textAlign:"start"}}>{subj.title}</TableCell>
                    <TableCell sx={{textAlign:"start"}}>{subj.fullMark}</TableCell>
                    <TableCell sx={{textAlign:"start"}}>{subj.successDegree}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Right Side - Registration Steps (3 Columns) */}
        <Grid item xs={12} md={3}>
          <RegistrationSteps />
        </Grid>
      </Grid>
    </Box>
  );
}
