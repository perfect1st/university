import Cookies from "js-cookie";

const USER_KEY = "user";
const TOKEN_KEY = "token";

export const setUserCookie = (user) => {
  Cookies.set(USER_KEY, JSON.stringify(user), { expires: 365 });
};

export const getUserCookie = () => {
  const user = Cookies.get(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUserCookie = () => {
  Cookies.remove(USER_KEY);
};

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: 365 });
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY) || null;
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const clearAllCookies = () => {
  const all = Cookies.get();
  if (Object.keys(all).length === 0) {
    return;
  }

  for (let key in all) {
    Cookies.remove(key);
  }
};

