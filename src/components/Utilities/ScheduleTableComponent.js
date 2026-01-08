import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Button,
    Box,
    Typography
} from "@mui/material";
import i18n from "../../i18n/i18n";
import { days } from "../../constants";
import { useTranslation } from "react-i18next";
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation } from "@apollo/client/react";
import { DELETE_TIME_TABLE_BY_ID, GET_TIME_TABLES_BY_MAIN_TABLE_ID } from "../../graphql/TimeTableQueries";
import { useLocation } from "react-router-dom";


// const colors=["#e3f2fd","#f3e5f5","#e8f5e9"];


const staticRows = [
    {
        time: "08:00 - 09:00",
        sat: null,
        sun: { subject: "رياضيات متقطعة", teacher: "د. أحمد سلامة", color: "#e3f2fd" },
        mon: { subject: "فيزياء عامة", teacher: "د. سارة علي", color: "#f3e5f5" },
        tue: null,
        wed: { subject: "كيمياء عضوية", teacher: "د. محمد عمر",  color: "#e8f5e9" },
        thu: null,
        fri: null
    },
    {
        time: "09:00 - 10:00",
        sat: null,
        sun: { subject: "رياضيات متقطعة", teacher: "د. أحمد سلامة", color: "#e3f2fd" },
        mon: { subject: "فيزياء عامة", teacher: "د. سارة علي", color: "#f3e5f5" },
        tue: { subject: "أحياء دقيقة", teacher: "د. منى خالد", place: "معمل 2", color: "#fff3e0" },
        wed: null,
        thu: { subject: "لغة عربية", teacher: "أ. ماجد", place: "قاعة 3", color: "#ffebee" },
        fri: null
    },
    {
        time: "10:00 - 11:00",
        break: true
    },
    {
        time: "11:00 - 12:00",
        sat: null,
        sun: null,
        mon: { subject: "برمجة حاسب", teacher: "م. يوسف", place: "معمل 4", color: "#e0f7fa" },
        tue: { subject: "تاريخ حديث", teacher: "د. كريم", place: "قاعة 5", color: "#fff8e1" },
        wed: null,
        thu: { subject: "لياقة بدنية", teacher: "ك. حسن", place: "الملعب", color: "#e8eaf6" },
        fri: null
    }
];





export default function ScheduleTable({rows,canDelete=false}) {

    const isArabic = i18n.language === "ar";
    const { t } = useTranslation();
    const location = useLocation();

    // delete time table
        const [
          DeleteTimeTable
        ]=useMutation(DELETE_TIME_TABLE_BY_ID, {
          refetchQueries: [
            {
              query: GET_TIME_TABLES_BY_MAIN_TABLE_ID,   // أو أي query عايز تحدثها
              variables: {
                main_time_table_id: location?.state?.id
              }
            }
          ],
        });

    return (
        <TableContainer
            component={Paper}
            sx={{
                maxWidth: "100%",
                overflowX: "auto" // <-- responsive scroll للموبايل
            }}
        >
            <Table sx={{ minWidth: 800 }}>

                {/* Header */}
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                fontWeight: "bold",
                                position: "sticky",
                                right: 0,
                                background: "#f8f9fc",
                                zIndex: 2
                            }}
                        >
                            {t("time")}
                        </TableCell>

                        {days.map((day) => (
                            <TableCell
                                key={day.key}
                                sx={{
                                    fontWeight: "bold",
                                    position: "sticky",
                                    background: "#f8f9fc",
                                    zIndex: 2
                                }}
                            >
                                {isArabic ? day.labelAr : day.labelEn}
                            </TableCell>
                        ))}
                        
                    </TableRow>
                </TableHead>

                {/* Body */}
                <TableBody>
                    {
                        rows?.length === 0 ? <TableRow><TableCell colSpan={7}>
                             <Typography variant="h6" color="text.secondary" align="center">
                                        {t("noData")}
                            </Typography>
                            </TableCell></TableRow>
                        :
                        rows?.map((row, index) =>
                        row.break ? (
                            <TableRow key={index}>
                                <TableCell
                                    sx={{
                                        position: "sticky",
                                        right: 0,
                                        background: "#f1f5f9",
                                        zIndex: 1
                                    }}
                                >
                                    {`${row?.start_time} - ${row?.end_time}`}
                                </TableCell>
                                <TableCell colSpan={5} align="center">
                                    ☕ استراحة
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow key={index} hover>

                                {/* time column sticky */}
                                <TableCell
                                    sx={{
                                        position: "sticky",
                                        right: 0,
                                        background: "white",
                                        zIndex: 1
                                    }}
                                >
                                    {`${row?.start_time} - ${row?.end_time}`}
                                </TableCell>

                                {/* days */}
                               
                                {days?.map((day,i) => {

                                    // console.log('row["day"]',row);
                                    // console.log("day",day);
                                   return <TableCell key={i}>
                                        {row["day"]==day?.key ? (
                                            <Button
                                                fullWidth
                                                sx={{
                                                    flexDirection: "column",
                                                    minHeight: 64,
                                                    background: "#e7eefd"
                                                }}
                                                onClick={async() => {
                                                    if(!canDelete) return;
                                                     console.log("row to delete", row);

                                                     const confirm = window.confirm(t("Dashboard.confirm"));
                                                     if (confirm) {
                                                         console.log("bbbbbbbbbbbbbbbb");
                                                         await DeleteTimeTable({
                                                             variables: {
                                                                 id: row?.id
                                                             }
                                                         })
                                                     }
                                                    // console.log("day", day);
                                                    // console.log("row[day.key]", row[day.key]);
                                                }}
                                            >
                                                <Box fontSize={12} fontWeight={700}>
                                                    {
                                                        isArabic ? row?.material_id?.title_ar : row?.material_id?.title_en
                                                    }
                                                    {/* {row[day.key]?.title_ar} */}
                                                </Box>

                                                {/* اسم الدكتور */}
                                                <Box fontSize={10}>{row?.doctor_id?.fullname}</Box>

                                                {/* السكشن هنا */}
                                                <Box fontSize={10}>{row?.section}</Box>

                                                {/* <DeleteIcon /> */}
                                            </Button>
                                        ) : (
                                            <Box
                                                sx={{
                                                    border: "1px dashed #bbb",
                                                    minHeight: 64,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: 2,
                                                    cursor: "pointer"
                                                }}
                                            >
                                                +
                                            </Box>
                                        )}
                                    </TableCell>
})}

                            </TableRow>
                        )
                    )
                    }
                  
                </TableBody>
            </Table>
        </TableContainer>
    );
}
