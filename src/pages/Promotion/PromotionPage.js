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
import { useEffect } from "react";
import { GET_ALL_FACULITIES, GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID } from "../../graphql/facultyQuiries";
import { GET_ACADEMY_TERMS_BY_FACULTY_DEPARTMENT_ID } from "../../graphql/AcademyTerms";
import { PREVIEW_PROMOTION } from "../../graphql/PromotionQueries";



export default function PromotionPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";

    const [filters, setFilters] = useState({
        faculty: "",
        department: "",
        type: "TERM_TO_TERM",
        period: "",
        source_study_year: ""
    });

    const [selectedFaculty, setSelectedFaculty] = useState(null);


    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    // Data Fetching
    const { data: facultiesData, loading: facultiesLoading } = useQuery(GET_ALL_FACULITIES);
    const [getDepartments, { data: departmentsData, loading: departmentsLoading }] = useLazyQuery(GET_ALL_DEPARTMENTS_IN_FACULTY_BY_ID);
    const [getTerms, { data: termsData, loading: termsLoading }] = useLazyQuery(GET_ACADEMY_TERMS_BY_FACULTY_DEPARTMENT_ID);
    const [getPreview, { data: previewData, loading: previewLoading, called }] = useLazyQuery(PREVIEW_PROMOTION, {
        onError: (err) => {
            notify(err.message, "error");
        }
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };
            if (name === "faculty") {
                const faculty = facultiesData?.faculties?.find(f => f.id === value);
                setSelectedFaculty(faculty);
                newFilters.department = "";
                newFilters.period = "";
                newFilters.source_study_year = "";
                getDepartments({ variables: { faculty_id: value } });
            }
            if (name === "department") {
                newFilters.period = "";
                getTerms({ variables: { faculty_department_id: value } });
            }
            if (name === "type") {
                newFilters.period = "";
                newFilters.source_study_year = "";
            }
            return newFilters;
        });
    };

    const handleResultClick = () => {
        if (!filters.faculty) return notify(t("Please select faculty"), "error");
        if (selectedFaculty?.required_dep !== false && !filters.department) return notify(t("Please select department"), "error");
        
        if (filters.type === "TERM_TO_TERM" && !filters.period) return notify(t("Please select promotion period"), "error");
        if (filters.type === "YEAR_TO_YEAR" && !filters.source_study_year) return notify(t("Please select study year"), "error");

        const input = {
            promotion_type: filters.type,
            faculty_department_id: selectedFaculty?.required_dep === false ? null : filters.department,
            source_academy_term_id: filters.type === "TERM_TO_TERM" ? filters.period : null,
            source_study_year: filters.type === "YEAR_TO_YEAR" ? filters.source_study_year : null
        };

        getPreview({ variables: { input } });
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
                                label={t("Department") + (selectedFaculty?.required_dep === false ? ` (${t("Optional")})` : "")}
                                name="department"
                                value={filters.department}
                                onChange={handleFilterChange}
                                size="small"
                                disabled={departmentsLoading || !filters.faculty}
                                error={selectedFaculty?.required_dep !== false && !filters.department && called}
                            >
                                <MenuItem value="">
                                    <em>{t("None")}</em>
                                </MenuItem>
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
                        {filters.type === "TERM_TO_TERM" ? (
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label={t("Promotion Period")}
                                    name="period"
                                    value={filters.period}
                                    onChange={handleFilterChange}
                                    size="small"
                                    disabled={termsLoading || (selectedFaculty?.required_dep !== false && !filters.department)}
                                >
                                    {termsData?.getAcademyTermsByFacultyDepartment?.map(t => (
                                        <MenuItem key={t.id} value={t.id}>
                                            {isArabic ? t.title_ar : t.title_en}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        ) : (
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label={t("Source Study Year")}
                                    name="source_study_year"
                                    value={filters.source_study_year}
                                    onChange={handleFilterChange}
                                    size="small"
                                    disabled={!filters.faculty}
                                >
                                    {Array.from({ length: parseInt(selectedFaculty?.study_years_count || 0) }, (_, i) => i + 1).map(year => (
                                        <MenuItem key={year} value={year.toString()}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ backgroundColor: "#22ABCE", "&:hover": { backgroundColor: "#1e96b5" } }}
                                onClick={handleResultClick}
                                disabled={previewLoading}
                            >
                                {previewLoading ? <CircularProgress size={24} color="inherit" /> : t("Result")}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {called && !previewLoading && previewData?.previewPromotion && (
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
                                    {previewData?.previewPromotion?.students?.map((student, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{student.student_id?.serial}</TableCell>
                                            <TableCell>{student.student_id?.fullname}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={t(student.status)}
                                                    color={student.status === "WILL_PROMOTE" ? "primary" : "warning"}
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
                                        value={previewData?.previewPromotion?.total_students > 0 ? (previewData?.previewPromotion?.will_promote_count / previewData?.previewPromotion?.total_students) * 100 : 0}
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
                                            {previewData?.previewPromotion?.total_students || 0}
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
                                        <Typography variant="h6">{previewData?.previewPromotion?.will_promote_count || 0}</Typography>
                                        <Typography variant="body2" color="textSecondary">{t("Success")}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                                    <Box sx={{ p: 1, backgroundColor: "#fff3e0", borderRadius: "50%", mr: 2 }}>
                                        <ErrorIcon sx={{ color: "#F39A15" }} />
                                    </Box>
                                    <Box sx={{ textAlign: isArabic ? "right" : "left", flex: 1 }}>
                                        <Typography variant="h6">{previewData?.previewPromotion?.will_fail_count || 0}</Typography>
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
                                    {selectedStudent?.failed_materials?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.title_en}</TableCell>
                                            <TableCell>{item.title_ar}</TableCell>
                                            <TableCell>{item.fullmark_degree}</TableCell>
                                            <TableCell>{item.success_degree}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={t(item.status ? "Success" : "Failed")}
                                                    color={item.status ? "primary" : "warning"}
                                                    size="small"
                                                    sx={{ borderRadius: "16px" }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!selectedStudent?.failed_materials || selectedStudent?.failed_materials?.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                {t("No Failed Materials")}
                                            </TableCell>
                                        </TableRow>
                                    )}
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
