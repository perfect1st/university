import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from "../../../components/notify";

// Get all trips (without pagination)
export const getAllTripsWithoutPaginations = createAsyncThunk(
  "/tripSlice/getAllTripsWithoutPaginations",
  async ({ query = '' }) => {
    try {
      let api = `/trips`;
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

// Get all trips (with pagination)
export const getAllTrips = createAsyncThunk(
  "/tripSlice/getAllTrips",
  async ({ query = '' }) => {
    try {
      const response = await useGetDataToken(`/trips?${query}`);
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
export const getAllDriverTrips = createAsyncThunk(
  "/tripSlice/getAllDriverTrips",
  async ({ id,query = '' }) => {
    try {
      const response = await useGetDataToken(`/trips?driver_id=${id}&${query}`);
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
export const getAllPassengerTrips = createAsyncThunk(
  "/tripSlice/getAllPassengerTrips",
  async ({ id,query = '' }) => {
    try {
      const response = await useGetDataToken(`/trips?user_id=${id}&${query}`);
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

// Get one trip
export const getOneTrip = createAsyncThunk(
  "/tripSlice/getOneTrip",
  async (id = '') => {
    try {
      const response = await useGetDataToken(`/trips/${id}`);
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
export const getTripChat = createAsyncThunk(
  "/tripSlice/getTripChat",
  async (id = '') => {
    try {
      const response = await useGetDataToken(`/trip-chats/trip/${id}`);
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

// Edit trip
export const editTrip = createAsyncThunk(
  "/tripSlice/editTrip",
  async ({ id = '', data }) => {
    try {
      const response = await useUpdateData(`/trips/${id}`, data);
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

// Add new trip
export const addTrip = createAsyncThunk(
  "/tripSlice/addTrip",
  async ({ data }) => {
    try {
      const response = await useInsertData(`/trips`, data);
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

// get Dashboard Stats
export const getDashboardStats = createAsyncThunk(
  "tripSlice/getDashboardStats",
  async ({filter}) => {
    try {
        const response = await useGetDataToken(`/trips/admin/dashboard-stats?filter=${filter}`);
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