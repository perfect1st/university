import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "../../components/PageHeader/header";
import HorizentalTextField from "../../components/Utilities/HorizentalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import NoPermissionPage from "../../components/NoPermissionPage";
import notify from "../../components/notify";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import {
  GET_SUPPORT_TICKET_TYPE_BY_ID,
  UPDATE_SUPPORT_TICKET_TYPE,
} from "../../graphql/supportTicketQueries";
import { GET_ALL_FEES_TYPES } from "../../graphql/feeTypesQueries";
import logger from "../../utils/logger";

export default function EditSupportTicketTypePage() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isArabic = i18n.language === "ar";

  const { view, update } = usePermissionsByModule("supportTicketTypes");

  const { data: typeData, loading: typeLoading } = useQuery(
    GET_SUPPORT_TICKET_TYPE_BY_ID,
    {
      variables: { id },
      fetchPolicy: "network-only",
      skip: !id,
    }
  );

  const { data: feesData, loading: feesLoading } = useQuery(GET_ALL_FEES_TYPES, {
    fetchPolicy: "network-only",
  });

  const [updateSupportTicketType, { loading: updating }] = useMutation(
    UPDATE_SUPPORT_TICKET_TYPE
  );

  const currentType = typeData?.getSupportTicketTypeById || location?.state;
  const allFees = feesData?.getFeesTypes || [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      label_ar: currentType?.label_ar || "",
      label_en: currentType?.label_en || "",
      requires_fee: Boolean(currentType?.requires_fee),
      fees: (currentType?.fees || []).map((f) => (typeof f === "string" ? f : f.id)),
    },
    validationSchema: Yup.object({
      label_ar: Yup.string().trim().required(t("admissions.errors.required")),
      label_en: Yup.string().trim().required(t("admissions.errors.required")),
      requires_fee: Yup.boolean(),
      fees: Yup.array(),
    }),
    onSubmit: async (values) => {
      if (!update) return notify(t("no_permission.title"), "error");
      try {
        const payload = {
          label_ar: values.label_ar.trim(),
          label_en: values.label_en.trim(),
          requires_fee: values.requires_fee,
          fees: values.requires_fee ? values.fees : [],
        };

        await updateSupportTicketType({
          variables: {
            id,
            input: payload,
          },
        });

        notify(t("success"), "success");
        navigate("/SupportTicketTypes");
      } catch (err) {
        logger.error("Error updating support ticket type:", err);
        notify(t("error"), "error");
      }
    },
  });

  const handleToggleFee = (feeId) => {
    if (!update) return;
    const currentFees = formik.values.fees || [];
    if (currentFees.includes(feeId)) {
      formik.setFieldValue(
        "fees",
        currentFees.filter((fid) => fid !== feeId)
      );
    } else {
      formik.setFieldValue("fees", [...currentFees, feeId]);
    }
  };

  if (!view) return <NoPermissionPage />;
  if (typeLoading || feesLoading) return <LoadingPage />;

  const itemText = isArabic ? "نوع تذكرة / مستند" : "Ticket Type / Document";

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Header
        title={
          isArabic
            ? "أنواع تذاكر الدعم والمستندات"
            : "Ticket Types & Documents"
        }
        subtitle={t("detailsItem", { item: itemText })}
        i18n={i18n}
        haveBtn={false}
        hasAddOrEditBtn={true}
        sub2={t("detailsItem", { item: itemText })}
        hasNavigate={true}
        isExcel={false}
        isPdf={false}
        isPrinter={false}
      />

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          maxWidth: { xs: "100%", md: "850px" },
          mt: 2,
        }}
      >
        {/* Name In Arabic */}
        <HorizentalTextField
          title={
            isArabic
              ? "اسم نوع الطلب / المستند (بالعربية)"
              : "Ticket Type / Document Name (Arabic)"
          }
          fieldID="label_ar"
          fieldName="label_ar"
          value={formik.values.label_ar}
          onChange={formik.handleChange}
          error={formik.touched.label_ar && Boolean(formik.errors.label_ar)}
          helperText={formik.touched.label_ar && formik.errors.label_ar}
          isDisabled={!update}
        />

        {/* Name In English */}
        <HorizentalTextField
          title={
            isArabic
              ? "اسم نوع الطلب / المستند (بالإنجليزية)"
              : "Ticket Type / Document Name (English)"
          }
          fieldID="label_en"
          fieldName="label_en"
          value={formik.values.label_en}
          onChange={formik.handleChange}
          error={formik.touched.label_en && Boolean(formik.errors.label_en)}
          helperText={formik.touched.label_en && formik.errors.label_en}
          isDisabled={!update}
        />

        {/* Requires Fee Switch */}
        <Box
          sx={{
            p: 2.5,
            my: 3,
            bgcolor: formik.values.requires_fee ? "#fffbeb" : "#f8fafc",
            border: "1px solid",
            borderColor: formik.values.requires_fee ? "#f59e0b" : "#e2e8f0",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {isArabic
                ? "هل يتطلب استخراج هذا المستند رسوماً؟"
                : "Does this request require fees?"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isArabic
                ? "في حال التفعيل، سيُطلب من الطالب سداد الرسوم المحددة إلكترونياً عند تقديم الطلب."
                : "If enabled, the student will be required to pay the configured fees upon submitting the request."}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.requires_fee}
                onChange={(e) => {
                  formik.setFieldValue("requires_fee", e.target.checked);
                  if (!e.target.checked) {
                    formik.setFieldValue("fees", []);
                  }
                }}
                color="warning"
                disabled={!update}
              />
            }
            label={
              formik.values.requires_fee
                ? isArabic
                  ? "يتطلب رسوم"
                  : "Requires Fee"
                : isArabic
                ? "مجاني"
                : "Free"
            }
            sx={{ m: 0 }}
          />
        </Box>

        {/* Fees Selection List */}
        {formik.values.requires_fee && (
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2,
              borderColor: "#cbd5e1",
              bgcolor: "#ffffff",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              {isArabic
                ? "اختر بنود الرسوم المرتبطة بهذا المستند:"
                : "Select Associated Fees for this Document:"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {isArabic
                ? "يمكنك اختيار بند أو أكثر من بنود الرسوم المعرفة في النظام."
                : "You can select one or more fee items configured in the system."}
            </Typography>

            {allFees.length === 0 ? (
              <Typography color="text.secondary" variant="body2">
                {isArabic
                  ? "لا توجد بنود رسوم مضافة في النظام حالياً."
                  : "No fee types currently exist in the system."}
              </Typography>
            ) : (
              <Grid container spacing={1.5}>
                {allFees.map((fee) => {
                  const isChecked = formik.values.fees.includes(fee.id);
                  return (
                    <Grid item xs={12} sm={6} key={fee.id}>
                      <Box
                        onClick={() => handleToggleFee(fee.id)}
                        sx={{
                          p: 1.5,
                          border: "1px solid",
                          borderColor: isChecked ? "primary.main" : "#e2e8f0",
                          borderRadius: 1.5,
                          bgcolor: isChecked ? "#eff6ff" : "#f8fafc",
                          cursor: update ? "pointer" : "default",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          transition: "all 0.2s",
                          "&:hover": update
                            ? {
                                borderColor: "primary.light",
                              }
                            : {},
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleToggleFee(fee.id)}
                            color="primary"
                            size="small"
                            disabled={!update}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: isChecked ? 700 : 500 }}
                            >
                              {isArabic ? fee.title_ar : fee.title_en}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {isArabic ? "داخل اليمن: " : "Inside Yemen: "}
                              <strong>{fee.inside_yemen_value}</strong> |{" "}
                              {isArabic ? "خارج اليمن: " : "Outside Yemen: "}
                              <strong>{fee.outside_yemen_value}</strong>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Paper>
        )}

        {update && (
          <Box sx={{ mt: 3 }}>
            <SubmitButton loading={updating} t={t} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
