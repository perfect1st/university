import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from '../../../components/notify';

// Get all Car Assignments (without pagination)
export const getAllCarAssignmentsWithoutPaginations = createAsyncThunk(
  "/carAssignmentSlice/getAllCarAssignmentsWithoutPaginations",
  async ({ query = '' }) => {
    try {
      let api = `/assignments`;
      if (query) api += `?${query}`;
      const response = await useGetDataToken(api);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ أثناء الاتصال بالإنترنت حاول مرة أخرى", "error");
      } else {
        return notify(error.response.data, "error");
      }
    }
  }
);

// Get all Car Assignments (with pagination)
export const getAllCarAssignments = createAsyncThunk(
  "/carAssignmentSlice/getAllCarAssignments",
  async ({ query = '' }) => {
    try {
      const response = await useGetDataToken(`/assignments?${query}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ أثناء الاتصال بالإنترنت حاول مرة أخرى", "error");
      } else {
        return notify(error.response.data, "error");
      }
    }
  }
);
// Get all Available Car Assignments (with pagination)
export const getAllAvaliableCarAssignments = createAsyncThunk(
  "/carAssignmentSlice/getAllAvaliableCarAssignments",
  async () => {
    try {
      const response = await useGetDataToken(`/assignments/cars/available`);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ أثناء الاتصال بالإنترنت حاول مرة أخرى", "error");
      } else {
        return notify(error.response.data, "error");
      }
    }
  }
);
// Get all Available Drivers Assignments (with pagination)
export const getAllAvaliableDriversAssignments = createAsyncThunk(
  "/carAssignmentSlice/getAllAvaliableDriversAssignments",
  async () => {
    try {
      const response = await useGetDataToken(`/assignments/driver/available`);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ أثناء الاتصال بالإنترنت حاول مرة أخرى", "error");
      } else {
        return notify(error.response.data, "error");
      }
    }
  }
);

// Get one Car Assignment
export const getOneCarAssignment = createAsyncThunk(
  "/carAssignmentSlice/getOneCarAssignment",
  async (id = '') => {
    try {
      const response = await useGetDataToken(`/assignments/${id}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ أثناء الاتصال بالإنترنت حاول مرة أخرى", "error");
      } else {
        return notify(error.response.data, "error");
      }
    }
  }
);

// Edit Car Assignment
export const editCarAssignment = createAsyncThunk(
  "/carAssignmentSlice/editCarAssignment",
  async ({ id = "", data }, { rejectWithValue }) => {
    try {
      const response = await useUpdateData(`/assignments/${id}`, data);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return rejectWithValue("حدث خطأ أثناء الاتصال بالإنترنت حاول مرة أخرى");
      } else {
        return rejectWithValue(
          error?.response?.data?.message || "حدث خطأ أثناء تعديل بيانات التعيين"
        );
      }
    }
  }
);

// Add Car Assignment
export const addCarAssignment = createAsyncThunk(
  "carAssignment/addCarAssignment",
  async ({ data }, thunkAPI) => {
    try {
      // assume useInsertData returns the parsed JSON on 2xx
      const response = await useInsertData(`/assignments`, data);
      return response;
    } catch (error) {
      // Network‐level error
      if (error.message === "Network Error") {
        notify("حدث خطأ أثناء الاتصال بالإنترنت حاول مرة أخرى", "error");
        return thunkAPI.rejectWithValue({ message: error.message });
      }

      const payload = error.response?.data || { message: error.message };
      return thunkAPI.rejectWithValue(payload);
    }
  }
);
