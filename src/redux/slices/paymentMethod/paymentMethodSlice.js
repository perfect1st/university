import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPaymentMethods,
  getAllPaymentMethodsWithoutPaginations,
  getOnePaymentMethod,
  editPaymentMethod,
  addPaymentMethod,
} from "./thunk";

const initialState = {
  allPaymentMethods: [],
  paymentMethods: [],
  paymentMethod: null,

  loading: false,
  error: null,
};

const paymentMethodSlice = createSlice({
  name: "paymentMethodSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All Payment Methods (without pagination)
    builder
      .addCase(getAllPaymentMethodsWithoutPaginations.pending, (state) => {
        state.loading = true;
        state.allPaymentMethods = [];
      })
      .addCase(getAllPaymentMethodsWithoutPaginations.fulfilled, (state, action) => {
        state.loading = false;
        state.allPaymentMethods = action.payload;
      })
      .addCase(getAllPaymentMethodsWithoutPaginations.rejected, (state, action) => {
        state.loading = false;
        state.allPaymentMethods = [];
        state.error = action.error.message;
      });

    // Get All Payment Methods (with pagination)
    builder
      .addCase(getAllPaymentMethods.pending, (state) => {
        state.loading = true;
        state.paymentMethods = [];
      })
      .addCase(getAllPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
      })
      .addCase(getAllPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.paymentMethods = [];
        state.error = action.error.message;
      });

    // Get One Payment Method
    builder
      .addCase(getOnePaymentMethod.pending, (state) => {
        state.loading = true;
        state.paymentMethod = null;
        state.error = null;
      })
      .addCase(getOnePaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethod = action.payload;
        state.error = null;
      })
      .addCase(getOnePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.paymentMethod = null;
        state.error = action.error.message;
      });

    // Optional: Edit Payment Method
    builder
      .addCase(editPaymentMethod.pending, (state) => {
        state.loading = true;
      })
      .addCase(editPaymentMethod.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Optional: Add Payment Method
    builder
      .addCase(addPaymentMethod.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPaymentMethod.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default paymentMethodSlice.reducer;
