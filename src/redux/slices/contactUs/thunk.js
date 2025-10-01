import { createAsyncThunk } from "@reduxjs/toolkit";
import { useGetDataToken } from "../../../hooks/useGetData";
import { useUpdateData } from "../../../hooks/useUpdateData";
import { useInsertData } from "../../../hooks/useInsertData";
import notify from "../../../components/notify";

// get all ContactUs without paginations
export const getAllContactUsWithoutPaginations = createAsyncThunk(
  "/contactUsSlice/getAllContactUsWithoutPaginations",
  async ({ query = "" }) => {
    try {
      const response = await useGetDataToken(`/contactUs?${query}`);
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

// get all ContactUs
export const getAllContactUs = createAsyncThunk(
  "/contactUsSlice/getAllContactUs",
  async ({ query = "" }) => {
    try {
      const response = await useGetDataToken(`/contactUs?${query}`);
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

// get one ContactUs
export const getOneContactUs = createAsyncThunk(
  "/contactUsSlice/getOneContactUs",
  async (id = "") => {
    try {
      const response = await useGetDataToken(`/contactUs/${id}`);
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

// edit ContactUs
export const editContactUs = createAsyncThunk(
  "/contactUsSlice/editContactUs",
  async ({ id = "", data }) => {
    try {
      const response = await useUpdateData(`/contactUs/${id}/status`, data);
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


