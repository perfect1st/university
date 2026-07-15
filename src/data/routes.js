import { ReactComponent as SettingIcon } from '../assets/setting.svg';
import { ReactComponent as DashboardIcon } from "../assets/HomeIcon.svg";
import { ReactComponent as ProfileIcon } from "../assets/Profile.svg";
import { ReactComponent as FeePaymentIcon } from "../assets/feePayment.svg";
import { getUserCookie } from '../hooks/authCookies';
import logger from '../utils/logger';
import { store } from '../redux/store';/**
 * Dynamically retrieves the faculty department id from localStorage.
 * This optimizes the app by evaluating localStorage at render-time when
 * the path is requested, rather than at module-load time.
 * @returns {number|string|undefined}
 */
const getFacultyDepartmentId = () => {
  try {
    const form = JSON.parse(localStorage.getItem('registerForm') || '{}');
    return form?.faculty_department_id?.id || '';
  } catch (e) {
    return '';
  }
};

const routesData = {

  student: [
    {
      key: "group_academic",
      label: { en: "Academic", ar: "أكاديمي" },
      children: [
        {
          key: "StudentDashboard",
          label: { en: "Student Dashboard", ar: "لوحة التحكم" },
          path: "/StudentDashboard",
        },
        {
          key: "timeTables",
          label: { en: "Lectures Schedule", ar: "جداول المحاضرات" },
          path: "/StudentlecturesSchedule",
        },
        {
          key: "lectureSessions",
          label: { en: "Lectures Records", ar: "سجلات المحاضرات" },
          path: "/LectureSessionDetails",
        },
        {
          key: "materials",
          label: { en: "Materials", ar: "المواد الدراسية" },
          get path() { return `/materials?faculty_department_id=${getFacultyDepartmentId()}` },
        },
        {
          key: "degrees",
          label: { en: "student degrees", ar: "درجات الطالب" },
          get path() {
            const user = store.getState().user.loggedUser;
            return `/exams/studentDegrees/${user?.id}`;
          },
        },
        {
          key: "userStudyMaterials",
          label: { en: "E-Library", ar: "المكتبة الالكترونية" },
          get path() { return `/ELibrary?faculty_department_id=${getFacultyDepartmentId()}` },
        },
      ]
    },
    {
      key: "group_financial",
      label: { en: "Financial", ar: "المالية" },
      children: [
        {
          key: "usersRequiredFees",
          label: { en: "Fee Payments", ar: "المدفوعات" },
          path: "/FeePayment",
          icon: FeePaymentIcon,
        },
      ]
    },
    {
      key: "group_settings",
      label: { en: "Account Settings", ar: "إعدادات الحساب" },
      children: [
        {
          key: "profile",
          isPublic: true,
          label: { en: "Profile", ar: "الصفحة الشخصية" },
          path: "/profile",
          icon: ProfileIcon,
        }
      ]
    },
    {
      key: "supportTickets",
      label: { en: "Support Tickets", ar: "الدعم الفني" },
      path: "/Support",

    }
  ],

  admin: [
    {
      key: "group_management",
      label: { en: "Management & Content", ar: "إدارة النظام والمحتوى" },
      children: [
        {
          key: "users",
          label: { en: "Users", ar: "المستخدمين" },
          path: "/users",
        },
        {
          key: "groups",
          label: { en: "Permissions Groups", ar: "مجموعات الصلاحيات" },
          path: "/PermissionsGroups",
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
          key: "contactMessages",
          isPublic: true,
          label: { en: "Contact Messages", ar: "رسائل اتصل بنا" },
          path: "/contact-messages",
        },
        {
          key: "site-settings",
          isPublic: true,
          label: { en: "Site Settings", ar: "اعدادات الموقع" },
          path: "/site-settings",
        },
      ]
    },
    {
      key: "group_academic",
      label: { en: "Academic System", ar: "النظام الأكاديمي" },
      children: [
        {
          key: "faculties",
          label: { en: "Faculties", ar: "الكليات" },
          path: "/faculities",
        },
        {
          key: "facultyDepartments",
          label: { en: "Departments", ar: "الاقسام" },
          path: "/departments",
        },
        {
          key: "academyTerms",
          label: { en: "Academy Terms", ar: "الفصول الدراسية" },
          path: "/academyTerms",
        },
        {
          key: "mainTimeTables",
          label: { en: "Lectures Schedule", ar: "جداول المحاضرات" },
          path: "/lecturesSchedule",
        },
        {
          key: "materials",
          label: { en: "Subjects", ar: "المواد الدراسية" },
          path: "/materials",
        },
        {
          // Key reused to share permissions with materials component
          key: "materials",
          label: { en: "E-Library", ar: "المكتبة الالكترونية" },
          path: "/ELibrary",
        },
        {
          key: "registerForms",
          label: { en: "Register Forms", ar: "استمارات التسجيل" },
          path: "/registerForms",
        },
        {
          key: "registerForms",
          label: { en: "Promotion", ar: "الترقية" },
          path: "/promotion",
        },
      ]
    },
    {
      key: "group_financial",
      label: { en: "Financial Services", ar: "الخدمات المالية" },
      children: [
        {
          key: "facultyPrices",
          label: { en: "Faculties Prices", ar: "اسعار الكليات" },
          path: "/prices",
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
      ]
    },
    {
      key: "group_settings",
      label: { en: "Settings", ar: "الإعدادات" },
      children: [
        {
          key: "profile",
          isPublic: true,
          label: { en: "Profile", ar: "الصفحة الشخصية" },
          path: "/profile",
        },
        {
          key: "nationalities",
          label: { en: "Nationality", ar: "الجنسيات" },
          path: "/nationality",
        },
        {
          key: "countries",
          label: { en: "Countries", ar: "الدول" },
          path: "/countries",
        },
        {
          key: "backups",
          isPublic: true,
          label: { en: "Backups", ar: "النسخ الاحتياطي" },
          path: "/backups",
        },
      ]
    },
    {
      key: "supportTickets",
      label: { en: "Support Tickets", ar: "الدعم الفني" },
      path: "/Support",

    }
  ],

  doctor: [
    {
      key: "group_academic",
      label: { en: "Academic Operations", ar: "العمليات الأكاديمية" },
      children: [
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
          key: "studentDegrees",
          label: { en: "Student Degrees", ar: "درجات الطلاب" },
          path: "/allStudentDegrees",
        },
      ]
    },
    {
      key: "group_settings",
      label: { en: "Account Config", ar: "إعدادات الحساب" },
      children: [
        {
          key: "profile",
          isPublic: true,
          label: { en: "Profile", ar: "الصفحة الشخصية" },
          path: "/profile",
          icon: ProfileIcon,
        }
      ]
    },
    {
      key: "supportTickets",
      label: { en: "Support Tickets", ar: "الدعم الفني" },
      path: "/Support",
    }
  ],
};

export default routesData;