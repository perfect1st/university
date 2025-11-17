import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import i18n from "../../i18n/i18n";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';


export default function MaterialArrComponent() {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";

    const [rows, setRows] = useState([]);

    const onInputChange = (e, index) => {
        console.log('eeee', e.target.value, index, e.target.name);

        let key = e.target.name;
        let newRows = rows?.map(el => {
            if (el?.index == index) {

                return {
                    ...el,
                    [key]: e.target.value
                }
            }
            else {
                return el;
            }

        });;

        setRows(newRows);
    }

    console.log('rows', rows);

    const handleAddRow = () => {
        const newRow = {
            index: rows?.length,
            title_ar: "",
            title_en: "",
            fullmark_degree: "",
            success_degree: "",
            material_hours: ""
        };
        setRows([...rows, newRow]);
    };

    const handleDeleteRow = (index) => {
        console.log('index', index);
        let newRows = rows?.filter(el => el?.index != index);

        // ظبط ال index
        newRows = newRows?.map((el, i) => {
            return {
                ...el,
                index: i
            }
        })

        setRows(newRows);
    }

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
                            <TableCell sx={{ fontWeight: 700, textAlign: "start" }}>

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
                                        id={"title_ar"}
                                        name={"title_ar"}
                                        placeholder={t("studentDashboard.subjectTitleAr")}
                                        value={row?.title_ar}
                                        onChange={(e) => onInputChange(e, i)}
                                        // error={error}
                                        // helperText={helperText}
                                        variant="outlined"
                                        sx={{ mb: 3, backgroundColor: theme.palette.background.inputBackGround }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField

                                        id={"title_en"}
                                        name={"title_en"}
                                        placeholder={t("studentDashboard.subjectTitleEn")}
                                        value={row?.title_en}
                                        onChange={(e) => onInputChange(e, i)}
                                        // error={error}
                                        // helperText={helperText}
                                        variant="outlined"
                                        sx={{ mb: 3, backgroundColor: theme.palette.background.inputBackGround }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        id={"fullmark_degree"}
                                        name={"fullmark_degree"}
                                        placeholder={t("studentDashboard.fullmarkDegree")}
                                        value={row?.fullmark_degree}
                                        onChange={(e) => onInputChange(e, i)}
                                        onKeyDown={(e) => {
                                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                e.preventDefault();   // يمنع الزيادة/النقصان
                                            }
                                        }}
                                      
                                        variant="outlined"

                                        inputProps={{
                                            inputMode: "numeric",
                                            pattern: "[0-9]*",
                                        }}
                                        sx={{
                                            mb: 3, backgroundColor: theme.palette.background.inputBackGround,
                                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                                display: "none",
                                            },
                                            "& input[type=number]": {
                                                MozAppearance: "textfield",
                                            },
                                        }}

                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        id={"success_degree"}
                                        name={"success_degree"}
                                        placeholder={t("studentDashboard.successDegree")}
                                        value={row?.success_degree}
                                        onChange={(e) => onInputChange(e, i)}
                                        onKeyDown={(e) => {
                                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                e.preventDefault();   // يمنع الزيادة/النقصان
                                            }
                                        }}
                                      
                                        inputProps={{
                                            inputMode: "numeric",
                                            pattern: "[0-9]*",
                                        }}
                                        sx={{
                                            mb: 3, backgroundColor: theme.palette.background.inputBackGround,
                                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                                display: "none",
                                            },
                                            "& input[type=number]": {
                                                MozAppearance: "textfield",
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField

                                        type="number"
                                        id={"material_hours"}
                                        name={"material_hours"}
                                        placeholder={t("studentDashboard.materialHours")}
                                        value={row?.material_hours}
                                        onChange={(e) => onInputChange(e, i)}
                                        inputProps={{
                                            inputMode: "numeric",
                                            pattern: "[0-9]*",
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                e.preventDefault();   // يمنع الزيادة/النقصان
                                            }
                                        }}
                                        sx={{
                                            mb: 3, backgroundColor: theme.palette.background.inputBackGround,
                                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                                display: "none",
                                            },
                                            "& input[type=number]": {
                                                MozAppearance: "textfield",
                                            },
                                        }}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleDeleteRow(i)}
                                        color="error"
                                        sx={{ gap: "5px", padding: "5px" }}
                                    >
                                        <DeleteRoundedIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />
                                    </Button>
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
