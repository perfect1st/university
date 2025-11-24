import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, CircularProgress, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useState } from "react";
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";
import { GET_TRANSACTION_BY_ID } from "../../graphql/transactionQueries";

export default function TransactionDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [GetTransactionById, {
    data: { getTransactionById } = {},
    loading: loadingTrans
  }] = useLazyQuery(GET_TRANSACTION_BY_ID, { fetchPolicy: "network-only" });

  useEffect(() => {
    GetTransactionById({
      variables: {
        id: location?.state?.id
      }
    })
  }, []);

  console.log("location", location?.state);
  console.log("getTransactionById", getTransactionById);

  let translateText = isArabic ? "معاملة مالية" : "Transaction";
  let translateText2 = isArabic ? "المعاملة المالية" : "Transaction";

  if (loadingTrans) return <LoadingPage />
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
      <Header
        title={t("Dashboard.transactions")}
        subtitle={t("detailsItem", { item: translateText })}
        i18n={i18n}
        haveBtn={false}
        hasAddOrEditBtn={true}
        sub2={t("detailsItem", { item: translateText })}
        hasNavigate={true}
        isExcel={false}
        isPdf={false}
        isPrinter={false}
      />

      <Box
        sx={{
          width: "100%"
        }}
      >

        <HorizentalTextField
          isDisabled={true}
          title={t("fee.transactionSerial")}
          fieldID={"transaction_serial"}
          fieldName={"transaction_serial"}
          value={getTransactionById?.transaction_serial}
        />

        <HorizentalTextField
          isDisabled={true}
          title={t("fee.paymentMethodsTitle")}
          fieldID={"payment_method_type"}
          fieldName={"payment_method_type"}
          value={t(`fee.method.${getTransactionById?.payment_method_type}`)}
        />

        <HorizentalTextField
          isDisabled={true}
          title={t("fee.paymentDate")}
          fieldID={"transaction_date"}
          fieldName={"transaction_date"}
          value={getTransactionById?.transaction_date}
        />

        <HorizentalTextField
          isDisabled={true}
          title={t("Dashboard.user")}
          fieldID={"user_id"}
          fieldName={"user_id"}
          value={getTransactionById?.user_id?.fullname}
        />

      </Box>

    </Box>
  )
}
