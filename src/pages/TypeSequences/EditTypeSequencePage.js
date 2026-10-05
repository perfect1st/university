import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "../../components/PageHeader/header";
import VerticalTextField, { VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import NoPermissionPage from "../../components/NoPermissionPage";
import notify from "../../components/notify";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import { UPDATE_TYPE_SEQUENCE, GET_TYPE_SEQUENCE_BY_ID } from "../../graphql/typeSequenceQueries";
import { GET_ALL_SUPPORT_TICKET_TYPES } from "../../graphql/supportTicketQueries";
import { GET_ACTIVE_JOB_TITLES } from "../../graphql/jobTitleQueries";
import logger from "../../utils/logger";

export default function EditTypeSequencePage() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isArabic = i18n.language === "ar";

  const { update } = usePermissionsByModule("typeSequences") || { update: true };
  const passedData = location.state; // passed from list page

  // Fetch ticket types for dropdown
  const { data: ticketTypesData, loading: loadingTickets } = useQuery(GET_ALL_SUPPORT_TICKET_TYPES, {
    fetchPolicy: "network-only",
  });

  // Fetch job titles for dropdown
  const { data: jobTitlesData, loading: loadingJobs } = useQuery(GET_ACTIVE_JOB_TITLES, {
    fetchPolicy: "network-only",
  });

  // Fetch sequence by ID if not passed via state
  const { data: sequenceData, loading: loadingSequence } = useQuery(GET_TYPE_SEQUENCE_BY_ID, {
    variables: { id },
    skip: !!passedData,
    fetchPolicy: "network-only"
  });

  const [updateTypeSequence, { loading: updating }] = useMutation(UPDATE_TYPE_SEQUENCE);

  const ticketTypesList = ticketTypesData?.getSupportTicketTypes || [];
  const jobTitlesList = jobTitlesData?.getActiveJobTitles || [];
  
  const currentItem = passedData || sequenceData?.getTypeSequenceById;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      SupportTicketTypeId: currentItem?.SupportTicketTypeId?.id || "",
      job_title_id: currentItem?.job_title_id?.id || "",
      arrange: currentItem?.arrange || "",
      period_time_per_day: currentItem?.period_time_per_day || "",
    },
    validationSchema: Yup.object({
      SupportTicketTypeId: Yup.string().required(isArabic ? "مطلوب" : "Required"),
      job_title_id: Yup.string().required(isArabic ? "مطلوب" : "Required"),
      arrange: Yup.number().required(isArabic ? "مطلوب" : "Required").positive().integer(),
      period_time_per_day: Yup.string().required(isArabic ? "مطلوب" : "Required"),
    }),
    onSubmit: async (values) => {
      try {
        await updateTypeSequence({
          variables: {
            id,
            input: {
              SupportTicketTypeId: values.SupportTicketTypeId,
              job_title_id: values.job_title_id,
              arrange: Number(values.arrange),
              period_time_per_day: values.period_time_per_day,
            },
          },
        });
        notify(t("success"), "success");
        navigate(-1);
      } catch (err) {
        logger.error("Error updating type sequence:", err);
        notify(t("error"), "error");
      }
    },
  });

  if (update === false) return <NoPermissionPage />;
  if (loadingTickets || loadingJobs || loadingSequence) return <LoadingPage />;

  const titleText = isArabic ? "تعديل خطوة مسار الموافقات" : "Edit Sequence Step";

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: "background.paper", minHeight: "100vh" }}>
      <Header
        title={titleText}
        subtitle={titleText}
        i18n={i18n}
        haveBtn={false}
      />
      
      <Card sx={{ mt: 3, p: 3, boxShadow: theme.shadows[2], borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {isArabic ? "بيانات الخطوة" : "Step Details"}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Ticket Type */}
            <Grid item xs={12} md={6}>
              <VerticalTextFieldSelect
                t={t}
                title={isArabic ? "نوع التذكرة" : "Ticket Type"}
                defaultOptionLabel={isArabic ? "اختر نوع التذكرة..." : "Select Ticket Type..."}
                fieldID="SupportTicketTypeId"
                fieldName="SupportTicketTypeId"
                value={formik.values.SupportTicketTypeId}
                onChange={formik.handleChange}
                error={formik.touched.SupportTicketTypeId && Boolean(formik.errors.SupportTicketTypeId)}
              >
                {ticketTypesList.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {isArabic ? type.label_ar : type.label_en}
                  </MenuItem>
                ))}
              </VerticalTextFieldSelect>
            </Grid>

            {/* Job Title */}
            <Grid item xs={12} md={6}>
              <VerticalTextFieldSelect
                t={t}
                title={isArabic ? "المسمى الوظيفي (المسؤول)" : "Job Title (Assignee)"}
                defaultOptionLabel={isArabic ? "اختر المسمى الوظيفي..." : "Select Job Title..."}
                fieldID="job_title_id"
                fieldName="job_title_id"
                value={formik.values.job_title_id}
                onChange={formik.handleChange}
                error={formik.touched.job_title_id && Boolean(formik.errors.job_title_id)}
              >
                {jobTitlesList.map((job) => (
                  <MenuItem key={job.id} value={job.id}>
                    {isArabic ? job.name_ar : job.name_en}
                  </MenuItem>
                ))}
              </VerticalTextFieldSelect>
            </Grid>

            {/* Arrange */}
            <Grid item xs={12} md={6}>
              <VerticalTextField
                title={isArabic ? "ترتيب الخطوة (مثال: 1، 2، 3...)" : "Step Order (e.g. 1, 2, 3...)"}
                fieldName="arrange"
                fieldID="arrange"
                type="number"
                value={formik.values.arrange}
                onChange={formik.handleChange}
                error={formik.touched.arrange && Boolean(formik.errors.arrange)}
                helperText={formik.touched.arrange && formik.errors.arrange}
              />
            </Grid>

            {/* Period Time */}
            <Grid item xs={12} md={6}>
              <VerticalTextField
                title={isArabic ? "المدة (تاريخ / وقت)" : "Period Time (Date)"}
                fieldName="period_time_per_day"
                fieldID="period_time_per_day"
                type="date"
                value={formik.values.period_time_per_day}
                onChange={formik.handleChange}
                error={formik.touched.period_time_per_day && Boolean(formik.errors.period_time_per_day)}
                helperText={formik.touched.period_time_per_day && formik.errors.period_time_per_day}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)} disabled={updating}>
              {t("cancel") || "إلغاء"}
            </Button>
            <SubmitButton
              loading={updating}
              t={t}
            />
          </Box>
        </form>
      </Card>
    </Box>
  );
}
