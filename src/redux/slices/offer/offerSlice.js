import { createSlice } from "@reduxjs/toolkit";
import { getAllOffers, getOneOffer } from "./thunk"; // Import the async thunks

const initialState = {
  offers: [],
  offer: null,

  loading: false,
  error: null,
};

const offerSlice = createSlice({
  name: "offerSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllOffers
      .addCase(getAllOffers.pending, (state) => {
        state.loading = true;
        state.offers = [];
      })
      .addCase(getAllOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(getAllOffers.rejected, (state, action) => {
        state.loading = false;
        state.offers = [];
        state.error = action.error.message;
      });

    // getOneOffer
    builder
      .addCase(getOneOffer.pending, (state) => {
        state.loading = true;
        state.offer = null;
        state.error = null;
      })
      .addCase(getOneOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offer = action.payload;
        state.error = null;
      })
      .addCase(getOneOffer.rejected, (state, action) => {
        state.loading = false;
        state.offer = null;
        state.error = action.error.message;
      });
  },
});

export default offerSlice.reducer;
