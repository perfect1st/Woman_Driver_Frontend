// ✅ routes.js

import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { ReactComponent as More } from '../assets/More.svg'


const routesData = {
  admin: [
    {
      key: "dashboard",
      label: { en: "Dashboard", ar: "لوحة التحكم" },
      path: "/adminHome",
      // icon: DashboardIcon,
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
      key: "WaitingTime",
      label: { en: "Waiting Times", ar: "أوقات الانتظار" },
      path: "/WaitingTime",
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
      key: "Loading",
      label: { en: "Loading", ar: "صفحه التحميل" },
      path: "/Loading",
      // icon: HomeIcon,
    },
    {
      key: "404",
      label: { en: "404 page", ar: "الصفحه غير موجوده" },
      path: "/404",
      // icon: HomeIcon,
    },
    {
      key: "Maintenance",
      label: { en: "Maintenance", ar: "الصيانة" },
      path: "/Maintenance",
      // icon: HomeIcon,
    },
    // {
    //   key: "home",
    //   label: { en: "home", ar: "الرئيسيه" },
    //   path: "/home",
    //   // icon: HomeIcon,
    // },
    {
      key: "settings",
      label: { en: "settings", ar: "الاعدادات" },
      icon: More,
      children: [
        {
          key: "TrackingFrequency",
          label: { en: "Tracking Frequency", ar: "تردد التتبع" },
          action: "openTrackingModal",
          path: "",
          // icon: 
        },
        {
          key: "NotifyRadius",
          label: { en: "Notify Radius", ar: "نطاق الإشعار" },
          action: "openNotifyRadiusModal",
          path: "",
          // icon: More,

        },
      ],
    },
    {
      key: "users",
      label: { en: "Users", ar: "المستخدمين" },
      icon: More,
      children: [
        {
          key: "allUsers",
          label: { en: "All Users", ar: "جميع المستخدمين" },
          path: "/admin/users",
          icon: HomeIcon,
        },
        {
          key: "createUser",
          label: { en: "Create User", ar: "إنشاء مستخدم" },
          path: "/admin/users/create",
          // icon: More,

        },
      ],
    },
    {
      key: "drivers",
      label: { en: "Drivers", ar: "السائقين" },
      icon: More,
      children: [
        {
          key: "allDrivers",
          label: { en: "All Drivers", ar: "جميع السائقين" },
          path: "/admin/Drivers",
          icon: HomeIcon,
        },
        {
          key: "createDriver",
          label: { en: "Create Driver", ar: "إنشاء سائق" },
          path: "/admin/Driver/create",
          icon: HomeIcon,
        },
      ],
    },
  ],
  accountant: [
    {
      key: "dashboard",
      label: { en: "Dashboard", ar: "لوحة التحكم" },
      path: "/accountantHome",
    },
    {
      key: "reports",
      label: { en: "Reports", ar: "التقارير" },
      children: [
        {
          key: "monthly",
          label: { en: "Monthly Report", ar: "تقرير شهري" },
          path: "/accountant/reports/monthly",
        },
      ],
    },
  ],
};

export default routesData;
