import { ReactComponent as setting } from '../assets/setting.svg'
import { getUserCookie } from '../hooks/authCookies';
import { ReactComponent as DashboardIcon } from "../assets/HomeIcon.svg";
import { ReactComponent as ProfileIcon } from "../assets/Profile.svg";
import { ReactComponent as FeePaymentIcon } from "../assets/feePayment.svg";

const user = getUserCookie();

const routesData = {
  admin: [
    {
      key: "StudentDashboard",
      label: { en: "Dashboard", ar: "لوحة التحكم" },
      path: "/StudentDashboard",
      icon: DashboardIcon,
    },
    {
      key: "Profile",
      label: { en: "Profile", ar: "الملف الشخصي" },
      path: "/Profile",
      icon: ProfileIcon,
    },
    {
      key: "FeePayment",
      label: { en: "Fee Payment", ar: "دفع الرسوم" },
      path: "/FeePayment",
      icon: FeePaymentIcon,
    },
  
    // {
    //   key: "settings",
    //   label: { en: "settings", ar: "الاعدادات" },
    //   icon: setting,
    //   children: [
    //     {
    //       key: "settings",
    //       label: { en: "Tracking Frequency", ar: "تردد التتبع" },
    //       action: "openTrackingModal",
    //       path: "",
    //       // icon: 
    //     },
       
       
    //   ],
    // },
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
