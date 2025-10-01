import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from '../../../components/notify';

// get all Cars (without pagination)
export const getAllCarsWithoutPaginations = createAsyncThunk(
  "/carSlice/getAllCarsWithoutPaginations",
  async ({ query = '' }) => {
    try {
      let api = `/cars`;
      if (query) api += `?${query}`;
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

// get all Cars (with pagination)
export const getAllCars = createAsyncThunk(
  "/carSlice/getAllCars",
  async ({ query = '' }) => {
    try {
      const response = await useGetDataToken(`/cars?${query}`);
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

// get one Car
export const getOneCar = createAsyncThunk(
  "/carSlice/getOneCar",
  async (id = '') => {
    try {
      const response = await useGetDataToken(`/cars/${id}`);
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

// edit Car
export const editCar = createAsyncThunk(
  "/carSlice/editCar",
  async ({ id = '', data }) => {
    try {
      const response = await useUpdateData(`/cars/${id}`, data);
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

// add Car
export const addCar = createAsyncThunk(
  "car/addCar",
  // note: receive the raw FormData directly
  async ({data}, { rejectWithValue }) => {
    try {
      const response = await useInsertData("/cars", data);
      return response;
    } catch (error) {

      console.log("errorerrorerror",error)
      // network-level
      if (error.message === "Network Error") {
        return rejectWithValue([{ message: "حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري" }]);
      }
      // validation errors
      if (error.response?.data?.errors) {
        return rejectWithValue(error.response.data.errors);
      }
      // any other
      if(error.response.data.error){
        notify(error.response.data.error, "error");
      }
      return rejectWithValue([{ message: error.response?.data || error.message }]);
    }
  }
);
