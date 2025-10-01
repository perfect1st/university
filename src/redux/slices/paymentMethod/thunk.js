import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from '../../../components/notify';

// get all Payment Methods (without pagination)
export const getAllPaymentMethodsWithoutPaginations = createAsyncThunk(
  "/paymentMethodSlice/getAllPaymentMethodsWithoutPaginations",
  async ({ query = '' }) => {
    try {
      let api = `/payment-methods`;
      if (query) api += `?${query}`;
      const response = await useGetDataToken(api);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
      } else {
        return notify(error.response?.data, "error");
      }
    }
  }
);

// get all Payment Methods (with pagination)
export const getAllPaymentMethods = createAsyncThunk(
  "/paymentMethodSlice/getAllPaymentMethods",
  async ({ query = '' }) => {
    try {
      const response = await useGetDataToken(`/payment-methods?${query}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
      } else {
        return notify(error.response?.data, "error");
      }
    }
  }
);

// get one Payment Method
export const getOnePaymentMethod = createAsyncThunk(
  "/paymentMethodSlice/getOnePaymentMethod",
  async (id = '') => {
    try {
      const response = await useGetDataToken(`/payment-methods/${id}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
      } else {
        return notify(error.response?.data, "error");
      }
    }
  }
);

// edit Payment Method
export const editPaymentMethod = createAsyncThunk(
  "/paymentMethodSlice/editPaymentMethod",
  async ({ id = '', data }) => {
    try {
      const response = await useUpdateData(`/payment-methods/${id}`, data);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
      } else {
        return notify(error.response?.data, "error");
      }
    }
  }
);

// add Payment Method
export const addPaymentMethod = createAsyncThunk(
  "/paymentMethodSlice/addPaymentMethod",
  async ({ data }) => {
    try {
      const response = await useInsertData(`/payment-methods`, data);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ", "error");
      } else {
        return notify(error.response?.data, "error");
      }
    }
  }
);
