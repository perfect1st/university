// commissionCategorySlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCommissionsCategory,
  getOneCommissionsCategory,
  getAllCommissionsCategoryWithoutPaginations,
} from "./thunk";

const initialState = {
  allCategories: [],
  categories: [],
  category: null,
  loading: false,
  error: null,
};

const commissionCategorySlice = createSlice({
  name: "commissionCategorySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // all without pagination
      .addCase(getAllCommissionsCategoryWithoutPaginations.pending, (state) => {
        state.loading = true;
        state.allCategories = [];
      })
      .addCase(getAllCommissionsCategoryWithoutPaginations.fulfilled, (state, action) => {
        state.loading = false;
        state.allCategories = action.payload;
      })
      .addCase(getAllCommissionsCategoryWithoutPaginations.rejected, (state, action) => {
        state.loading = false;
        state.allCategories = [];
        state.error = action.error.message;
      });

    builder
      // all with pagination
      .addCase(getAllCommissionsCategory.pending, (state) => {
        state.loading = true;
        state.categories = [];
      })
      .addCase(getAllCommissionsCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCommissionsCategory.rejected, (state, action) => {
        state.loading = false;
        state.categories = [];
        state.error = action.error.message;
      });

    builder
      // get one
      .addCase(getOneCommissionsCategory.pending, (state) => {
        state.loading = true;
        state.category = null;
      })
      .addCase(getOneCommissionsCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(getOneCommissionsCategory.rejected, (state, action) => {
        state.loading = false;
        state.category = null;
        state.error = action.error.message;
      });
  },
});

export default commissionCategorySlice.reducer;
