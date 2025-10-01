import { createSlice } from "@reduxjs/toolkit";
import { getAllCoupons, getOneCoupon } from "./thunk"; // Import the async thunks

const initialState = {
  coupons: [],
  coupon: null,

  loading: false,
  error: null,
};

const couponSlice = createSlice({
  name: "couponSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllCoupons
      .addCase(getAllCoupons.pending, (state) => {
        state.loading = true;
        state.coupons = [];
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.coupons = [];
        state.error = action.error.message;
      });

    // getOneCoupon
    builder
      .addCase(getOneCoupon.pending, (state) => {
        state.loading = true;
        state.coupon = null;
        state.error = null;
      })
      .addCase(getOneCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload;
        state.error = null;
      })
      .addCase(getOneCoupon.rejected, (state, action) => {
        state.loading = false;
        state.coupon = null;
        state.error = action.error.message;
      });
  },
});

export default couponSlice.reducer;
