import { useTheme } from "@emotion/react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    IconButton
} from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import Header from "../../components/PageHeader/header";
import { useState } from "react";
import notify from "../../components/notify";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { GET_ALL_FACULITIES, GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID } from "../../graphql/facultyQuiries";
import { GET_ACADEMY_TERMS_BY_FACULTY_DEPARTMENT_ID } from "../../graphql/AcademyTerms";
import { useEffect } from "react";

// Dummy Data
const dummyStudents = [
    { id: "#72641", name: "Emma Davis", status: "Success", totalDegree: 90 },
    { id: "#72642", name: "Emma Davis", status: "Failed", totalDegree: 45 },
    { id: "#72643", name: "Emma Davis", status: "Success", totalDegree: 85 },
    { id: "#72644", name: "Emma Davis", status: "Success", totalDegree: 78 },
    { id: "#72645", name: "Emma Davis", status: "Success", totalDegree: 92 },
    { id: "#72646", name: "Emma Davis", status: "Failed", totalDegree: 30 },
];

const dummyStudentDetails = [
    { titleEn: "General Surgery", titleAr: "الجراحة العامة", fullmark: 100, degree: 80, status: "Success" },
    { titleEn: "General Surgery", titleAr: "الجراحة العامة", fullmark: 100, degree: 75, status: "Success" },
    { titleEn: "General Surgery", titleAr: "الجراحة العامة", fullmark: 100, degree: 40, status: "Failed" },
    { titleEn: "General Surgery", titleAr: "الجراحة العامة", fullmark: 100, degree: 60, status: "Success" },
    { titleEn: "General Surgery", titleAr: "الجراحة العامة", fullmark: 100, degree: 85, status: "Success" },
    { titleEn: "General Surgery", titleAr: "الجراحة العامة", fullmark: 100, degree: 90, status: "Success" },
];

export default function PromotionPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";

    const [filters, setFilters] = useState({
        faculty: "",
        department: "",
        type: "TERM_TO_TERM",
        period: ""
    });

    const [showData, setShowData] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Data Fetching
    const { data: facultiesData, loading: facultiesLoading } = useQuery(GET_ALL_FACULITIES);
    const [getDepartments, { data: departmentsData, loading: departmentsLoading }] = useLazyQuery(GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID);
    const [getTerms, { data: termsData, loading: termsLoading }] = useLazyQuery(GET_ACADEMY_TERMS_BY_FACULTY_DEPARTMENT_ID);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };
            if (name === "faculty") {
                newFilters.department = "";
                newFilters.period = "";
                getDepartments({ variables: { faculty_id: value } });
            }
            if (name === "department") {
                newFilters.period = "";
                getTerms({ variables: { faculty_department_id: value } });
            }
            return newFilters;
        });
    };

    const handleResultClick = () => {
        setLoading(true);
        setTimeout(() => {
            setShowData(true);
            setLoading(false);
        }, 800);
    };

    const handleUpgradeAll = () => {
        setOpenConfirm(true);
    };

    const confirmUpgrade = () => {
        setOpenConfirm(false);
        notify(t("success"), "success");
    };

    const handleShowDetails = (student) => {
        setSelectedStudent(student);
        setOpenDialog(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Header
                title={t("Promotion")}
                subtitle={t("Promotion")}
                i18n={i18n}
                haveBtn={true}
                btn={t("Upgrade All")}
                onSubmit={handleUpgradeAll}
                isExcel
                isPdf
                isPrinter
            />

            <Card sx={{ mt: 2, mb: 4, borderRadius: 2 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label={t("Faculties")}
                                name="faculty"
                                value={filters.faculty}
                                onChange={handleFilterChange}
                                size="small"
                                disabled={facultiesLoading}
                            >
                                {facultiesData?.faculties?.map(f => (
                                    <MenuItem key={f.id} value={f.id}>
                                        {isArabic ? f.title_ar : f.title_en}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label={t("Department")}
                                name="department"
                                value={filters.department}
                                onChange={handleFilterChange}
                                size="small"
                                disabled={departmentsLoading || !filters.faculty}
                            >
                                {departmentsData?.getFacultyDepartmentsByFaculty?.map(d => (
                                    <MenuItem key={d.id} value={d.id}>
                                        {isArabic ? d.title_ar : d.title_en}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label={t("Promotion Type")}
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                size="small"
                            >
                                <MenuItem value="TERM_TO_TERM">{t("TERM_TO_TERM")}</MenuItem>
                                <MenuItem value="YEAR_TO_YEAR">{t("YEAR_TO_YEAR")}</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label={t("Promotion Period")}
                                name="period"
                                value={filters.period}
                                onChange={handleFilterChange}
                                size="small"
                                disabled={termsLoading || !filters.department}
                            >
                                {termsData?.getAcademyTermsByFacultyDepartment?.map(t => (
                                    <MenuItem key={t.id} value={t.id}>
                                        {isArabic ? t.title_ar : t.title_en}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ backgroundColor: "#22ABCE", "&:hover": { backgroundColor: "#1e96b5" } }}
                                onClick={handleResultClick}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : t("Result")}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {showData && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>{t("Student Name")}</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>{t("Student Status")}</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: "bold" }}>{t("Action")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dummyStudents.map((student, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{student.id}</TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={t(student.status)}
                                                    color={student.status === "Success" ? "primary" : "warning"}
                                                    size="small"
                                                    sx={{ borderRadius: "16px", minWidth: 80 }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{ backgroundColor: "#22ABCE", borderRadius: "16px" }}
                                                    onClick={() => handleShowDetails(student)}
                                                >
                                                    {t("The Student's Total Degree")}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardContent sx={{ textAlign: "center" }}>
                                <Box sx={{ position: "relative", display: "inline-flex", mb: 3 }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={75}
                                        size={180}
                                        thickness={8}
                                        sx={{ color: "#F39A15" }}
                                    />
                                    <Box
                                        sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: "absolute",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                                            1,691
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Students
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", mb: 2, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                                    <Box sx={{ p: 1, backgroundColor: "#e3f2fd", borderRadius: "50%", mr: 2 }}>
                                        <CheckCircleIcon color="primary" />
                                    </Box>
                                    <Box sx={{ textAlign: isArabic ? "right" : "left", flex: 1 }}>
                                        <Typography variant="h6">1,235</Typography>
                                        <Typography variant="body2" color="textSecondary">{t("Success")}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                                    <Box sx={{ p: 1, backgroundColor: "#fff3e0", borderRadius: "50%", mr: 2 }}>
                                        <ErrorIcon sx={{ color: "#F39A15" }} />
                                    </Box>
                                    <Box sx={{ textAlign: isArabic ? "right" : "left", flex: 1 }}>
                                        <Typography variant="h6">456</Typography>
                                        <Typography variant="body2" color="textSecondary">{t("Failed")}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Student Details Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
                    <Typography variant="h6" sx={{ color: "#095690", fontWeight: "bold" }}>
                        {t("The Student's Total Degree")}
                    </Typography>
                    <IconButton onClick={() => setOpenDialog(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <TableContainer component={Box}>
                        <Table>
                            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>Subjects Title EN</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Subjects Title AR</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Fullmark Degree</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Student Degree</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Student Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dummyStudentDetails.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.titleEn}</TableCell>
                                        <TableCell>{item.titleAr}</TableCell>
                                        <TableCell>{item.fullmark}</TableCell>
                                        <TableCell>{item.degree}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={t(item.status)}
                                                color={item.status === "Success" ? "primary" : "warning"}
                                                size="small"
                                                sx={{ borderRadius: "16px" }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>

            {/* Confirm Upgrade Dialog */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>{t("Upgrade All")}</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to upgrade all successful students?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)} color="inherit">
                        {t("Cancel")}
                    </Button>
                    <Button onClick={confirmUpgrade} variant="contained" color="primary">
                        {t("submit")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
