import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";

import LoadingPage from "../../components/LoadingComponent";
import { useEffect } from "react";
import HorizentalTextField from "../../components/Utilities/HorizentalTextField";
import { GET_TRANSACTION_BY_ID } from "../../graphql/transactionQueries";
import HistoryIcon from "@mui/icons-material/History";

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

  console.log("getTransactionById?.fees_type_ids",getTransactionById?.fees_type_ids);

  if (loadingTrans) return <LoadingPage />
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
      <Header
        title={t("Dashboard.transactions")}
        subtitle={t("detailsItem", { item: translateText })}
        i18n={i18n}
        haveBtn={true}
        btn={t("Logs")}
        btnIcon={<HistoryIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
        onSubmit={() => navigate("/transactions/logs/" + getTransactionById?.id)}
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
          value={
            getTransactionById?.user_id
              ? `${getTransactionById?.user_id?.fullname} - ${getTransactionById?.user_id?.email}`
              : `${getTransactionById?.register_form_id?.first_name || ""} ${getTransactionById?.register_form_id?.second_name || ""} ${getTransactionById?.register_form_id?.third_name || ""} ${getTransactionById?.register_form_id?.fourth_name || ""} - ${getTransactionById?.register_form_id?.email || ""}`
          }
        />

         {/* Collapsible table */}
              <Collapse in={true} timeout="auto">
                <Box sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead
                      sx={{
                        backgroundColor:
                          theme.palette.primary?.tabelHeader || "#e0e0e0",
                      }}
                    >
                      <TableRow>
                        <TableCell sx={{ textAlign: "start", fontWeight: 700,color:"#384250" }}>
                          {t("Dashboard.feesTypes")}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: "start",
                            fontWeight: 700,
                            width: 140,
                            textAlign: "right",
                            color:"#384250"
                          }}
                        >
                          {t("fee.table.amount")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      sx={{
                        backgroundColor:
                          theme.palette.background?.secDefault || "#fafafa",
                      }}
                    >
                      {getTransactionById?.fees_type_snapshot?.map((it, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ textAlign: "start", fontWeight: 600 }}>
                            {isArabic ? it?.title_ar : it?.title_en}
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: `${isArabic ? "end" : "start"}` }}
                          >
                            {
                               it?.inside_yemen_value
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>

      </Box>

    </Box>
  )
}
