import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from "../../../components/notify";

export const getAllUsersWithoutPaginations = createAsyncThunk(
  "/userSlice/getAllUsersWithoutPaginations",
  async ({ query = '' }) => {
    try {
      let api = `/admins`;
      if (query) api += `?${query}`;
      const response = await useGetDataToken(api);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data, "error");
      }
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "/userSlice/getAllUsers",
  async ({ query = '' }) => {
    try {
      const response = await useGetDataToken(`/admins?${query}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data, "error");
      }
    }
  });
  export const getOneUser = createAsyncThunk(
    "/userSlice/getOneUser",
    async (id = '') => {
      try {
        const response = await useGetDataToken(`/admins/${id}`);
        return response;
      } catch (error) {
        if (error.message === "Network Error") {
          return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
        } else {
          return notify(error.response?.data, "error");
        }
      }
    }
  );

export const editUser = createAsyncThunk(
  "/userSlice/editUser",
  async ({ id,data }) => {
    try {
      const response = await useUpdateData(`/admins/${id}`,data);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data, "error");
      }
    }
  });

  export const register = createAsyncThunk(
    "/userSlice/register",
    async ({ data }, { rejectWithValue }) => {
      try {
        const response = await useInsertData("/admins/register", data);
        return response;
      } catch (error) {
        if (error.message === "Network Error") {
          return rejectWithValue("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري");
        } else {
          notify(error.response?.data?.message,"error")
          return rejectWithValue(error.response?.data  || error.response?.data?.message || error.response?.data?.error || "حدث خطأ");
        }
      }
    }
  );
export const login = createAsyncThunk(
  "/userSlice/login",
  async ({data}) => {
    try {
      const response = await useInsertData(`/admins/login`,data);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data?.message, "error");
      }
    }
  }
);

