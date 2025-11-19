import { CREATE_NEW_TRANSACTION_BY_ADMIN } from "../../graphql/transactionQueries"
import { GET_ALL_FEES_TYPES } from "../../graphql/feeTypesQueries";
import { useEffect } from "react";
import { GET_ALL_TRANSACTION_TYPES } from "../../graphql/transactionTypeQueries";
import { useLocation, useNavigate } from "react-router-dom"
import { CREATE_NEW_COUNTRY } from "../../graphql/countriesQueries"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import { useState } from "react";
import { paymentMethodsArr, transactionTypesArr } from "../../constants";

export default function AddTransactionPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0);
    const [selectedTransactionType, setSelectedTransactionType] = useState(0);

    const [CreateTransaction, {
        data,
        loading: creatingTransaction
    }] = useMutation(CREATE_NEW_TRANSACTION_BY_ADMIN, { fetchPolicy: "network-only" });

    // get fees ids
    const [GetFeesTypes, {
        data: { getFeesTypes } = {},
        loading: gettingFees
    }] = useLazyQuery(GET_ALL_FEES_TYPES, { fetchPolicy: "network-only" });

    // get transaction types
    const [GetTransactionTypes, {
        data: { getTransactionTypes } = {},
        loading: transactionTypesLoading
    }] = useLazyQuery(GET_ALL_TRANSACTION_TYPES, { fetchPolicy: "network-only" })

    useEffect(() => {
        GetFeesTypes();
        GetTransactionTypes();
    }, []);

    const formik = useFormik({
        initialValues: {
            // title_ar: "",
            // title_en: ""
            // faculty_id: ""
            // flag: "",
        },

        validationSchema: Yup.object({
            selectedPaymentMethod: selectedPaymentMethod == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
            selectedTransactionType: selectedTransactionType == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
            // faculty_id: Yup.string().required(t("admissions.errors.required")),

        }),
        onSubmit: async (values) => {

            // ✅ التحقق اليدوي قبل الإرسال
            // if (selected==0) {
            //     // console.log('rrrrrrrrrrrrrrrrrrrrrrr');
            //     // formik.setFieldError("faculty_id", t("admissions.errors.required"));

            //     setSelectError(t("admissions.errors.required"));
            //     return; // وقف الإرسال لحد ما المستخدم يختار
            // }
            console.log('xxxxxxxxxxxxxxxxxxxxxxx');
            const data = {
                title_ar: values?.title_ar,
                title_en: values.title_en,
                // faculty_id: selected

            };
            try {
                console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
                console.log(data);

                // return;
                const result = await CreateTransaction({
                    variables: {
                        input: data
                    }
                });

                console.log('result', result);

                notify(t("success"), "success");

                navigate('/departments');

            } catch (error) {
                console.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
    });

    console.log("getTransactionTypes", getTransactionTypes);

    let translateText = isArabic ? "معاملة مالية" : "Transaction";
    let translateText2 = isArabic ? "المعاملة المالية" : "Transaction";

    if (gettingFees || transactionTypesLoading) return <LoadingPage />;
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Header
                title={t("Dashboard.transactions")}
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

            <Box component="form" onSubmit={formik.handleSubmit} fullWidth>

                {/* <VerticalTextField
                    title={t("form.name_ar", { item: translateText2 })}
                    fieldID={"title_ar"}
                    fieldName={"title_ar"}
                    placeholder={t("form.name_ar", { item: translateText2 })}
                    value={formik.values.title_ar}
                    onChange={formik.handleChange}
                    error={formik.touched.title_ar && Boolean(formik.errors.title_ar)}
                    helperText={formik.touched.title_ar && formik.errors.title_ar}
                />

                <VerticalTextField
                    title={t("form.name_en", { item: translateText2 })}
                    fieldID={"title_en"}
                    fieldName={"title_en"}
                    placeholder={t("form.name_en", { item: translateText2 })}
                    value={formik.values.title_en}
                    onChange={formik.handleChange}
                    error={formik.touched.title_en && Boolean(formik.errors.title_en)}
                    helperText={formik.touched.title_en && formik.errors.title_en}
                /> */}

                <VerticalTextFieldSelect
                    t={t}
                    title={t("fee.paymentMethodsTitle")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedPaymentMethod}
                    setValue={setSelectedPaymentMethod}
                    onBlur={(e) => {
                        console.log('blur', selectedPaymentMethod);
                        if (selectedPaymentMethod != 0) formik.setFieldError("selectedPaymentMethod", undefined);

                    }}
                    error={formik.errors.selectedPaymentMethod && t("admissions.errors.required")}
                    helperText={formik.errors.selectedPaymentMethod && t("admissions.errors.required")}
                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        paymentMethodsArr?.map((el, i) => <MenuItem key={i} value={el}>{t(`fee.method.${el}`)}</MenuItem>)
                    }
                </VerticalTextFieldSelect>

                 <VerticalTextFieldSelect
                    t={t}
                    title={t("Dashboard.transactionType")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedTransactionType}
                    setValue={setSelectedTransactionType}
                    onBlur={(e) => {
                       
                        if (selectedTransactionType != 0) formik.setFieldError("selectedTransactionType", undefined);

                    }}
                    error={formik.errors.selectedTransactionType && t("admissions.errors.required")}
                    helperText={formik.errors.selectedTransactionType && t("admissions.errors.required")}
                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        transactionTypesArr?.map((el, i) => <MenuItem key={i} value={el}>{t(`fee.transactionType.${el}`)}</MenuItem>)
                    }
                </VerticalTextFieldSelect>


                <SubmitButton loading={creatingTransaction} t={t} />

            </Box>


        </Box>
    )
}
