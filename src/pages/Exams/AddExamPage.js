import { useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, CircularProgress, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import VerticalTextField, { SearchByTypingSelect, VerticalTextFieldSelect } from "../../components/Utilities/VerticalTextField";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID, GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useState } from "react";
import { CREATE_ACADEMY_TERM } from "../../graphql/AcademyTerms";
import { GET_MATERIALS_BY_DEPARTMENT_ID, GET_MATERIALS_BY_DOCTOR } from "../../graphql/materialQueries";
import { useSelector } from "react-redux";
export default function AddExamPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const me = useSelector(state => state.user.loggedUser);
    // get doctors materials
    const[
        MaterialsByDoctor,
        {
            data:{materialsByDoctor={}}={},
            loading:loadingMaterialsByDoctor
        }
    ]=useLazyQuery(GET_MATERIALS_BY_DOCTOR,{fetchPolicy:"network-only"});

    useEffect(()=>{
        if(me?.id){
            MaterialsByDoctor({variables:{doctor_id:me?.id}});
        }
    },[me]);

    // material_id ??  ------ academy_term_id->(api) ?????

    console.log("materialsByDoctor",materialsByDoctor);

    let translateText = isArabic ? "امتحان" : "Exam";
    let translateText2 = isArabic ? "الامتحان" : "Exam";

    if(loadingMaterialsByDoctor) return <LoadingPage/>
    
    return (
        <div>AddExamPage</div>
    )
}
