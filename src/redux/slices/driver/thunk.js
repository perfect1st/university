import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from "../../../components/notify";

// Get all Drivers without pagination
export const getAllDriversWithoutPaginations = createAsyncThunk(
  "/driverSlice/getAllDriversWithoutPaginations",
  async ({ query = "" }) => {
    try {
      const response = await useGetDataToken(`/users/drivers/cars?${query}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error")
        return notify(
          "حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ",
          "error"
        );
      else return notify(error.response.data, "error");
    }
  }
);

// Get all Drivers with pagination
export const getAllDrivers = createAsyncThunk(
  "/driverSlice/getAllDrivers",
  async ({ query = "" }) => {
    try {
      const response = await useGetDataToken(`/users/drivers/cars?${query}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error")
        return notify(
          "حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ",
          "error"
        );
      else return notify(error.response.data, "error");
    }
  }
);

// Get one Driver by ID
export const getOneDriver = createAsyncThunk(
  "/driverSlice/getOneDriver",
  async ({ id = "" }) => {
    try {
      const response = await useGetDataToken(`/users/driver/${id}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error")
        return notify(
          "حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ",
          "error"
        );
      else return notify(error.response.data, "error");
    }
  }
);

// Edit Driver
export const editDriver = createAsyncThunk(
  "/driverSlice/editDriver",
  async ({ id = "", data }) => {
    try {
      const response = await useUpdateData(`/users/driverByAdmin/${id}`, data);
      return response;
    } catch (error) {
      if (error.message === "Network Error")
        return notify(
          "حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ",
          "error"
        );
      else if (error?.response?.data?.error)
        return notify(error?.response?.data?.error, "error");
      else return notify(error.response.data, "error");
    }
  }
);
