import { useTheme } from "@emotion/react";
import { Box, CircularProgress, FormControlLabel, Grid, MenuItem, Switch, Typography, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import i18n from "../../i18n/i18n";
import { GET_LECTURE_SESSION_BY_ID, UPDATE_LECTURE_SESSION_BY_ID } from "../../graphql/LectureSessionQueries";
import LoadingPage from "../../components/LoadingComponent";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import axios from "axios";
import { baseURL } from "../../Api/apolloClient";
import UploadFileField from "../../components/Utilities/UploadFileField";
import { UPDATE_SUPPORT_TICKET_BY_ID } from "../../graphql/supportTicketQueries";
import { ticketTypes } from "../../constants";
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";


export default function EditSupportTicketPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();
    console.log("location", location.state);


    const [
        UpdateSupportTicket, {
            loading: updatingTicket
        }
    ] = useMutation(UPDATE_SUPPORT_TICKET_BY_ID, { fetchPolicy: "network-only" });

    const [selectedType, setSelectedType] = useState(()=>location?.state?.type);

    const me = useSelector((state) => state.user.loggedUser);


     const formik = useFormik({
            initialValues: {
                subject: location?.state?.subject,
                message: location?.state?.message,
                admin_reply:location?.state?.admin_reply
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
    
                console.log("suuuubmit");
    
    
                let data = {
                    subject: values?.subject,
                    message: values?.message,
                    type: selectedType,
                    admin_reply:values?.admin_reply,
                    status:"closed"
                };
    
    
    
                try {
                    console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu", data);
                    // console.log(data);
    
                    //  return;
                    const result = await UpdateSupportTicket({
                        variables: {
                            input: data,
                            id:location?.state?.id
                        }
                    });
    
                    console.log('result', result);
    
                    notify(t("success"), "success");
    
                    navigate(location.pathname.split('/details')[0]);
    
                } catch (error) {
                    console.error("Error logging in:", error);
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
            <Box component="form"
                onSubmit={
                    formik.handleSubmit
                }
                sx={{
                    width: "100%",
                }}
            >


                <HorizentalTextField
                    title={t("title", { item: translateText2 })}
                    fieldID={"subject"}
                    fieldName={"subject"}
                    placeholder={t("title")}
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                    helperText={formik.touched.subject && formik.errors.subject}
                    isDisabled={true}
                />

                {/* نوع الشكوي */}
               
                <HorizentalTextField
                    title={t("profile.Gender", { item: translateText2 })}
                    fieldID={"message"}
                    fieldName={"message"}
                    placeholder={t("profile.Gender", { item: translateText2 })}
                    value={ isArabic ? ticketTypes?.find(el=>el?.id==selectedType)?.labelAr : ticketTypes?.find(el=>el?.id==selectedType)?.labelEn}
                     isDisabled={true}
                />
               
                

                <HorizentalTextField
                    isMultiline={true}
                    title={t("Dashboard.message", { item: translateText2 })}
                    fieldID={"message"}
                    fieldName={"message"}
                    placeholder={t("Dashboard.message", { item: translateText2 })}
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    error={formik.touched.message && Boolean(formik.errors.message)}
                    helperText={formik.touched.message && formik.errors.message}
                     isDisabled={true}
                />

                 <HorizentalTextField
                    isMultiline={true}
                    title={t("Dashboard.adminReply", { item: translateText2 })}
                    fieldID={"admin_reply"}
                    fieldName={"admin_reply"}
                    placeholder={t("Dashboard.adminReply", { item: translateText2 })}
                    value={formik.values.admin_reply}
                    onChange={formik.handleChange}
                    error={formik.touched.admin_reply && Boolean(formik.errors.admin_reply)}
                    helperText={formik.touched.admin_reply && formik.errors.admin_reply}
                    isDisabled={me?.role!=="admin" ? true :false}
                />

               




               {
                me?.role=="admin"&&<SubmitButton loading={updatingTicket} t={t} />
               } 
            </Box>
        </Box>
    )
}
