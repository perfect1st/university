import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
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
import { GET_TIME_TABLE_BY_DOCTOR_ID } from "../../../graphql/TimeTableQueries";
import i18n from "../../../i18n/i18n";
import LoadingPage from "../../../components/LoadingComponent";
import Header from "../../../components/PageHeader/header";
import ScheduleTable from "../../../components/Utilities/ScheduleTableComponent";

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

    useEffect(() => {
        if (me?.id) {
            // console.log('meeeee', me?.id);
            TimeTablesByDoctor({ variables: { doctor_id: me?.id } });
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
    console.log("timeTablesByDoctor",timeTablesByDoctor);

    if (getTimeTableLoading) return <LoadingPage />
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Grid container spacing={3}>
                <Grid item
                    sm={12} md={12}
                    sx={{
                        overflowX: "auto", // ✅ مهم جدًا عشان الجدول يعمل scroll داخل الـ Grid
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
                </Grid>
            </Grid>
        </Box>

    )
}
