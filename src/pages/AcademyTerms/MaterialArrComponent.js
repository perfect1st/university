import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import i18n from "../../i18n/i18n";
import ControlPointIcon from "@mui/icons-material/ControlPoint";


export default function MaterialArrComponent() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";

    const [rows, setRows] = useState([
        // {  title_ar: "Row 1", title_en: "Value 1", fullmark_degree: 100, success_degree: 50,material_hours:100 },
    ]);

    const handleAddRow = () => {
        const newRow = {
            title_ar: "",
            title_en: "",
            fullmark_degree: "",
            success_degree: "",
            material_hours: ""
        };
        setRows([...rows, newRow]);
    };

    return (
        <Box sx={{ my: 2, width: "100%", }}>


            <TableContainer sx={{
                width: "100%",
                [theme.breakpoints.down("sm")]: {
                    width: "100%", // 👈 للموبايل
                    overflow: "scroll"
                },
                maxWidth: "100%",
                overflowX: "auto", // ✅ لو الأعمدة كتيرة بيعمل scroll تلقائي


                whiteSpace: "nowrap" // يمنع تكسير الصفوف
            }} component={Paper}>
                <Table sx={{ overflowX: "auto" }}>
                    <TableHead
                        sx={{
                            backgroundColor:
                                theme.palette.primary?.tabelHeader || "#e0e0e0",
                        }}
                    >
                        <TableRow sx={{
                            whiteSpace: "nowrap",   // يمنع النزول لسطر جديد
                        }}>
                            <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>{t("studentDashboard.subjectTitleAr")}</TableCell>
                            <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>{t("studentDashboard.subjectTitleEn")}</TableCell>
                            <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>{t("studentDashboard.fullmarkDegree")}</TableCell>
                            <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>
                                {t("studentDashboard.successDegree")}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>
                                {t("studentDashboard.materialHours")}
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody sx={{
                        backgroundColor:
                            theme.palette.background?.secDefault || "#fafafa",
                    }}>
                        {rows.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell sx={{
                                    whiteSpace: "nowrap",   // يمنع النزول لسطر جديد
                                }}>
                                    <TextField
                                        // fullWidth
                                        // id={fieldID}
                                        // name={fieldName}
                                        placeholder={t("studentDashboard.subjectTitleAr")}
                                        value={row?.title_ar}
                                        // onChange={onChange}
                                        // error={error}
                                        // helperText={helperText}
                                        variant="outlined"
                                        sx={{ mb: 3, backgroundColor: theme.palette.background.inputBackGround, height: "56px" }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        // fullWidth
                                        // id={fieldID}
                                        // name={fieldName}
                                        placeholder={t("studentDashboard.subjectTitleEn")}
                                        value={row?.title_en}
                                        // onChange={onChange}
                                        // error={error}
                                        // helperText={helperText}
                                        variant="outlined"
                                        sx={{ mb: 3, backgroundColor: theme.palette.background.inputBackGround, height: "56px" }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        // fullWidth
                                        // id={fieldID}
                                        // name={fieldName}
                                        placeholder={t("studentDashboard.fullmarkDegree")}
                                        value={row?.fullmark_degree}
                                        // onChange={onChange}
                                        // error={error}
                                        // helperText={helperText}
                                        variant="outlined"
                                        sx={{ mb: 3, backgroundColor: theme.palette.background.inputBackGround, height: "56px" }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        // fullWidth
                                        // id={fieldID}
                                        // name={fieldName}
                                        placeholder={t("studentDashboard.successDegree")}
                                        value={row?.success_degree}
                                        // onChange={onChange}
                                        // error={error}
                                        // helperText={helperText}
                                        variant="outlined"
                                        sx={{ mb: 3, backgroundColor: theme.palette.background.inputBackGround, height: "56px" }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        // fullWidth
                                        // id={fieldID}
                                        // name={fieldName}
                                        placeholder={t("studentDashboard.materialHours")}
                                        value={row?.material_hours}
                                        // onChange={onChange}
                                        // error={error}
                                        // helperText={helperText}
                                        variant="outlined"
                                        sx={{ mb: 3, backgroundColor: theme.palette.background.inputBackGround, height: "56px" }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button
                variant="contained"
                onClick={handleAddRow}
                sx={{ my: 2, backgroundColor: theme.palette.info.main, gap: "5px", padding: "5px" }}
            >
                {t("Dashboard.addSubject")}

                <ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />
            </Button>
        </Box>
    )
}
