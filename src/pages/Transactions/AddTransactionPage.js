import { CREATE_NEW_TRANSACTION_BY_ADMIN } from "../../graphql/transactionQueries"
import { GET_ALL_FEES_TYPES } from "../../graphql/feeTypesQueries";
import { useEffect, useRef } from "react";
import { GET_ALL_TRANSACTION_TYPES } from "../../graphql/transactionTypeQueries";
import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import {  Box, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { SearchByTypingSelect, VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import { useState } from "react";
import { paymentMethodsArr, TrueOrFalseArr } from "../../constants";
import { GET_ALL_USERES_FOR_ADMIN } from "../../graphql/userQueriesForAdmin";
import axios from "axios";
import ConfirmModal from "../../components/Utilities/ConfirmModal";
import { baseURL } from "../../Api/apolloClient";
import UploadFileField from "../../components/Utilities/UploadFileField";


export default function AddTransactionPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0);
    const [selectedTransactionType, setSelectedTransactionType] = useState(0);
    const [selectedFeeType, setSelectedFeeType] = useState([]);

    const [isInSideYemen, setIsInSideYemen] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedToShowFile, setSelectedToShowFile] = useState(null);
    const [progress, setProgress] = useState(0);

    // File handling
    const handlePickFile = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0] ?? null;


        console.log("ppppppppppppppppppppppp", file);

        // fileInputRef.current=file?.name;

        setSelectedToShowFile(file?.name);

        const formData = new FormData();
        formData.append("file", file);

        try {

            setProgress(0);

            const res = await axios.post(`${baseURL}/api/forms/single`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percent);
                },
            });

            console.log("res", res?.data?.url);
            setSelectedFile(res?.data?.url);
            // setBankTransferDocument(`${baseURL}${res?.data?.url}`);
        } catch (error) {
            notify(t("errorUplaod"), "error");
            console.log("error", error.message);
        }


    };

    console.log('selectedFile', selectedFile);


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
            let data = {
                payment_method_type: selectedPaymentMethod,
                transaction_type_id: selectedTransactionType,
                fees_type_ids: selectedFeeType,
                user_id: selectedUser,
                amount: values?.amount,
            };

            if(selectedFile!=null) data.payment_document_file=selectedFile;

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

                navigate(location.pathname.split('/add')[0]);

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


    // console.log("selectedFeeType",selectedFeeType);
    // console.log("selectedUser",selectedUser);
    // console.log("isInSideYemen",isInSideYemen);
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>

            {/* {
                showConfirmModal&&<ConfirmModal 
                title={"confirm"}
                content={"confirm"} 
                dialogOpen={showConfirmModal}
                setDialogOpen={setShowConfirmModal}
                onClickAction={formik.handleSubmit()}
                 />
            } */}
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

            <Box
                onSubmit={formik.handleSubmit}
                sx={{ width: isMobile ? "90%" : "100%" }}
                component="form"

            >
                    {/* paymentMethod */}
                    
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

                {
                    selectedPaymentMethod == "BANK_TRANSFER" && <UploadFileField
                        title={t("admissions.addFile")}
                        subTitle={t("admissions.addFile")}
                        fileInputRef={fileInputRef}
                        handleFileChange={handleFileChange}
                        handlePickFile={handlePickFile}
                        selectedToShowFile={selectedToShowFile}
                        progress={progress}
                    />
                }

                {/* ادخل اليمن */}
                <VerticalTextFieldSelect
                    t={t}
                    title={t("Dashboard.inside_yemen")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={isInSideYemen}
                    setValue={setIsInSideYemen}
                    onBlur={(e) => {
                        // console.log('blur', selectedPaymentMethod);
                        // if (selectedPaymentMethod != 0) formik.setFieldError("selectedPaymentMethod", undefined);

                    }}
                >
                    {
                        TrueOrFalseArr?.map((el, i) => <MenuItem key={i} value={el}>{t(`Dashboard.trueOrFalse.${el}`)}</MenuItem>)
                    }
                </VerticalTextFieldSelect>

                {/* نوع المعاملة */}
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
                        getTransactionTypes?.map((el, i) => <MenuItem key={i} value={el?.id}>{t(`fee.transactionType.${el?.operation_type}`)}</MenuItem>)
                    }
                </VerticalTextFieldSelect>


                {/*   getTransactionTypes
                    نوع الرسوم
                    labelToShow-> الل انت عاوزه يتكتب جوة كل option
                     */}

                <SearchByTypingSelect
                    multiple={true}
                    title={t("Dashboard.feeType")}
                    labelToShow={(option) => {
                        return `${isArabic ? option?.title_ar : option?.title_en}- [${t("Dashboard.inside_yemen")} : ${option?.inside_yemen_value}] - [${t("Dashboard.outside_yemen")} : ${option?.outside_yemen_value}]`
                    }}
                    findKey={"id"}
                    isArabic={isArabic}
                    options={getFeesTypes ? getFeesTypes : []}
                    value={selectedFeeType}
                    setValue={setSelectedFeeType}
                    error={formik.errors.selectedFeeType && t("admissions.errors.required")}
                    onBlur={(e) => {
                        // console.log("selectedFeeType blur",selectedFeeType);
                        let totalAmount = 0;

                        getFeesTypes?.map(fee => {
                            let feeObj = selectedFeeType?.find(el => el == fee?.id);
                            console.log("feeObj", feeObj);
                            if (feeObj) {
                                if (isInSideYemen == true) totalAmount += Number(fee?.inside_yemen_value)
                                else totalAmount += Number(fee?.outside_yemen_value)
                            }
                        });

                        // console.log('total amount',totalAmount);

                        formik.values.amount = totalAmount;

                        // validation check
                        if (selectedFeeType != 0) formik.setFieldError("selectedFeeType", undefined);

                    }}
                />

                {/* المستخدم */}
                <SearchByTypingSelect
                    title={t("Dashboard.user")}
                    labelToShow={(option) => {
                        return `${option?.fullname} - ${option?.email}`
                    }}
                    findKey={"id"}
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
                    isDisabled={true}
                />

                <SubmitButton loading={creatingTransaction} t={t} />

            </Box>


        </Box>
    )
}
