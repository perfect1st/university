import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from "../../../components/notify";

// get all TrafficTimes without paginations
export const getAllTrafficTimesWithoutPaginations = createAsyncThunk(
  "/trafficTimeSlice/getAllTrafficTimesWithoutPaginations",
  async ({ query = "" }) => {
    try {
      const response = await useGetDataToken(`/trafficTimes?${query}`);
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

// get all TrafficTimes
export const getAllTrafficTimes = createAsyncThunk(
  "/trafficTimeSlice/getAllTrafficTimes",
  async ({ query = "" }) => {
    try {
      const response = await useGetDataToken(`/trafficTimes?${query}`);
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

// get one TrafficTime
export const getOneTrafficTime = createAsyncThunk(
  "/trafficTimeSlice/getOneTrafficTime",
  async (id = "") => {
    try {
      const response = await useGetDataToken(`/trafficTimes/${id}`);
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

// edit TrafficTime
export const editTrafficTime = createAsyncThunk(
  "/trafficTimeSlice/editTrafficTime",
  async ({ id = "", data }) => {
    try {
      const response = await useUpdateData(`/trafficTimes/${id}`, data);
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

// add TrafficTime
export const addTrafficTime = createAsyncThunk(
  "/trafficTimeSlice/addTrafficTime",
  async ({ id = "", data }, { rejectWithValue }) => {
    try {
      const response = await useInsertData(`/trafficTimes`, data);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return rejectWithValue("حدث خطأ أثناء الاتصال بالإنترنت حاول مرة أخرى");
      } else {
        return rejectWithValue(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            "حدث خطأ أثناء تعديل بيانات التعيين"
        );
      }
    }
  }
);
