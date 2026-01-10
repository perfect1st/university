import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, Typography, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useEffect, useRef } from "react";

import { useSelector } from "react-redux";
import { GET_TIME_TABLE_BY_DOCTOR_ID, TODAY_TIME_TABLE } from "../../../graphql/TimeTableQueries";
import i18n from "../../../i18n/i18n";
import LoadingPage from "../../../components/LoadingComponent";
import Header from "../../../components/PageHeader/header";
import ScheduleTable from "../../../components/Utilities/ScheduleTableComponent";
import ToDayTimeTableComponent from "../../../components/Utilities/ToDayTimeTableComponent";

export default function DoctorLecturesPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams();
    const isArabic = i18n.language === "ar";

    const me = useSelector(state => state.user.loggedUser);
    const [
        TimeTablesByDoctor,
        {
            data: { timeTablesByDoctor } = {},
            loading: getTimeTableLoading,

        }
    ] = useLazyQuery(GET_TIME_TABLE_BY_DOCTOR_ID, { fetchPolicy: "network-only" });

    const [
        TodayTimeTable,
        {
            data: { todayTimeTable } = {},
            loading: getTodayTimeTableLoading
        }
    ] = useLazyQuery(TODAY_TIME_TABLE, { fetchPolicy: "network-only" });

    

    useEffect(() => {
        if (me?.id) {
            // console.log('meeeee', me?.id);
            const date = new Date();
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

            console.log("dayName",dayName);
            TimeTablesByDoctor({ variables: { doctor_id: me?.id } });
            TodayTimeTable({ variables: { doctor_id: me?.id,day:dayName } });
            // data({variables:{doctor_id:me?.id}});
        }
    }, [me]);

    const groupedTimeTablesByMainTimeTable =
        timeTablesByDoctor?.reduce((acc, item) => {
            // هل في جروب نفس البداية والنهاية؟
            const existingGroup = acc.find(
                (g) =>
                    g.start_time === item.start_time &&
                    g.end_time === item.end_time
            );

            if (existingGroup) {
                // ضيف العنصر للجروب القديم
                existingGroup.items.push(item);
            } else {
                // اعمل جروب جديد
                acc.push({
                    start_time: item.start_time,
                    end_time: item.end_time,
                    items: [item]
                });
            }

            return acc;
        }, []);

    console.log("me", me);
    console.log("timeTablesByDoctor", timeTablesByDoctor);
    console.log("todayTimeTable",todayTimeTable);

    if (getTimeTableLoading || getTodayTimeTableLoading) return <LoadingPage />
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Grid container>
                <Grid item
                    sm={12} md={12}
                    sx={{

                    }}
                >
                    <Header
                        title={t("Dashboard.LecturesSchedule")}
                        subtitle={`${t("Dashboard.LecturesSchedule")}`}
                        i18n={i18n}
                        haveBtn={false}
                        // btn={t("addItem", { item: translateText })}
                        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
                        // onSubmit={addNavigate}
                        isExcel
                        isPdf
                        isPrinter
                    // onExcel={() => fetchAndExport("excel")}
                    // onPdf={() => fetchAndExport("pdf")}
                    // onPrinter={() => fetchAndExport("print")}
                    />

                    <ScheduleTable rows={groupedTimeTablesByMainTimeTable} canDelete={false} />

                    <Box display="flex" width={isMobile ? "55%" : "100%"} flexDirection="column" gap={3} py={3} borderTop="1px solid #cfd7e7">
                        {/* Title */}
                        <Box display="flex" gap={1}>
                            <Typography variant="h6" fontWeight={700}>
                                {t("Dashboard.toDayLectures")}
                            </Typography>

                        </Box>

                        <ToDayTimeTableComponent rows={todayTimeTable} canEdit={true} />
                    </Box>



                </Grid>
            </Grid>
        </Box>

    )
}
