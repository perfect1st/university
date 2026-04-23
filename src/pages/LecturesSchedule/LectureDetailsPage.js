import React, { useState } from "react";
import ScheduleTable from "../../components/Utilities/ScheduleTableComponent";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";

import BookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Header from "../../components/PageHeader/header";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { GET_MATERIALS_BY_DEPARTMENT_ID } from "../../graphql/materialQueries";
import VerticalTextField, {
  VerticalTextFieldSelect,
} from "../../components/Utilities/VerticalTextField";
import { days } from "../../constants";
import LoadingPage from "../../components/LoadingComponent";
import notify from "../../components/notify";
import {
  CREATE_TIME_TABLE,
  GET_TIME_TABLES_BY_MAIN_TABLE_ID,
  DELETE_TIME_TABLE_BY_ID,
} from "../../graphql/TimeTableQueries";
import logger from "../../utils/logger";

export default function LectureDetailsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [selectedMaterialDepartment, setSelectedMaterialDepartment] =
    useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  // const [sectionInput, setSectionInput] = useState("");
  // const [rows, setRows] = useState([]);

  const [from, setFrom] = useState("08:00");
  const [to, setTo] = useState("09:00");

  logger.log("location", location.state);

  const [CreateTimeTable, { loading: creating }] = useMutation(
    CREATE_TIME_TABLE,
    {
      refetchQueries: [
        {
          query: GET_TIME_TABLES_BY_MAIN_TABLE_ID, // أو أي query عايز تحدثها
          variables: {
            main_time_table_id: location?.state?.id,
          },
        },
      ],
    },
  );

  // get time tables by main time table
  const {
    data: { timeTablesByMainTimeTable } = {},
    loading: timeTablesLoading,
  } = useQuery(GET_TIME_TABLES_BY_MAIN_TABLE_ID, {
    variables: {
      main_time_table_id: location?.state?.id,
    },
    fetchPolicy: "network-only",
    // onCompleted: (data) => {
    //   logger.log("completed",data);
    // }
  });

  logger.log("timeTablesByMainTimeTable", timeTablesByMainTimeTable);

  //   const groupedTimeTablesByMainTimeTable = timeTablesByMainTimeTable?.reduce((acc, item) => {
  //   const key = `${item.start_time}-${item.end_time}`;

  //   if (!acc[key]) {
  //     acc[key] = {
  //       items: []
  //     };
  //   }

  //   acc[key].items.push(item);
  //   return acc;
  // }, {});

  // تقسيم الوقت لساعات متساوية
  const groupedTimeTablesByMainTimeTable = (() => {
    if (!timeTablesByMainTimeTable?.length) return [];

    // استخرج كل الأوقات من البيانات
    const allTimes = new Set();
    allTimes.add("08:00");
    timeTablesByMainTimeTable.forEach((item) => {
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
    for (let i = 0; i < sortedTimes.length - 1; i++) {
      const slotStart = sortedTimes[i];
      const slotEnd = sortedTimes[i + 1];

      // حوّل للـ 12-hour
      const to12Hour = (h) => (h >= 13 ? h - 12 : h === 0 ? 12 : h);
      const slotStart12 = to12Hour(parseInt(slotStart.split(":")[0]));
      const slotEnd12 = to12Hour(parseInt(slotEnd.split(":")[0]));

      // اجمع المحاضرات اللي في هذا الوقت لكل يوم
      const items = timeTablesByMainTimeTable.filter((lecture) => {
        const lectureStart12 = to12Hour(
          parseInt(lecture.start_time.split(":")[0]),
        );
        const lectureEnd12 = to12Hour(parseInt(lecture.end_time.split(":")[0]));

        return lectureStart12 <= slotStart12 && lectureEnd12 > slotStart12;
      });

      rows.push({
        start_time: slotStart,
        end_time: slotEnd,
        items: items || [],
      });
    }

    return rows;
  })();

  logger.log(
    "groupedTimeTablesByMainTimeTable",
    groupedTimeTablesByMainTimeTable,
  );

  // get materials in Department
  const {
    data: { materialsByDepartment } = {},
    loading: DepartmentMaterialsLoading,
  } = useQuery(GET_MATERIALS_BY_DEPARTMENT_ID, {
    variables: {
      faculty_department_id: location?.state?.faculty_department_id?.id,
    },
    fetchPolicy: "network-only",
  });

  const colors = ["#e3f2fd", "#f3e5f5", "#e8f5e9"];

  const addRowToTable = async () => {
    try {
      if (selectedDay == 0 || selectedMaterialDepartment == 0)
        return notify(t("completeData"), "error");

      let fromString = from == "00:00" ? "12:00" : from;
      let toString = to == "00:00" ? "12:00" : to;

      let data = {
        start_time: fromString,
        end_time: toString,
        day: selectedDay,
        section: "1",
        doctor_id: materialsByDepartment?.find(
          (el) => el?.id == selectedMaterialDepartment,
        )?.doctor_id?.id,
        main_time_table_id: location?.state?.id,
        material_id: selectedMaterialDepartment,
        academy_term_id: location?.state?.academy_term_id?.id,
      };

      logger.log("data to send", data);

      const result = await CreateTimeTable({
        variables: {
          input: data,
        },
      });

      logger.log("result", result?.data);
      // let time = fromString + " - " + toString;

      // if (selectedDay == 0 || selectedDoctor == 0 || selectedMaterialDepartment == 0) return notify(t("completeData"), "error");

      // rowOBJ.time = time;

      // let newObj;

      // newObj = materialsByDepartment?.find(el => el?.id == selectedMaterialDepartment);

      // const randomColor = colors[Math.floor(Math.random() * colors.length)];
      // newObj = {
      //   ...newObj,
      //   // teacher: users?.find(el => el?.id == selectedDoctor),
      //   color: randomColor
      // }

      // rowOBJ[selectedDay] = newObj;
      // logger.log("rowOBJ", rowOBJ);
      // logger.log("selectedDoctor", selectedDoctor);

      // setRows(prev => {
      //   // هل يوجد صف بنفس الوقت؟
      //   const existingRowIndex = prev.findIndex(r => r.time === rowOBJ.time);

      //   // لو الوقت موجود بالفعل → حدث نفس الصف
      //   if (existingRowIndex !== -1) {
      //     const updated = [...prev];

      //     // نعدل اليوم فقط داخل نفس الصف
      //     updated[existingRowIndex] = {
      //       ...updated[existingRowIndex],
      //       [selectedDay]: rowOBJ[selectedDay]   // أضف المادة لليوم
      //     };

      //     return updated;
      //   }

      //   // لو وقت جديد → أضف row جديد
      //   return [...prev, rowOBJ];
      // });
    } catch (error) {
      logger.log("error", error.message);
      error?.message
        ? notify(error.message, "error")
        : notify(t("error"), "error");
    }
  };

  // logger.log("rows", rows);
  logger.log("materialsByDepartment", materialsByDepartment);

  let translateText = isArabic ? "جدول المحاضرة" : "Lecture Schedule";
  let translateText2 = isArabic ? "مادة جديدة" : "New Subject";

  if (DepartmentMaterialsLoading || timeTablesLoading) return <LoadingPage />;
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", maxWidth: "100%" }}>
      <Header
        title={t("Dashboard.LecturesSchedule")}
        subtitle={t("detailsItem", { item: translateText })}
        i18n={i18n}
        haveBtn={false}
        hasAddOrEditBtn={true}
        sub2={t("detailsItem", { item: translateText })}
        hasNavigate={true}
        isExcel={false}
        isPdf={false}
        isPrinter={false}
      />
      {
        <ScheduleTable
          rows={groupedTimeTablesByMainTimeTable}
          canDelete={true}
        />
      }

      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        pt={3}
        borderTop="1px solid #cfd7e7"
      >
        {/* Title */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="h6" fontWeight={700}>
            {t("addItem", { item: translateText2 })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("Dashboard.subjectDetails")}
          </Typography>
        </Box>

        {/* Form */}
        <Grid container spacing={6}>
          {/* Subject Name */}
          <Grid item xs={12} md={6} lg={3}>
            <VerticalTextFieldSelect
              t={t}
              title={
                isArabic
                  ? t("studentDashboard.subjectTitleAr")
                  : t("studentDashboard.subjectTitleEn")
              }
              defaultOptionLabel={t("select")}
              backgroundColor={theme.palette.background.inputBackGround}
              value={selectedMaterialDepartment}
              setValue={setSelectedMaterialDepartment}
              // onChange={async (e) => {
              //   await GetFacultyDepartmentsByFaculty({
              //     variables: {
              //       faculty_id: e.target.value,
              //     },
              //   });

              //   setSelectedDepartment(0);
              // }}

              onBlur={(e) => {
                // logger.log('blur',selectedSemester);
                // if (selectedFaculity != 0) formik.setFieldError("selectedFaculity", undefined);
              }}

              // error={formik.errors.selectedFaculity && t("admissions.errors.required")}
              // helperText={formik.errors.selectedFaculity && t("admissions.errors.required")}
            >
              <MenuItem value={0} selected>
                {t("select")}
              </MenuItem>
              {materialsByDepartment?.map((el) => (
                <MenuItem key={el?.id} value={el?.id}>
                  {isArabic ? el?.title_ar : el?.title_en}
                </MenuItem>
              ))}
            </VerticalTextFieldSelect>
          </Grid>

          {/* section */}
          {/* <Grid item xs={12} md={6} lg={3}>
            <VerticalTextField
              title={t("studentDashboard.section")}
              fieldID={"section"}
              fieldName={"section"}
              placeholder={t("studentDashboard.section")}
              value={sectionInput}
              onChange={(e) => setSectionInput(e.target.value)}
            />
          </Grid> */}

          {/* Day */}
          <Grid item xs={12} md={6} lg={3}>
            <FormControl fullWidth>
              <VerticalTextFieldSelect
                t={t}
                title={t("day")}
                defaultOptionLabel={t("select")}
                backgroundColor={theme.palette.background.inputBackGround}
                value={selectedDay}
                setValue={setSelectedDay}
                // onChange={async (e) => {
                //   await GetFacultyDepartmentsByFaculty({
                //     variables: {
                //       faculty_id: e.target.value,
                //     },
                //   });

                //   setSelectedDepartment(0);
                // }}

                onBlur={(e) => {
                  // logger.log('blur',selectedSemester);
                  // if (selectedFaculity != 0) formik.setFieldError("selectedFaculity", undefined);
                }}

                // error={formik.errors.selectedFaculity && t("admissions.errors.required")}
                // helperText={formik.errors.selectedFaculity && t("admissions.errors.required")}
              >
                <MenuItem value={0} selected>
                  {t("select")}
                </MenuItem>
                {days?.map((el) => (
                  <MenuItem key={el?.id} value={el?.key}>
                    {isArabic ? el?.labelAr : el?.labelEn}
                  </MenuItem>
                ))}
              </VerticalTextFieldSelect>
            </FormControl>
          </Grid>

          {/* Time */}
          <Grid item xs={12} md={6} lg={5}>
            <FormControl fullWidth>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {t("time")}
              </Typography>

              <Box display="flex" gap={2} flexWrap="wrap">
                {/* وقت البداية */}
                <TextField
                  label={t("from")}
                  type="time"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />

                {/* وقت النهاية */}
                <TextField
                  label={t("to")}
                  type="time"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </Box>
            </FormControl>
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box display="flex" justifyContent="end" gap={2} mt={1}>
          {/* <Button variant="outlined" color="inherit">
            إلغاء
          </Button> */}

          <Button
            variant="contained"
            onClick={() => addRowToTable()}
            disabled={creating}
            fullWidth={isMobile}
          >
            {creating ? (
              <CircularProgress
                size={26}
                thickness={8}
                sx={{ color: "black" }}
              />
            ) : (
              t("Dashboard.saveSubject")
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
