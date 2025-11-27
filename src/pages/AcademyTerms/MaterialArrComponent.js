import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import i18n from "../../i18n/i18n";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';


export default function MaterialArrComponent({rows,setRows}) {
    const theme = useTheme();
    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";


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
                        </TableRow>
                    </TableHead>

                    <TableBody sx={{
                        backgroundColor:
                            theme.palette.background?.secDefault || "#fafafa",
                    }}>
                        {rows?.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell sx={{
                                    whiteSpace: "nowrap",   // يمنع النزول لسطر جديد
                                }}>
                                    {row?.title_ar}
                                </TableCell>
                                <TableCell>
                                  {row?.title_en}
                                </TableCell>
                                <TableCell>
                                   {row?.fullmark_degree}
                                </TableCell>
                                <TableCell>
                                   {row?.success_degree}
                                </TableCell>
                                <TableCell>
                                  {row?.material_hours}
                                </TableCell>

                                {/* <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleDeleteRow(i)}
                                        color="error"
                                        sx={{ gap: "5px", padding: "5px" }}
                                    >
                                        <DeleteRoundedIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />
                                    </Button>
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* <Button
                variant="contained"
                onClick={handleAddRow}
                sx={{ my: 2, backgroundColor: theme.palette.info.main, gap: "5px", padding: "5px" }}
            >
                {t("Dashboard.addSubject")}

                <ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />
            </Button> */}
        </Box>
    )
}
