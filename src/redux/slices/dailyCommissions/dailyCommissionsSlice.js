import { createSlice } from "@reduxjs/toolkit";
import { getAllDailyCommissions, getOneDailyCommission, getAllDailyCommissionsWithoutPaginations } from "./thunk"; // تأكد أنك غيرت المسارات الصحيحة

const initialState = {
  allDailyCommissions: [],
  dailyCommissions: [],
  dailyCommission: null,
  loading: false,
  error: null,
};

const dailyCommissionsSlice = createSlice({
  name: "dailyCommissionsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(getAllDailyCommissionsWithoutPaginations.pending, (state) => {
        state.loading = true;
        state.allDailyCommissions = [];
      })
      .addCase(getAllDailyCommissionsWithoutPaginations.fulfilled, (state, action) => {
        state.loading = false;
        state.allDailyCommissions = action.payload;
      })
      .addCase(getAllDailyCommissionsWithoutPaginations.rejected, (state, action) => {
        state.loading = false;
        state.allDailyCommissions = [];
        state.error = action.error.message;
      });
    builder
      .addCase(getAllDailyCommissions.pending, (state) => {
        state.loading = true;
        state.dailyCommissions = [];
      })
      .addCase(getAllDailyCommissions.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyCommissions = action.payload;
      })
      .addCase(getAllDailyCommissions.rejected, (state, action) => {
        state.loading = false;
        state.dailyCommissions = [];
        state.error = action.error.message;
      });
    builder
      .addCase(getOneDailyCommission.pending, (state) => {
        state.loading = true;
        state.dailyCommission = null;
      })
      .addCase(getOneDailyCommission.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyCommission = action.payload;
      })
      .addCase(getOneDailyCommission.rejected, (state, action) => {
        state.loading = false;
        state.dailyCommission = null;
        state.error = action.error.message;
      });

  },
});

export default dailyCommissionsSlice.reducer;
