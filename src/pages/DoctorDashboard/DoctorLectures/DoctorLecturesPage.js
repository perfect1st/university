import { useTheme } from "@emotion/react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import {
  GET_TIME_TABLE_BY_DOCTOR_ID,
  TODAY_TIME_TABLE,
} from "../../../graphql/TimeTableQueries";
import i18n from "../../../i18n/i18n";
import LoadingPage from "../../../components/LoadingComponent";
import Header from "../../../components/PageHeader/header";
import ScheduleTable from "../../../components/Utilities/ScheduleTableComponent";
import ToDayTimeTableComponent from "../../../components/Utilities/ToDayTimeTableComponent";
import logger from "../../../utils/logger";

export default function DoctorLecturesPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const isArabic = i18n.language === "ar";

  const me = useSelector((state) => state.user.loggedUser);
  const [
    TimeTablesByDoctor,
    { data: { timeTablesByDoctor } = {}, loading: getTimeTableLoading },
  ] = useLazyQuery(GET_TIME_TABLE_BY_DOCTOR_ID, {
    fetchPolicy: "network-only",
  });

  const [
    TodayTimeTable,
    { data: { todayTimeTable } = {}, loading: getTodayTimeTableLoading },
  ] = useLazyQuery(TODAY_TIME_TABLE, { fetchPolicy: "network-only" });

  useEffect(() => {
    if (me?.id) {
      // logger.log('meeeee', me?.id);
      const date = new Date();
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      logger.log("dayName", dayName);
      TimeTablesByDoctor({ variables: { doctor_id: me?.id } });
      TodayTimeTable({ variables: { doctor_id: me?.id, day: dayName } });
      // data({variables:{doctor_id:me?.id}});
    }
  }, [me]);

  // تقسيم الوقت لساعات متساوية
  const groupedTimeTablesByMainTimeTable = (() => {
    if (!timeTablesByDoctor?.length) return [];

    // استخرج كل الأوقات من البيانات
    const allTimes = new Set();
    allTimes.add("08:00");
    timeTablesByDoctor.forEach((item) => {
      allTimes.add(item.start_time);
      allTimes.add(item.end_time);
    });

    // ترتيب الأوقات: 7-8-9-10-11-12-1-2-3-4-5-6-7-8-9-10-11-12
    const sortedTimes = [...allTimes].sort((a, b) => {
      const hoursA = parseInt(a.split(":")[0]);
      const hoursB = parseInt(b.split(":")[0]);

      const getOrder = (h) => {
        if (h >= 7) return h;
        return h + 24;
      };

      return getOrder(hoursA) - getOrder(hoursB);
    });

    // اصنع rows لكل ساعة
    const rows = [];

    const timeToMinutes = (timeString) => {
      const [h, m] = timeString.split(":");
      let hours = parseInt(h);
      if (hours < 7) hours += 24; // Start day at 7 AM
      return hours * 60 + parseInt(m);
    };

    for (let i = 0; i < sortedTimes.length - 1; i++) {
      const slotStart = sortedTimes[i];
      const slotEnd = sortedTimes[i + 1];

      const slotStartMins = timeToMinutes(slotStart);
      const slotEndMins = timeToMinutes(slotEnd);

      // اجمع المحاضرات اللي في هذا الوقت لكل يوم
      const items = timeTablesByDoctor.filter((lecture) => {
        const lectureStartMins = timeToMinutes(lecture.start_time);
        const lectureEndMins = timeToMinutes(lecture.end_time);

        return lectureStartMins <= slotStartMins && lectureEndMins > slotStartMins;
      });

      rows.push({
        start_time: slotStart,
        end_time: slotEnd,
        items: items || [],
      });
    }

    return rows;
  })();

  logger.log("me", me);
  logger.log("timeTablesByDoctor", timeTablesByDoctor);
  logger.log("todayTimeTable", todayTimeTable);

  if (getTimeTableLoading || getTodayTimeTableLoading) return <LoadingPage />;
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Grid container>
        <Grid item sm={12} md={12} sx={{}}>
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

          <ScheduleTable
            rows={groupedTimeTablesByMainTimeTable}
            canDelete={false}
          />

          <Box
            display="flex"
            width={isMobile ? "80%" : "100%"}
            flexDirection="column"
            gap={3}
            py={3}
            borderTop="1px solid #cfd7e7"
          >
            {/* Title */}
            <Box display="flex" gap={1}>
              <Typography variant="h6" fontWeight={700}>
                {t("Dashboard.toDayLectures")}
              </Typography>
            </Box>

            <ToDayTimeTableComponent
              rows={todayTimeTable}
              canEdit={true}
              func={TodayTimeTable}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
