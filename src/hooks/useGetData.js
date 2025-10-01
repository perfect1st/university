import baseURL, { config } from "../Api/baseURL";
import { getToken } from "./authCookies";

export const useGetData = async (url, params) => {
  const res = await baseURL.get(url, config); // No token
  return res.data;
};

export const useGetDataToken = async (url, params) => {
  const token = getToken();

  const tokenConfig = {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
    params: params || {}, // optional: in case you want to pass query params
  };

  const res = await baseURL.get(url, tokenConfig);
  return res.data;
};
