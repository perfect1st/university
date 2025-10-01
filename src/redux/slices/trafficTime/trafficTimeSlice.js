import { createSlice } from "@reduxjs/toolkit";
import { getAllTrafficTimes, getOneTrafficTime } from "./thunk"; // Import the async thunks

const initialState = {
  trafficTimes: [],
  trafficTime: null,

  loading: false,
  error: null,
};

const trafficTimeSlice = createSlice({
  name: "trafficTimeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllTrafficTimes
      .addCase(getAllTrafficTimes.pending, (state) => {
        state.loading = true;
        state.trafficTimes = [];
      })
      .addCase(getAllTrafficTimes.fulfilled, (state, action) => {
        state.loading = false;
        state.trafficTimes = action.payload;
      })
      .addCase(getAllTrafficTimes.rejected, (state, action) => {
        state.loading = false;
        state.trafficTimes = [];
        state.error = action.error.message;
      });

    // getOneTrafficTime
    builder
      .addCase(getOneTrafficTime.pending, (state) => {
        state.loading = true;
        state.trafficTime = null;
        state.error = null;
      })
      .addCase(getOneTrafficTime.fulfilled, (state, action) => {
        state.loading = false;
        state.trafficTime = action.payload;
        state.error = null;
      })
      .addCase(getOneTrafficTime.rejected, (state, action) => {
        state.loading = false;
        state.trafficTime = null;
        state.error = action.error.message;
      });
  },
});

export default trafficTimeSlice.reducer;
