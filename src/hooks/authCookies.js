import Cookies from "js-cookie";

const USER_KEY = "user";
const TOKEN_KEY = "token";

export const setUserCookie = (user) => {
  // Using localStorage for full user data because the user object with permissions exceeds the 4KB cookie limit
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Save a simplified version in cookies so it is visible and usable within the 4KB limit
  const basicUser = { ...user };
  delete basicUser.groups; // Exclude the large permissions array to prevent silent cookie failure
  Cookies.set(USER_KEY, JSON.stringify(basicUser), { expires: 365, path: "/" });
};

export const getUserCookie = () => {
  const localUser = localStorage.getItem(USER_KEY);
  if (localUser) {
    return JSON.parse(localUser);
  }
  // Fallback to cookie for backward compatibility
  const cookieUser = Cookies.get(USER_KEY);
  return cookieUser ? JSON.parse(cookieUser) : null;
};

export const removeUserCookie = () => {
  localStorage.removeItem(USER_KEY);
  Cookies.remove(USER_KEY, { path: "/" });
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  Cookies.set(TOKEN_KEY, token, { expires: 365, path: "/" });
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY) || null;
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  Cookies.remove(TOKEN_KEY, { path: "/" });
};

export const clearAllCookies = () => {
  const all = Cookies.get();
  if (Object.keys(all).length > 0) {
    for (let key in all) {
      Cookies.remove(key, { path: "/" });
    }
  }
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

