import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from "../../../components/notify";

// get all Coupons without paginations
export const getAllCouponsWithoutPaginations = createAsyncThunk(
  "/couponSlice/getAllCouponsWithoutPaginations",
  async ({ query = "" }) => {
    try {
      const response = await useGetDataToken(`/coupons?${query}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error")
        return notify(
          "حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ",
          "error"
        );
      else return notify(error.response.data, "error");
    }
  }
);

// get all Coupons
export const getAllCoupons = createAsyncThunk(
  "/couponSlice/getAllCoupons",
  async ({ query = "" }) => {
    try {
      const response = await useGetDataToken(`/coupons?${query}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error")
        return notify(
          "حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ",
          "error"
        );
      else return notify(error.response.data, "error");
    }
  }
);

// get one Coupon
export const getOneCoupon = createAsyncThunk(
  "/couponSlice/getOneCoupon",
  async (id = "") => {
    try {
      const response = await useGetDataToken(`/coupons/${id}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error")
        return notify(
          "حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ",
          "error"
        );
      else return notify(error.response.data, "error");
    }
  }
);

// edit Coupon
export const editCoupon = createAsyncThunk(
  "/couponSlice/editCoupon",
  async ({ id = "", data }) => {
    try {
      const response = await useUpdateData(`/coupons/${id}`, data);
      return response;
    } catch (error) {
      if (error.message === "Network Error")
        return notify(
          "حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري ",
          "error"
        );
      else return notify(error.response.data, "error");
    }
  }
);
// add Coupon 
export const addCoupon = createAsyncThunk(
  "/couponSlice/addCoupon",
  async ({ id = "", data },{ rejectWithValue }) => {
    try {
      const response = await useInsertData(`/coupons`, data);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return rejectWithValue("حدث خطأ أثناء الاتصال بالإنترنت حاول مرة أخرى");
      } else {
        return rejectWithValue(
          error?.response?.data?.message || error?.response?.data?.error || "حدث خطأ أثناء تعديل بيانات التعيين"
        );
      }
    }
  }
);
