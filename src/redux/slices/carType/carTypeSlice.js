import { createSlice } from "@reduxjs/toolkit";
import { getAllCarTypes, getOneCarType, getAllCarTypesWithoutPaginations } from "./thunk"; // تأكد أنك غيرت المسارات الصحيحة

const initialState = {
  allCarTypes: [],
  carTypes: [],
  carType: null,

  loading: false,
  error: null,
};

const carTypeSlice = createSlice({
  name: "carTypeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Car Types
      .addCase(getAllCarTypesWithoutPaginations.pending, (state) => {
        state.loading = true;
        state.allCarTypes = [];
      })
      .addCase(getAllCarTypesWithoutPaginations.fulfilled, (state, action) => {
        state.loading = false;
        state.allCarTypes = action.payload;
      })
      .addCase(getAllCarTypesWithoutPaginations.rejected, (state, action) => {
        state.loading = false;
        state.allCarTypes = [];
        state.error = action.error.message;
      });
    builder
      // Get All Car Types
      .addCase(getAllCarTypes.pending, (state) => {
        state.loading = true;
        state.carTypes = [];
      })
      .addCase(getAllCarTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.carTypes = action.payload;
      })
      .addCase(getAllCarTypes.rejected, (state, action) => {
        state.loading = false;
        state.carTypes = [];
        state.error = action.error.message;
      });

    // Get One Car Type
    builder
      .addCase(getOneCarType.pending, (state) => {
        state.loading = true;
        state.carType = null;
        state.error = null;
      })
      .addCase(getOneCarType.fulfilled, (state, action) => {
        state.loading = false;
        state.carType = action.payload;
        state.error = null;
      })
      .addCase(getOneCarType.rejected, (state, action) => {
        state.loading = false;
        state.carType = null;
        state.error = action.error.message;
      });
  },
});

export default carTypeSlice.reducer;
