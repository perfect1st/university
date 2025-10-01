import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from '../../../components/notify';

// get All Daily Commissions
export const getAllDailyCommissions = createAsyncThunk(
  "/dailyCommissionsSlice/getAllDailyCommissions",
  async ({ query = '' }) => {
    try {
      const response = await useGetDataToken(`/dailyCommissions?${query}`);
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


export const getAllDailyCommissionsWithoutPaginations = createAsyncThunk(
  "/dailyCommissionsSlice/getAllDailyCommissionsWithoutPaginations",
  async ({ query = '' }) => {
    try {
      let api = `/dailyCommissions`
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


// get one  Daily Commission 
export const getOneDailyCommission = createAsyncThunk(
  "/dailyCommissionsSlice/getOneDailyCommission",
  async ({id,query=''}) => {
    try {
      const response = await useGetDataToken(`/dailyCommissions/${id}?${query}`);
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