import { createSlice } from "@reduxjs/toolkit";
import { getAllDrivers, getOneDriver } from "./thunk"; // Import the async thunks

const initialState = {
  drivers: [],
  driver: null,

  loading: false,
  error: null,
};

const driverSlice = createSlice({
  name: "driverSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllDrivers.pending, (state) => {
        state.loading = true;
        state.drivers = [];
      })
      .addCase(getAllDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload;
      })
      .addCase(getAllDrivers.rejected, (state, action) => {
        state.loading = false;
        state.drivers = [];
        state.error = action.error.message;
      });

    builder
      .addCase(getOneDriver.pending, (state) => {
        state.loading = true;
        state.driver = null;
        state.error = null;
      })
      .addCase(getOneDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload;
        state.error = null;
      })
      .addCase(getOneDriver.rejected, (state, action) => {
        state.loading = false;
        state.driver = null;
        state.error = action.error.message;
      });
  },
});

export default driverSlice.reducer;
