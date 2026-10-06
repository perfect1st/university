import React from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  MenuItem,
  Typography,
  useTheme,
  FormControlLabel,
  Switch
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
import { CREATE_SEQUENCE_TRANS, GET_TYPE_SEQUENCES } from "../../graphql/typeSequenceQueries";
import { GET_ALL_SUPPORT_TICKETS } from "../../graphql/supportTicketQueries";
import { GET_USERS } from "../../graphql/usersQueries";
import logger from "../../utils/logger";

export default function AddSequenceTransPage() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const { create } = usePermissionsByModule("supportTicketsSequenceTrans") || { create: true };

  const { data: ticketsData, loading: loadingTickets } = useQuery(GET_ALL_SUPPORT_TICKETS, { fetchPolicy: "network-only" });
  const { data: sequencesData, loading: loadingSequences } = useQuery(GET_TYPE_SEQUENCES, { fetchPolicy: "network-only" });
  const { data: usersData, loading: loadingUsers } = useQuery(GET_USERS, { fetchPolicy: "network-only" });

  const [createSequenceTrans, { loading: creating }] = useMutation(CREATE_SEQUENCE_TRANS);

  const ticketsList = ticketsData?.getSupportTickets || [];
  const sequencesList = sequencesData?.getTypeSequences || [];
  const usersList = usersData?.users || [];

  const formik = useFormik({
    initialValues: {
      support_ticketsId: "",
      type_sequence_id: "",
      user_id: "",
      is_approved: false,
      approved_datetime: "",
    },
    validationSchema: Yup.object({
      support_ticketsId: Yup.string().required(isArabic ? "مطلوب" : "Required"),
      type_sequence_id: Yup.string().required(isArabic ? "مطلوب" : "Required"),
      user_id: Yup.string().required(isArabic ? "مطلوب" : "Required"),
    }),
    onSubmit: async (values) => {
      try {
        await createSequenceTrans({
          variables: {
            input: {
              support_ticketsId: values.support_ticketsId,
              type_sequence_id: values.type_sequence_id,
              user_id: values.user_id,
              is_approved: values.is_approved,
              approved_datetime: values.is_approved ? String(new Date().getTime()) : null,
            },
          },
        });
        notify(t("success"), "success");
        navigate(-1);
      } catch (err) {
        logger.error("Error creating sequence trans:", err);
        notify(t("error"), "error");
      }
    },
  });

  if (create === false) return <NoPermissionPage />;
  if (loadingTickets || loadingSequences || loadingUsers) return <LoadingPage />;

  const titleText = isArabic ? "إضافة حركة موافقة" : "Add Approval Transaction";

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: "background.paper", minHeight: "100vh" }}>
      <Header title={titleText} subtitle={titleText} i18n={i18n} haveBtn={false} />
      
      <Card sx={{ mt: 3, p: 3, boxShadow: theme.shadows[2], borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {isArabic ? "بيانات الحركة" : "Transaction Details"}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Ticket */}
            <Grid item xs={12} md={6}>
              <VerticalTextFieldSelect
                t={t}
                title={isArabic ? "التذكرة" : "Ticket"}
                defaultOptionLabel={isArabic ? "اختر التذكرة..." : "Select Ticket..."}
                fieldID="support_ticketsId"
                fieldName="support_ticketsId"
                value={formik.values.support_ticketsId}
                onChange={formik.handleChange}
                error={formik.touched.support_ticketsId && Boolean(formik.errors.support_ticketsId)}
              >
                {ticketsList.map((ticket) => (
                  <MenuItem key={ticket.id} value={ticket.id}>
                    {ticket.serial} - {ticket.subject}
                  </MenuItem>
                ))}
              </VerticalTextFieldSelect>
            </Grid>

            {/* Sequence Step */}
            <Grid item xs={12} md={6}>
              <VerticalTextFieldSelect
                t={t}
                title={isArabic ? "خطوة المسار" : "Sequence Step"}
                defaultOptionLabel={isArabic ? "اختر الخطوة..." : "Select Step..."}
                fieldID="type_sequence_id"
                fieldName="type_sequence_id"
                value={formik.values.type_sequence_id}
                onChange={formik.handleChange}
                error={formik.touched.type_sequence_id && Boolean(formik.errors.type_sequence_id)}
              >
                {sequencesList.map((seq) => (
                  <MenuItem key={seq.id} value={seq.id}>
                    {isArabic ? seq.SupportTicketTypeId?.label_ar : seq.SupportTicketTypeId?.label_en} - الخطوة {seq.arrange}
                  </MenuItem>
                ))}
              </VerticalTextFieldSelect>
            </Grid>

            {/* User */}
            <Grid item xs={12} md={6}>
              <VerticalTextFieldSelect
                t={t}
                title={isArabic ? "الموظف المسؤول" : "Assignee"}
                defaultOptionLabel={isArabic ? "اختر الموظف..." : "Select Assignee..."}
                fieldID="user_id"
                fieldName="user_id"
                value={formik.values.user_id}
                onChange={formik.handleChange}
                error={formik.touched.user_id && Boolean(formik.errors.user_id)}
              >
                {usersList.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullname} ({user.email})
                  </MenuItem>
                ))}
              </VerticalTextFieldSelect>
            </Grid>

            {/* Approval Status */}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.is_approved}
                    onChange={(e) => formik.setFieldValue("is_approved", e.target.checked)}
                    name="is_approved"
                    color="success"
                  />
                }
                label={isArabic ? "معتمد (Approved)؟" : "Approved?"}
                sx={{ mt: 3 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            {/* <Button variant="outlined" onClick={() => navigate(-1)} disabled={creating}>
              {t("cancel") || "إلغاء"}
            </Button> */}
            <SubmitButton loading={creating} t={t} />
          </Box>
        </form>
      </Card>
    </Box>
  );
}
