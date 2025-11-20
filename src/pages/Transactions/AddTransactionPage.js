import { CREATE_NEW_TRANSACTION_BY_ADMIN } from "../../graphql/transactionQueries"
import { GET_ALL_FEES_TYPES } from "../../graphql/feeTypesQueries";
import { useEffect } from "react";
import { GET_ALL_TRANSACTION_TYPES } from "../../graphql/transactionTypeQueries";
import { useLocation, useNavigate } from "react-router-dom"
import { CREATE_NEW_COUNTRY } from "../../graphql/countriesQueries"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Autocomplete, Box, MenuItem, TextField, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { SearchByTypingSelect, VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import { useState } from "react";
import { paymentMethodsArr, transactionTypesArr } from "../../constants";
import { GET_ALL_USERES_FOR_ADMIN } from "../../graphql/userQueriesForAdmin";
// GET_ALL_USERES_FOR_ADMIN

export default function AddTransactionPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0);
    const [selectedTransactionType, setSelectedTransactionType] = useState(0);
    const [selectedFeeType, setSelectedFeeType] = useState(0);

    const [selectedUser, setSelectedUser] = useState(null);

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
    }] = useLazyQuery(GET_ALL_TRANSACTION_TYPES, { fetchPolicy: "network-only" });

    // get all users
    const [Users, {
        data: { users } = {},
        loading: usersLoading
    }] = useLazyQuery(GET_ALL_USERES_FOR_ADMIN, { fetchPolicy: "network-only" });

    useEffect(() => {
        GetFeesTypes();
        GetTransactionTypes();
        Users();
    }, []);

    const formik = useFormik({
        initialValues: {
            amount: "",
        },

        validationSchema: Yup.object({
            selectedPaymentMethod: selectedPaymentMethod == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
            selectedTransactionType: selectedTransactionType == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
            selectedFeeType: selectedFeeType == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
            selectedUser: selectedUser == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
            amount: Yup.string().required(t("admissions.errors.required")),

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

    // console.log("getTransactionTypes", getTransactionTypes);
    console.log("getFeesTypes", getFeesTypes);
    console.log("users", users);

    let translateText = isArabic ? "معاملة مالية" : "Transaction";
    let translateText2 = isArabic ? "المعاملة المالية" : "Transaction";

    if (gettingFees || transactionTypesLoading || usersLoading) return <LoadingPage />;



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

                <VerticalTextFieldSelect
                    t={t}
                    title={t("Dashboard.feeType")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedFeeType}
                    setValue={setSelectedFeeType}
                    onBlur={(e) => {

                        if (selectedFeeType != 0) formik.setFieldError("selectedFeeType", undefined);

                    }}
                    error={formik.errors.selectedFeeType && t("admissions.errors.required")}
                    helperText={formik.errors.selectedFeeType && t("admissions.errors.required")}
                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        getFeesTypes?.map((el, i) => <MenuItem key={el?.id} value={el?.id}>{isArabic ? el?.title_ar : el?.title_en}</MenuItem>)
                    }
                </VerticalTextFieldSelect>



                {/* label=> ال  key الل انت عاوز تظهره من ال options */}
                <SearchByTypingSelect
                    title={t("Dashboard.user")}
                    label={"fullname"}
                    isArabic={isArabic}
                    options={users}
                    value={selectedUser}
                    setValue={setSelectedUser}
                    error={formik.errors.selectedFeeType && t("admissions.errors.required")}
                    onBlur={(e) => {
                        if (selectedUser != null) formik.setFieldError("selectedUser", undefined);

                    }}
                />

                <VerticalTextField
                    title={t("fee.table.amount", { item: translateText2 })}
                    type={"number"}
                    fieldID={"amount"}
                    fieldName={"amount"}
                    placeholder={t("fee.table.amount")}
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                />

                <SubmitButton loading={creatingTransaction} t={t} />

            </Box>


        </Box>
    )
}
