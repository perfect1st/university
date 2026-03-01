import { useSelector } from "react-redux";
import { useMemo } from "react";
import routesData from "../data/routes";

const useAccessibleRoutes = () => {
  const user = useSelector((state) => state.user.loggedUser);

const filteredRoutes = useMemo(() => {
    if (!user) return [];

    const userType = user.role?.toLowerCase();
    const routes = routesData[userType] || [];

    // 1. إذا لم يكن المستخدم Admin، أظهر له كل مساراته الثابتة مباشرة
    if (userType !== "admin") {
      return routes;
    }

    // 2. إذا كان Admin، نطبق نظام الـ Permissions
    if (!user.groups) return [];

    const allowedModules = new Set();
    user.groups.forEach(group => {
      group.permissions?.forEach(perm => {
        if (typeof perm === "string" && perm.endsWith(".view")) {
          const moduleName = perm.split(".")[0];
          allowedModules.add(moduleName.toLowerCase());
        }
      });
    });

    const alwaysAllowed = ["profile", "dashboard", "studentdashboard"];

    const isRouteAllowed = (route) => {
      if (route.isPublic) return true;
      const key = route.key?.toLowerCase();
      return allowedModules.has(key) || alwaysAllowed.includes(key);
    };

    return routes
      .map(route => {
        if (route.children) {
          const filteredChildren = route.children.filter(child => isRouteAllowed(child));
          // نرجع المسار فقط إذا كان لديه أبناء مسموح بهم
          return filteredChildren.length > 0 ? { ...route, children: filteredChildren } : null;
        }
        return isRouteAllowed(route) ? route : null;
      })
      .filter(Boolean);

  }, [user]);

  return filteredRoutes;
};

export default useAccessibleRoutes;