import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from '../../../components/notify';



export const getAllCommissionsCategoryWithoutPaginations = createAsyncThunk(
  "/dailyCommissionsSlice/getAllDailyCommissionsWithoutPaginations",
  async ({ query = '' }) => {
    try {
      let api = `/commission-categories`
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

export const getAllCommissionsCategory = createAsyncThunk(
  "/commissionCategorySlice/getAllCommissionsCategory",
  async ({ query = '' }) => {
    try {
      const response = await useGetDataToken(`/commission-categories?${query}`);
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
export const getOneCommissionsCategory = createAsyncThunk(
  "/commissionCategorySlice/getOneCommissionsCategory",
  async (id) => {
    try {
      const response = await useGetDataToken(`/commission-categories/${id}`);
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
export const editCommissionCategory = createAsyncThunk(
  "/commissionCategorySlice/editCommissionCategory",
  async ({id,data}) => {
    try {
      const response = await useUpdateData(`/commission-categories/${id}`,data);
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
export const addCommissionCategory = createAsyncThunk(
  "/commissionCategorySlice/addCommissionCategory",
  async ({id,data}) => {
    try {
      const response = await useInsertData(`/commission-categories`,data);
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