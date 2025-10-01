import { createSlice } from "@reduxjs/toolkit";
import { getAllContactUs, getOneContactUs } from "./thunk"; // Import the async thunks

const initialState = {
  contactUsList: [],
  contactUs: null,

  loading: false,
  error: null,
};

const contactUsSlice = createSlice({
  name: "contactUsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllContactUs
      .addCase(getAllContactUs.pending, (state) => {
        state.loading = true;
        state.contactUsList = [];
      })
      .addCase(getAllContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.contactUsList = action.payload;
      })
      .addCase(getAllContactUs.rejected, (state, action) => {
        state.loading = false;
        state.contactUsList = [];
        state.error = action.error.message;
      });

    // getOneContactUs
    builder
      .addCase(getOneContactUs.pending, (state) => {
        state.loading = true;
        state.contactUs = null;
        state.error = null;
      })
      .addCase(getOneContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.contactUs = action.payload;
        state.error = null;
      })
      .addCase(getOneContactUs.rejected, (state, action) => {
        state.loading = false;
        state.contactUs = null;
        state.error = action.error.message;
      });
  },
});

export default contactUsSlice.reducer;
