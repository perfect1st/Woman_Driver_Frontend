// ✅ routes.js

import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';


const routesData = {
  admin: [
    {
      key: "dashboard",
      label: { en: "Dashboard", ar: "لوحة التحكم" },
      path: "/adminHome",
      icon: DashboardIcon,
    },
    {
      key: "home",
      label: { en: "home", ar: "الرئيسيه" },
      path: "/home",
      icon: HomeIcon,
    },
    {
      key: "users",
      label: { en: "Users", ar: "المستخدمين" },
      icon: HomeIcon,
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
          icon: HomeIcon,
        },
      ],
    },
    {
      key: "drivers",
      label: { en: "Drivers", ar: "السائقين" },
      // icon: HomeIcon,
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
