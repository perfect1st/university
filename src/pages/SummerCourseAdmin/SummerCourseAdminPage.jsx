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
import { useParams, useNavigate } from "react-router-dom";
import LabelValueRow from "../../components/LabelValueRow";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import {
  GET_USER_STUDY_MATERIALS_BY_USER_ID,
  CREATE_USER_STUDY_MATERIAL,
  UPDATE_USER_STUDY_MATERIAL,
} from "../../graphql/usersQueries";
import { GET_REGISTERATION_FORM_BY_USER_ID } from "../../graphql/registerationFormQueries";
import { GET_SUPPORT_TICKET_BY_ID } from "../../graphql/supportTicketQueries";
import LoadingPage from "../../components/LoadingComponent";
import Header from "../../components/PageHeader/header";
import i18n from "../../i18n/i18n";
import notify from "../../components/notify";
import logger from "../../utils/logger";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EditIcon from "@mui/icons-material/Edit";

export default function SummerCourseAdminPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { ticketId, studentId } = useParams();
  const navigate = useNavigate();

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const { data: ticketData, loading: ticketLoading } = useQuery(
    GET_SUPPORT_TICKET_BY_ID,
    {
      variables: { id: ticketId },
      fetchPolicy: "network-only",
      skip: !ticketId,
    }
  );

  const ticket = ticketData?.getSupportTicketById;
  const resolvedStudentId = studentId || ticket?.user_id?.id;

  const [GetRegisterFormByUserId, { data: regData, loading: regLoading }] =
    useLazyQuery(GET_REGISTERATION_FORM_BY_USER_ID, {
      fetchPolicy: "network-only",
    });

  const [
    GetUserStudyMaterialsByUser,
    { data: materialsData, loading: materialsLoading },
  ] = useLazyQuery(GET_USER_STUDY_MATERIALS_BY_USER_ID, {
    fetchPolicy: "network-only",
  });

  const [CreateUserStudyMaterial, { loading: creating }] = useMutation(
    CREATE_USER_STUDY_MATERIAL,
    { fetchPolicy: "network-only" }
  );

  const [UpdateUserStudyMaterial, { loading: updating }] = useMutation(
    UPDATE_USER_STUDY_MATERIAL,
    { fetchPolicy: "network-only" }
  );

  useEffect(() => {
    if (resolvedStudentId) {
      GetRegisterFormByUserId({ variables: { user_id: resolvedStudentId } });
    }
  }, [resolvedStudentId]);
  const registrationData = regData?.getRegisterFormByUserId;

  useEffect(() => {
    if (resolvedStudentId && registrationData?.academyTerm_id?.id) {
      GetUserStudyMaterialsByUser({
        variables: {
          user_id: resolvedStudentId,
          academyTerm_id: registrationData?.academyTerm_id?.id,
        },
      });
    }
  }, [resolvedStudentId, registrationData?.academyTerm_id?.id]);

  const userStudyMaterials = materialsData?.getUserStudyMaterialsByUser;

  const subjects =
    registrationData?.academyTerm_id?.materials_array || [];

  const hasExistingMaterials =
    userStudyMaterials && userStudyMaterials.length > 0;
  const lastMaterialRecord =
    hasExistingMaterials
      ? userStudyMaterials[userStudyMaterials.length - 1]
      : null;

  const prevSelectedMaterials = lastMaterialRecord?.material_id || [];

  const handleChange = (e) => {
    let isChecked = e.target.checked;
    if (isChecked) {
      setSelectedSubjects((prev) => [...prev, e.target.value]);
    } else {
      setSelectedSubjects((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    }
  };

  const handleSubmitMaterials = async () => {
    try {
      let selectedMaterialsArr = selectedSubjects?.map((el) =>
        subjects?.find((ele) => ele?.id == el)
      );
      let totalMaterialHours = 0;
      let academyMinHours =
        registrationData?.academyTerm_id?.min_study_hours;
      let academyMaxHours =
        registrationData?.academyTerm_id?.max_study_hours;

      selectedMaterialsArr?.map(
        (el) => (totalMaterialHours += el?.material_hours)
      );

      if (
        totalMaterialHours >= academyMinHours &&
        totalMaterialHours <= academyMaxHours
      ) {
        if (hasExistingMaterials) {
          await UpdateUserStudyMaterial({
            variables: {
              id: lastMaterialRecord?.id,
              input: {
                user_id: resolvedStudentId,
                academyTerm_id: registrationData?.academyTerm_id?.id,
                material_id: selectedSubjects,
              },
            },
          });
        } else {
          await CreateUserStudyMaterial({
            variables: {
              input: {
                user_id: resolvedStudentId,
                academyTerm_id: registrationData?.academyTerm_id?.id,
                material_id: selectedSubjects,
              },
            },
          });
        }

        notify(t("success"), "success");
        GetUserStudyMaterialsByUser({
          variables: {
            user_id: resolvedStudentId,
            academyTerm_id: registrationData?.academyTerm_id?.id,
          },
        });
        setIsEditing(false);
      } else {
        notify(t("studentDashboard.hoursError"), "error");
      }
    } catch (error) {
      logger.log("error", error);
      notify(t("error"), "error");
    }
  };

  if (ticketLoading || regLoading || materialsLoading)
    return <LoadingPage />;

  if (!resolvedStudentId || !registrationData)
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          {isArabic ? "لم يتم العثور على بيانات الطالب" : "Student data not found"}
        </Typography>
      </Box>
    );

  const studentName = ticket?.user_id?.fullname || registrationData?.user_id?.fullname;

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", minHeight: "100vh" }}>
      <Header
        title={t("Dashboard.support")}
        subtitle={t("summerCourseAdmin.title") + " - " + studentName}
        i18n={i18n}
        hasNavigate={true}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
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
                      ? registrationData?.faculty_id?.title_ar
                      : registrationData?.faculty_id?.title_en
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.facultyDepartment")}
                  value={
                    isArabic
                      ? registrationData?.faculty_department_id?.title_ar
                      : registrationData?.faculty_department_id?.title_en
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <LabelValueRow
                  label={isArabic ? "اسم الطالب" : "Student Name"}
                  value={studentName}
                />
              </Grid>
            </Grid>
          </Paper>

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
                  value={registrationData?.academyTerm_id?.study_year}
                />
              </Grid>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.studyYear")}
                  value={registrationData?.academyTerm_id?.current_year}
                />
              </Grid>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.semester")}
                  value={
                    isArabic
                      ? registrationData?.academyTerm_id?.title_ar
                      : registrationData?.academyTerm_id?.title_en
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.minAcademyHours")}
                  value={registrationData?.academyTerm_id?.min_study_hours}
                />
              </Grid>
              <Grid item xs={12}>
                <LabelValueRow
                  label={t("studentDashboard.maxAcademyHours")}
                  value={registrationData?.academyTerm_id?.max_study_hours}
                />
              </Grid>
            </Grid>
          </Paper>

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
                      {subj?.title_ar}
                    </TableCell>
                    <TableCell sx={{ textAlign: "start" }}>
                      {subj?.title_en}
                    </TableCell>
                    <TableCell sx={{ textAlign: "start" }}>
                      {subj.material_hours}
                    </TableCell>
                    <TableCell sx={{ textAlign: "start" }}>
                      <Checkbox
                        checked={
                          isEditing
                            ? selectedSubjects?.find(
                              (el) => el == subj?.id
                            )
                            : prevSelectedMaterials?.find(
                              (el) => el.id == subj?.id
                            )
                        }
                        value={subj?.id}
                        disabled={!isEditing}
                        onChange={(e) => handleChange(e)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {hasExistingMaterials && (
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                sx={{ gap: 1 }}
                startIcon={<EditIcon />}
                onClick={() => {
                  if (!isEditing) {
                    setSelectedSubjects(
                      prevSelectedMaterials?.map((el) => el?.id) || []
                    );
                  }
                  setIsEditing(!isEditing);
                }}
              >
                {isEditing
                  ? isArabic
                    ? "إلغاء التعديل"
                    : "Cancel Edit"
                  : isArabic
                    ? "تعديل المواد"
                    : "Edit Materials"}
              </Button>
            </Box>
          )}

          {!hasExistingMaterials || isEditing ? (
            <Button
              variant="contained"
              sx={{
                my: 4,
                textAlign: "start",
                justifyContent: "start",
                gap: 1,
              }}
              onClick={() => handleSubmitMaterials()}
              disabled={creating || updating}
            >
              {creating || updating ? (
                <CircularProgress size={25} sx={{ color: "white" }} />
              ) : (
                <>
                  <CheckCircleRoundedIcon /> {t("submit")}
                </>
              )}
            </Button>
          ) : null}
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: theme.palette.info.main }}>
              {isArabic ? "حالة المواد" : "Materials Status"}
            </Typography>
            {hasExistingMaterials ? (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {isArabic ? "الحالة:" : "Status:"}{" "}
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: "bold",
                      color:
                        lastMaterialRecord?.status === "completed"
                          ? "success.main"
                          : "warning.main",
                    }}
                  >
                    {lastMaterialRecord?.status === "completed"
                      ? isArabic
                        ? "مكتمل"
                        : "Completed"
                      : isArabic
                        ? "قيد المراجعة"
                        : "Pending"}
                  </Typography>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {isArabic ? "عدد المواد:" : "Materials Count:"}{" "}
                  {prevSelectedMaterials?.length}
                </Typography>
                <Typography variant="body2">
                  {isArabic ? "إجمالي الساعات:" : "Total Hours:"}{" "}
                  {prevSelectedMaterials?.reduce(
                    (sum, el) => sum + (el?.material_hours || 0),
                    0
                  )}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {isArabic
                  ? "لم يتم تسجيل مواد حتى الآن"
                  : "No materials registered yet"}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
