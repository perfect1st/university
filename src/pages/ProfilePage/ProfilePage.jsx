import React, { useEffect } from "react";
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
import { useQuery , useLazyQuery } from "@apollo/client/react";
import { GET_LOGGED_USER_BY_TOKEN } from "../../graphql/usersQueries";
import LoadingPage from "../../components/LoadingComponent";
import { GET_REGISTERATION_FORM_BY_USER_ID } from "../../graphql/registerationFormQueries";
import i18n from "../../i18n/i18n";

export default function ProfilePage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";

  
  // get user token
    const {
      data: {me}={},
      loading: userLoading,
      error: userError,
    } = useQuery(GET_LOGGED_USER_BY_TOKEN, { fetchPolicy: "network-only" });

  const[GetRegisterFormByUserId,{data:{getRegisterFormByUserId}={},loading:GetRegisterFormByUserIdLoading, error:GetRegisterFormByUserIdError}]=useLazyQuery(GET_REGISTERATION_FORM_BY_USER_ID , { fetchPolicy: "network-only" });

  useEffect(()=>{
    if(me?.id){
      console.log('meeeee');
      GetRegisterFormByUserId({variables:{user_id:me?.id}});
    }
  },[me]);

  console.log('getRegisterFormByUserId',getRegisterFormByUserId);
  console.log('userData',me);

  console.log('GetRegisterFormByUserIdLoading',GetRegisterFormByUserIdLoading);

  const handleOpenFile = (url) => window.open(url, "_blank");
  const handleDownloadFile = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    link.click();
  };

  const highSchoolFile =
    getRegisterFormByUserId?.high_school_certificate_file;

    if(userLoading||GetRegisterFormByUserIdLoading) return <LoadingPage />

    console.log('high_school_certificate_file',highSchoolFile);

    let genderTransArr=[
      {
      ar:"ذكر",
      en:"male"
    },
    {
      ar:'أنثى',
      en:"female"
    }
  ]

  let gender=genderTransArr.find(gender=>gender.en===getRegisterFormByUserId?.gender);

 // console.log('genderrrrr',gender)
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
            <Grid item xs={12}><LabelValueRow label={t("profile.Name")} value={me?.fullname} /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.NameInArabic")} value={me?.fullname} /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.Gender")} value={isArabic ? gender?.ar : gender?.en} /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.Nationality")} value={isArabic ? getRegisterFormByUserId?.nationality_id?.name_ar : getRegisterFormByUserId?.nationality_id?.name_en } /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.DateOfBirth")} value={getRegisterFormByUserId?.birthdate} /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.HomePhone")} value={getRegisterFormByUserId?.home_tel} /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.Email")} value={me?.email} /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.PhoneNumber")} value={me?.mobile} /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.IDNo")} value={getRegisterFormByUserId?.national_id} /></Grid>
          </Grid>

          {/* </Paper> */}

          {/* ACADEMIC INFORMATION */}
          <Typography variant="h6" sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1 }}>
            {t("profile.academicInformation")}
          </Typography>
          {/* <Paper sx={{ p: 2, mb: 3 }}> */}
          <Grid container>
            <Grid item xs={12}><LabelValueRow label={t("profile.YearOfEducation")} value={getRegisterFormByUserId?.education_year} /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.Country")} value={isArabic ? getRegisterFormByUserId?.country_id?.name_ar : getRegisterFormByUserId?.country_id?.name_en } /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.City")} value={isArabic ? getRegisterFormByUserId?.city_id?.name_ar : getRegisterFormByUserId?.city_id?.name_en } /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.StudentNoInHighSchool")} value={getRegisterFormByUserId?.high_school_student_number} /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.GeneralAppreciation")} value={getRegisterFormByUserId?.general_grade} /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.GPA")} value={getRegisterFormByUserId?.gpa} /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.HighSchoolCertificate")} file={true} filevalue={t("profile.ViewCertificate")} onOpen={() => handleOpenFile(highSchoolFile)} onDownload={() => handleDownloadFile(highSchoolFile)} /></Grid>
          </Grid>

          {/* </Paper> */}

          {/* MAJOR INFORMATION */}
          <Typography variant="h6" sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1 }}>
            {t("profile.majorInformation")}
          </Typography>
          {/* <Paper sx={{ p: 2 }}> */}
          <Grid container>
            <Grid item xs={12}><LabelValueRow label={t("profile.Faculty")} value={isArabic ? getRegisterFormByUserId?.faculty_id?.title_ar : getRegisterFormByUserId?.faculty_id?.title_en} /></Grid>
            <Grid item xs={12}><LabelValueRow label={t("profile.FacultyDepartment")} value={isArabic ? getRegisterFormByUserId?.faculty_department_id?.title_ar : getRegisterFormByUserId?.faculty_department_id?.title_en} /></Grid>
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
