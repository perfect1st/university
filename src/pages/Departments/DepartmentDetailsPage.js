import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { Box, Grid, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import notify from "../../components/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../components/Utilities/SubmitButton";
import { GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import LoadingPage from "../../components/LoadingComponent";
import { useEffect, useState } from "react";
import HorizentalTextField, { HorizentalTextFieldSelect } from "../../components/Utilities/HorizentalTextField";
import { GET_DEPARTMENTS_BY_FATHER_ID_FOR_ADMIN, UPDATE_WEBSITE_DEPARTMENT_BY_ID } from "../../graphql/departmentsQueries";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";

// UPDATE_FACULITY_DEPARTMENT_BY_ID
export default function DepartmentDetailsPage() {

    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    // const [selected, setSelected] = useState(()=>location?.state?.faculty_id?.id);
    // const [selectError, setSelectError] = useState("");

    // const [
    //     Faculties, {
    //         data: { faculties } = {},
    //         loading: faculitiesLoading
    //     }
    // ] = useLazyQuery(GET_ALL_FACULITIES, { fetchPolicy: "network-only" });

    const [
        UpdateWebsiteDepartment,
        {
            data,
            loading
        }
    ] = useMutation(UPDATE_WEBSITE_DEPARTMENT_BY_ID, { fetchPolicy: "network-only" });

    const [
        GetDepartmentsByFather,
        {
            data: { getDepartmentsByFather } = {},
            loading: getDepartmentsByFatherLoading
        }
    ] = useLazyQuery(GET_DEPARTMENTS_BY_FATHER_ID_FOR_ADMIN, { fetchPolicy: "network-only" });

    useEffect(() => {
        GetDepartmentsByFather({ variables: { father_id: location?.state?.id } });
        // Faculties();
    }, []);

    let columns = [
        // { key: "ID", label: "ID" },
        { key: "title_ar", label: t("Dashboard.NameInArabic") },
        { key: "title_en", label: t("Dashboard.NameInEnglish") },
        { key: "status", label: t("Status") }
        //  { key: "userType", label: t("User Type") }

    ];

     const fetchAndExport = async (type) => {
                try {
                    const exportData = getDepartmentsByFather?.map((user) => ({
                        ID: user.serial_num,
                        "Full Name": user.name,
                        Email: user.email,
                        Mobile: user.mobile,
                        "User Type": user.userType,
                        Status: user.status,
                    }));
        
                    if (type === "excel") {
                        const ws = XLSX.utils.json_to_sheet(exportData);
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "Users");
                        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
                        const data = new Blob([excelBuffer], {
                            type: "application/octet-stream",
                        });
                        saveAs(data, `Users_${new Date().toISOString()}.xlsx`);
                    } else if (type === "pdf") {
                        const doc = new jsPDF();
                        doc.text("Users Report", 14, 10);
                        autoTable(doc, {
                            startY: 20,
                            head: [Object.keys(exportData[0] || {})],
                            body: exportData.map((row) => Object.values(row)),
                        });
                        doc.save(`Users_${new Date().toISOString()}.pdf`);
                    } else if (type === "print") {
                        const printableWindow = window.open("", "_blank");
                        const htmlContent = `
                                   <html>
                                     <head>
                                       <title>Users Report</title>
                                       <style>
                                         table { width: 100%; border-collapse: collapse; }
                                         th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                                         th { background-color: #f2f2f2; }
                                       </style>
                                     </head>
                                     <body>
                                       <h2>Users Report</h2>
                                       <table>
                                         <thead><tr>${Object.keys(exportData[0] || {})
                                .map((k) => `<th>${k}</th>`)
                                .join("")}</tr></thead>
                                         <tbody>${exportData
                                .map(
                                    (row) =>
                                        `<tr>${Object.values(row)
                                            .map((v) => `<td>${v}</td>`)
                                            .join("")}</tr>`
                                )
                                .join("")}</tbody>
                                       </table>
                                     </body>
                                   </html>
                                 `;
                        printableWindow.document.write(htmlContent);
                        printableWindow.document.close();
                        printableWindow.print();
                    }
                } catch (err) {
                    console.error("Export error:", err);
                }
            };
        
            const addNavigate = () => navigate("add");
        
            const handleDetailsClick = (selectedRow) => {
                console.log('handleDetailsClick', selectedRow);
                navigate(`details/${selectedRow?.id}`, {
                    state: selectedRow
                });
            }
        
            const onStatusChange = async (selectedRow, newStatus) => {
                try {
                    console.log("selectedRow", selectedRow, newStatus);
                    // return;
                    let data={
                        status:newStatus=="inActive" ? false :true
                    }
                    // const result=await UpdateFacultyDepartment({
                    //     variables:{
                    //         id:selectedRow?.id,
                    //         input:data
                    //     }
                    // });
        
                   // console.log("reeesult",result);
        
                     notify(t("success"), "success");
        
                } catch (error) {
                        notify(t("error"), "error");
                }
            }
        
        
    // console.log("faculties", faculties);
    console.log("location", location?.state);
    console.log("getDepartmentsByFather", getDepartmentsByFather);

    // faculty_id?.id
    const formik = useFormik({
        initialValues: {
            title_ar: location?.state?.title_ar,
            title_en: location?.state?.title_en,
            desc_ar: location?.state?.desc_ar,
            desc_en: location?.state?.desc_en
            // faculty_id: ""
            // flag: "",
        },

        validationSchema: Yup.object({
            title_ar: Yup.string().required(t("admissions.errors.required")),
            title_en: Yup.string().required(t("admissions.errors.required")),
            // faculty_id: Yup.string().required(t("admissions.errors.required")),

        }),
        onSubmit: async (values) => {

            // ✅ التحقق اليدوي قبل الإرسال
            // if (selected==0) {
            //     setSelectError(t("admissions.errors.required"));
            //     return; // وقف الإرسال لحد ما المستخدم يختار
            // }
            console.log('xxxxxxxxxxxxxxxxxxxxxxx');
            const data = {
                title_ar: values?.title_ar,
                title_en: values.title_en,
                desc_ar: values?.state?.desc_ar,
                desc_en: values?.state?.desc_en
                // faculty_id: selected

            };
            try {
                console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu");
                console.log(data);

                const result = await UpdateWebsiteDepartment({
                    variables: {
                        id: location?.state?.id,
                        input: data
                    }
                });

                console.log('result', result);

                notify(t("success"), "success");

                navigate('/website-departments');

            } catch (error) {
                console.error("Error logging in:", error);
                notify(t("error"), "error");

            } finally {
                //  setIsLoading(false);
            }
        },
    });

    let translateText = isArabic ? "قسم" : "Department";
    let translateText2 = isArabic ? "القسم" : "Department";
    let translateText3 = isArabic ? "عنوان فرعي" : "Sub Title";

    if (getDepartmentsByFatherLoading) return <LoadingPage />;

        const hasViewPermission = true;
        const hasAddPermission = true;
        if (!hasViewPermission) return <Navigate to="/profile" />;

      // console.log("DepartmentDetailsPage");

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Header
                title={t("departments")}
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

            <Box component="form" onSubmit={formik.handleSubmit} sx={{
                width:isMobile ? "50%" : "100%"
            }}>

                <HorizentalTextField
                    title={t("form.name_ar", { item: translateText2 })}
                    fieldID={"title_ar"}
                    fieldName={"title_ar"}
                    placeholder={t("form.name_ar", { item: translateText2 })}
                    value={formik.values.title_ar}
                    onChange={formik.handleChange}
                    error={formik.touched.title_ar && Boolean(formik.errors.title_ar)}
                    helperText={formik.touched.title_ar && formik.errors.title_ar}
                />

                <HorizentalTextField
                    title={t("form.name_en", { item: translateText2 })}
                    fieldID={"title_en"}
                    fieldName={"title_en"}
                    placeholder={t("form.name_en", { item: translateText2 })}
                    value={formik.values.title_en}
                    onChange={formik.handleChange}
                    error={formik.touched.title_en && Boolean(formik.errors.title_en)}
                    helperText={formik.touched.title_en && formik.errors.title_en}
                />

                <HorizentalTextField
                    isMultiline={true}
                    title={t("Dashboard.arDescription", { item: translateText2 })}
                    fieldID={"desc_ar"}
                    fieldName={"desc_ar"}
                    placeholder={t("Dashboard.arDescription", { item: translateText2 })}
                    value={formik.values.desc_ar}
                    onChange={formik.handleChange}
                    error={formik.touched.desc_ar && Boolean(formik.errors.desc_ar)}
                    helperText={formik.touched.desc_ar && formik.errors.desc_ar}
                />

                <HorizentalTextField
                    isMultiline={true}
                    title={t("Dashboard.enDescription", { item: translateText2 })}
                    fieldID={"desc_en"}
                    fieldName={"desc_en"}
                    placeholder={t("Dashboard.enDescription", { item: translateText2 })}
                    value={formik.values.desc_en}
                    onChange={formik.handleChange}
                    error={formik.touched.desc_en && Boolean(formik.errors.desc_en)}
                    helperText={formik.touched.desc_en && formik.errors.desc_en}
                />


                <SubmitButton loading={loading} t={t} />

            </Box>

             {/* {
                            updatingStatus && <CircularProgress
                                size={26}
                                thickness={8}
                                sx={{ color: "black" }}
                            />
                        } */}

             <Grid container spacing={3}>
                <Grid item
                    sm={12} md={12}
                    sx={{
                        overflowX: "auto", // ✅ مهم جدًا عشان الجدول يعمل scroll داخل الـ Grid
                    }}
                >
                    <Header
                        title={t("Dashboard.subtitle")}
                        subtitle={`${t("Dashboard.subtitle")}`}
                        i18n={i18n}
                        haveBtn={hasAddPermission}
                        btn={t("addItem", { item: translateText3 })}
                        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
                        onSubmit={addNavigate}
                        isExcel
                        isPdf
                        isPrinter
                        onExcel={() => fetchAndExport("excel")}
                        onPdf={() => fetchAndExport("pdf")}
                        onPrinter={() => fetchAndExport("print")}
                    />

                    <DashboardFilterComponent t={t} />


                    <TableComponent
                        columns={columns}
                        data={getDepartmentsByFather}
                        // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
                        loading={getDepartmentsByFatherLoading}
                        // isUsers={true}
                        statusKey="status"
                        // arPopulateKey={"title_ar"}
                        // enPopulateKey={"title_en"}
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            boxShadow: 1,
                            borderRadius: 1,
                            width: "100%",
                        }}
                        handleDetailsClick={handleDetailsClick}
                        onStatusChange={onStatusChange}
                    />
                </Grid>
            </Grid>

        </Box>
    )
}
