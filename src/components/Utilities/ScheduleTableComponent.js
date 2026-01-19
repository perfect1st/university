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
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import i18n from "../../i18n/i18n";
import { days } from "../../constants";
import { useTranslation } from "react-i18next";
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation } from "@apollo/client/react";
import { DELETE_TIME_TABLE_BY_ID, GET_TIME_TABLES_BY_MAIN_TABLE_ID } from "../../graphql/TimeTableQueries";
import { useLocation } from "react-router-dom";


// const colors=["#e3f2fd","#f3e5f5","#e8f5e9"];




const timeColStyle = {
//   position: "sticky",
  left: 0,
  background: "#fff",
  zIndex: 3,
  minWidth: 110,
  width: 110,
  boxShadow: "2px 0 4px rgba(0,0,0,0.05)",
};




export default function ScheduleTable({ rows, canDelete = false }) {

    const isArabic = i18n.language === "ar";
    const theme = useTheme();
    const { t } = useTranslation();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // delete time table
    const [
        DeleteTimeTable
    ] = useMutation(DELETE_TIME_TABLE_BY_ID, {
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
                maxWidth: isMobile ? "80vw" : "100%",
    overflowX: "auto",
            }}
        >
            <Table
             sx={{
    minWidth: "max-content",
    tableLayout: "auto",
  }}
            >

                {/* Header */}
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{ ...timeColStyle, background: "#f8f9fc", zIndex: 4 }}
                        >
                            {t("time")}
                        </TableCell>

                        {days.map((day) => (
                            <TableCell
                                key={day.key}
                                sx={{
                                    fontWeight: "bold",
                                    // position: "sticky",
                                    background: "#f8f9fc",
                                    zIndex: 2,
                                    // right: 0
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
                                             sx={timeColStyle}
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
                                                // position: "sticky",
                                                // right: 0,
                                                background: "white",
                                                zIndex: 1
                                            }}
                                        >
                                            {`${row?.start_time} - ${row?.end_time}`}
                                        </TableCell>

                                        {/* days */}

                                        {days?.map((day, i) => {
                                            let foundDay = row?.items?.find(el => el?.day == day?.key);

                                            // console.log('foundDay',foundDay);
                                            // console.log("day",day);

                                            return <TableCell
                                                key={i}
                                                sx={{
                                                    // position: "sticky",
                                                    // right: 0,
                                                    background: "white",
                                                    zIndex: 1
                                                }}
                                            >
                                                {foundDay ? (
                                                    <Button
                                                        fullWidth
                                                        sx={{
                                                            flexDirection: "column",
                                                            minHeight: 64,
                                                            background: "#e7eefd"
                                                        }}
                                                        onClick={async () => {
                                                            if (!canDelete) return;
                                                            console.log("row to delete", row);

                                                            const confirm = window.confirm(t("Dashboard.confirm"));
                                                            if (confirm) {
                                                                console.log("bbbbbbbbbbbbbbbb");
                                                                await DeleteTimeTable({
                                                                    variables: {
                                                                        id: foundDay?.id
                                                                    }
                                                                })
                                                            }
                                                            // console.log("day", day);
                                                            // console.log("row[day.key]", row[day.key]);
                                                        }}
                                                    >
                                                        <Box fontSize={12} fontWeight={700}>
                                                            {
                                                                isArabic ? foundDay?.material_id?.title_ar : foundDay?.material_id?.title_en
                                                            }
                                                            {/* {row[day.key]?.title_ar} */}
                                                        </Box>

                                                        {/* اسم الدكتور */}
                                                        <Box fontSize={10}>{foundDay?.doctor_id?.fullname}</Box>

                                                        {/* السكشن هنا */}
                                                        {/* <Box fontSize={10}>{foundDay?.section}</Box> */}

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
