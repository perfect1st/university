import React, { useEffect, useState } from "react";
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
  Checkbox,
  Button,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import LabelValueRow from "../../components/LabelValueRow"; // adjust path if needed
import RegistrationSteps from "../../components/studentDashboard/RegistrationSteps";
import { useSelector } from "react-redux";
import i18n from "../../i18n/i18n";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { GET_REGISTERATION_FORM_BY_USER_ID } from "../../graphql/registerationFormQueries";
import LoadingPage from "../../components/LoadingComponent";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { CREATE_USER_STUDY_MATERIAL , GET_USER_STUDY_MATERIALS_BY_USER_ID } from "../../graphql/usersQueries";
import notify from "../../components/notify";


export default function StudentDashboard() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const handleChange = (e) => {
    let isChecked=e.target.checked;
    if(isChecked){
        setSelectedSubjects((prev) => [...prev, e.target.value]);
    }
    else{
        setSelectedSubjects((prev) => prev.filter((item) => item !== e.target.value));
    }

    //e.target.checked = true;
   // console.log("subj",e.target.value,e.target.checked);
    // setChecked(event.target.checked);
  };

  console.log('selectedSubjects',selectedSubjects);

  const me = useSelector((state) => state.user.loggedUser);

  const[CreateUserStudyMaterial,{
    data:{createUserStudyMaterial}={},
    loading:creatingUserSubjects,
    error:creatingMaterialError
  }]=useMutation(CREATE_USER_STUDY_MATERIAL,{fetchPolicy:"network-only"});

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

  // المواد الل المشرف وافق عليها
  const[GetUserStudyMaterialsByUser,{
    data:{ getUserStudyMaterialsByUser}={},
    loading:getUserStudyMaterialsLoading,
    error: getUserStudyMaterialError
  }]=useLazyQuery(GET_USER_STUDY_MATERIALS_BY_USER_ID,{
    fetchPolicy:"network-only"
  })


  useEffect(() => {
      if (me?.id) {
      console.log("meeeee",me?.id);
      
        GetRegisterFormByUserId({ variables: { user_id: me?.id } });
        GetUserStudyMaterialsByUser({ variables: { user_id: me?.id } });
    }

  }, [me]);

  const subjects = getRegisterFormByUserId?.academyTerm_id?.materials_array || [];

  const handleSubmitMaterials=async()=>{
    try {
      // الاول اعمل check علي عدد الساعات
      let selectedMaterialsArr=selectedSubjects?.map(el=>subjects?.find(ele=>ele?.id==el));
      console.log('selectedMaterialsArr',selectedMaterialsArr);

      let totalMaterialHours=0;
      let academyMinHours=getRegisterFormByUserId?.academyTerm_id?.min_study_hours;
      let academyMaxHours=getRegisterFormByUserId?.academyTerm_id?.max_study_hours;

      selectedMaterialsArr?.map(el=>totalMaterialHours+=el?.material_hours);

      console.log('totalMaterialHours',totalMaterialHours);

      if(totalMaterialHours>=academyMinHours && totalMaterialHours<=academyMaxHours){
         

          let data={
              user_id: me?.id,
              academyTerm_id:getRegisterFormByUserId?.academyTerm_id?.id,
              material_id:selectedSubjects
          }
     const result=await CreateUserStudyMaterial({
      variables:{
        input: data
      }
     });

     console.log("result",result);
     notify(t("success"),"success");

     window.location.reload();
     
      }
      else{
        notify(t("studentDashboard.hoursError"),"error");
      }

    } catch (error) {
      console.log('error',error);
      notify(t("error"),"error");
    }
  }

  console.log('subjects',subjects);

  console.log("getRegisterFormByUserId", getRegisterFormByUserId);


  // لو مفيش مواد مسجل فيها
  const isPending = getUserStudyMaterialsByUser ? true : false;

  // في مواد و ب انتظار موافقة المشرف
  const isDisabled= getUserStudyMaterialsByUser?.length>0 && (getUserStudyMaterialsByUser[0]?.status=="pending" ? true : false)

  console.log("isPending", isPending);
  console.log("isDisabled",isDisabled);

  console.log("getUserStudyMaterialsByUser",getUserStudyMaterialsByUser?.length>0 &&getUserStudyMaterialsByUser[0]?.material_id);


  let prevSelectedMaterialsByStudent=getUserStudyMaterialsByUser?.length>0 &&getUserStudyMaterialsByUser[0]?.material_id;
  if (me == null || GetRegisterFormByUserIdLoading || getUserStudyMaterialsLoading) return <LoadingPage />;

  console.log('prevSelectedMaterialsByStudent?.find(el=>el.id==subj?.id)',prevSelectedMaterialsByStudent&& prevSelectedMaterialsByStudent?.find(el=>el?.id=="690b32d1ae33204319ed82ad"));
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
                  value={
                    isArabic
                      ? getRegisterFormByUserId?.faculty_id?.title_ar
                      : getRegisterFormByUserId?.faculty_id?.title_en
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.facultyDepartment")}
                  value={
                    isArabic
                      ? getRegisterFormByUserId?.faculty_department_id?.title_ar
                      : getRegisterFormByUserId?.faculty_department_id?.title_en
                  }
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
                  value={getRegisterFormByUserId?.academyTerm_id?.study_year}
                />
              </Grid>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.studyYear")}
                  value={getRegisterFormByUserId?.academyTerm_id?.current_year}
                />
              </Grid>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.semester")}
                  value={
                    isArabic
                      ? getRegisterFormByUserId?.academyTerm_id?.title_ar
                      : getRegisterFormByUserId?.academyTerm_id?.title_en
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.minAcademyHours")}
                  value={
                     getRegisterFormByUserId?.academyTerm_id?.min_study_hours
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.maxAcademyHours")}
                  value={
                     getRegisterFormByUserId?.academyTerm_id?.max_study_hours
                  }
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
          {isPending ? (
            <>
              <Paper sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead
                    sx={{
                      backgroundColor:
                        theme.palette.primary?.tabelHeader || "#e0e0e0",
                    }}
                  >
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>
                        {t("studentDashboard.subjectTitleAr")}
                      </TableCell>
                       <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>
                        {t("studentDashboard.subjectTitleEn")}
                      </TableCell>
                     
                      <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>
                        {t("studentDashboard.materialHours")}
                      </TableCell>

                      <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>
                        {t("studentDashboard.chooseMaterial")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody
                    sx={{
                      backgroundColor:
                        theme.palette.background?.secDefault || "#fafafa",
                    }}
                  >
                    {subjects?.map((subj, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ textAlign: "start" }}>
                          {  subj?.title_ar  }
                        </TableCell>
                        <TableCell sx={{ textAlign: "start" }}>
                          {  subj?.title_en  }
                        </TableCell>
                       
                        <TableCell sx={{ textAlign: "start" }}>
                          {subj.material_hours}
                        </TableCell>

                        <TableCell sx={{ textAlign: "start" }}>
                          <Checkbox
                          //checked={false}
                             checked={isDisabled ?
                              prevSelectedMaterialsByStudent?.find(el=>el.id==subj?.id) 
                              :
                              selectedSubjects?.find(el=>el==subj?.id)
                            }
                             value={subj?.id}
                             disabled={isDisabled}
                             onChange={(e)=>handleChange(e)}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>

                  {
                    !isDisabled &&<>
                      <Button
                variant="contained"
                sx={{ width: "10%", my: 4 , textAlign:"start", justifyContent:"start",gap:1 }}
                 onClick={() => handleSubmitMaterials()}
              >
              { creatingUserSubjects ? <CircularProgress size={25} sx={{color:"white"}} /> : <> <CheckCircleRoundedIcon /> {t("submit")}</>}   
              </Button>
                    </>
                  }
            
            </>
          ) : (
            <Paper sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead
                  sx={{
                    backgroundColor:
                      theme.palette.primary?.tabelHeader || "#e0e0e0",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>
                      {t("studentDashboard.subjectTitle")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>
                      {t("studentDashboard.fullmarkDegree")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>
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
                  {subjects?.map((subj, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ textAlign: "start" }}>
                        {subj.title}
                      </TableCell>
                      <TableCell sx={{ textAlign: "start" }}>
                        {subj.fullmark_degree}
                      </TableCell>
                      <TableCell sx={{ textAlign: "start" }}>
                        {subj.success_degree}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Grid>

        {/* Right Side - Registration Steps (3 Columns) */}
        <Grid item xs={12} md={3}>
          <RegistrationSteps />
        </Grid>
      </Grid>
    </Box>
  );
}
