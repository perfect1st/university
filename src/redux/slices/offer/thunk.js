import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from "../../../components/notify";

// get all Offers without paginations
export const getAllOffersWithoutPaginations = createAsyncThunk(
  "/offerSlice/getAllOffersWithoutPaginations",
  async ({ query = "" }) => {
    try {
      const response = await useGetDataToken(`/offers?${query}`);
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

// get all Offers
export const getAllOffers = createAsyncThunk(
  "/offerSlice/getAllOffers",
  async ({ query = "" }) => {
    try {
      const response = await useGetDataToken(`/offers?${query}`);
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

// get one Offer
export const getOneOffer = createAsyncThunk(
  "/offerSlice/getOneOffer",
  async (id = "") => {
    try {
      const response = await useGetDataToken(`/offers/${id}`);
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

// edit Offer
export const editOffer = createAsyncThunk(
  "/offerSlice/editOffer",
  async ({ id = "", data }) => {
    try {
      const response = await useUpdateData(`/offers/${id}`, data);
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
// add Offer
export const addOffer = createAsyncThunk(
  "/offerSlice/addOffer",
  async ({ id = "", data },{ rejectWithValue }) => {
    try {
      const response = await useInsertData(`/offers`, data);
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
