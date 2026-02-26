import { useSelector } from "react-redux";
import { useMemo } from "react";
import routesData from "../data/routes";

const useAccessibleRoutes = () => {
  const user = useSelector((state) => state.user.loggedUser);

  const filteredRoutes = useMemo(() => {
    if (!user || !user.groups) return [];

    const userType = user.role?.toLowerCase();

    // 1. Extract modules the user can "view"
    // Converts "users.view" -> "users"
    const allowedModules = new Set();
    user.groups.forEach(group => {
      group.permissions?.forEach(perm => {
        if (perm.endsWith(".view")) {
          const moduleName = perm.split(".")[0];
          allowedModules.add(moduleName.toLowerCase());
        }
      });
    });

    // Special Case: Always allow Profile and Dashboard if they don't have specific perms
    const alwaysAllowed = ["profile", "dashboard", "studentdashboard"];

    // داخل filteredRoutes.map
    const isRouteAllowed = (route) => {
      if (route.isPublic) return true; // لو الـ route معلم كـ public يظهر فورا

      const key = route.key?.toLowerCase();
      return allowedModules.has(key) || alwaysAllowed.includes(key);
    };

    // وتعديل الـ map ليمرر الكائن كاملاً
    return (routesData[userType] || [])
      .map(route => {
        if (route.children) {
          const filteredChildren = route.children.filter(child => isRouteAllowed(child));
          return filteredChildren.length > 0 ? { ...route, children: filteredChildren } : null;
        }
        return isRouteAllowed(route) ? route : null;
      })
      .filter(Boolean);


  }, [user]);

  return filteredRoutes;
};

export default useAccessibleRoutes;