import LoadingPage from "../../components/LoadingComponent";
import { useTheme } from "@emotion/react";
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import { useState, Fragment } from "react";
import Header from "../../components/PageHeader/header";
import { GET_STUDENT_DEGRESS_BY_STUDENT_ID } from "../../graphql/studentDegreeQueries";
import logger from "../../utils/logger";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { examTypes } from "../../constants";
import notify from "../../components/notify";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import html2pdf from "html2pdf.js";
import logo from "../../assets/Logo.png";

function SubjectGroup({ subject, isArabic, t, studentSerial }) {
    const [open, setOpen] = useState(true);
    const theme = useTheme();

    return (
        <Fragment>
            <TableRow
                sx={{
                    backgroundColor: "#F5F7FA",
                    cursor: "pointer",
                    "& > *": { borderBottom: "unset" },
                }}
                onClick={() => setOpen(!open)}
            >
                <TableCell align="center">
                    <IconButton size="small">
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell colSpan={2} sx={{ fontWeight: "bold", color: "text.secondary", textAlign: "start" }}>
                    {t("Dashboard.subjectName")}: {isArabic ? subject.material_id?.title_ar : subject.material_id?.title_en}
                </TableCell>
                <TableCell colSpan={4}></TableCell>
                <TableCell align="center">
                    <IconButton size="small">
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 0 }}>
                            <Table size="small" aria-label="exams">
                                <TableBody>
                                    {subject.exams?.map((exam, index) => (
                                        <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell sx={{ width: "8%", textAlign: "center" }}>#{exam.exam_id?.serial || studentSerial || "---"}</TableCell>
                                            <TableCell sx={{ width: "15%", textAlign: "center" }}>{exam.exam_id?.exam_name}</TableCell>
                                            <TableCell sx={{ width: "15%", textAlign: "center" }}>
                                                {isArabic
                                                    ? examTypes.find((el) => el.id === exam.exam_id?.exam_type)?.labelAr
                                                    : examTypes.find((el) => el.id === exam.exam_id?.exam_type)?.labelEn}
                                            </TableCell>
                                            <TableCell sx={{ width: "10%", textAlign: "center" }}>
                                                {exam.exam_attendance ? (
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                ) : (
                                                    <CheckCircleIcon sx={{ color: "#E0E0E0" }} fontSize="small" />
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ width: "12%", textAlign: "center" }}>{exam.full_mark}</TableCell>
                                            <TableCell sx={{ width: "12%", textAlign: "center" }}>{exam.student_degree}</TableCell>
                                            <TableCell sx={{ width: "12%", textAlign: "center" }}>{exam.lecture_attendance}</TableCell>
                                            <TableCell sx={{ width: "12%", textAlign: "center" }}>{exam.total_exam_degree}</TableCell>
                                        </TableRow>
                                    ))}
                                    {/* Totals Row */}
                                    <TableRow sx={{ backgroundColor: "#E3EBF6" }}>
                                        <TableCell colSpan={4} sx={{ fontWeight: "bold", textAlign: "center" }}>
                                            {t("Dashboard.totalDegree")}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                                            {subject.totals?.total_full_mark}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                                            {subject.totals?.total_student_degree}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                                            {subject.totals?.total_lecture_attendance}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                                            {subject.totals?.total_exam_degree}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

export default function AllDegreesForStudentPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const { id } = useParams();
    const location = useLocation();

    const isArabic = i18n.language === "ar";

    const {
        data: {
            studentDegreeByStudent
        } = {},
        loading
    } = useQuery(GET_STUDENT_DEGRESS_BY_STUDENT_ID,
        {
            variables: { student_id: id },
            fetchPolicy: "network-only",
        }
    );

    if (loading) return <LoadingPage />;

    const fetchAndExport = async (type) => {
        try {
            if (!studentDegreeByStudent || studentDegreeByStudent.length === 0) {
                notify(isArabic ? "لا توجد بيانات للطباعة" : "No data to export", "error");
                return;
            }

            let studentName = location?.state?.name;
            let localUser = {};
            try {
                localUser = JSON.parse(localStorage.getItem("user") || "{}");
                if (!studentName) studentName = localUser?.fullname || "---";
            } catch (e) {
                if (!studentName) studentName = "---";
            }

            if (type === "print" || type === "pdf") {
                const reportTitle = isArabic ? "كشف درجات الطالب" : "Student Transcript";
                
                let htmlContent = `
                    <div style="font-family:Tahoma, Arial, sans-serif; direction:${isArabic ? "rtl" : "ltr"}; padding:20px; color: #333;">
                        <div style="text-align:center; margin-bottom: 20px;">
                            <img src="${logo}" alt="Logo" style="max-height: 80px; margin-bottom: 10px;" />
                            <h2 style="margin: 0; color: #1a237e;">${reportTitle}</h2>
                        </div>
                        
                        <div style="margin-bottom: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e0e0e0;">
                            <h3 style="margin: 0 0 10px 0; color: #1a237e; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;">
                                ${isArabic ? "بيانات الطالب" : "Student Details"}
                            </h3>
                            <table style="width: 100%; border: none; font-size: 15px;">
                                <tr>
                                    <td style="padding: 5px; font-weight: bold; width: 150px; color: #555;">${t("Dashboard.studentName")}:</td>
                                    <td style="padding: 5px; font-weight: bold;">${studentName}</td>
                                    <td style="padding: 5px; font-weight: bold; width: 100px; color: #555;">${t("profile.Email") || "Email"}:</td>
                                    <td style="padding: 5px;">${localUser?.email || "---"}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px; font-weight: bold; color: #555;">ID (Serial):</td>
                                    <td style="padding: 5px;">${localUser?.serial || location?.state?.serial || "---"}</td>
                                    <td style="padding: 5px; font-weight: bold; color: #555;">${t("profile.Mobile") || "Mobile"}:</td>
                                    <td style="padding: 5px;">${localUser?.mobile || "---"}</td>
                                </tr>
                            </table>
                        </div>
                `;

                studentDegreeByStudent.forEach((subject) => {
                    const subjectName = isArabic ? subject.material_id?.title_ar : subject.material_id?.title_en;
                    htmlContent += `
                        <div style="margin-bottom: 25px; break-inside: avoid;">
                            <h4 style="margin: 0 0 10px 0; background-color: #e8eaf6; padding: 10px; border-radius: 4px; color: #1a237e; border-${isArabic ? 'right' : 'left'}: 4px solid #3f51b5;">
                                ${t("Dashboard.subjectName")}: ${subjectName}
                            </h4>
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 14px;">
                                <thead>
                                    <tr style="background-color: #f5f5f5;">
                                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">${t("Dashboard.examName")}</th>
                                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">${t("Dashboard.examType")}</th>
                                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">${t("Dashboard.examAttendance")}</th>
                                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">${t("studentDashboard.fullmarkDegree")}</th>
                                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">${t("Dashboard.studentDegree")}</th>
                                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">${t("Dashboard.lectureAttendance")}</th>
                                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">${t("Dashboard.totalExamDegree")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                    `;

                    subject.exams?.forEach((exam) => {
                        const examType = isArabic 
                            ? examTypes.find((el) => el.id === exam.exam_id?.exam_type)?.labelAr 
                            : examTypes.find((el) => el.id === exam.exam_id?.exam_type)?.labelEn;
                        const attendance = exam.exam_attendance ? t("yes") : t("no");

                        htmlContent += `
                                    <tr>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${exam.exam_id?.exam_name || "-"}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${examType || "-"}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${attendance}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${exam.full_mark || 0}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">${exam.student_degree || 0}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${exam.lecture_attendance || 0}</td>
                                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: #1a237e;">${exam.total_exam_degree || 0}</td>
                                    </tr>
                        `;
                    });

                    // Totals Row
                    htmlContent += `
                                    <tr style="background-color: #fdfdfd; font-weight: bold;">
                                        <td colspan="3" style="border: 1px solid #ddd; padding: 10px; text-align: center; color: #d32f2f;">${t("Dashboard.totalDegree")}</td>
                                        <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${subject.totals?.total_full_mark || 0}</td>
                                        <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${subject.totals?.total_student_degree || 0}</td>
                                        <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${subject.totals?.total_lecture_attendance || 0}</td>
                                        <td style="border: 1px solid #ddd; padding: 10px; text-align: center; color: #d32f2f;">${subject.totals?.total_exam_degree || 0}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `;
                });

                htmlContent += `</div>`;

                if (type === "print") {
                    const printableWindow = window.open("", "_blank");
                    printableWindow.document.write(`
                        <html>
                            <head>
                                <meta charset="UTF-8" />
                                <title>${reportTitle}</title>
                                <style>
                                    @media print {
                                        body { -webkit-print-color-adjust: exact; }
                                    }
                                </style>
                            </head>
                            <body>${htmlContent}</body>
                        </html>
                    `);
                    printableWindow.document.close();
                    setTimeout(() => {
                        printableWindow.print();
                    }, 500);
                    return;
                } else if (type === "pdf") {
                    const element = document.createElement('div');
                    element.innerHTML = htmlContent;
                    html2pdf()
                        .set({
                            margin: 10,
                            filename: `${reportTitle}_${new Date().toISOString()}.pdf`,
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                        })
                        .from(element)
                        .save();
                    return;
                }
            }

            // Fallback for Excel
            const exportData = [];
            
            studentDegreeByStudent.forEach((subject) => {
                const subjectName = isArabic ? subject.material_id?.title_ar : subject.material_id?.title_en;
                
                subject.exams?.forEach((exam) => {
                    exportData.push({
                        [t("Dashboard.studentName")]: studentName,
                        [t("Dashboard.subjectName")]: subjectName,
                        [t("Dashboard.examName")]: exam.exam_id?.exam_name,
                        [t("Dashboard.examType")]: isArabic 
                            ? examTypes.find((el) => el.id === exam.exam_id?.exam_type)?.labelAr 
                            : examTypes.find((el) => el.id === exam.exam_id?.exam_type)?.labelEn,
                        [t("Dashboard.examAttendance")]: exam.exam_attendance ? t("yes") : t("no"),
                        [t("studentDashboard.fullmarkDegree")]: exam.full_mark,
                        [t("Dashboard.studentDegree")]: exam.student_degree,
                        [t("Dashboard.lectureAttendance")]: exam.lecture_attendance,
                        [t("Dashboard.totalExamDegree")]: exam.total_exam_degree,
                    });
                });
            });

            ExportExcelAndPDF({
                exportData,
                isArabic,
                reportTitle: isArabic ? "درجات الطالب" : "Student Degrees",
                type
            });
        } catch (err) {
            logger.error("Export error:", err);
        }
    };

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Header
                        title={t("Dashboard.studentTotalDegree")}
                        subtitle={location?.state?.name || t("Dashboard.studentDegree")}
                        i18n={i18n}
                        haveBtn={false}
                        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
                        isExcel
                        isPdf
                        isPrinter
                        hasNavigate={true}
                        onExcel={() => fetchAndExport("excel")}
                        onPdf={() => fetchAndExport("pdf")}
                        onPrinter={() => fetchAndExport("print")}
                    />

                    <Box sx={{ mt: 5 }}>
                        {/* <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                            <span style={{ color: theme.palette.primary.main }}>{t("Dashboard.studentName")}:</span>
                            {location?.state?.name || "---"}
                        </Typography>
                         */}
                        <TableContainer component={Paper} sx={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", borderRadius: 2 }}>
                            <Table stickyHeader aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ backgroundColor: "#CCD8E7", color: "text.primary", fontWeight: "bold", textAlign: "center", width: "10%" }}>
                                            ID (Serial)
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#CCD8E7", color: "text.primary", fontWeight: "bold", textAlign: "center", width: "15%" }}>
                                            {t("Dashboard.examName")}
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#CCD8E7", color: "text.primary", fontWeight: "bold", textAlign: "center", width: "15%" }}>
                                            {t("Dashboard.examType")}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                backgroundColor: "#CCD8E7",
                                                color: "text.primary",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                width: "12%"
                                            }}
                                        >
                                            {t("Dashboard.examAttendance")}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                backgroundColor: "#CCD8E7",
                                                color: "text.primary",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                width: "12%"
                                            }}
                                        >
                                            {t("studentDashboard.fullmarkDegree")}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                backgroundColor: "#CCD8E7",
                                                color: "text.primary",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                width: "12%"
                                            }}
                                        >
                                            {t("Dashboard.studentDegree")}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                backgroundColor: "#CCD8E7",
                                                color: "text.primary",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                width: "12%"
                                            }}
                                        >
                                            {t("Dashboard.lectureAttendance")}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                backgroundColor: "#CCD8E7",
                                                color: "text.primary",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                width: "12%"
                                            }}
                                        >
                                            {t("Dashboard.totalExamDegree")}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {studentDegreeByStudent?.map((subject, subIndex) => (
                                        <SubjectGroup
                                            key={subIndex}
                                            subject={subject}
                                            isArabic={isArabic}
                                            t={t}
                                            studentSerial={location?.state?.serial} // Depending on if it's passed
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {(!studentDegreeByStudent || studentDegreeByStudent.length === 0) && (
                        <Box sx={{ mt: 3, textAlign: "center", p: 3 }}>
                            <Typography color="text.secondary">{t("dataNotFound")}</Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
