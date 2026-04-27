import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Grid,
  Paper,
  IconButton,
  TextField,
  Button
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import LabelValueRow from "../../components/LabelValueRow";
import RegistrationSteps from "../../components/studentDashboard/RegistrationSteps";
import UniversityCard from "../../components/UniversityCard";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client/react";
import { GET_LOGGED_USER_BY_TOKEN } from "../../graphql/usersQueries";
import notify from "../../components/notify";
import { UPDATE_USER_BY_ADMIN } from "../../graphql/userQueriesForAdmin";
import LoadingPage from "../../components/LoadingComponent";
import { GET_REGISTERATION_FORM_BY_USER_ID } from "../../graphql/registerationFormQueries";
import i18n from "../../i18n/i18n";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseURL } from "../../Api/apolloClient";
import UploadFileField from "../../components/Utilities/UploadFileField";
import logger from "../../utils/logger";

export default function ProfilePage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const me = useSelector((state) => state.user.loggedUser);

  const [password, setPassword] = useState("");
  const [UpdateUser, { loading: updating }] = useMutation(UPDATE_USER_BY_ADMIN);

  const fileInputRef = React.useRef(null);
  const [selectedToShowFile, setSelectedToShowFile] = useState(me?.profile_image || null);
  const [progress, setProgress] = useState(0);
  const [profileImage, setProfileImage] = useState(me?.profile_image || "");

  const handleUpdatePassword = async () => {
    if (!password || password.trim() === "") return;
    try {
      const input = {
        username: me?.username,
        fullname: me?.fullname,
        email: me?.email,
        mobile: me?.mobile,
        role: me?.role,
        groups: me?.groups?.map(g => g.id) || [],
        profile_image: profileImage,
      };
      
      if (password && password.trim() !== "") {
        input.password = password;
      }
      
      await UpdateUser({
        variables: {
          id: me?.id,
          input: input
        }
      });
      notify(t("updatedSuccessfully", "Updated successfully"), "success");
      setPassword("");
    } catch (error) {
      notify(error.message || t("error"), "error");
    }
  };

  const [
    GetRegisterFormByUserId,
    {
      data: { getRegisterFormByUserId } = {},
      loading: GetRegisterFormByUserIdLoading,
      error: GetRegisterFormByUserIdError,
    },
  ] = useLazyQuery(GET_REGISTERATION_FORM_BY_USER_ID, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (me?.id) {
      logger.log("meeeee");
      GetRegisterFormByUserId({ variables: { user_id: me?.id } });
    }
  }, [me]);

  logger.log("getRegisterFormByUserId", getRegisterFormByUserId);
  logger.log("userData", me);

  logger.log("GetRegisterFormByUserIdLoading", GetRegisterFormByUserIdLoading);

  const handleOpenFile = (url) => window.open(url, "_blank");
  const handleDownloadFile = (url) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = url.split("/").pop();
      link.click();
    } catch (error) {
      logger.error("error", error.message);
    }
  };

  if (getRegisterFormByUserId?.id) {
    localStorage.setItem(
      "registerForm",
      JSON.stringify(getRegisterFormByUserId),
    );
  }
  const highSchoolFile = getRegisterFormByUserId?.high_school_certificate_file;

  logger.log("high_school_certificate_file", highSchoolFile);

  let genderTransArr = [
    {
      ar: "ذكر",
      en: "male",
    },
    {
      ar: "أنثى",
      en: "female",
    },
  ];

  let gender = genderTransArr.find(
    (gender) => gender.en === getRegisterFormByUserId?.gender,
  );

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedToShowFile(file.name);
    const formData = new FormData();
    formData.append("file", file);

    try {
      setProgress(1);
      const res = await axios.post(`${baseURL}/api/forms/single`, formData, {
        onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total)),
      });
      setProfileImage(res?.data?.url);
      notify(t("fileUploaded"), "success");

      // Automatic update after upload
      await UpdateUser({
        variables: {
          id: me?.id,
          input: {
            username: me?.username,
            fullname: me?.fullname,
            email: me?.email,
            mobile: me?.mobile,
            role: me?.role,
            groups: me?.groups?.map((g) => g.id) || [],
            profile_image: res?.data?.url,
          },
        },
        refetchQueries: [{ query: GET_LOGGED_USER_BY_TOKEN }],
      });
    } catch (error) {
      notify(t("errorUplaod"), "error");
    } finally {
      setTimeout(() => setProgress(0), 2000);
    }
  };

  if (me == null || GetRegisterFormByUserIdLoading) return <LoadingPage />;
  // logger.log('genderrrrr',gender)
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Grid container spacing={3}>
        {/* Left Side - Profile Info */}
        <Grid item xs={12} md={9}>
          {/* PERSONAL INFORMATION */}
          <Typography
            variant="h6"
            sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1 }}
          >
            {t("profile.personalInformation")}
          </Typography>
          {/* <Paper sx={{ p: 2, mb: 3 }}> */}
          <Grid container>
            <Grid item xs={12}>
              <LabelValueRow label={t("profile.Name")} value={me?.fullname} />
            </Grid>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.NameInArabic")}
                value={me?.fullname}
              />
            </Grid>
          {me.role !== "admin" &&
          <>
          <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.Gender")}
                value={isArabic ? gender?.ar : gender?.en}
              />
            </Grid>
               <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.Nationality")}
                value={
                  isArabic
                    ? getRegisterFormByUserId?.nationality_id?.name_ar
                    : getRegisterFormByUserId?.nationality_id?.name_en
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.DateOfBirth")}
                value={getRegisterFormByUserId?.birthdate}
              />
            </Grid>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.HomePhone")}
                value={getRegisterFormByUserId?.home_tel}
              />
            </Grid>
          </>
            }
         
            <Grid item xs={12}>
              <LabelValueRow label={t("profile.Email")} value={me?.email} />
            </Grid>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.PhoneNumber")}
                value={me?.mobile}
              />
            </Grid>
            {me?.role !== "admin" && (
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("profile.IDNo")}
                  value={getRegisterFormByUserId?.national_id}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ my: 1 }}>
                <UploadFileField
                  title={t("profile.profile_image", "Profile Image")}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  handlePickFile={() => fileInputRef.current.click()}
                  selectedToShowFile={selectedToShowFile}
                  progress={progress}
                  showInput={true}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ 
                backgroundColor: theme.palette.primary?.gray || "#f5f5f5",
                borderRadius: 1,
                px: 2,
                py: 1.2,
                my: 1,
                display: "flex", 
                alignItems: "center", 
                flexWrap: "wrap",
                gap: 2 
              }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, flexBasis: "23%", flexGrow: 0, flexShrink: 0 }}>
                  {t("form.password", "Update Info")}
                </Typography>
                <TextField
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="small"
                  sx={{ width: { xs: '100%', sm: 250 } }}
                  placeholder="********"
                />
                <Button 
                  variant="outlined" 
                  onClick={handleUpdatePassword} 
                  disabled={updating}
                  sx={{ ml: 'auto' }}
                >
                  {t("form.save", "Update Profile")}
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* </Paper> */}
{me?.role == "student" &&
<>
          {/* ACADEMIC INFORMATION */}
          <Typography
            variant="h6"
            sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1 }}
          >
            {t("profile.academicInformation")}
          </Typography>
          {/* <Paper sx={{ p: 2, mb: 3 }}> */}
          <Grid container>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.YearOfEducation")}
                value={getRegisterFormByUserId?.education_year}
              />
            </Grid>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.Country")}
                value={
                  isArabic
                    ? getRegisterFormByUserId?.country_id?.name_ar
                    : getRegisterFormByUserId?.country_id?.name_en
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.City")}
                value={
                  isArabic
                    ? getRegisterFormByUserId?.city_id?.name_ar
                    : getRegisterFormByUserId?.city_id?.name_en
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.StudentNoInHighSchool")}
                value={getRegisterFormByUserId?.high_school_student_number}
              />
            </Grid>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.GeneralAppreciation")}
                value={getRegisterFormByUserId?.general_grade}
              />
            </Grid>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.GPA")}
                value={getRegisterFormByUserId?.gpa}
              />
            </Grid>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.HighSchoolCertificate")}
                file={true}
                filevalue={t("profile.ViewCertificate")}
                onOpen={() => handleOpenFile(highSchoolFile)}
                onDownload={() => handleDownloadFile(highSchoolFile)}
              />
            </Grid>
          </Grid>

          {/* </Paper> */}

          {/* MAJOR INFORMATION */}
          <Typography
            variant="h6"
            sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1 }}
          >
            {t("profile.majorInformation")}
          </Typography>
          {/* <Paper sx={{ p: 2 }}> */}
          <Grid container>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.Faculty")}
                value={
                  isArabic
                    ? getRegisterFormByUserId?.faculty_id?.title_ar
                    : getRegisterFormByUserId?.faculty_id?.title_en
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LabelValueRow
                label={t("profile.FacultyDepartment")}
                value={
                  isArabic
                    ? getRegisterFormByUserId?.faculty_department_id?.title_ar
                    : getRegisterFormByUserId?.faculty_department_id?.title_en
                }
              />
            </Grid>
          </Grid>
            {me?.role === "student" && (
        <Box sx={{ mt: 4 }}>
          <UniversityCard studentData={me} registrationData={getRegisterFormByUserId} />
        </Box>
      )}
</>}

          {/* </Paper> */}
        </Grid>

        {/* Right Side - Registration Steps */}
        {me?.role == "student" && <Grid item xs={12} md={3}>
          <RegistrationSteps paid={false} semester="first" />
        </Grid>}
      </Grid>
      
      
    </Box>
  );
}
