import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import { useDeleteData } from "../../../hooks/useDeleteData";
import notify from "../../../components/notify";


export const getAllSetting = createAsyncThunk(
  "settingSlice/getAllSettings",
  async () => {
    try {
        const response = await useGetDataToken(`/settings`);
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


export const updateSetting = createAsyncThunk(
  "settingSlice/updateSetting", 
  async ({id, data}) => {
    try {
      const response = await useUpdateData(`/settings`, data);
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


export const getAllNotifications = createAsyncThunk(
  "settingSlice/getAllNotifications",
  async () => {
    try {
        const response = await useGetDataToken(`/dashboard-notifications`);
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
export const MarkRead = createAsyncThunk(
  "settingSlice/MarkRead",
  async ({id}) => {
    try {
      let data = {
        is_read:true
      }
        const response = await useUpdateData(`/dashboard-notifications/${id}/read`,data);
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
export const MarkAllasRead = createAsyncThunk(
  "settingSlice/MarkAllasRead",
  async () => {
    try {

        const response = await useDeleteData(`/dashboard-notifications`,);
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