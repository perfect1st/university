import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from "../../../components/notify";

// get all Liquidations (without pagination)
export const getAllLiquidationsWithoutPaginations = createAsyncThunk(
  "/liquidationSlice/getAllLiquidationsWithoutPaginations",
  async ({ query = "" }) => {
    try {
      let api = `/liquidations`;
      if (query) api += `?${query}`;
      const response = await useGetDataToken(api);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data || "حدث خطأ غير متوقع", "error");
      }
    }
  }
);

// get all Liquidations (with pagination)
export const getAllLiquidations = createAsyncThunk(
  "/liquidationSlice/getAllLiquidations",
  async ({ query = "" }) => {
    try {
      const response = await useGetDataToken(`/liquidations?${query}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data || "حدث خطأ غير متوقع", "error");
      }
    }
  }
);

// get one Liquidation
export const getOneLiquidation = createAsyncThunk(
  "/liquidationSlice/getOneLiquidation",
  async ({ id = "", query }) => {
    try {
      const response = await useGetDataToken(`/liquidations/${id}?${query}`);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data || "حدث خطأ غير متوقع", "error");
      }
    }
  }
);
export const getOneLiquidationWithoutPagination = createAsyncThunk(
  "/liquidationSlice/getOneLiquidation",
  async ({ id = "", query }) => {
    try {
      let api = `/liquidations/${id}`;
      if (query) api += `?${query}`;
      const response = await useGetDataToken(api);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify("حدث خطأ اثناء الاتصال بالانترنت حاول مرة اخري", "error");
      } else {
        return notify(error.response?.data || "حدث خطأ غير متوقع", "error");
      }
    }
  }
);

// edit Liquidation
export const processLiquidation = createAsyncThunk(
  "/liquidationSlice/editLiquidation",
  async ({ id = "", data }, { rejectWithValue }) => {
    try {
      const response = await useInsertData(`/liquidations/processLiquidation`, data);
      return response;
    } catch (error) {
      if (error.message === "Network Error") {
        return notify(
          "حدث خطأ أثناء الاتصال بالإنترنت. حاول مرة أخرى.",
          "error"
        );
      } else {
        return rejectWithValue(error);
      }
    }
  }
);
