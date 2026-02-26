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
      // console.log('meeeee', me?.id);
      const date = new Date();
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      console.log("dayName", dayName);
      TimeTablesByDoctor({ variables: { doctor_id: me?.id } });
      TodayTimeTable({ variables: { doctor_id: me?.id, day: dayName } });
      // data({variables:{doctor_id:me?.id}});
    }
  }, [me]);

  // تقسيم الوقت لساعات متساوية
  const groupedTimeTablesByMainTimeTable = (() => {
    if (!timeTablesByDoctor?.length) return [];

    // ترتيب الأوقات (8 AM first, then PM)
    const timeOrder = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
    ];

    // استخرج كل الـ time boundaries
    const allTimes = new Set();
    allTimes.add("08:00");
    timeTablesByDoctor.forEach((item) => {
      allTimes.add(item.start_time);
      allTimes.add(item.end_time);
    });

    // رتب الأوقات حسب الترتيب الصحيح (8,9,10,11,12,1,2,3...)
    const sortedTimes = [...allTimes].sort((a, b) => {
      const indexA = timeOrder.indexOf(a);
      const indexB = timeOrder.indexOf(b);
      // لو مش موجود في القائمة، استخدم string comparison
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    // اصنع rows لكل ساعة
    const rows = [];
    for (let i = 0; i < sortedTimes.length - 1; i++) {
      const slotStart = sortedTimes[i];
      const slotEnd = sortedTimes[i + 1];

      // اجمع المحاضرات اللي في هذا الوقت لكل يوم
      const items = timeTablesByDoctor.filter((lecture) => {
        // نشوف إذا الـ lecture تقع في هذا الـ slot
        const startIndex = timeOrder.indexOf(lecture.start_time);
        const endIndex = timeOrder.indexOf(lecture.end_time);
        const slotIndex = timeOrder.indexOf(slotStart);

        if (startIndex === -1 || endIndex === -1 || slotIndex === -1)
          return false;

        return startIndex <= slotIndex && endIndex > slotIndex;
      });

      rows.push({
        start_time: slotStart,
        end_time: slotEnd,
        items: items || [],
      });
    }

    return rows;
  })();

  console.log("me", me);
  console.log("timeTablesByDoctor", timeTablesByDoctor);
  console.log("todayTimeTable", todayTimeTable);

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
