import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
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
import { GET_MATERIALS_BY_DEPARTMENT_ID, GET_MATERIALS_BY_DOCTOR, GET_STUDENT_BY_MATERIAL_ID } from "../../graphql/materialQueries";
import { useSelector } from "react-redux";
import { ADD_NEW_EXAM } from "../../graphql/ExamsQueries";
import { examTypes } from "../../constants";

export default function AddExamStudentDegreePage() {
    const theme = useTheme();
        const { t } = useTranslation();
        const isArabic = i18n.language === "ar";
        const navigate = useNavigate();
        const isMobile = useMediaQuery(theme.breakpoints.down("md"));
        const location = useLocation();
        const{id}=useParams();

        const{
            data:{studentsByMaterial=[]}={},
            loading:studentsByMaterialLoading
        }=useQuery(GET_STUDENT_BY_MATERIAL_ID,{
            variables:{material_id:location?.state?.material_id}
        });

        console.log("location",location.state);
        console.log("studentsByMaterial",studentsByMaterial);

        if(studentsByMaterialLoading) return <LoadingPage/>;
  return (
    <div>AddExamStudentDegreePage</div>
  )
}
