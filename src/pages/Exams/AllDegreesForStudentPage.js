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
