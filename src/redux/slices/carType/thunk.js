import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from '../../../components/notify';

// get all Car Types (without pagination)
export const getAllCarTypesWithoutPaginations = createAsyncThunk(
  "/carTypeSlice/getAllCarTypesWithoutPaginations",
  async ({ query = '' }) => {
    try {
      let api = `/carTypes`
      if(query) api += `?${query}`
      const response = await useGetDataToken(api);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
      } else {
        return notify(error.response.data, "error");
      }
    }
  }
);

// get all Car Types (with pagination)
export const getAllCarTypes = createAsyncThunk(
  "/carTypeSlice/getAllCarTypes",
  async ({ query = '' }) => {
    try {
      const response = await useGetDataToken(`/carTypes?${query}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
      } else {
        return notify(error.response.data, "error");
      }
    }
  }
);

// get one Car Type
export const getOneCarType = createAsyncThunk(
  "/carTypeSlice/getOneCarType",
  async (id = '') => {
    try {
      const response = await useGetDataToken(`/carTypes/${id}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
      } else {
        return notify(error.response.data, "error");
      }
    }
  }
);

// edit Car Type
export const editCarType = createAsyncThunk(
  "/carTypeSlice/editCarType",
  async ({ id = '', data }, { rejectWithValue }) => {
    try {
      const response = await useUpdateData(`/carTypes/${id}`, data);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ أثناء الاتصال بالإنترنت. حاول مرة أخرى.", "error");
      } else {
        return rejectWithValue(error);
      }
    }
  }
);
// add Car Type
export const addCarType = createAsyncThunk(
  "carType/addCarType",
  async ({ id = '', data }, { rejectWithValue }) => {
    try {
      const response = await useInsertData(`/carTypes`, data);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ أثناء الاتصال بالإنترنت. حاول مرة أخرى.", "error");
      } else {
        return rejectWithValue(error);
      }
    }
  }
);

