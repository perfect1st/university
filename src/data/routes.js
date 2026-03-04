import { ReactComponent as SettingIcon } from '../assets/setting.svg';
import { ReactComponent as DashboardIcon } from "../assets/HomeIcon.svg";
import { ReactComponent as ProfileIcon } from "../assets/Profile.svg";
import { ReactComponent as FeePaymentIcon } from "../assets/feePayment.svg";

const storedStudentForm = JSON.parse(localStorage.getItem('registerForm'));

const routesData = {
  student: [
    {
      key: "dashboard",
      isPublic: true, // Hint: Not in backend permissions, always show
      label: { en: "Student Dashboard", ar: "لوحة التحكم" },
      path: "/StudentDashboard",
      icon: DashboardIcon,
    },
    {
      key: "profile",
      isPublic: true, // Hint: Internal route
      label: { en: "Profile", ar: "الصفحة الشخصية" },
      path: "/profile",
      icon: ProfileIcon,
    },
    {
      key: "timeTables", // Matches timeTables.view
      label: { en: "Lectures Schedule", ar: "جداول المحاضرات" },
      path: "/StudentlecturesSchedule",
    },
    {
      key: "lectureSessions", // Matches lectureSessions.view
      label: { en: "Lectures Records", ar: "سجلات المحاضرات" },
      path: "/LectureSessionDetails",
    },
    {
      key: "usersRequiredFees", // Matches usersRequiredFees.view
      label: { en: "Fee Payments", ar: "المدفوعات" },
      path: "/FeePayment",
      icon: FeePaymentIcon,
    },
    {
      key: "materials", // Matches userStudyMaterials.view
      label: { en: "materials", ar: "المواد الدراسية" },
      path: `/materials?faculty_department_id=${storedStudentForm?.faculty_department_id?.id}`,
    },
    {
      key: "userStudyMaterials", // Matches userStudyMaterials.view
      label: { en: "E-Library", ar: "المكتبة الالكترونية" },
      path: `/ELibrary?faculty_department_id=${storedStudentForm?.faculty_department_id?.id}`,
    },
    {
      key: "supportTickets", // Matches supportTickets.view
      label: { en: "Support", ar: "الدعم الفني" },
      path: "/Support",
    },
  ],

  admin: [
    {
      key: "dashboard",
      isPublic: true,
      label: { en: "Dashboard", ar: "لوحة التحكم" },
      path: "/dashboard",
      icon: DashboardIcon,
    },
    {
      key: "websiteDepartments",
      label: { en: "Website Departments", ar: "اقسام الموقع" },
      path: "/website-departments",
    },
    {
      key: "websiteArticles",
      label: { en: "Website Articles", ar: "مقالات الموقع" },
      path: "/website-articles",
    },
    {
      key: "users",
      label: { en: "Users", ar: "المستخدمين" },
      path: "/users",
    },
    {
      key: "nationalities", // Matches nationalities.view
      label: { en: "Nationality", ar: "الجنسيات" },
      path: "/nationality",
    },
    {
      key: "countries",
      label: { en: "Countries", ar: "الدول" },
      path: "/countries",
    },
    {
      key: "faculties", // Corrected spelling
      label: { en: "Faculties", ar: "الكليات" },
      path: "/faculities",
    },
    {
      key: "facultyDepartments", // Matches facultyDepartments.view
      label: { en: "Departments", ar: "الاقسام" },
      path: "/departments",
    },
    {
      key: "facultyPrices", // Matches facultyPrices.view
      label: { en: "Faculties Prices", ar: "اسعار الكليات" },
      path: "/prices",
    },
    {
      key: "materials", // Matches materials.view
      label: { en: "Subjects", ar: "المواد الدراسية" },
      path: "/materials",
    },
    {
      key: "materials", // Matches materials.view
      label: { en: "ELibrary", ar: "المكتبة الالكترونية" },
      path: "/ELibrary",
    },
    {
      key: "academyTerms",
      label: { en: "Academy Terms", ar: "الفصول الدراسية" },
      path: "/academyTerms",
    },
    {
      key: "mainTimeTables", // Matches mainTimeTables.view
      label: { en: "Lectures Schedule", ar: "جداول المحاضرات" },
      path: "/lecturesSchedule",
    },
    {
      key: "feesTypes",
      label: { en: "Fees Types", ar: "انواع الرسوم" },
      path: "/feesTypes",
    },
    {
      key: "transactionTypes",
      label: { en: "Transaction Types", ar: "انواع المعاملات المالية" },
      path: "/transactionTypes",
    },
    {
      key: "transactions",
      label: { en: "Transactions", ar: "المعاملات المالية" },
      path: "/transactions",
    },
    {
      key: "usersRequiredFees",
      label: { en: "Student Required Fees", ar: "رسوم الطلاب" },
      path: "/requiredFees",
    },
    {
      key: "groups", // Matches groups.view
      label: { en: "Permissions Groups", ar: "مجموعات الصلاحيات" },
      path: "/PermissionsGroups",
    },
    {
      key: "profile",
      isPublic: true,
      label: { en: "Profile", ar: "الصفحة الشخصية" },
      path: "/profile",
      icon: ProfileIcon,
    },
    {
      key: "supportTickets",
      label: { en: "Support", ar: "الدعم الفني" },
      path: "/Support",
    },
  ],

  doctor: [
    {
      key: "profile",
      isPublic: true,
      label: { en: "Profile", ar: "الصفحة الشخصية" },
      path: "/profile",
      icon: ProfileIcon,
    },
    {
      key: "timeTables",
      label: { en: "Lectures Schedule", ar: "جداول المحاضرات" },
      path: "/DoctorlecturesSchedule",
    },
    {
      key: "lectureSessions",
      label: { en: "Lectures Records", ar: "سجلات المحاضرات" },
      path: "/LectureSessionDetails",
    },
    {
      key: "exams",
      label: { en: "Exams", ar: "الامتحانات" },
      path: "/exams",
    },
    {
      key: "studentDegrees", // Matches studentDegrees.view
      label: { en: "Student Degrees", ar: "درجات الطلاب" },
      path: "/allStudentDegrees",
    },
    {
      key: "supportTickets",
      label: { en: "Support", ar: "الدعم الفني" },
      path: "/Support",
    },
  ],
};

export default routesData;