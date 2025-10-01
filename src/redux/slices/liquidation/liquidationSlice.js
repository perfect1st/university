import { createSlice } from "@reduxjs/toolkit";
import {
  getAllLiquidations,
  getOneLiquidation,
  getAllLiquidationsWithoutPaginations,
} from "./thunk";

const initialState = {
  allLiquidations: [],
  liquidations: [],
  liquidation: null,

  loading: false,
  error: null,
};

const liquidationSlice = createSlice({
  name: "liquidationSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Liquidations Without Pagination
      .addCase(getAllLiquidationsWithoutPaginations.pending, (state) => {
        state.loading = true;
        state.allLiquidations = [];
      })
      .addCase(
        getAllLiquidationsWithoutPaginations.fulfilled,
        (state, action) => {
          state.loading = false;
          state.allLiquidations = action.payload;
        }
      )
      .addCase(
        getAllLiquidationsWithoutPaginations.rejected,
        (state, action) => {
          state.loading = false;
          state.allLiquidations = [];
          state.error = action.error.message;
        }
      );

    builder
      // Get All Liquidations With Pagination
      .addCase(getAllLiquidations.pending, (state) => {
        state.loading = true;
        state.liquidations = [];
      })
      .addCase(getAllLiquidations.fulfilled, (state, action) => {
        state.loading = false;
        state.liquidations = action.payload;
      })
      .addCase(getAllLiquidations.rejected, (state, action) => {
        state.loading = false;
        state.liquidations = [];
        state.error = action.error.message;
      });

    // Get One Liquidation
    builder
      .addCase(getOneLiquidation.pending, (state) => {
        state.loading = true;
        state.liquidation = null;
        state.error = null;
      })
      .addCase(getOneLiquidation.fulfilled, (state, action) => {
        state.loading = false;
        state.liquidation = action.payload;
        state.error = null;
      })
      .addCase(getOneLiquidation.rejected, (state, action) => {
        state.loading = false;
        state.liquidation = null;
        state.error = action.error.message;
      });
  },
});

export default liquidationSlice.reducer;
