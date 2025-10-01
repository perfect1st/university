import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import { useDeleteData } from "../../../hooks/useDeleteData";
import notify from "../../../components/notify";

// thunk.js
export const getAllWalletsWithoutPaginations = createAsyncThunk(
  "walletSlice/getAllWalletsWithoutPaginations",
  async ({ query = '' }) => {
    try {
        const response = await useGetDataToken(`/wallets?${query}`);
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
export const getAllWallets = createAsyncThunk(
  "walletSlice/getAllWallets",
  async ({ query = '' }) => {
    try {
        const response = await useGetDataToken(`/wallets?${query}`);
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
export const getOneWallet = createAsyncThunk(
  "walletSlice/getOneWallet",
  async (id) => {
    try {
        const response = await useGetDataToken(`/wallets/${id}`);
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
export const getUserWallet = createAsyncThunk(
  "walletSlice/getUserWallet",
  async (id) => {
    try {
        const response = await useGetDataToken(`/wallets/user/${id}`);
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
export const createTransaction = createAsyncThunk(
  "walletSlice/createTransaction",
  async ({data}) => {
    try {
        const response = await useInsertData(`/wallets`,data);
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
export const updateTransation = createAsyncThunk(
  "walletSlice/updateTransation", // ✅ fixed here
  async ({id, data}) => {
    try {
      const response = await useUpdateData(`/wallets/${id}`, data);
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



