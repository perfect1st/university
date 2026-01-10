import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useTheme,
    useMediaQuery,
    Typography
} from "@mui/material";
import i18n from "../../i18n/i18n";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";


// const rows = [
//   { id: 1, name: "Ahmed", age: 25 },
//   { id: 2, name: "Sara", age: 30 },
//   { id: 3, name: "Ali", age: 22 }
// ];

export default function ToDayTimeTableComponent({ rows=[],canEdit=false }) {

    const isArabic = i18n.language === "ar";
    const theme = useTheme();
    const { t } = useTranslation();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t("from")}</TableCell>
                        <TableCell>{t("to")}</TableCell>
                        <TableCell>{t("studentDashboard.section")}</TableCell>
                        <TableCell>{t("Status")}</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        rows?.length == 0 ? <TableRow><TableCell colSpan={7}>
                            <Typography variant="h6" color="text.secondary" align="center">
                                                                    {t("noData")}
                                                        </Typography>
                            </TableCell></TableRow>
                            :
                            rows?.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{row?.start_time}</TableCell>
                                    <TableCell>{row?.end_time}</TableCell>
                                    <TableCell>{row?.section}</TableCell>
                                    <TableCell>{t(`lectures.${row?.lecture_status}`)}</TableCell>
                                </TableRow>
                            ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
