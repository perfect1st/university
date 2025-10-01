import routesData from "../data/routes";
import { getUserCookie } from "./authCookies";

const getAccessibleRoutes = (userType = "admin") => {
  const user = getUserCookie();
  if (!user) return [];

  if (user?.super_admin) return routesData[userType] || [];

  const allowedScreens = new Set();

  user?.groups?.forEach(group => {
    group?.screens?.forEach(screen => {
      if (screen.permissions?.view) {
        allowedScreens.add(screen.screen);
      }
    });
  });

  const isRouteAllowed = (key) =>
    allowedScreens.has(key) ||
    allowedScreens.has(key.toLowerCase()) ||
    allowedScreens.has(key.charAt(0).toUpperCase() + key.slice(1));

  const filteredRoutes = (routesData[userType] || [])
    .map(route => {
      if (route.children) {
        const filteredChildren = route.children.filter(child => isRouteAllowed(child.key));
        if (filteredChildren.length > 0) {
          return { ...route, children: filteredChildren };
        }
        return null;
      }

      return isRouteAllowed(route.key) ? route : null;
    })
    .filter(Boolean);

  return filteredRoutes;
};

export default getAccessibleRoutes;
