import { createSlice } from "@reduxjs/toolkit";
import {
  getAllWallets,
  getOneWallet,
  getAllWalletsWithoutPaginations,
  getUserWallet
} from "./thunk";

const initialState = {
  allWallets: [],
  wallets: [],
  wallet: null,
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "walletSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All Trips (without pagination)
    builder
      .addCase(getAllWalletsWithoutPaginations.pending, (state) => {
        state.loading = true;
        state.allWallets = [];
      })
      .addCase(getAllWalletsWithoutPaginations.fulfilled, (state, action) => {
        state.loading = false;
        state.allWallets = action.payload;
      })
      .addCase(getAllWalletsWithoutPaginations.rejected, (state, action) => {
        state.loading = false;
        state.allWallets = [];
        state.error = action.error.message;
      });
    builder
      .addCase(getAllWallets.pending, (state) => {
        state.loading = true;
        state.wallets = [];
      })
      .addCase(getAllWallets.fulfilled, (state, action) => {
        state.loading = false;
        state.wallets = action.payload;
      })
      .addCase(getAllWallets.rejected, (state, action) => {
        state.loading = false;
        state.wallets = [];
        state.error = action.error.message;
      });

    // Get All Trips (with pagination)
    builder
      .addCase(getOneWallet.pending, (state) => {
        state.loading = true;
        state.wallet = null;
      })
      .addCase(getOneWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(getOneWallet.rejected, (state, action) => {
        state.loading = false;
        state.wallet = null;
        state.error = action.error.message;
      });
    builder
      .addCase(getUserWallet.pending, (state) => {
        state.loading = true;
        state.wallet = null;
      })
      .addCase(getUserWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(getUserWallet.rejected, (state, action) => {
        state.loading = false;
        state.wallet = null;
        state.error = action.error.message;
      });
  },
});

export default walletSlice.reducer;
