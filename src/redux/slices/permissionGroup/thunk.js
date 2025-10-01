import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import { useDeleteData } from "../../../hooks/useDeleteData";
import notify from "../../../components/notify";

// thunk.js
export const getAllPermissionGroups = createAsyncThunk(
  "permissionGroupSlice/getAllPermissionGroups",
  async () => {
    try {
        const response = await useGetDataToken(`/groups`);
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
export const getOnePermissionGroups = createAsyncThunk(
  "permissionGroupSlice/getOnePermissionGroups",
  async (id) => {
    try {
        const response = await useGetDataToken(`/groups/${id}`);
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
export const createPermissionGroup = createAsyncThunk(
  "permissionGroupSlice/createPermissionGroup",
  async ({data}) => {
    try {
        const response = await useInsertData(`/groups`,data);
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
export const updatePermissionGroup = createAsyncThunk(
  "permissionGroupSlice/updatePermissionGroup", // ✅ fixed here
  async ({id, data}) => {
    try {
      const response = await useUpdateData(`/groups/${id}`, data);
      return { id, data: response }; // ✅ نحتاج id داخل الـ payload
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data, "error");
      }
    }
  }
);
export const updatePermissionsActions = createAsyncThunk(
  "permissionGroupSlice/updatePermissionsActions", // ✅ fixed here
  async ({id, data}) => {
    try {
      const response = await useUpdateData(`/groups/permissions/${id}`, data);
      return { id, data: response }; // ✅ نحتاج id داخل الـ payload
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data, "error");
      }
    }
  }
);

export const deletePermissionGroup = createAsyncThunk(
  "permissionGroupSlice/deletePermissionGroup",
  async ({ id }) => {
    try {
      await useDeleteData(`/groups/${id}`);
      return { id }; // ✅ رجع الـ id عشان نحذفه من الـ state
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data, "error");
      }
    }
  }
);


