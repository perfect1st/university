// ✅ routes.js

import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { ReactComponent as More } from '../assets/More.svg'
import { ReactComponent as setting } from '../assets/setting.svg'
import { getUserCookie } from '../hooks/authCookies';
const user = getUserCookie();

const routesData = {
  admin: [
    {
      key: "dashboard",
      label: { en: "Dashboard", ar: "لوحة التحكم" },
      path: "/home",
      // icon: DashboardIcon,
    },
    {
      key: "users",
      label: { en: "Users", ar: "المستخدمين" },
      path: "/users",
      // icon: HomeIcon,
    },
    {
      key: "Passengers",
      label: { en: "Passengers", ar: "الركاب" },
      path: "/Passengers",
      // icon: HomeIcon,
    },
    {
      key: "Drivers",
      label: { en: "Drivers", ar: "السائقين" },
      path: "/Drivers",
      // icon: HomeIcon,
    },
    {
      key: "Trips",
      label: { en: "Trips", ar: "الرحلات" },
      path: "/Trips",
      // icon: HomeIcon,
    },
    {
      key: "Cars",
      label: { en: "Cars", ar: "السيارات" },
      path: "/Cars",
      // icon: HomeIcon,
    },
    {
      key: "CarTypes",
      label: { en: "Cars types", ar: "انواع السيارات" },
      path: "/CarTypes",
      // icon: HomeIcon,
    },
    {
      key: "CarDriver",
      label: { en: "Cars-Drivers", ar: "سيارات السائقين" },
      path: "/CarDriver",
      // icon: HomeIcon,
    },
    {
      key: "TrafficTime",
      label: { en: "Traffic Time", ar: "مواعيد الذروة" },
      path: "/TrafficTime",
      // icon: HomeIcon,
    },
    {
      key: "Wallet",
      label: { en: "Wallet", ar: "المحفظة" },
      path: "/Wallet",
      // icon: HomeIcon,
    },
    {
      key: "PaymentMethods",
      label: { en: "Payment Methods", ar: "وسائل الدفع" },
      path: "/PaymentMethods",
      // icon: HomeIcon,
    },
    {
      key: "Liqudation",
      label: { en: "Liqudation", ar: "التصفية" },
      path: "/Liqudation",
      // icon: HomeIcon,
    },
    {
      key: "Commission",
      label: { en: "Commission", ar: "العمولة" },
      path: "/Commission",
      // icon: HomeIcon,
    },
    {
      key: "CommissionCategory",
      label: { en: "Commission Category", ar: "فئة العمولة" },
      path: "/CommissionCategory",
      // icon: HomeIcon,
    },
    {
      key: "permissions",
      label: { en: "Permission Groups", ar: "مجموعات الصلاحيات" },
      path: "/PermissionGroups",
      // icon: HomeIcon,
    },
    {
      key: "Coupons",
      label: { en: "Coupons", ar: "القسائم" },
      path: "/Coupons",
      // icon: HomeIcon,
    },
    {
      key: "Offers",
      label: { en: "Offers", ar: "العروض" },
      path: "/Offers",
      // icon: HomeIcon,
    },
    {
      key: "ContactUs",
      label: { en: "Contact Us", ar: "تواصل معنا" },
      path: "/ContactUs",
      // icon: HomeIcon,
    },
    {
      key: "settings",
      label: { en: "settings", ar: "الاعدادات" },
      icon: setting,
      children: [
        {
          key: "settings",
          label: { en: "Tracking Frequency", ar: "تردد التتبع" },
          action: "openTrackingModal",
          path: "",
          // icon: 
        },
        {
          key: "settings",
          label: { en: "Notify Radius", ar: "نطاق الإشعار" },
          action: "openNotifyRadiusModal",
          path: "",
          // icon: More,

        },
        {
          key: "settings",
          label: { en: "Cashback Percentage", ar: "نسبة استرداد النقود" },
          action: "openCashbackModal",
          path: "",
          // icon: More,

        },
        {
          key: "privacyPolicy",
          label: { en: "privacy Policy", ar: "سياسة الخصوصية" },
          path: "/privacyPolicy",
          // icon: More,

        },
        {
          key: "Help",
          label: { en: "Help & Support", ar: "المساعدة والدعم" },
          path: "/Help",
          // icon: More,

        },
       
      ],
    },
    // {
    //   key: "Loading",
    //   label: { en: "Loading", ar: "صفحه التحميل" },
    //   path: "/Loading",
    //   // icon: HomeIcon,
    // },
    // {
    //   key: "404",
    //   label: { en: "404 page", ar: "الصفحه غير موجوده" },
    //   path: "/404",
    //   // icon: HomeIcon,
    // },
    // {
    //   key: "Maintenance",
    //   label: { en: "Maintenance", ar: "الصيانة" },
    //   path: "/Maintenance",
    //   // icon: HomeIcon,
    // },
   
  ],

};

export default routesData;
