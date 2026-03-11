import { useLocation, useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { SearchByTypingSelect, VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import LoadingPage from "../../components/LoadingComponent";
import { useState } from "react";
import { CREATE_USER_BY_ADMIN } from "../../graphql/userQueriesForAdmin";
import { userRules } from "../../constants";
import { GET_GROUPS } from "../../graphql/groupQueries";


export default function AddUserPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const [selectedRule, setSelectedRule] = useState(0);
  const { data, loading, error } = useQuery(GET_GROUPS, {
    fetchPolicy: "network-only",
  });

    const [
        CreateUser,
        {
            loading: CreateUserLoading
        }
    ] = useMutation(CREATE_USER_BY_ADMIN, { fetchPolicy: "network-only" });

    const formik = useFormik({
        initialValues: {
            username: "",
            fullname: "",
            email: "",
            mobile: "",
            password:"",
            groupIds: [],
        },

        validationSchema: Yup.object({
            selectedRule: selectedRule == 0 && Yup.string()
                .required(t("admissions.errors.required"))
                .notOneOf(["0"], t("admissions.errors.required")),
            username: Yup.string().required(t("admissions.errors.required")),
            fullname: Yup.string().required(t("admissions.errors.required")),
            email: Yup.string().email(t("admissions.errors.invalidEmail"))
            .required(t("admissions.errors.required")),
            mobile: Yup.string().required(t("admissions.errors.required")),
            groupIds: Yup.array().min(1, t("admissions.errors.required")).required(t("admissions.errors.required")),

        }),
   
        onSubmit: async (values) => {
    let data = {
        username: values?.username,
        fullname: values?.fullname,
        email: values?.email,
        mobile: values?.mobile,
        password: values?.password,
        groups: values.groupIds
    };
    data.role = selectedRule;

    try {
        const result = await CreateUser({
            variables: { input: data }
        });
        notify(t("success"), "success");
        navigate(location.pathname.split('/add')[0]);
    } catch (error) {
        console.error("Error:", error);
        // أضف رسالة الخطأ الفعلية
        const errorMessage = error?.graphQLErrors?.[0]?.message 
            || error?.message 
            || t("error");
        notify(errorMessage, "error");
    }
},

    });

    const groupsOptions = data?.groups || [];
    let translateText = isArabic ? "مستخدم" : "User";
    let translateText2 = isArabic ? "المستخدم" : "User";

    let userRulesWithOutStudent=userRules.filter(item=>item!="student");
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Header
                title={t("Users")}
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
                // sx={{ width: isMobile ? "90%" : "100%" }}
                component="form">

                <VerticalTextField
                    title={t("Dashboard.userName", { item: translateText2 })}
                    fieldID={"username"}
                    fieldName={"username"}
                    placeholder={t("Dashboard.userName", { item: translateText2 })}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                />

                <VerticalTextField
                    title={t("admissions.fullName", { item: translateText2 })}
                    fieldID={"fullname"}
                    fieldName={"fullname"}
                    placeholder={t("admissions.fullName", { item: translateText2 })}
                    value={formik.values.fullname}
                    onChange={formik.handleChange}
                    error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                    helperText={formik.touched.fullname && formik.errors.fullname}
                />

                <VerticalTextField
                    title={t("admissions.email", { item: translateText2 })}
                    fieldID={"email"}
                    fieldName={"email"}
                    placeholder={t("admissions.email", { item: translateText2 })}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />

                <VerticalTextField
                    title={t("Mobile", { item: translateText2 })}
                    fieldID={"mobile"}
                    fieldName={"mobile"}
                    placeholder={t("Mobile", { item: translateText2 })}
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}
                />

                 <VerticalTextField
                    title={t("form.password", { item: translateText2 })}
                    fieldID={"password"}
                    fieldName={"password"}
                    placeholder={t("form.password", { item: translateText2 })}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />

                <VerticalTextFieldSelect
                    t={t}
                    title={t("Dashboard.userType")} defaultOptionLabel={t("select")}
                    backgroundColor={theme.palette.background.inputBackGround}
                    value={selectedRule}
                    setValue={setSelectedRule}
                    onBlur={(e) => {
                        if (selectedRule != 0) formik.setFieldError("selectedRule", undefined);

                    }}
                    error={formik.errors.selectedRule && t("admissions.errors.required")}
                    helperText={formik.errors.selectedRule && t("admissions.errors.required")}
                >
                    <MenuItem value={0} selected>{t("select")}</MenuItem>
                    {
                        userRulesWithOutStudent?.map((el, i) => <MenuItem key={i} value={el}>{t(`Dashboard.${el}`)}</MenuItem>)
                    }
                </VerticalTextFieldSelect>
<SearchByTypingSelect
    title={t("Groups")}
    options={groupsOptions}
    multiple={true} // Enable multi-select
    findKey="id"    // The key in the object to store (groups)
    labelToShow={(option) => (isArabic ? option.name_ar : option.name_en)}
    value={formik.values.groupIds}
    setValue={(newIds) => formik.setFieldValue("groupIds", newIds)}
    onBlur={() => formik.setFieldTouched("groupIds", true)}
    error={formik.touched.groupIds && formik.errors.groupIds}
/>

                <SubmitButton loading={CreateUserLoading} t={t} />
            </Box>
        </Box>
    )
}
