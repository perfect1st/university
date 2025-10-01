// src/hooks/getPermissionsByScreen.js

import { getUserCookie } from "./authCookies";


function getPermissionsByScreen(screenName) {
  const user = getUserCookie();
  if (!user) return null;

  // ✅ if user is super_admin → grant full access
  if (user.super_admin) {
    return {
      view: true,
      edit: true,
      delete: true,
      add: true,
    };
  }

  if (!user.groups) return null;

  // Otherwise → check permissions normally
  for (const group of user.groups) {
    const screen = group.screens.find((s) => s.screen === screenName);
    if (screen) {
      return screen.permissions;
    }
  }

  return null; // not found
}

export default getPermissionsByScreen;
