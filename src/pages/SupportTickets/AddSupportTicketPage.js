import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, CircularProgress, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useState } from "react";
import { paymentMethodsArr, ticketTypes, transactionTypesArr, TrueOrFalseArr } from "../../constants";
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import { CREATE_NEW_FACULTY_PRICE } from "../../graphql/faculityPricesQueries";
import { CREATE_SUPPORT_TICKET } from "../../graphql/supportTicketQueries";
import { useSelector } from "react-redux";
import logger from "../../utils/logger";

export default function AddSupportTicketPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const [selectedType, setSelectedType] = useState(0);

    const me = useSelector((state) => state.user.loggedUser);

    const [
        CreateSupportTicket, {
            loading: creatingTicket
        }

    ] = useMutation(CREATE_SUPPORT_TICKET, { fetchPolicy: "network-only" });

    const formik = useFormik({
        initialValues: {
            subject: "",
            message: "",
            // price_inside_yemen: "",
            // price_outside_yemen: "",
        },

        validationSchema: Yup.object({
            message: Yup.string().required(t("admissions.errors.required")),
            subject: Yup.string()
                .required(t("admissions.errors.required")),
            selectedType: selectedType == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
          
        }),
        onSubmit: async (values) => {

            logger.log("suuuubmit");


            let data = {
                subject: values?.subject,
                message: values?.message,
                type: selectedType,
                user_id:me?.id
            };



            try {
                logger.log("uuuuuuuuuuuuuuuuuuuuuuuuuu", data);
                // logger.log(data);

                //  return;
                const result = await CreateSupportTicket({
                    variables: {
                        input: data
                    }
                });

                logger.log('result', result);

                notify(t("success"), "success");

                navigate(location.pathname.split('/add')[0]);

            } catch (error) {
                logger.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
    });

    let translateText = isArabic ? "تذكرة" : "Ticket";
    let translateText2 = isArabic ? "تذكرة" : "Ticket";
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
            <Header
                title={t("Dashboard.support")}
                subtitle={t("addItem", { item: translateText })}
                i18n={i18n}
                haveBtn={false}
                hasAddOrEditBtn={true}
                sub2={t("addItem", { item: translateText })}
                hasNavigate={true}
                isExcel={false}
                isPdf={false}
                isPrinter={false}
            />
            <Box component="form"
                onSubmit={
                    formik.handleSubmit
                }
                sx={{
                    width: "100%", [theme.breakpoints.down("sm")]: {
                        width: "60%", // 👈 للموبايل
                    },
                }}
            >


                <VerticalTextField
                    title={t("title", { item: translateText2 })}
                    fieldID={"subject"}
                    fieldName={"subject"}
                    placeholder={t("title")}
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                    helperText={formik.touched.subject && formik.errors.subject}
                />

                {/* الكلية */}

                <VerticalTextFieldSelect
                    t={t}
                    title={t("profile.Gender")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedType}
                    setValue={setSelectedType}


                    onBlur={(e) => {
                        // logger.log('blur',selectedSemester);
                        if (selectedType != 0) formik.setFieldError("selectedType", undefined);

                    }}

                    error={formik.errors.selectedType && t("admissions.errors.required")}
                    helperText={formik.errors.selectedType && t("admissions.errors.required")}


                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        ticketTypes?.map(el => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.labelAr : el?.labelEn}</MenuItem>)
                    }
                </VerticalTextFieldSelect>

                <VerticalTextField
                    isMultiline={true}
                    title={t("Dashboard.message", { item: translateText2 })}
                    fieldID={"message"}
                    fieldName={"message"}
                    placeholder={t("Dashboard.message", { item: translateText2 })}
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    error={formik.touched.message && Boolean(formik.errors.message)}
                    helperText={formik.touched.message && formik.errors.message}
                />

               




                <SubmitButton loading={creatingTicket} t={t} />
            </Box>
        </Box>
    )
}
