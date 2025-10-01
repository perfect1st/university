import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCars,
  getOneCar,
  getAllCarsWithoutPaginations,
} from "./thunk"; // تأكد أنك غيرت المسارات في المشروع أيضاً

const initialState = {
  allCars: [],
  cars: [],
  car: null,

  loading: false,
  error: null,
};

const carSlice = createSlice({
  name: "carSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Cars (without pagination)
      .addCase(getAllCarsWithoutPaginations.pending, (state) => {
        state.loading = true;
        state.allCars = [];
      })
      .addCase(getAllCarsWithoutPaginations.fulfilled, (state, action) => {
        state.loading = false;
        state.allCars = action.payload;
      })
      .addCase(getAllCarsWithoutPaginations.rejected, (state, action) => {
        state.loading = false;
        state.allCars = [];
        state.error = action.error.message;
      });

    // Get All Cars (with pagination)
    builder
      .addCase(getAllCars.pending, (state) => {
        state.loading = true;
        state.cars = [];
      })
      .addCase(getAllCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(getAllCars.rejected, (state, action) => {
        state.loading = false;
        state.cars = [];
        state.error = action.error.message;
      });

    // Get One Car
    builder
      .addCase(getOneCar.pending, (state) => {
        state.loading = true;
        state.car = null;
        state.error = null;
      })
      .addCase(getOneCar.fulfilled, (state, action) => {
        state.loading = false;
        state.car = action.payload;
        state.error = null;
      })
      .addCase(getOneCar.rejected, (state, action) => {
        state.loading = false;
        state.car = null;
        state.error = action.error.message;
      });
  },
});

export default carSlice.reducer;
