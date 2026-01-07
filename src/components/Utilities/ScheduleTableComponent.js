import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Button,
    Box
} from "@mui/material";
import i18n from "../../i18n/i18n";
import { days } from "../../constants";


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





export default function ScheduleTable({rows}) {

    const isArabic = i18n.language === "ar";

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
                            الوقت
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
                    {rows?.map((row, index) =>
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
                                    {row?.time}
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
                                    {row?.time}
                                </TableCell>

                                {/* days */}
                               
                                {days?.map((day) => (
                                    <TableCell key={day?.key}>
                                        {row[day?.key] ? (
                                            <Button
                                                fullWidth
                                                sx={{
                                                    flexDirection: "column",
                                                    minHeight: 64,
                                                    background: row[day?.key]?.color
                                                }}
                                            >
                                                <Box fontSize={12} fontWeight={700}>
                                                    {row[day.key]?.title_ar}
                                                </Box>
                                                <Box fontSize={10}>{row[day.key]?.teacher?.fullname}</Box>
                                                <Box fontSize={10}>{row[day.key]?.place}</Box>
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
                                ))}

                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
